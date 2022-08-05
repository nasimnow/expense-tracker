import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
} from "antd";
import isMobile from "is-mobile";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addAccount, getAccounts } from "../api/account.api";
import { getCategories, getSubCategories } from "../api/category.api";
import { addTags, getTags } from "../api/tag.api";
import { addTransactions } from "../api/transaction.api";
import { DATE_FORMAT } from "../constants";
import captalizeSentance from "../utils/capitalizeSentance";
import AddableSelect from "./AddableSelect";
import AddCategoryModal from "./addCategoryModal";
import "twin.macro";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({
  visible,
  onClose,
}: AddTransactionModalProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] =
    useState<boolean>(false);
  const [tags, setTags] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);

  const transactionsQuery = useMutation(addTransactions);

  useEffect(() => {
    getData();
  }, [visible, addCategoryModalVisible]);

  const getData = async () => {
    const { data: categories }: any = await getCategories();
    const { data: tags }: any = await getTags();
    const { data: accounts }: any = await getAccounts();

    setTags(tags);
    setAccounts(accounts);
    setCategories(categories);
  };

  const onFinish = async (values: any) => {
    transactionsQuery.mutate(values);
    if (transactionsQuery.isError) message.error("Something went wrong");
    else {
      message.success("Transaction added successfully");
      form.resetFields();
    }
  };

  const addTagAPI = async (tag: string) => {
    setLoading("ADD_TAG");
    const { data = [], error }: any = await addTags(tag);
    !error && setTags([...tags, ...data]);
    const currentTags = form.getFieldValue("tags");
    form.setFieldsValue({ tags: [...currentTags, data[0].id] });
    if (error) message.error("Same tag already exists");
    setLoading(null);
  };

  const addAccountAPI = async (account: string) => {
    setLoading("ADD_ACCOUNT");
    const { data = [], error }: any = await addAccount({
      name: captalizeSentance(account),
    });
    if (error) {
      message.error("Same Account already exists");
    } else {
      setAccounts([...accounts, ...data]);
      form.setFieldsValue({ account_id: data[0].id });
    }
    setLoading(null);
  };

  return (
    <Drawer
      width={isMobile() ? "100%" : "50%"}
      title="Add Transaction"
      placement="right"
      onClose={() => {
        form.resetFields();
        onClose();
      }}
      visible={visible}
    >
      <AddCategoryModal
        onClose={() => {
          setAddCategoryModalVisible(false);
        }}
        visible={addCategoryModalVisible}
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: "EXPENSE",
          transaction_date: moment(),
          account: "CASH",
        }}
      >
        <Row>
          <Col xs={24} sm={24} lg={12}>
            <Form.Item
              name={["type"]}
              label="Type"
              rules={[{ required: true }]}
            >
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
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Form.Item
              name={["transaction_date"]}
              label="Date"
              rules={[{ required: true }]}
            >
              <DatePicker size="large" format={DATE_FORMAT} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name={["account_id"]} label="Account">
          <AddableSelect
            placeholder="Account"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option.children
                .replace(/ /g, "")
                .toLowerCase()
                .indexOf(input.replace(/ /g, "").toLowerCase()) >= 0
            }
            showSearch
            addButtonText="Add Account"
            size="large"
            style={{ textTransform: "capitalize" }}
            onAddOption={async (account: string) => {
              await addAccountAPI(account);
            }}
            addButtonLoading={loading === "ADD_ACCOUNT"}
          >
            {accounts.map((item: any) => (
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
        <Row gutter={{ sm: 8, lg: 24 }}>
          <Col xs={24} sm={24} lg={12}>
            <Form.Item
              name={["category"]}
              label="Category"
              rules={[{ required: true }]}
              style={{ marginBottom: "2px" }}
            >
              <Select
                placeholder="Category"
                optionFilterProp="children"
                showSearch
                size="large"
                onChange={async (item) => {
                  const subCategoriesResponse: any = await getSubCategories(
                    item
                  );
                  setSubCategories(subCategoriesResponse.data);
                }}
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
              tw="text-blue-600 font-bold cursor-pointer pb-2"
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
        <Row>
          <Col xs={24} sm={24} lg={13}>
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
          </Col>

          <Col xs={24} sm={24} lg={11}>
            <Form.Item
              name={["amount"]}
              label="Amount"
              rules={[{ required: true }]}
            >
              <InputNumber tw="w-full" size="large" placeholder="Amount" />
            </Form.Item>
          </Col>
        </Row>
        <Collapse tw="mb-4 mt-2">
          <Collapse.Panel header="More Options" key="1">
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
            <Form.Item name={["invoice_no"]} label="Invoice / Voucher No">
              <Input placeholder="invoice / voucher no" />
            </Form.Item>
            <Form.Item name={["comment"]} label="Comments">
              <Input.TextArea placeholder="Type Comments Here" />
            </Form.Item>
          </Collapse.Panel>
        </Collapse>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={transactionsQuery.isLoading}
        >
          Submit
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddTransactionModal;
