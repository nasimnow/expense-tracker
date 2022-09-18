import "twin.macro";
import { useEffect, useState } from "react";
import AddCategoryModal from "../components/addCategoryModal";
import { deleteCategory, getCategories } from "../api/category.api";
import { CategoriesCard } from "../styles/catogories.style";
import { CloseOutline } from "react-ionicons";
import { Popconfirm, Button, message, List } from "antd";
import { Category } from "../types/categories.types";
import { useQuery } from "@tanstack/react-query";

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery(["categories"], getCategories);

  useEffect(() => {
    if (!isModalVisible) {
      refetch();
    }
  }, [isModalVisible]);

  return (
    <>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base mb-6">Categories</h2>
        <Button
          size="large"
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          Add New Category
        </Button>
      </div>
      <List
        grid={{ xs: 1, lg: 3 }}
        loading={isLoading}
        dataSource={categories || []}
        renderItem={(item: Category) => (
          <CategoriesCard key={item.id}>
            <div tw="flex items-center capitalize">
              <div className="image">{item.emoji || item.name.charAt(0)}</div>
              <h2>{item.name}</h2>
            </div>
            <Popconfirm
              title="Are you sure to delete this category?"
              onConfirm={async () => {
                const { error } = await deleteCategory(item.id);
                if (error)
                  message.error(error.message || "Something went wrong");
                else {
                  message.success("Category deleted successfully");
                  refetch();
                }
              }}
            >
              <CloseOutline color="red" />
            </Popconfirm>
          </CategoriesCard>
        )}
      />
    </>
  );
};
export default Categories;
