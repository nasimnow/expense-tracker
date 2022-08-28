import supabase from "../utils/supabase";

export const addTags = async (tag: any) => {
  return await supabase.from("tags").insert({ name: tag.toLowerCase() });
};

export const getTags = async () => {
  const response = await supabase.from("tags").select();
  return response.body;
};

interface TagTransaction {
  tag_id: number;
  transaction_id: number;
}

export const addTransactionTags = async (transactionTags: TagTransaction[]) => {
  return await supabase.from("transaction_tags").insert(transactionTags);
};

export const editTransactionTags = async (
  transaction_id: number,
  tags: any
) => {
  //remove existing tags and replace with new tags
  tags = tags.map((tag_id: any) => ({ tag_id, transaction_id }));
  await supabase.from("transaction_tags").delete().match({ transaction_id });
  await supabase.from("transaction_tags").insert(tags);
};
