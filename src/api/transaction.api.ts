import supabase from "../utils/supabase";

export const addTransactions = async (transaction: any) => {
  return await supabase.from("transactions").insert(transaction);
};

interface TransactionParams {
  from: number;
  to: number;
  startDate: string | null;
  endDate: string | null;
  search: string;
  categoryId: number | null;
}

export const getTransactions = async ({
  from,
  to,
  startDate,
  endDate,
  search,
  categoryId,
}: TransactionParams) => {
  const query = supabase
    .from("transactions")
    .select("*,categories(*),sub_categories(*),transaction_tags(tags(*))", {
      count: "exact",
    })
    .eq("is_deleted", false)
    .range(from, to)
    .order("id", { ascending: false });

  if (categoryId) {
    query.eq("category", categoryId);
  }
  if (search) {
    query.or(`comment.ilike.%${search}%,invoice_no.ilike.%${search}%`);
  }
  if (startDate && endDate) {
    query.lte("transaction_date", endDate).gte("transaction_date", startDate);
  }
  return await query;
};

export const getSingleTransaction = async (id: any) => {
  return await supabase
    .from("transactions")
    .select("*,categories(*),sub_categories(*),transaction_tags(tags(*))")
    .eq("id", id)
    .eq("is_deleted", false);
};

export const updateSingleTransaction = async (id: number, transaction: any) => {
  return await supabase.from("transactions").update(transaction).match({ id });
};

export const deleteTransaction = async (id: number) => {
  return await supabase
    .from("transactions")
    .update({ is_deleted: true })
    .match({ id });
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
  return await supabase.rpc("categories_sum_2", {
    transaction_type: type,
    start_date: start_date,
    end_date: end_date,
  });
};
