import supabase from "../utils/supabase";
import { addTransactionTags } from "./tag.api";

export const addTransactions = async (transaction: any) => {
  try {
    let tags = transaction.tags;
    console.log(
      "🚀 ~ file: transaction.api.ts ~ line 7 ~ addTransactions ~ tags",
      tags
    );
    delete transaction.tags;
    const response: any = await supabase
      .from("transactions")
      .insert(transaction);
    if (tags?.length > 0) {
      tags = tags.map((tag: any) => ({
        transaction_id: response.data[0].id,
        tag_id: tag,
      }));
      await addTransactionTags(tags);
    }
    return true;
  } catch (error) {
    return false;
  }
};

interface TransactionParams {
  from?: number;
  to?: number;
  startDate?: string | null;
  endDate?: string | null;
  search?: string;
  category_ids?: number[] | undefined;
  account_ids: number[] | undefined;
  tag_ids?: number[] | undefined;
  transaction_type?: "expense" | "income" | null | undefined;
}

export const getTransactions = async ({
  from,
  to,
  startDate,
  endDate,
  search,
  category_ids,
  account_ids,
  tag_ids,
  transaction_type,
}: TransactionParams) => {
  const query = supabase
    .from("transactions")
    .select(
      "*,categories(*),sub_categories(*),transaction_tags(tags(*)),accounts(*)",
      {
        count: "exact",
      }
    )
    .eq("is_deleted", false)
    .order("id", { ascending: false });

  if (transaction_type) {
    query.eq("type", transaction_type.toUpperCase());
  }

  if (from && to) {
    query.range(from, to);
  }
  if (category_ids && category_ids.length > 0) {
    query.in("category", category_ids);
  }
  if (search) {
    query.or(`comment.ilike.%${search}%,invoice_no.ilike.%${search}%`);
  }
  if (startDate && endDate) {
    query.lte("transaction_date", endDate).gte("transaction_date", startDate);
  }
  if (account_ids && account_ids.length > 0) {
    query.in("account_id", account_ids);
  }
  if (tag_ids && tag_ids.length > 0) {
    let { data: taggedTransactions = [] } = await supabase
      .from("transaction_tags")
      .select("transaction_id")
      .in("tag_id", tag_ids);

    if (taggedTransactions && taggedTransactions.length > 0) {
      taggedTransactions = taggedTransactions.map(
        (account: any) => account.transaction_id
      );
      query.in("id", taggedTransactions);
    }
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
