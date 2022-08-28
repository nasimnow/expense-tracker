import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message, Select, Typography } from "antd";
import { useState } from "react";
import {
  addCategories,
  addSubCategories,
  getCategories,
} from "../api/category.api";

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ visible, onClose }: AddCategoryModalProps) => {
  const [categoryForm] = Form.useForm();
  const [subCategoryForm] = Form.useForm();

  const categoriesQuery = useQuery(["categories"], getCategories);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const onCategoryFinish = async (values: any) => {
    let categoryObject: any = {
      name: values.name,
    };
    const { error } = await addCategories(categoryObject);
    if (error) {
      message.error(error.message || "Something went wrong");
    } else {
      message.success("Category added successfully");
      categoryForm.resetFields();
      onClose();
    }
  };

  const onSubCategoryFinish = async (values: any) => {
    const { error } = await addSubCategories(values);
    if (error) {
      message.error(error?.message || "Something went wrong");
    } else {
      message.success("Sub Category added successfully");
      subCategoryForm.resetFields();
      onClose();
    }
  };

  return (
    <Drawer
      title="Add Category"
      placement="right"
      onClose={() => {
        categoryForm.resetFields();
        subCategoryForm.resetFields();
        onClose();
      }}
      visible={visible}
    >
      <div tw="flex flex-col gap-6">
        <Form layout="vertical" onFinish={onCategoryFinish} form={categoryForm}>
          <Form.Item name={["name"]} label="Name" rules={[{ required: true }]}>
            <Input
              placeholder="Category Name"
              size="large"
              autoComplete="off"
              list="autocompleteOff"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Add Category
          </Button>
        </Form>

        <Form
          layout="vertical"
          onFinish={onSubCategoryFinish}
          form={subCategoryForm}
        >
          <Typography.Title level={5}>Add SubCategory</Typography.Title>

          <Form.Item
            name={["parent_category"]}
            label="Parent Category"
            rules={[{ required: true }]}
          >
            <Select
              loading={categoriesQuery.isLoading}
              optionFilterProp="children"
              showSearch
              size="large"
              onChange={async (item) => {
                setIsCategorySelected(true);
              }}
            >
              {categoriesQuery.data?.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={["name"]} label="Name" rules={[{ required: true }]}>
            <Input
              disabled={!isCategorySelected}
              placeholder="Category Name"
              size="large"
              autoComplete="off"
              list="autocompleteOff"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Add SubCategory
          </Button>
        </Form>
      </div>
    </Drawer>
  );
};

export default AddCategoryModal;
