import create from "zustand";

interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}

interface IState {
  scrollPosition: number;
  setScrollPosition: (scrollPosition: number) => void;
  isAddDrawer: boolean;
  setIsAddDrawer: (isAddDrawer: boolean) => void;
  pagination: IPagination;
  setPagination: (pagination: any) => void;

  //accounts
  accountSearch: string;
  setAccountSearch: (accountSearch: string) => void;
}

const useZustandStore = create<IState>((set) => ({
  scrollPosition: 0,
  setScrollPosition: (scrollPosition) =>
    set({
      scrollPosition,
    }),
  isAddDrawer: false,
  setIsAddDrawer: (isAddDrawer) => set({ isAddDrawer }),
  pagination: {
    current: 1,
    pageSize: 25,
    total: 0,
  },
  setPagination: (values) => {
    set((state) => ({ pagination: { ...state.pagination, ...values } }));
  },

  //accounts
  accountSearch: "",
  setAccountSearch: (accountSearch) => set({ accountSearch }),
}));

export default useZustandStore;
