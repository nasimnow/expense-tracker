import supabase from "../utils/supabase";

export const addAccount = async (account: any) => {
  return await supabase
    .from("accounts")
    .insert({ ...account, name: account.name.toLowerCase() });
};

export const getAccounts = async (search = "" as any) => {
  const query = supabase.from("accounts").select("*").order("id", {
    ascending: false,
  });
  if (search) {
    query.ilike("name", `%${search}%`);
  }
  const response = await query;
  return response.body;
};

export const getSingleAccount = async (id: number) => {
  const query = supabase.from("accounts").select("*").eq("id", id);
  return await query;
};
