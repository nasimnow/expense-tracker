import supabase from "../utils/supabase";

export const addTransactions = async (transaction: any) => {
  return await supabase.from("transactions").insert(transaction);
};

interface TransactionParams {
  from: number;
  to: number;
  startDate: string | null;
  endDate: string | null;
}

export const getTransactions = async ({
  from,
  to,
  startDate,
  endDate,
}: TransactionParams) => {
  return await supabase
    .from("transactions")
    .select("*,categories(*),sub_categories(*)", { count: "exact" })
    .lte("transaction_date", endDate)
    .gte("transaction_date", startDate)
    .eq("is_deleted", false)
    .range(from, to)
    .order("id", { ascending: false });
};

export const getSingleTransaction = async (id: number) => {
  return await supabase
    .from("transactions")
    .select("*,categories(*),sub_categories(*)")
    .eq("id", id)
    .eq("is_deleted", false);
};

export const updateSingleTransaction = async (id: number, transaction: any) => {
  return await supabase.from("transactions").update(transaction).match({ id });
};

interface TransactionSumParams {
  type: "INCOME" | "EXPENSE";
  start_date: string;
  end_date: string;
}

export const getTransactionsSumByCategories = async ({
  type,
  start_date,
  end_date,
}: TransactionSumParams) => {
  return await supabase.rpc("categories_sum_by_date", {
    transaction_type: type,
    start_date: start_date,
    end_date: end_date,
  });
};
