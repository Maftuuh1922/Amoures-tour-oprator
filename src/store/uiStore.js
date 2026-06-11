import { create } from 'zustand'

const useUIStore = create((set) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  clearSearch: () => set({ searchQuery: '' }),
}))

export default useUIStore
