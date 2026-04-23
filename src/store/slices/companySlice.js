import { analyzeCompany } from '../../services/analyze';

export const createCompanySlice = (set, get) => ({
  companyResult: null,
  companyLoading: false,
  companyError: null,

  runAnalysis: async (input) => {
    set({ companyLoading: true, companyError: null, companyResult: null });
    try {
      const apiKey = get().apiKey;
      const result = await analyzeCompany({ ...input, apiKey });
      if (result.ok) {
        set({ companyResult: result.data, companyLoading: false });
      } else {
        set({ companyError: result.error, companyLoading: false });
      }
      return result;
    } catch (e) {
      set({ companyError: e.message, companyLoading: false });
      return { ok: false, error: e.message };
    }
  },

  clearCompany: () => set({ companyResult: null, companyError: null }),
});
