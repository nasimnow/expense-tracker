import create from "zustand";

interface IPagination {
  current: number;
  pageSize: number;
  total: number;
}

type TDateRange = [moment.Moment | null, moment.Moment | null];
interface ITransactionFilters {
  filter_accounts?: number[];
  filter_categories?: number[];
  filter_sub_categories?: number[];
  filter_tags?: number[];
  filter_type?: null | "income" | "expense";
  filter_date_range?: TDateRange;
  filter_search?: string;
}

export const defaultFilterValues: ITransactionFilters = {
  filter_accounts: [],
  filter_categories: [],
  filter_sub_categories: [],
  filter_tags: [],
  filter_type: null,
  filter_date_range: [null, null],
  filter_search: "",
};

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
  transactionFilters: ITransactionFilters;
  setTransactionFilters: (transactionFilters: ITransactionFilters) => void;
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

  transactionFilters: { ...defaultFilterValues },
  setTransactionFilters: (transactionFilters) =>
    set((old) => ({
      transactionFilters: { ...old.transactionFilters, ...transactionFilters },
    })),
}));

export default useZustandStore;
