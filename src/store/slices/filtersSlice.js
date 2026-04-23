export const createFiltersSlice = (set) => ({
  scope: 'all',
  filterCountry: null,
  filterLanguage: null,
  filterMaxSize: null,

  setScope: (scope) => set({ scope }),
  setFilterCountry: (country) => set({ filterCountry: country }),
  setFilterLanguage: (language) => set({ filterLanguage: language }),
  setFilterMaxSize: (maxSize) => set({ filterMaxSize: maxSize }),
});
