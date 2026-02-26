import { create } from "zustand";

const sampleCompetitors = [
  {
    id: "1",
    name: "Acme Corp",
    website: "acmecorp.com",
    industry: "SaaS",
    founded: "2019",
    hq: "San Francisco, CA",
    employees: "250-500",
    funding: "Series C · $45M",
    description: "Enterprise analytics platform.",
    estimatedRevenue: "$12M ARR",
    marketShare: "15%",
    score: 82,
    trend: "+5",
    status: "Leader",
    color: "#3B82F6",
    strengths: ["Strong brand recognition", "Superior API", "24/7 support"],
    weaknesses: ["No mobile app", "Higher pricing", "Slow releases"],
    opportunities: ["AI integration", "Enterprise expansion"],
    threats: ["New VC-funded competitors", "Market commoditization"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "BetaWorks",
    website: "betaworks.io",
    industry: "SaaS",
    founded: "2020",
    hq: "Austin, TX",
    employees: "100-250",
    funding: "Series B · $20M",
    description: "Developer-focused tools.",
    estimatedRevenue: "$6M ARR",
    marketShare: "8%",
    score: 74,
    trend: "+2",
    status: "Contender",
    color: "#8B5CF6",
    strengths: ["Fast innovation", "Developer community"],
    weaknesses: ["Limited enterprise features", "Small sales team"],
    opportunities: ["Open-source growth", "API marketplace"],
    threats: ["Enterprise players entering market"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "ClearView",
    website: "clearview.co",
    industry: "SaaS",
    founded: "2018",
    hq: "London, UK",
    employees: "50-100",
    funding: "Series A · $8M",
    description: "Budget-friendly SMB solution.",
    estimatedRevenue: "$3M ARR",
    marketShare: "5%",
    score: 68,
    trend: "-1",
    status: "Follower",
    color: "#F59E0B",
    strengths: ["Low pricing", "Easy onboarding"],
    weaknesses: ["Limited features", "No API access"],
    opportunities: ["SMB market growth", "Self-serve expansion"],
    threats: ["Free tier from competitors"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "DataPrime",
    website: "dataprime.dev",
    industry: "SaaS",
    founded: "2022",
    hq: "Berlin, DE",
    employees: "20-50",
    funding: "Seed · $3M",
    description: "AI-first analytics startup.",
    estimatedRevenue: "$1M ARR",
    marketShare: "2%",
    score: 61,
    trend: "+8",
    status: "Rising",
    color: "#10B981",
    strengths: ["AI-powered insights", "Modern tech stack"],
    weaknesses: ["New to market", "Limited integrations"],
    opportunities: ["AI trend riding", "First-mover in AI analytics"],
    threats: ["Bigger players adding AI features"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Your Product",
    website: "yourproduct.com",
    industry: "SaaS",
    founded: "2024",
    hq: "Remote",
    employees: "1-10",
    funding: "Bootstrapped",
    description: "Your competitive analysis tool.",
    estimatedRevenue: "$0",
    marketShare: "0%",
    score: 77,
    trend: "+12",
    status: "You",
    color: "#EC4899",
    strengths: ["Fresh perspective", "Modern UX", "Agile development"],
    weaknesses: ["New entrant", "Limited brand awareness"],
    opportunities: ["Market gap in AI tools", "Underserved SMBs"],
    threats: ["Established incumbents", "Funding challenges"],
    createdAt: new Date().toISOString(),
  },
];

const sampleFeatures = [
  { id: "f1", name: "Real-time Analytics", category: "Core" },
  { id: "f2", name: "API Access", category: "Core" },
  { id: "f3", name: "Team Collaboration", category: "Collaboration" },
  { id: "f4", name: "Custom Reports", category: "Reporting" },
  { id: "f5", name: "Mobile App", category: "Platform" },
  { id: "f6", name: "SSO / SAML", category: "Security" },
  { id: "f7", name: "Webhooks", category: "Integration" },
  { id: "f8", name: "White Labeling", category: "Customization" },
  { id: "f9", name: "Data Export (CSV)", category: "Reporting" },
  { id: "f10", name: "Role-Based Permissions", category: "Security" },
  { id: "f11", name: "Slack Integration", category: "Integration" },
  { id: "f12", name: "AI-Powered Insights", category: "Core" },
];

const sampleFeatureScores = {
  1: {
    f1: "yes",
    f2: "yes",
    f3: "yes",
    f4: "yes",
    f5: "no",
    f6: "yes",
    f7: "yes",
    f8: "no",
    f9: "yes",
    f10: "yes",
    f11: "partial",
    f12: "no",
  },
  2: {
    f1: "yes",
    f2: "yes",
    f3: "no",
    f4: "yes",
    f5: "yes",
    f6: "no",
    f7: "yes",
    f8: "yes",
    f9: "yes",
    f10: "no",
    f11: "yes",
    f12: "partial",
  },
  3: {
    f1: "yes",
    f2: "no",
    f3: "yes",
    f4: "no",
    f5: "yes",
    f6: "no",
    f7: "no",
    f8: "no",
    f9: "yes",
    f10: "no",
    f11: "no",
    f12: "no",
  },
  4: {
    f1: "partial",
    f2: "yes",
    f3: "yes",
    f4: "yes",
    f5: "no",
    f6: "yes",
    f7: "yes",
    f8: "yes",
    f9: "no",
    f10: "yes",
    f11: "yes",
    f12: "yes",
  },
  5: {
    f1: "yes",
    f2: "yes",
    f3: "yes",
    f4: "no",
    f5: "yes",
    f6: "no",
    f7: "yes",
    f8: "no",
    f9: "yes",
    f10: "partial",
    f11: "no",
    f12: "partial",
  },
};

const sampleMonopoly = {
  hhi: 2200,
  concentrationLevel: "Moderate",
  dominantPlayer: "Acme Corp",
  dominantPlayerShare: "15%",
  barriers: ["Brand loyalty", "High switching costs", "Network effects"],
  disruptionOpportunities: [
    "AI-first approach",
    "Underserved SMB segment",
    "Better pricing model",
  ],
  marketTrend: "Consolidating",
  nichesAvailable: ["Vertical-specific analytics", "Self-serve SMB market"],
};

const sampleMarketOverview = {
  totalMarketSize: "$15B",
  growthRate: "18%",
  marketType: "Concentrated",
  keyTrend: "AI-driven analytics transformation",
};

const STORAGE_KEY = "competitoriq-data";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Load failed:", e);
  }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

function getState(state) {
  return {
    competitors: state.competitors,
    features: state.features,
    featureScores: state.featureScores,
    monopoly: state.monopoly,
    marketOverview: state.marketOverview,
    apiKey: state.apiKey,
    pastResearches: state.pastResearches,
    currentResearchQuery: state.currentResearchQuery,
  };
}

const useStore = create((set, get) => {
  const saved = loadData();

  return {
    // === STATE ===
    competitors: saved?.competitors || sampleCompetitors,
    features: saved?.features || sampleFeatures,
    featureScores: saved?.featureScores || sampleFeatureScores,
    monopoly: saved?.monopoly || sampleMonopoly,
    marketOverview: saved?.marketOverview || sampleMarketOverview,
    apiKey: saved?.apiKey || "",
    pastResearches: saved?.pastResearches || [],
    currentResearchQuery: saved?.currentResearchQuery || "",

    // === LOAD RESEARCH RESULTS ===
    loadResearch: (result) => {
      set((state) => {
        const pastResearches = [
          { query: result.query, timestamp: result.timestamp },
          ...(state.pastResearches || []).filter(
            (r) => r.query !== result.query,
          ),
        ].slice(0, 20);

        const updated = {
          ...state,
          competitors: result.competitors,
          features: result.features,
          featureScores: result.featureScores,
          monopoly: result.monopoly || sampleMonopoly,
          marketOverview: result.marketOverview || sampleMarketOverview,
          pastResearches,
          currentResearchQuery: result.query,
        };
        saveData(getState(updated));
        return updated;
      });
    },

    // === API KEY ===
    setApiKey: (key) => {
      set((state) => {
        const updated = { ...state, apiKey: key };
        saveData(getState(updated));
        return { apiKey: key };
      });
    },

    // === COMPETITORS ===
    addCompetitor: (competitor) => {
      const newCompetitor = {
        ...competitor,
        id: Date.now().toString(),
        score: competitor.score || 50,
        trend: "+0",
        status: "New",
        color: [
          "#3B82F6",
          "#8B5CF6",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#EC4899",
        ][get().competitors.length % 6],
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        const newFeatureScores = { ...state.featureScores };
        newFeatureScores[newCompetitor.id] = {};
        state.features.forEach((f) => {
          newFeatureScores[newCompetitor.id][f.id] = "no";
        });
        const updated = {
          ...state,
          competitors: [...state.competitors, newCompetitor],
          featureScores: newFeatureScores,
        };
        saveData(getState(updated));
        return updated;
      });
    },

    updateCompetitor: (id, updates) => {
      set((state) => {
        const updated = {
          ...state,
          competitors: state.competitors.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        };
        saveData(getState(updated));
        return updated;
      });
    },

    deleteCompetitor: (id) => {
      set((state) => {
        const newFS = { ...state.featureScores };
        delete newFS[id];
        const updated = {
          ...state,
          competitors: state.competitors.filter((c) => c.id !== id),
          featureScores: newFS,
        };
        saveData(getState(updated));
        return updated;
      });
    },

    getCompetitor: (id) => get().competitors.find((c) => c.id === id),

    // === FEATURES ===
    addFeature: (feature) => {
      const newFeature = { ...feature, id: "f" + Date.now() };
      set((state) => {
        const newFS = { ...state.featureScores };
        state.competitors.forEach((c) => {
          if (!newFS[c.id]) newFS[c.id] = {};
          newFS[c.id][newFeature.id] = "no";
        });
        const updated = {
          ...state,
          features: [...state.features, newFeature],
          featureScores: newFS,
        };
        saveData(getState(updated));
        return updated;
      });
    },

    updateFeature: (id, updates) => {
      set((state) => {
        const updated = {
          ...state,
          features: state.features.map((f) =>
            f.id === id ? { ...f, ...updates } : f,
          ),
        };
        saveData(getState(updated));
        return updated;
      });
    },

    deleteFeature: (id) => {
      set((state) => {
        const newFS = { ...state.featureScores };
        Object.keys(newFS).forEach((compId) => {
          const copy = { ...newFS[compId] };
          delete copy[id];
          newFS[compId] = copy;
        });
        const updated = {
          ...state,
          features: state.features.filter((f) => f.id !== id),
          featureScores: newFS,
        };
        saveData(getState(updated));
        return updated;
      });
    },

    setFeatureScore: (competitorId, featureId, value) => {
      set((state) => {
        const newFS = { ...state.featureScores };
        if (!newFS[competitorId]) newFS[competitorId] = {};
        newFS[competitorId] = { ...newFS[competitorId], [featureId]: value };
        const updated = { ...state, featureScores: newFS };
        saveData(getState(updated));
        return updated;
      });
    },

    // === RESET ===
    resetToSample: () => {
      const data = {
        competitors: sampleCompetitors,
        features: sampleFeatures,
        featureScores: sampleFeatureScores,
        monopoly: sampleMonopoly,
        marketOverview: sampleMarketOverview,
        apiKey: get().apiKey,
        pastResearches: get().pastResearches,
        currentResearchQuery: "",
      };
      set(data);
      saveData(data);
    },
  };
});

export default useStore;
