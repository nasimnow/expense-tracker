import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "twin.macro";
import { addAccount, getAccounts } from "../api/account.api";
import { getCategories, getSubCategories } from "../api/category.api";
import { addTags, editTransactionTags, getTags } from "../api/tag.api";
import {
  deleteTransaction,
  getSingleTransaction,
  updateSingleTransaction,
} from "../api/transaction.api";
import AddableSelect from "../components/AddableSelect";
import AddCategoryModal from "../components/addCategoryModal";
import { DATE_FORMAT } from "../constants";
import captalizeSentance from "../utils/capitalizeSentance";

const EditTransactions = () => {
  const transactionId: string = useLocation().pathname.split("/")[2];
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] =
    useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const accountsQuery = useQuery<any>(["accounts"], () => getAccounts(""));
  const categoriesQuery = useQuery(["categories"], () => getCategories());
  const tagsQuery = useQuery(["tags"], () => getTags());

  const navigate = useNavigate();

  const addTagAPI = async (tag: string) => {
    setLoading("ADD_TAG");
    const { data = [], error }: any = await addTags(tag);
    tagsQuery.refetch();
    const currentTags = form.getFieldValue("tags");
    form.setFieldsValue({ tags: [...currentTags, data[0].id] });

    if (error) message.error("Same tag already exists");
    setLoading(null);
  };

  useEffect(() => {
    setLoading("UPDATE_TRANSACTION");

    if (transactionId) getTransactionData();
    setLoading(null);
  }, [transactionId]);

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
    if (item) {
      const subCategoriesResponse: any = await getSubCategories(item);
      setSubCategories(subCategoriesResponse.data);
    }
  };

  const onFinish = async (values: any) => {
    // replace undefined with null
    Object.keys(values).forEach((key) => {
      if (values[key] === undefined) {
        values[key] = null;
      }
    });
    values.transaction_date = values?.transaction_date?.format("YYYY-MM-DD");
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
      navigate("/transactions");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
    setLoading(null);
  };

  const deleteTransactionAPI = async () => {
    await deleteTransaction(Number(transactionId));
    message.success("Transaction deleted successfully");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    navigate("/transactions");
  };

  const addAccountAPI = async (account: string) => {
    setLoading("ADD_ACCOUNT");
    const { data = [], error }: any = await addAccount({
      name: captalizeSentance(account),
    });
    if (error) {
      message.error("Same Account already exists");
    } else {
      form.setFieldsValue({ account_id: data[0].id });
    }
    setLoading(null);
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
          <Form.Item name={["account_id"]} label="Account">
            <AddableSelect
              placeholder="Account"
              optionFilterProp="children"
              showSearch
              size="large"
              style={{ textTransform: "capitalize" }}
              addButtonText="Add Account"
              onAddOption={async (account: string) => {
                await addAccountAPI(account);
              }}
              addButtonLoading={loading === "ADD_ACCOUNT"}
              allowClear
            >
              {accountsQuery?.data?.map((item: any) => (
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
                  allowClear
                  onClear={() => form.setFieldsValue({ sub_category: null })}
                >
                  {categoriesQuery?.data?.map((item: any) => (
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
                  allowClear
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
              {tagsQuery?.data?.map((item: any) => (
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
          <Form.Item name={["comment"]} label="Comments" tw="pb-20">
            <Input.TextArea placeholder="Type Comments Here" />
          </Form.Item>
          <div tw="fixed bottom-0 flex justify-end p-2 w-1/2 shadow-2xl bg-white">
            <Button
              type="primary"
              tw="w-36"
              htmlType="submit"
              size="large"
              loading={loading === "UPDATE_TRANSACTION"}
            >
              Update
            </Button>
          </div>
        </Form>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default EditTransactions;
