import { analyzeIdea } from '../../services/analyze';

export const createIdeaSlice = (set, get) => ({
  ideaResult: null,
  ideaLoading: false,
  ideaError: null,

  runIdeaAnalysis: async (input) => {
    set({ ideaLoading: true, ideaError: null, ideaResult: null });
    try {
      const apiKey = get().apiKey;
      const result = await analyzeIdea({ ...input, apiKey });
      if (result.ok) {
        set({ ideaResult: result.data, ideaLoading: false });
      } else {
        set({ ideaError: result.error, ideaLoading: false });
      }
      return result;
    } catch (e) {
      set({ ideaError: e.message, ideaLoading: false });
      return { ok: false, error: e.message };
    }
  },

  clearIdea: () => set({ ideaResult: null, ideaError: null }),
});
