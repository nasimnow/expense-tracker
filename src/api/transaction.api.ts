import supabase from "../utils/supabase";

export const addTransactions = async (transaction: any) => {
  return await supabase.from("transactions").insert(transaction);
};

interface TransactionParams {
  from: number;
  to: number;
}

export const getTransactions = async ({ from, to }: TransactionParams) => {
  console.log({ from, to });
  return await supabase
    .from("transactions")
    .select("*,categories(*),sub_categories(*)", { count: "exact" })
    .eq("is_deleted", false)
    .range(from, to)
    .order("id", { ascending: false });
};
