import supabase from "../utils/supabase";

export const addAccount = async (account: any) => {
  return await supabase.from("accounts").insert(account);
};
export const getAccounts = async () => {
  return await supabase.from("accounts").select("*").order("id", {
    ascending: false,
  });
};
