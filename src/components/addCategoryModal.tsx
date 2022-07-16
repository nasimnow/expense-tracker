import { Drawer, Form, Input, Button, message, Typography, Select } from "antd";
import search from "@jukben/emoji-search";
import {
  addCategories,
  addSubCategories,
  getCategories,
} from "../api/category.api";
import tw from "twin.macro";
import { useEffect, useState } from "react";

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddCategoryModal = ({ visible, onClose }: AddCategoryModalProps) => {
  const [categoryForm] = Form.useForm();
  const [subCategoryForm] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  useEffect(() => {
    getData();
  }, [visible]);

  const getData = async () => {
    const { data: categories }: any = await getCategories();
    setCategories(categories);
  };

  const onCategoryFinish = async (values: any) => {
    let emojies = search(values.name);
    let categoryObject: any = {
      name: values.name,
      emoji: emojies.length > 0 ? emojies[0].char : null,
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
            <Input placeholder="Category Name" size="large" />
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
              optionFilterProp="children"
              showSearch
              size="large"
              onChange={async (item) => {
                setIsCategorySelected(true);
              }}
            >
              {categories.map((item: any) => (
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
