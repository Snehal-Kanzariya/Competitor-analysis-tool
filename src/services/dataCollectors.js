// Data collection layer — 8 free/paid collectors called in parallel.
// Each returns { source, data } or { source, data: null, reason }.
// API keys read from import.meta.env.VITE_* — if missing, returns null for that source.

const TIMEOUT_MS = 10000;

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 1. WHOIS via RDAP — free, no key needed
export async function whoisLookup(domain) {
  if (!domain) return { source: 'whois', data: null, reason: 'no_domain' };
  try {
    const data = await withTimeout(safeFetch(`https://rdap.org/domain/${domain}`));
    return {
      source: 'whois',
      data: {
        registrationDate: data.events?.find((e) => e.eventAction === 'registration')?.eventDate ?? null,
        expirationDate: data.events?.find((e) => e.eventAction === 'expiration')?.eventDate ?? null,
        registrant: data.entities?.[0]?.vcardArray?.[1]?.find((f) => f[0] === 'org')?.[3] ?? null,
        status: data.status ?? [],
      },
    };
  } catch (e) {
    return { source: 'whois', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 2. Firecrawl scrape — POST markdown; falls back to Jina if key missing
export async function firecrawlScrape(domain) {
  if (!domain) return { source: 'firecrawl', data: null, reason: 'no_domain' };
  const key = import.meta.env.VITE_FIRECRAWL_KEY;
  if (!key) return jinaReader(`https://${domain}`);

  try {
    const data = await withTimeout(
      safeFetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ url: `https://${domain}`, formats: ['markdown'] }),
      })
    );
    return { source: 'firecrawl', data: data?.data?.markdown ?? null };
  } catch (e) {
    return { source: 'firecrawl', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 8. Jina Reader — free fallback for scraping
export async function jinaReader(url) {
  if (!url) return { source: 'jina', data: null, reason: 'no_url' };
  try {
    const res = await withTimeout(fetch(`https://r.jina.ai/${url}`));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return { source: 'jina', data: text.slice(0, 8000) };
  } catch (e) {
    return { source: 'jina', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 3. PageSpeed Insights — returns performance + tech signals
export async function pagespeed(domain) {
  if (!domain) return { source: 'pagespeed', data: null, reason: 'no_domain' };
  const key = import.meta.env.VITE_PAGESPEED_KEY;
  if (!key) return { source: 'pagespeed', data: null, reason: 'no_key' };

  try {
    const data = await withTimeout(
      safeFetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}&key=${key}&strategy=mobile`
      )
    );
    const cats = data?.lighthouseResult?.categories ?? {};
    return {
      source: 'pagespeed',
      data: {
        performance: cats.performance?.score ?? null,
        accessibility: cats.accessibility?.score ?? null,
        seo: cats.seo?.score ?? null,
        techStack: Object.keys(data?.loadingExperience?.metrics ?? {}).slice(0, 5),
      },
    };
  } catch (e) {
    return { source: 'pagespeed', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 4. Serper — Google search proxy
async function serperSearch(query) {
  const key = import.meta.env.VITE_SERPER_KEY;
  if (!key) return { source: 'serper', data: null, reason: 'no_key' };

  try {
    const data = await withTimeout(
      safeFetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': key },
        body: JSON.stringify({ q: query, num: 10 }),
      })
    );
    return {
      source: 'serper',
      data: {
        organic: (data?.organic ?? []).slice(0, 8).map((r) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
        })),
        answerBox: data?.answerBox ?? null,
        peopleAlsoAsk: (data?.peopleAlsoAsk ?? []).slice(0, 4).map((q) => q.question),
      },
    };
  } catch (e) {
    return { source: 'serper', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

export async function serperAlternatives(domain) {
  return serperSearch(`${domain} alternatives competitors vs`);
}

export async function serperReddit(query) {
  return serperSearch(`site:reddit.com ${query} reviews discussion`);
}

// 5. Google Places New API
export async function placesSearch(query, location = '') {
  const key = import.meta.env.VITE_GOOGLE_PLACES_KEY;
  if (!key) return { source: 'places', data: null, reason: 'no_key' };

  try {
    const body = { textQuery: location ? `${query} near ${location}` : query };
    const data = await withTimeout(
      safeFetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri',
        },
        body: JSON.stringify(body),
      })
    );
    return {
      source: 'places',
      data: (data?.places ?? []).slice(0, 5).map((p) => ({
        name: p.displayName?.text,
        address: p.formattedAddress,
        rating: p.rating,
        reviewCount: p.userRatingCount,
        website: p.websiteUri,
      })),
    };
  } catch (e) {
    return { source: 'places', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 6. Wayback Machine CDX API — free, no key
export async function waybackSnapshots(domain) {
  if (!domain) return { source: 'wayback', data: null, reason: 'no_domain' };
  try {
    const data = await withTimeout(
      safeFetch(
        `https://web.archive.org/cdx/search/cdx?url=${domain}&output=json&limit=5&from=2015&fl=timestamp,statuscode&collapse=timestamp:6`
      )
    );
    if (!Array.isArray(data) || data.length < 2) return { source: 'wayback', data: [] };
    const [, ...rows] = data;
    return {
      source: 'wayback',
      data: rows.map(([timestamp, status]) => ({ timestamp, status })),
    };
  } catch (e) {
    return { source: 'wayback', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// 7. Exa findSimilar
export async function exaSimilar(domainOrQuery, isIdea = false) {
  const key = import.meta.env.VITE_EXA_KEY;
  if (!key) return { source: 'exa', data: null, reason: 'no_key' };

  try {
    const body = isIdea
      ? { query: domainOrQuery, numResults: 5, type: 'neural' }
      : { url: `https://${domainOrQuery}`, numResults: 5 };

    const endpoint = isIdea
      ? 'https://api.exa.ai/search'
      : 'https://api.exa.ai/findSimilar';

    const data = await withTimeout(
      safeFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify(body),
      })
    );
    return {
      source: 'exa',
      data: (data?.results ?? []).slice(0, 5).map((r) => ({
        title: r.title,
        url: r.url,
        score: r.score,
        publishedDate: r.publishedDate,
      })),
    };
  } catch (e) {
    return { source: 'exa', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// Wikipedia — free, used for company context
async function wikipediaLookup(query) {
  if (!query) return { source: 'wikipedia', data: null, reason: 'no_query' };
  try {
    const res = await withTimeout(
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
    );
    if (!res.ok) return { source: 'wikipedia', data: null, reason: `HTTP ${res.status}` };
    const data = await res.json();
    return {
      source: 'wikipedia',
      data: {
        title: data.title,
        description: data.description,
        extract: data.extract?.slice(0, 1500),
        thumbnail: data.thumbnail?.source ?? null,
      },
    };
  } catch (e) {
    return { source: 'wikipedia', data: null, reason: e.message === 'timeout' ? 'timeout' : 'error' };
  }
}

// ─── Master collector ──────────────────────────────────────────────────────

export async function collectAll(domain, { isLocal = false, ideaQuery = null } = {}) {
  const query = ideaQuery ?? domain;

  if (ideaQuery) {
    // Idea mode — no domain-specific collectors
    const [serpResult, redditResult, exaResult] = await Promise.allSettled([
      serperAlternatives(ideaQuery),
      serperReddit(ideaQuery),
      exaSimilar(ideaQuery, true),
    ]);
    return {
      wikipedia: null,
      whois: null,
      scrape: null,
      tech: null,
      serp: serpResult.status === 'fulfilled' ? serpResult.value.data : null,
      social: redditResult.status === 'fulfilled' ? redditResult.value.data : null,
      places: null,
      reviews: null,
      wayback: null,
      reddit: redditResult.status === 'fulfilled' ? redditResult.value.data : null,
      exa: exaResult.status === 'fulfilled' ? exaResult.value.data : null,
    };
  }

  // Company mode — all collectors
  const collectors = [
    wikipediaLookup(query),
    whoisLookup(domain),
    firecrawlScrape(domain),
    pagespeed(domain),
    serperAlternatives(domain),
    serperReddit(query),
    isLocal ? placesSearch(query) : Promise.resolve({ source: 'places', data: null, reason: 'not_local' }),
    waybackSnapshots(domain),
    exaSimilar(domain),
  ];

  const [wikiRes, whoisRes, scrapeRes, techRes, serpRes, socialRes, placesRes, waybackRes, exaRes] =
    await Promise.allSettled(collectors);

  const get = (res) => (res.status === 'fulfilled' ? res.value.data : null);
  const scrapeData = get(scrapeRes);

  return {
    wikipedia: get(wikiRes),
    whois: get(whoisRes),
    scrape: typeof scrapeData === 'string' ? scrapeData : null,
    tech: get(techRes),
    serp: get(serpRes),
    social: get(socialRes),
    places: get(placesRes),
    reviews: null,
    wayback: get(waybackRes),
    reddit: get(socialRes),
    exa: get(exaRes),
  };
}
