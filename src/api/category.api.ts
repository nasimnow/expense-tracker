import { Category } from "../types/categories.types";
import supabase from "../utils/supabase";

export const addCategories = async (category: Category) => {
  return await supabase.from("categories").insert(category);
};

export const getCategories = async () => {
  return await supabase.from("categories").select("*").order("id", {
    ascending: false,
  });
};

export const getSubCategories = async (parentCategoryId: number) => {
  return await supabase
    .from("sub_categories")
    .select("*")
    .eq("parent_category", parentCategoryId);
};

export const addSubCategories = async (subCategory: any) => {
  const isSubCategoryExist = (await supabase
    .from("sub_categories")
    .select("*")
    .eq("name", subCategory.name)
    .eq("parent_category", subCategory.parent_category)) as any;
  if (isSubCategoryExist.data?.length < 1) {
    return await supabase.from("sub_categories").insert(subCategory);
  } else {
    return { error: { error: true, message: "Sub category already exist" } };
  }
};

export const deleteCategory = async (categoryId: number) => {
  return await supabase.from("categories").delete().match({ id: categoryId });
};
