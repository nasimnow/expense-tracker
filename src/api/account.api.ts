import supabase from "../utils/supabase";

export const addAccount = async (account: any) => {
  return await supabase.from("accounts").insert(account);
};

export const getAccounts = async (search = "" as any) => {
  const query = supabase.from("accounts").select("*").order("id", {
    ascending: false,
  });
  if (search) {
    query.ilike("name", `%${search}%`);
  }
  return await query;
};

export const getSingleAccount = async (id: number) => {
  const query = supabase.from("accounts").select("*").eq("id", id);
  return await query;
};
