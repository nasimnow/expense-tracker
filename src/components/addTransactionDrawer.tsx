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
} from "antd";
import moment from "moment";
import { DATE_FORMAT } from "../constants";
import { addTransactions } from "../api/transaction.api";
import { useEffect, useState } from "react";
import { getCategories, getSubCategories } from "../api/category.api";
import isMobile from "is-mobile";
import AddCategoryModal from "./addCategoryModal";
import tw from "twin.macro";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddTransactionModal = ({
  visible,
  onClose,
}: AddTransactionModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [visible, addCategoryModalVisible]);

  const getData = async () => {
    const { data: categories }: any = await getCategories();
    setCategories(categories);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const { error } = await addTransactions(values);
    if (error) {
      message.error("Something went wrong");
    } else {
      message.success("Transaction added successfully");
      form.resetFields();
    }
    setLoading(false);
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
        <Form.Item name={["invoice_no"]} label="Invoice / Voucher No">
          <Input placeholder="invoice / voucher no" />
        </Form.Item>
        <Form.Item name={["comment"]} label="Comments">
          <Input.TextArea placeholder="Type Comments Here" />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          Submit
        </Button>
      </Form>
    </Drawer>
  );
};

export default AddTransactionModal;
