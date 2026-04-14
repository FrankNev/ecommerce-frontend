import { create } from 'zustand';
 
const useProductImageStore = create((set) => ({
  activeIndex: 0,
  setActiveIndex: (index) => set({ activeIndex: index }),
  reset: () => set({ activeIndex: 0 }),
}));
 
export default useProductImageStore;