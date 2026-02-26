// AI Research Engine — Calls Claude API with Web Search
// Works free inside Claude.ai artifacts, or with user's API key in deployed version

const CLAUDE_API_URL = "/api/claude/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

/**
 * Research a company and find its competitors with full analysis
 * @param {string} companyName - e.g. "McDonald's" or "Sciteline"
 * @param {string} apiKey - Anthropic API key (optional in Claude.ai artifacts)
 * @param {function} onProgress - callback for progress updates
 */
export async function researchCompany(
  companyName,
  apiKey = null,
  onProgress = () => {},
) {
  onProgress({ step: 1, total: 3, message: `Researching ${companyName}...` });

  // Step 1: Find competitors and basic info
  const competitorData = await callClaude(
    buildCompetitorPrompt(companyName),
    apiKey,
    true, // enable web search
  );

  onProgress({ step: 2, total: 3, message: "Analyzing market & features..." });

  // Step 2: Deep analysis (SWOT, features, monopoly)
  const analysisData = await callClaude(
    buildAnalysisPrompt(companyName, competitorData),
    apiKey,
    true,
  );

  onProgress({ step: 3, total: 3, message: "Generating final report..." });

  // Step 3: Parse and structure the data
  const result = parseResearchResult(companyName, competitorData, analysisData);

  return result;
}

/**
 * Call Claude API
 */
async function callClaude(prompt, apiKey, useWebSearch = false) {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  }

  const body = {
    model: MODEL,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  };

  if (useWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();

  // Extract text from response content blocks
  const text = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return text;
}

/**
 * Prompt to find competitors
 */
function buildCompetitorPrompt(companyName) {
  return `Research "${companyName}" and find its top 5 competitors. 

Return ONLY valid JSON (no markdown, no backticks, no explanation) in this exact format:

{
  "company": {
    "name": "Official Company Name",
    "website": "example.com",
    "industry": "Industry Name",
    "founded": "Year",
    "hq": "City, Country",
    "employees": "Range like 100-500",
    "description": "One sentence description",
    "estimatedRevenue": "$X ARR or annual",
    "marketShare": "Estimated percentage"
  },
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "competitor.com",
      "industry": "Same or related industry",
      "founded": "Year",
      "hq": "City, Country",
      "employees": "Range",
      "description": "One sentence",
      "estimatedRevenue": "Estimate",
      "marketShare": "Estimated percentage",
      "whyCompetitor": "Why they compete with the main company"
    }
  ],
  "marketOverview": {
    "totalMarketSize": "$X billion",
    "growthRate": "X% annually",
    "marketType": "Fragmented or Concentrated or Oligopoly or Monopoly",
    "keyTrend": "Main market trend in one sentence"
  }
}

Be accurate with real data. Use web search to find current information. Return exactly 5 competitors.`;
}

/**
 * Prompt for deep analysis
 */
function buildAnalysisPrompt(companyName, competitorInfo) {
  return `Based on this competitor research for "${companyName}":

${competitorInfo}

Now provide a deep competitive analysis. Return ONLY valid JSON (no markdown, no backticks):

{
  "features": [
    {
      "name": "Feature Name",
      "category": "Category",
      "scores": {
        "Company Name": "yes",
        "Competitor 1": "yes",
        "Competitor 2": "no",
        "Competitor 3": "partial"
      }
    }
  ],
  "swot": {
    "Company Name": {
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "opportunities": ["opportunity 1", "opportunity 2"],
      "threats": ["threat 1", "threat 2"]
    }
  },
  "monopoly": {
    "hhi": 2500,
    "concentrationLevel": "High",
    "dominantPlayer": "Company Name",
    "dominantPlayerShare": "42%",
    "barriers": ["barrier 1", "barrier 2", "barrier 3"],
    "disruptionOpportunities": ["opportunity 1", "opportunity 2"],
    "marketTrend": "Consolidating or Fragmenting or Stable",
    "nichesAvailable": ["niche 1", "niche 2"]
  },
  "scoring": {
    "criteria": [
      { "name": "Product Quality", "weight": 25 },
      { "name": "Pricing", "weight": 20 },
      { "name": "Brand Strength", "weight": 15 },
      { "name": "Innovation", "weight": 15 },
      { "name": "Customer Support", "weight": 15 },
      { "name": "Market Reach", "weight": 10 }
    ],
    "scores": {
      "Company Name": [8, 7, 9, 7, 8, 9],
      "Competitor 1": [7, 8, 7, 8, 6, 7]
    }
  },
  "positioning": {
    "xAxis": "Price Level",
    "yAxis": "Product Quality",
    "positions": {
      "Company Name": { "x": 75, "y": 80 },
      "Competitor 1": { "x": 60, "y": 65 }
    }
  }
}

Use REAL company names from the research. Provide 8-12 relevant features for this industry. Include SWOT for ALL companies (main + 5 competitors). Scores should reflect real market positioning. Be accurate and use current market data.`;
}

/**
 * Parse the AI response into structured data for our store
 */
function parseResearchResult(companyName, competitorRaw, analysisRaw) {
  let competitors, analysis;

  try {
    competitors = extractJSON(competitorRaw);
  } catch (e) {
    console.error("Failed to parse competitor data:", e);
    throw new Error("Failed to parse competitor research. Please try again.");
  }

  try {
    analysis = extractJSON(analysisRaw);
  } catch (e) {
    console.error("Failed to parse analysis data:", e);
    throw new Error("Failed to parse analysis data. Please try again.");
  }

  const colors = [
    "#3B82F6",
    "#8B5CF6",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  // Build competitor list (main company + competitors)
  const allCompanies = [];

  // Main company
  if (competitors.company) {
    allCompanies.push({
      id: "main",
      name: competitors.company.name || companyName,
      website: competitors.company.website || "",
      industry: competitors.company.industry || "",
      founded: competitors.company.founded || "",
      hq: competitors.company.hq || "",
      employees: competitors.company.employees || "",
      description: competitors.company.description || "",
      estimatedRevenue: competitors.company.estimatedRevenue || "",
      marketShare: competitors.company.marketShare || "",
      score: 80,
      trend: "+0",
      status: "Target",
      color: colors[0],
      strengths: analysis?.swot?.[competitors.company.name]?.strengths || [],
      weaknesses: analysis?.swot?.[competitors.company.name]?.weaknesses || [],
      opportunities:
        analysis?.swot?.[competitors.company.name]?.opportunities || [],
      threats: analysis?.swot?.[competitors.company.name]?.threats || [],
      createdAt: new Date().toISOString(),
    });
  }

  // Competitors
  if (competitors.competitors) {
    competitors.competitors.forEach((comp, i) => {
      allCompanies.push({
        id: `comp-${i}`,
        name: comp.name,
        website: comp.website || "",
        industry: comp.industry || "",
        founded: comp.founded || "",
        hq: comp.hq || "",
        employees: comp.employees || "",
        description: comp.description || "",
        estimatedRevenue: comp.estimatedRevenue || "",
        marketShare: comp.marketShare || "",
        whyCompetitor: comp.whyCompetitor || "",
        score: Math.max(
          40,
          Math.min(95, 75 - i * 5 + Math.floor(Math.random() * 10)),
        ),
        trend: ["+5", "+2", "-1", "+8", "+3"][i % 5],
        status: ["Leader", "Contender", "Follower", "Rising", "Contender"][
          i % 5
        ],
        color: colors[(i + 1) % colors.length],
        strengths: analysis?.swot?.[comp.name]?.strengths || [],
        weaknesses: analysis?.swot?.[comp.name]?.weaknesses || [],
        opportunities: analysis?.swot?.[comp.name]?.opportunities || [],
        threats: analysis?.swot?.[comp.name]?.threats || [],
        createdAt: new Date().toISOString(),
      });
    });
  }

  // Build features data
  const features = [];
  const featureScores = {};

  if (analysis?.features) {
    analysis.features.forEach((f, i) => {
      const featureId = `f-${i}`;
      features.push({
        id: featureId,
        name: f.name,
        category: f.category || "General",
      });

      // Map scores to our competitor IDs
      allCompanies.forEach((comp) => {
        if (!featureScores[comp.id]) featureScores[comp.id] = {};
        const scoreValue = f.scores?.[comp.name] || "no";
        featureScores[comp.id][featureId] = scoreValue;
      });
    });
  }

  // Build scoring data
  let scoringCriteria = [];
  let scoringScores = {};

  if (analysis?.scoring) {
    scoringCriteria = analysis.scoring.criteria || [];
    allCompanies.forEach((comp) => {
      scoringScores[comp.id] =
        analysis.scoring.scores?.[comp.name] || scoringCriteria.map(() => 5);
    });
  }

  // Build positioning data
  let positioning = {
    xAxis: "Price Level",
    yAxis: "Product Quality",
    positions: {},
  };
  if (analysis?.positioning) {
    positioning.xAxis = analysis.positioning.xAxis || "Price Level";
    positioning.yAxis = analysis.positioning.yAxis || "Product Quality";
    allCompanies.forEach((comp) => {
      positioning.positions[comp.id] = analysis.positioning.positions?.[
        comp.name
      ] || {
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      };
    });
  }

  return {
    query: companyName,
    timestamp: new Date().toISOString(),
    competitors: allCompanies,
    features,
    featureScores,
    marketOverview: competitors.marketOverview || {},
    monopoly: analysis?.monopoly || {},
    scoringCriteria,
    scoringScores,
    positioning,
  };
}

/**
 * Extract JSON from a string that might contain markdown or extra text
 */
function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No valid JSON found in response");
  }
}

/**
 * Demo/fallback research when no API key is available
 * Returns sample data for testing
 */
export function getDemoResearch(companyName) {
  return {
    query: companyName,
    timestamp: new Date().toISOString(),
    competitors: [
      {
        id: "main",
        name: companyName,
        website: "",
        industry: "Technology",
        founded: "",
        hq: "",
        employees: "",
        description: `${companyName} - researched company`,
        marketShare: "25%",
        score: 80,
        trend: "+5",
        status: "Target",
        color: "#3B82F6",
        strengths: ["Market leader", "Strong brand", "Large user base"],
        weaknesses: ["High prices", "Slow innovation"],
        opportunities: ["Emerging markets", "AI integration"],
        threats: ["New competitors", "Market saturation"],
        createdAt: new Date().toISOString(),
      },
      ...[1, 2, 3, 4, 5].map((i) => ({
        id: `comp-${i}`,
        name: `Competitor ${i}`,
        website: "",
        industry: "Technology",
        founded: "",
        hq: "",
        employees: "",
        description: `Competitor ${i} of ${companyName}`,
        marketShare: `${20 - i * 3}%`,
        score: 75 - i * 5,
        trend: ["+5", "+2", "-1", "+8", "+3"][i - 1],
        status: ["Leader", "Contender", "Follower", "Rising", "Contender"][
          i - 1
        ],
        color: ["#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899"][i - 1],
        strengths: ["Strong feature set", "Good pricing"],
        weaknesses: ["Limited market reach"],
        opportunities: ["Growth potential"],
        threats: ["Market competition"],
        createdAt: new Date().toISOString(),
      })),
    ],
    features: [
      { id: "f-0", name: "Core Platform", category: "Core" },
      { id: "f-1", name: "API Access", category: "Core" },
      { id: "f-2", name: "Mobile App", category: "Platform" },
      { id: "f-3", name: "Analytics", category: "Reporting" },
      { id: "f-4", name: "Integration", category: "Integration" },
    ],
    featureScores: {},
    marketOverview: {
      totalMarketSize: "$10B",
      growthRate: "15%",
      marketType: "Concentrated",
      keyTrend: "AI-driven transformation",
    },
    monopoly: {
      hhi: 2200,
      concentrationLevel: "Moderate",
      dominantPlayer: companyName,
      dominantPlayerShare: "25%",
      barriers: ["Brand loyalty", "High switching costs", "Network effects"],
      disruptionOpportunities: [
        "AI-first approach",
        "Underserved segments",
        "Better pricing",
      ],
      marketTrend: "Consolidating",
      nichesAvailable: ["SMB market", "Vertical-specific solutions"],
    },
    scoringCriteria: [
      { name: "Product Quality", weight: 25 },
      { name: "Pricing", weight: 20 },
      { name: "Brand Strength", weight: 15 },
      { name: "Innovation", weight: 15 },
      { name: "Support", weight: 15 },
      { name: "Market Reach", weight: 10 },
    ],
    scoringScores: {},
    positioning: { xAxis: "Price", yAxis: "Quality", positions: {} },
  };
}
