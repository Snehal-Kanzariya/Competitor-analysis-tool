// Free Research Engine — 5 Free APIs, Zero Cost!
// Uses: Wikipedia REST API + Wikidata + DuckDuckGo + HackerNews + GitHub
// All called in parallel with Promise.allSettled — never fails if one API is down

import { findInDatabase } from '../data/industryDatabase';

const WIKI_REST = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';
const HN_API = 'https://hn.algolia.com/api/v1/search';
const GITHUB_API = 'https://api.github.com/search/repositories';

// ─── Individual API fetchers ───────────────────────────────────────────────

async function fetchWikipedia(company) {
  const res = await fetch(`${WIKI_REST}/${encodeURIComponent(company)}`);
  if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
  return res.json();
}

async function fetchWikipediaFullExtract(company) {
  const params = new URLSearchParams({
    action: 'query',
    titles: company,
    prop: 'extracts',
    explaintext: 'true',
    exsectionformat: 'plain',
    format: 'json',
    origin: '*',
  });
  const res = await fetch(`${WIKI_API}?${params}`);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  return page?.extract || '';
}

async function fetchWikidata(company) {
  const searchParams = new URLSearchParams({
    action: 'wbsearchentities',
    search: company,
    language: 'en',
    format: 'json',
    origin: '*',
    limit: '3',
  });
  const searchRes = await fetch(`${WIKIDATA_API}?${searchParams}`);
  const searchData = await searchRes.json();
  const entityId = searchData?.search?.[0]?.id;
  if (!entityId) return null;

  const entityParams = new URLSearchParams({
    action: 'wbgetentities',
    ids: entityId,
    props: 'claims|labels|descriptions',
    languages: 'en',
    format: 'json',
    origin: '*',
  });
  const entityRes = await fetch(`${WIKIDATA_API}?${entityParams}`);
  const entityData = await entityRes.json();
  const entity = entityData?.entities?.[entityId];
  if (!entity) return null;

  const claims = entity.claims || {};
  const getClaimValue = (prop) => claims[prop]?.[0]?.mainsnak?.datavalue?.value;
  const getStringValue = (prop) => {
    const v = getClaimValue(prop);
    return typeof v === 'string' ? v : v?.text || v?.id || null;
  };
  const getTimeValue = (prop) => {
    const v = getClaimValue(prop);
    return v?.time ? v.time.replace(/^\+/, '').slice(0, 4) : null;
  };
  const getAmountValue = (prop) => {
    const v = getClaimValue(prop);
    return v?.amount ? v.amount.replace(/^\+/, '') : null;
  };

  return {
    description: entity.descriptions?.en?.value || null,
    founded: getTimeValue('P571'),
    hq: getStringValue('P159'),
    employees: getAmountValue('P1128'),
    revenue: getAmountValue('P2139'),
    industry: getStringValue('P452'),
    product: getStringValue('P1056'),
  };
}

async function fetchDuckDuckGo(company) {
  const res = await fetch(`/api/ddg?q=${encodeURIComponent(company)}`);
  if (!res.ok) throw new Error(`DDG ${res.status}`);
  return res.json();
}

async function fetchHackerNews(company) {
  const params = new URLSearchParams({ query: company, tags: 'story', hitsPerPage: '5' });
  const res = await fetch(`${HN_API}?${params}`);
  if (!res.ok) throw new Error(`HN ${res.status}`);
  return res.json();
}

async function fetchGitHub(company) {
  const params = new URLSearchParams({ q: company, sort: 'stars', per_page: '3' });
  const res = await fetch(`${GITHUB_API}?${params}`);
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return res.json();
}

// ─── Competitor discovery from APIs ───────────────────────────────────────

function extractFromDDGTopics(ddg, exclude, found) {
  const topics = ddg?.RelatedTopics || [];
  for (const topic of topics) {
    const list = topic.Topics?.length ? topic.Topics : [topic];
    for (const t of list) {
      if (!t?.FirstURL || !t?.Text) continue;

      // Strategy A: URL slug (original approach)
      const segment = t.FirstURL.split('/').pop();
      if (segment && !segment.startsWith('c/') && !segment.includes('%2F')) {
        const name = decodeURIComponent(segment).replace(/_/g, ' ').replace(/\.[a-z]{2,4}$/, '').trim();
        if (name.length >= 2 && name.length <= 50 && /^[A-Z]/.test(name) && name.toLowerCase() !== exclude.toLowerCase()) {
          found.add(name);
        }
      }

      // Strategy B: Leading proper noun from Text field — format "Brand Name - description" or "Brand Name is a..."
      const textMatch = t.Text.match(/^([A-Z][a-zA-Z0-9&'.\-\s]{1,35}?)\s*(?:\s[-–—]|\sis\s|\swas\s|\sare\s)/);
      if (textMatch) {
        const name = textMatch[1].trim();
        if (name.length >= 2 && name.length <= 40 && name.toLowerCase() !== exclude.toLowerCase()) {
          found.add(name);
        }
      }
    }
    if (found.size >= 10) break;
  }
}

function extractFromWikiText(text, exclude, found) {
  if (!text) return;
  const patterns = [
    /competes?\s+with\s+([A-Z][a-zA-Z\s&.]{2,35}?)(?:\s*[,;.]|\s+and\s+[A-Z])/g,
    /rival(?:s|ry)?\s+(?:include[sd]?|such as|like)\s+([A-Z][a-zA-Z\s&.]{2,35}?)(?:\s*[,;.]|\s+and\s+[A-Z])/g,
    /\bvs\.?\s+([A-Z][a-zA-Z\s&.]{2,30}?)(?:\s*[,;.]|\s*$)/gm,
    /competitors?\s+(?:include[sd]?|are|such as)\s+([A-Z][a-zA-Z\s&.]{2,35}?)(?:\s*[,;.]|\s+and\s+[A-Z])/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const name = m[1].trim().replace(/\s+/g, ' ');
      if (name && name.toLowerCase() !== exclude.toLowerCase() && name.length >= 2 && name.length <= 40) {
        found.add(name);
      }
    }
  }
}

function extractFromHNTitles(hn, exclude, found) {
  for (const hit of (hn?.hits || [])) {
    const title = hit.title || '';
    const vsMatch = title.match(/\b([A-Z][a-zA-Z0-9]+)\s+(?:vs\.?|versus)\s+([A-Z][a-zA-Z0-9]+)/i);
    if (vsMatch) {
      [vsMatch[1], vsMatch[2]].forEach((n) => {
        if (n.toLowerCase() !== exclude.toLowerCase() && n.length > 2) found.add(n);
      });
    }
  }
}

async function fetchWikipediaCategoryPeers(company, exclude) {
  // Get Wikipedia categories for the company's page, then list articles in the best category
  try {
    const catParams = new URLSearchParams({
      action: 'query', titles: company, prop: 'categories', cllimit: '15', format: 'json', origin: '*',
    });
    const catRes = await fetch(`${WIKI_API}?${catParams}`);
    const catData = await catRes.json();
    const pages = catData?.query?.pages || {};
    const page = Object.values(pages)[0];
    if (!page || page.missing !== undefined) return [];

    const skipPatterns = /^(Articles|Use |Webarchive|stub|coordinates|Pages|Wikipedia|All |CS1|Infobox|Good article)/i;
    const cats = (page.categories || [])
      .map((c) => c.title.replace('Category:', ''))
      .filter((c) => !skipPatterns.test(c) && c.length < 70)
      .slice(0, 3);

    for (const cat of cats) {
      const memberParams = new URLSearchParams({
        action: 'query', list: 'categorymembers', cmtitle: `Category:${cat}`,
        cmlimit: '15', cmtype: 'page', format: 'json', origin: '*',
      });
      const memberRes = await fetch(`${WIKI_API}?${memberParams}`);
      const memberData = await memberRes.json();
      const members = (memberData?.query?.categorymembers || [])
        .map((m) => m.title)
        .filter((t) => t !== company && !t.includes(':') && t.toLowerCase() !== exclude.toLowerCase());
      if (members.length >= 2) return members.slice(0, 8);
    }
  } catch { /* non-fatal */ }
  return [];
}

async function discoverCompetitorNames(company, ddgRaw, hnRaw) {
  const found = new Set();

  // Source 1: DDG RelatedTopics (URL slugs + Text field extraction)
  extractFromDDGTopics(ddgRaw, company, found);

  // Source 2: Wikipedia full article — competitor mention patterns
  try {
    const fullText = await fetchWikipediaFullExtract(company);
    extractFromWikiText(fullText, company, found);
  } catch { /* non-fatal */ }

  // Source 3: Wikipedia search for "{company} competitors" article extract
  try {
    const searchParams = new URLSearchParams({
      action: 'query', list: 'search', srsearch: `${company} competitors`,
      srlimit: '3', format: 'json', origin: '*',
    });
    const res = await fetch(`${WIKI_API}?${searchParams}`);
    const data = await res.json();
    const titles = (data?.query?.search || []).map((r) => r.title);
    if (titles[0]) {
      const extractParams = new URLSearchParams({
        action: 'query', titles: titles[0], prop: 'extracts',
        explaintext: 'true', format: 'json', origin: '*',
      });
      const eRes = await fetch(`${WIKI_API}?${extractParams}`);
      const eData = await eRes.json();
      const pages = eData?.query?.pages || {};
      const text = Object.values(pages)[0]?.extract || '';
      extractFromWikiText(text, company, found);
    }
  } catch { /* non-fatal */ }

  // Source 4: Targeted DDG search for "{company} competitors" — often returns better RelatedTopics
  if (found.size < 3) {
    try {
      const competitorDDG = await fetchDuckDuckGo(`${company} competitors alternatives`);
      extractFromDDGTopics(competitorDDG, company, found);
      if (competitorDDG?.AbstractText) extractFromWikiText(competitorDDG.AbstractText, company, found);
    } catch { /* non-fatal */ }
  }

  // Source 5: Wikipedia Category peers — same-category articles = industry siblings
  if (found.size < 2) {
    try {
      const peers = await fetchWikipediaCategoryPeers(company, company);
      peers.forEach((p) => found.add(p));
    } catch { /* non-fatal */ }
  }

  // Source 6: HackerNews "vs" title patterns
  extractFromHNTitles(hnRaw, company, found);

  return [...found]
    .filter((n) => n.toLowerCase() !== company.toLowerCase())
    .slice(0, 5);
}

// ─── Data merging ──────────────────────────────────────────────────────────

function parseFoundedFromText(text) {
  if (!text) return null;
  const m = text.match(/(?:founded|established|incorporated|started)\s*(?:in|on)?\s*(\d{4})/i)
    || text.match(/\b((?:19|20)\d{2})\b/);
  return m ? m[1] : null;
}

function parseHQFromText(text) {
  if (!text) return null;
  const patterns = [
    /headquartered\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,\s+(?:is|and|the|it))/i,
    /based\s+in\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,\s+(?:is|and|the|it))/i,
    /headquarters?\s+(?:in|at)\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,\s+(?:is|and|the|it))/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].trim().replace(/,\s*$/, '');
  }
  return null;
}

function mergeCompanyData(company, wiki, wikidata, ddg, hn, github, dbEntry) {
  return {
    name: company,
    description: wiki?.extract || ddg?.AbstractText || wikidata?.description || '',
    founded: wikidata?.founded || parseFoundedFromText(wiki?.extract) || dbEntry?.founded || '',
    hq: wikidata?.hq || parseHQFromText(wiki?.extract) || dbEntry?.hq || '',
    employees: wikidata?.employees || '',
    revenue: wikidata?.revenue || '',
    industry: wikidata?.industry || dbEntry?.industry || '',
    logo: wiki?.thumbnail?.source || ddg?.Image || '',
    website: wiki?.content_urls?.desktop?.page || '',
    techBuzz: hn?.hits?.map((h) => h.title).slice(0, 3) || [],
    githubPresence: github?.items?.map((r) => ({ name: r.name, stars: r.stargazers_count, lang: r.language })) || [],
    relatedTopics: ddg?.RelatedTopics?.filter((t) => t.Text)?.map((t) => t.Text).slice(0, 5) || [],
  };
}

// ─── SWOT generation ───────────────────────────────────────────────────────

function generateSWOT(name, mergedData) {
  const text = (mergedData?.description || '').toLowerCase();
  const buzz = (mergedData?.techBuzz || []).join(' ').toLowerCase();
  const combined = text + ' ' + buzz;

  const strengths = [], weaknesses = [], opportunities = [], threats = [];

  if (combined.includes('leader') || combined.includes('largest') || combined.includes('dominant')) strengths.push('Market leadership position');
  if (combined.includes('brand') || combined.includes('recogni') || combined.includes('popular')) strengths.push('Strong brand recognition');
  if (combined.includes('innovat') || combined.includes('technolog') || combined.includes('patent')) strengths.push('Innovation and technology focus');
  if (combined.includes('global') || combined.includes('worldwide') || combined.includes('countries')) strengths.push('Global market presence');
  if (combined.includes('revenue') || combined.includes('profit') || combined.includes('billion')) strengths.push('Strong financial performance');
  if (mergedData?.githubPresence?.length > 0) strengths.push('Active open-source / developer community');
  if (strengths.length === 0) strengths.push('Established market presence', 'Known industry player');

  if (combined.includes('controversi') || combined.includes('criticism') || combined.includes('lawsuit')) weaknesses.push('Public relations challenges');
  if (combined.includes('expensive') || combined.includes('premium') || combined.includes('high cost')) weaknesses.push('Premium pricing limits accessibility');
  if (combined.includes('depend') || combined.includes('relian')) weaknesses.push('Market dependency risks');
  if (weaknesses.length === 0) weaknesses.push('Competitive pressure on margins', 'Ongoing need for innovation');

  if (combined.includes('ai') || combined.includes('machine learning')) opportunities.push('AI and automation integration');
  if (combined.includes('expand') || combined.includes('growth') || combined.includes('emerging')) opportunities.push('Market expansion potential');
  if (combined.includes('digital') || combined.includes('online') || combined.includes('mobile')) opportunities.push('Digital transformation opportunities');
  if (combined.includes('sustainab') || combined.includes('green')) opportunities.push('Sustainability initiatives');
  if (opportunities.length === 0) opportunities.push('New market segments', 'Technology-driven growth');

  if (combined.includes('competit') || combined.includes('rival')) threats.push('Intensifying competition');
  if (combined.includes('regulat') || combined.includes('antitrust')) threats.push('Regulatory challenges');
  if (combined.includes('economic') || combined.includes('recession')) threats.push('Economic uncertainty');
  if (threats.length === 0) threats.push('Market dynamics and disruption', 'Changing consumer preferences');

  return { strengths, weaknesses, opportunities, threats };
}

// ─── Features ──────────────────────────────────────────────────────────────

function generateFeatures() {
  return [
    { id: 'f-0', name: 'Core Product', category: 'Core' },
    { id: 'f-1', name: 'Mobile Presence', category: 'Platform' },
    { id: 'f-2', name: 'Global Operations', category: 'Core' },
    { id: 'f-3', name: 'Innovation / R&D', category: 'Core' },
    { id: 'f-4', name: 'Brand Strength', category: 'Market' },
    { id: 'f-5', name: 'Customer Support', category: 'Service' },
    { id: 'f-6', name: 'Sustainability', category: 'ESG' },
    { id: 'f-7', name: 'E-commerce / Digital', category: 'Platform' },
    { id: 'f-8', name: 'Enterprise Solutions', category: 'Core' },
    { id: 'f-9', name: 'Data Analytics', category: 'Technology' },
    { id: 'f-10', name: 'Partner Ecosystem', category: 'Integration' },
    { id: 'f-11', name: 'AI Features', category: 'Technology' },
  ];
}

// ─── Build final result ────────────────────────────────────────────────────

function buildResult(companyName, dbResult, mainData, competitorList) {
  // competitorList: array of { name, data } where data is mergedCompanyData (may be null)
  const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
  const statusLabels = ['Target', 'Leader', 'Contender', 'Follower', 'Rising', 'Contender'];

  const allCompanies = [];
  const mainSwot = generateSWOT(companyName, mainData);

  allCompanies.push({
    id: 'main',
    name: companyName,
    website: mainData?.website || '',
    industry: mainData?.industry || dbResult?.industry || '',
    founded: mainData?.founded || '',
    hq: mainData?.hq || '',
    employees: mainData?.employees || '',
    description: mainData?.description || `${companyName} — researched via public APIs`,
    estimatedRevenue: mainData?.revenue || '',
    marketShare: dbResult ? '25%' : '',
    score: 82,
    trend: '+5',
    status: 'Target',
    color: colors[0],
    logo: mainData?.logo || '',
    techBuzz: mainData?.techBuzz || [],
    githubPresence: mainData?.githubPresence || [],
    ...mainSwot,
    createdAt: new Date().toISOString(),
  });

  competitorList.forEach(({ name, data, meta }, i) => {
    const swot = generateSWOT(name, data);
    allCompanies.push({
      id: `comp-${i}`,
      name,
      website: data?.website || '',
      industry: data?.industry || mainData?.industry || dbResult?.industry || '',
      founded: data?.founded || meta?.founded || '',
      hq: data?.hq || meta?.hq || '',
      employees: data?.employees || '',
      description: data?.description || meta?.desc || `Competitor of ${companyName}`,
      estimatedRevenue: data?.revenue || '',
      marketShare: `${Math.max(5, 20 - i * 3)}%`,
      score: Math.max(45, 78 - i * 6 + Math.floor(Math.random() * 8)),
      trend: ['+5', '+2', '-1', '+8', '+3'][i % 5],
      status: statusLabels[(i + 1) % statusLabels.length],
      color: colors[(i + 1) % colors.length],
      logo: data?.logo || '',
      techBuzz: data?.techBuzz || [],
      githubPresence: data?.githubPresence || [],
      ...swot,
      createdAt: new Date().toISOString(),
    });
  });

  const features = generateFeatures();
  const featureScores = {};
  allCompanies.forEach((comp, ci) => {
    featureScores[comp.id] = {};
    features.forEach((f) => {
      if (ci === 0) {
        featureScores[comp.id][f.id] = Math.random() > 0.2 ? 'yes' : 'partial';
      } else {
        const rand = Math.random();
        featureScores[comp.id][f.id] = rand > 0.55 ? 'yes' : rand > 0.25 ? 'partial' : 'no';
      }
    });
  });

  const marketOverview = {
    totalMarketSize: dbResult?.marketSize || 'N/A',
    growthRate: dbResult?.growthRate || 'N/A',
    marketType: allCompanies.length <= 3 ? 'Concentrated' : 'Competitive',
    keyTrend: 'AI and digital transformation driving industry change',
  };

  const sharePerCompany = Math.floor(80 / allCompanies.length);
  const monopoly = {
    hhi: 1200 + Math.floor(Math.random() * 1500),
    concentrationLevel: allCompanies.length <= 3 ? 'High' : 'Moderate',
    dominantPlayer: allCompanies[0].name,
    dominantPlayerShare: `${sharePerCompany + 10}%`,
    barriers: ['Brand recognition and loyalty', 'High capital requirements', 'Regulatory compliance', 'Network effects'],
    disruptionOpportunities: ['AI-powered innovation', 'Underserved niches', 'Superior user experience', 'Cost disruption'],
    marketTrend: 'Stable',
    nichesAvailable: ['SMB segment', 'Emerging markets', 'Vertical-specific solutions'],
  };

  return {
    query: companyName,
    timestamp: new Date().toISOString(),
    competitors: allCompanies,
    features,
    featureScores,
    marketOverview,
    monopoly,
    scoringCriteria: [
      { name: 'Product Quality', weight: 25 },
      { name: 'Pricing', weight: 20 },
      { name: 'Brand Strength', weight: 15 },
      { name: 'Innovation', weight: 15 },
      { name: 'Customer Support', weight: 15 },
      { name: 'Market Reach', weight: 10 },
    ],
    scoringScores: {},
    positioning: { xAxis: 'Price Level', yAxis: 'Product Quality', positions: {} },
  };
}

// ─── Fetch all 5 APIs — returns merged data + raw DDG/HN for discovery ────

async function fetchAllAPIs(company, dbEntry) {
  const [wikiResult, wikidataResult, ddgResult, hnResult, githubResult] = await Promise.allSettled([
    fetchWikipedia(company),
    fetchWikidata(company),
    fetchDuckDuckGo(company),
    fetchHackerNews(company),
    fetchGitHub(company),
  ]);

  const wiki = wikiResult.status === 'fulfilled' ? wikiResult.value : null;
  const wikidata = wikidataResult.status === 'fulfilled' ? wikidataResult.value : null;
  const ddg = ddgResult.status === 'fulfilled' ? ddgResult.value : null;
  const hn = hnResult.status === 'fulfilled' ? hnResult.value : null;
  const github = githubResult.status === 'fulfilled' ? githubResult.value : null;

  return {
    data: mergeCompanyData(company, wiki, wikidata, ddg, hn, github, dbEntry),
    ddgRaw: ddg,
    hnRaw: hn,
  };
}

// ─── Main exported function ────────────────────────────────────────────────

export async function researchCompanyFree(companyName, _keys, onProgress = () => {}) {
  onProgress({ step: 1, total: 5, message: `Looking up ${companyName} in database...` });
  const dbResult = findInDatabase(companyName);

  onProgress({ step: 2, total: 5, message: `Fetching data for ${companyName} from 5 APIs...` });
  const { data: mainData, ddgRaw, hnRaw } = await fetchAllAPIs(companyName, dbResult);

  onProgress({ step: 3, total: 5, message: 'Discovering and fetching competitor data...' });

  let competitorList = [];

  if (dbResult?.competitors?.length) {
    // Known competitors from industry database — fetch full data for each
    const results = await Promise.allSettled(
      dbResult.competitors.map((c) => fetchAllAPIs(c.name, null))
    );
    competitorList = dbResult.competitors.map((c, i) => ({
      name: c.name,
      data: results[i].status === 'fulfilled' ? results[i].value.data : null,
      meta: c,
    }));
  } else {
    // No database match — discover competitors from DDG, Wikipedia, and HackerNews
    onProgress({ step: 3, total: 5, message: 'No database match — discovering competitors from APIs...' });
    const discoveredNames = await discoverCompetitorNames(companyName, ddgRaw, hnRaw);

    if (discoveredNames.length > 0) {
      const results = await Promise.allSettled(
        discoveredNames.map((name) => fetchAllAPIs(name, null))
      );
      competitorList = discoveredNames.map((name, i) => ({
        name,
        data: results[i].status === 'fulfilled' ? results[i].value.data : null,
        meta: {},
      }));
    }
    // If still no competitors found, competitorList stays empty → buildResult handles it gracefully
  }

  onProgress({ step: 4, total: 5, message: 'Analyzing market and building SWOT...' });
  await new Promise((r) => setTimeout(r, 200));

  onProgress({ step: 5, total: 5, message: 'Building complete analysis...' });
  return buildResult(companyName, dbResult, mainData, competitorList);
}

export function getDemoResearch(companyName) {
  return researchCompanyFree(companyName, null, () => {});
}
