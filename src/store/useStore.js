import { create } from 'zustand';

const sampleCompetitors = [
  {
    id: '1',
    name: 'Acme Corp',
    website: 'acmecorp.com',
    industry: 'SaaS',
    founded: '2019',
    hq: 'San Francisco, CA',
    employees: '250-500',
    funding: 'Series C · $45M',
    description: 'Enterprise analytics platform with strong market presence.',
    score: 82,
    trend: '+5',
    status: 'Leader',
    color: '#3B82F6',
    strengths: ['Strong brand recognition', 'Superior API documentation', '24/7 customer support'],
    weaknesses: ['No mobile app', 'Higher pricing', 'Slow release cycle'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'BetaWorks',
    website: 'betaworks.io',
    industry: 'SaaS',
    founded: '2020',
    hq: 'Austin, TX',
    employees: '100-250',
    funding: 'Series B · $20M',
    description: 'Developer-focused tools with rapid innovation cycle.',
    score: 74,
    trend: '+2',
    status: 'Contender',
    color: '#8B5CF6',
    strengths: ['Fast innovation', 'Developer community', 'Open-source tools'],
    weaknesses: ['Limited enterprise features', 'Small sales team'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'ClearView',
    website: 'clearview.co',
    industry: 'SaaS',
    founded: '2018',
    hq: 'London, UK',
    employees: '50-100',
    funding: 'Series A · $8M',
    description: 'Budget-friendly solution targeting SMBs.',
    score: 68,
    trend: '-1',
    status: 'Follower',
    color: '#F59E0B',
    strengths: ['Low pricing', 'Easy onboarding', 'Good documentation'],
    weaknesses: ['Limited features', 'No API access', 'Slow support'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'DataPrime',
    website: 'dataprime.dev',
    industry: 'SaaS',
    founded: '2022',
    hq: 'Berlin, DE',
    employees: '20-50',
    funding: 'Seed · $3M',
    description: 'AI-first analytics with rapid growth trajectory.',
    score: 61,
    trend: '+8',
    status: 'Rising',
    color: '#10B981',
    strengths: ['AI-powered insights', 'Modern tech stack', 'Fast growing'],
    weaknesses: ['New to market', 'Limited integrations', 'Small team'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Your Product',
    website: 'yourproduct.com',
    industry: 'SaaS',
    founded: '2024',
    hq: 'Remote',
    employees: '1-10',
    funding: 'Bootstrapped',
    description: 'Your competitive analysis tool.',
    score: 77,
    trend: '+12',
    status: 'You',
    color: '#EC4899',
    strengths: ['Fresh perspective', 'Modern UX', 'Agile development'],
    weaknesses: ['New entrant', 'Limited brand awareness'],
    createdAt: new Date().toISOString(),
  },
];

const sampleFeatures = [
  { id: 'f1', name: 'Real-time Analytics', category: 'Core' },
  { id: 'f2', name: 'API Access', category: 'Core' },
  { id: 'f3', name: 'Team Collaboration', category: 'Collaboration' },
  { id: 'f4', name: 'Custom Reports', category: 'Reporting' },
  { id: 'f5', name: 'Mobile App', category: 'Platform' },
  { id: 'f6', name: 'SSO / SAML', category: 'Security' },
  { id: 'f7', name: 'Webhooks', category: 'Integration' },
  { id: 'f8', name: 'White Labeling', category: 'Customization' },
  { id: 'f9', name: 'Data Export (CSV)', category: 'Reporting' },
  { id: 'f10', name: 'Role-Based Permissions', category: 'Security' },
  { id: 'f11', name: 'Slack Integration', category: 'Integration' },
  { id: 'f12', name: 'AI-Powered Insights', category: 'Core' },
];

// featureScores: { competitorId: { featureId: 'yes' | 'no' | 'partial' } }
const sampleFeatureScores = {
  '1': { f1: 'yes', f2: 'yes', f3: 'yes', f4: 'yes', f5: 'no', f6: 'yes', f7: 'yes', f8: 'no', f9: 'yes', f10: 'yes', f11: 'partial', f12: 'no' },
  '2': { f1: 'yes', f2: 'yes', f3: 'no', f4: 'yes', f5: 'yes', f6: 'no', f7: 'yes', f8: 'yes', f9: 'yes', f10: 'no', f11: 'yes', f12: 'partial' },
  '3': { f1: 'yes', f2: 'no', f3: 'yes', f4: 'no', f5: 'yes', f6: 'no', f7: 'no', f8: 'no', f9: 'yes', f10: 'no', f11: 'no', f12: 'no' },
  '4': { f1: 'partial', f2: 'yes', f3: 'yes', f4: 'yes', f5: 'no', f6: 'yes', f7: 'yes', f8: 'yes', f9: 'no', f10: 'yes', f11: 'yes', f12: 'yes' },
  '5': { f1: 'yes', f2: 'yes', f3: 'yes', f4: 'no', f5: 'yes', f6: 'no', f7: 'yes', f8: 'no', f9: 'yes', f10: 'partial', f11: 'no', f12: 'partial' },
};

const STORAGE_KEY = 'competitoriq-data';

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return null;
}

function saveData(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      competitors: state.competitors,
      features: state.features,
      featureScores: state.featureScores,
    }));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

const useStore = create((set, get) => {
  const saved = loadData();

  return {
    // === COMPETITORS ===
    competitors: saved?.competitors || sampleCompetitors,

    addCompetitor: (competitor) => {
      const newCompetitor = {
        ...competitor,
        id: Date.now().toString(),
        score: competitor.score || 50,
        trend: '+0',
        status: 'New',
        color: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'][
          get().competitors.length % 6
        ],
        strengths: [],
        weaknesses: [],
        createdAt: new Date().toISOString(),
      };
      set((state) => {
        // Initialize empty feature scores for new competitor
        const newFeatureScores = { ...state.featureScores };
        newFeatureScores[newCompetitor.id] = {};
        state.features.forEach((f) => {
          newFeatureScores[newCompetitor.id][f.id] = 'no';
        });

        const updated = {
          ...state,
          competitors: [...state.competitors, newCompetitor],
          featureScores: newFeatureScores,
        };
        saveData(updated);
        return updated;
      });
    },

    updateCompetitor: (id, updates) => {
      set((state) => {
        const updated = {
          ...state,
          competitors: state.competitors.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        };
        saveData(updated);
        return updated;
      });
    },

    deleteCompetitor: (id) => {
      set((state) => {
        const newFeatureScores = { ...state.featureScores };
        delete newFeatureScores[id];

        const updated = {
          ...state,
          competitors: state.competitors.filter((c) => c.id !== id),
          featureScores: newFeatureScores,
        };
        saveData(updated);
        return updated;
      });
    },

    getCompetitor: (id) => {
      return get().competitors.find((c) => c.id === id);
    },

    // === FEATURES ===
    features: saved?.features || sampleFeatures,
    featureScores: saved?.featureScores || sampleFeatureScores,

    addFeature: (feature) => {
      const newFeature = {
        ...feature,
        id: 'f' + Date.now(),
      };
      set((state) => {
        // Add 'no' score for every competitor
        const newScores = { ...state.featureScores };
        state.competitors.forEach((c) => {
          if (!newScores[c.id]) newScores[c.id] = {};
          newScores[c.id][newFeature.id] = 'no';
        });

        const updated = {
          ...state,
          features: [...state.features, newFeature],
          featureScores: newScores,
        };
        saveData(updated);
        return updated;
      });
    },

    updateFeature: (id, updates) => {
      set((state) => {
        const updated = {
          ...state,
          features: state.features.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        };
        saveData(updated);
        return updated;
      });
    },

    deleteFeature: (id) => {
      set((state) => {
        const newScores = { ...state.featureScores };
        Object.keys(newScores).forEach((compId) => {
          const copy = { ...newScores[compId] };
          delete copy[id];
          newScores[compId] = copy;
        });

        const updated = {
          ...state,
          features: state.features.filter((f) => f.id !== id),
          featureScores: newScores,
        };
        saveData(updated);
        return updated;
      });
    },

    setFeatureScore: (competitorId, featureId, value) => {
      set((state) => {
        const newScores = { ...state.featureScores };
        if (!newScores[competitorId]) newScores[competitorId] = {};
        newScores[competitorId] = { ...newScores[competitorId], [featureId]: value };

        const updated = { ...state, featureScores: newScores };
        saveData(updated);
        return updated;
      });
    },

    // === RESET ===
    resetToSample: () => {
      const data = {
        competitors: sampleCompetitors,
        features: sampleFeatures,
        featureScores: sampleFeatureScores,
      };
      set(data);
      saveData(data);
    },
  };
});

export default useStore;
