import {
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Button,
  Modal,
  Popconfirm,
} from "antd";
import moment from "moment";
import { DATE_FORMAT } from "../constants";
import {
  deleteTransaction,
  getSingleTransaction,
  updateSingleTransaction,
} from "../api/transaction.api";
import { useEffect, useState } from "react";
import { getCategories, getSubCategories } from "../api/category.api";
import AddCategoryModal from "../components/addCategoryModal";
import "twin.macro";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import AddableSelect from "../components/AddableSelect";
import { addTags, editTransactionTags, getTags } from "../api/tag.api";

const EditTransactions = () => {
  const transactionId: string = useLocation().pathname.split("/")[2];
  const [loading, setLoading] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState<any>([]);

  const [subCategories, setSubCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] =
    useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const navigate = useNavigate();

  const addTagAPI = async (tag: string) => {
    setLoading("ADD_TAG");
    const { data = [], error }: any = await addTags(tag);
    !error && setTags([...tags, ...data]);
    const currentTags = form.getFieldValue("tags");
    form.setFieldsValue({ tags: [...currentTags, data[0].id] });

    if (error) message.error("Same tag already exists");
    setLoading(null);
  };

  useEffect(() => {
    setLoading("UPDATE_TRANSACTION");
    getCategoriesData();

    if (transactionId) getTransactionData();
    setLoading(null);
  }, [transactionId]);

  const getCategoriesData = async () => {
    const { data: categories }: any = await getCategories();
    const { data: tags }: any = await getTags();

    setTags(tags);
    setCategories(categories);
  };

  const getTransactionData = async () => {
    let { data }: any = await getSingleTransaction(Number(transactionId));
    data = data[0] || {};
    data = {
      ...data,
      transaction_date: moment(data.transaction_date),
      tags: data.transaction_tags.map((item: any) => item.tags.id),
    };
    getSubCategoriesById(data.category);
    setTransactionData(data);
  };

  const getSubCategoriesById = async (item: any) => {
    const subCategoriesResponse: any = await getSubCategories(item);
    setSubCategories(subCategoriesResponse.data);
  };

  const onFinish = async (values: any) => {
    setLoading("UPDATE_TRANSACTION");
    const tags = values.tags;
    delete values.tags;
    const { error } = await updateSingleTransaction(
      Number(transactionId),
      values
    );

    if (error) {
      message.error("Something went wrong");
    } else {
      await editTransactionTags(Number(transactionId), tags);
      message.success("Transaction updated successfully");
    }
    setLoading(null);
  };

  const deleteTransactionAPI = async () => {
    await deleteTransaction(Number(transactionId));
    message.success("Transaction deleted successfully");
    navigate("/transactions");
  };

  return (
    <>
      <div tw="flex justify-between">
        <Button
          icon={<ArrowLeftOutlined />}
          size="large"
          style={{ marginBottom: "20px" }}
          onClick={() => navigate("/transactions")}
        >
          Back
        </Button>
        <Popconfirm
          title="Are you sure to delete this transaction"
          onConfirm={deleteTransactionAPI}
        >
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            size="large"
            style={{ marginBottom: "20px" }}
          >
            Delete
          </Button>
        </Popconfirm>
      </div>
      <AddCategoryModal
        onClose={() => {
          setAddCategoryModalVisible(false);
        }}
        visible={addCategoryModalVisible}
      />
      {transactionData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={transactionData}
        >
          <Form.Item name={["type"]} label="Type" rules={[{ required: true }]}>
            <Radio.Group
              size="large"
              options={[
                { label: "Expense", value: "EXPENSE" },
                { label: "Income", value: "INCOME" },
              ]}
              optionType="button"
              value={["CASH"]}
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item
            name={["transaction_date"]}
            label="Date"
            rules={[{ required: true }]}
          >
            <DatePicker size="large" format={DATE_FORMAT} />
          </Form.Item>
          <Row gutter={{ sm: 8, lg: 24 }}>
            <Col xs={24} sm={24} lg={12}>
              <Form.Item
                name={["category"]}
                label="Category"
                rules={[{ required: true }]}
                style={{ marginBottom: "2px" }}
              >
                <Select
                  optionFilterProp="children"
                  showSearch
                  size="large"
                  onChange={async (item) => await getSubCategoriesById(item)}
                  style={{ textTransform: "capitalize" }}
                >
                  {categories.map((item: any) => (
                    <Select.Option
                      key={item.id}
                      value={item.id}
                      style={{ textTransform: "capitalize" }}
                    >
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <p
                tw="text-blue-600 font-bold cursor-pointer"
                onClick={() => {
                  form.setFieldsValue({ category: null });
                  setAddCategoryModalVisible(true);
                }}
              >
                Add Category
              </p>
            </Col>
            <Col xs={24} sm={24} lg={12}>
              <Form.Item name={["sub_category"]} label="Sub Category">
                <Select
                  optionFilterProp="children"
                  showSearch
                  size="large"
                  disabled={form.getFieldValue("category") === null}
                >
                  {subCategories.map((item: any) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            style={{ marginTop: "6px" }}
            name={["amount"]}
            label="Amount"
            rules={[{ required: true }]}
          >
            <InputNumber size="large" placeholder="Amount" />
          </Form.Item>
          <Form.Item
            name={["account"]}
            label="Account"
            rules={[{ required: true }]}
          >
            <Radio.Group
              size="large"
              options={[
                { label: "Cash", value: "CASH" },
                { label: "Cheque", value: "CHEQUE" },
                { label: "Bank", value: "BANK" },
              ]}
              optionType="button"
              value={["CASH"]}
              buttonStyle="solid"
            />
          </Form.Item>
          <Form.Item
            name={["tags"]}
            label="Tags"
            style={{ marginBottom: "2px" }}
          >
            <AddableSelect
              mode="multiple"
              placeholder="Tags"
              optionFilterProp="children"
              showSearch
              size="large"
              style={{ textTransform: "capitalize" }}
              onAddOption={async (tag: string) => {
                await addTagAPI(tag);
              }}
              addButtonLoading={loading === "ADD_TAG"}
            >
              {tags.map((item: any) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  style={{ textTransform: "capitalize" }}
                >
                  {item.name}
                </Select.Option>
              ))}
            </AddableSelect>
          </Form.Item>
          <Form.Item name={["invoice_no"]} label="Invoice No">
            <Input />
          </Form.Item>
          <Form.Item name={["comment"]} label="Comments">
            <Input.TextArea placeholder="Type Comments Here" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading === "UPDATE_TRANSACTION"}
          >
            Update
          </Button>
        </Form>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default EditTransactions;
