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

const STORAGE_KEY = 'competitoriq-data';

// Load from localStorage
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return null;
}

// Save to localStorage
function saveData(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      competitors: state.competitors,
    }));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

const useStore = create((set, get) => {
  const saved = loadData();

  return {
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
        const updated = { competitors: [...state.competitors, newCompetitor] };
        saveData(updated);
        return updated;
      });
    },

    updateCompetitor: (id, updates) => {
      set((state) => {
        const updated = {
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
        const updated = {
          competitors: state.competitors.filter((c) => c.id !== id),
        };
        saveData(updated);
        return updated;
      });
    },

    getCompetitor: (id) => {
      return get().competitors.find((c) => c.id === id);
    },

    resetToSample: () => {
      set({ competitors: sampleCompetitors });
      saveData({ competitors: sampleCompetitors });
    },
  };
});

export default useStore;
