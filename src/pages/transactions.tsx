import { DatePicker, Button, List, Input, Select, Tag } from "antd";
import moment from "moment";
import { DateRanges, DATE_FORMAT } from "../constants";
import "twin.macro";
import { useEffect, useState } from "react";
import AddTransactionDrawer from "../components/addTransactionDrawer";
import { TransactionCard } from "../styles/transactions.style.";
import { getTransactions } from "../api/transaction.api";
import getPagination from "../utils/getPagination";
import { useNavigate } from "react-router-dom";
import { ITransaction } from "../types/transactions.types";
import { getCategories } from "../api/category.api";
import getUniqueColor from "../utils/getUniqueColor";

type TDateRange = [moment.Moment | null, moment.Moment | null];

const Transactions = () => {
  const [isAddDrawer, setIsAddDrawer] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<TDateRange>([
    null,
    null,
  ]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [pagination.current, selectedDateRange, search, selectedCategory]);

  useEffect(() => {
    if (!isAddDrawer) {
      getData();
    }
  }, [isAddDrawer]);

  const getData = async () => {
    setLoading(true);
    const { from, to } = getPagination(pagination.current, pagination.pageSize);
    //if range is null set a default date
    const { data, error, count } = await getTransactions({
      from,
      to,
      startDate: selectedDateRange[0]
        ? selectedDateRange[0].format("YYYY-MM-DD")
        : moment("2000-01-01").format("YYYY-MM-DD"),
      endDate: selectedDateRange[1]
        ? selectedDateRange[1].format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      search,
      categoryId: selectedCategory,
    });
    setPagination((old: any) => ({ ...old, total: count }));
    setTransactions(data as any);

    const { data: categoriesData } = await getCategories();
    setCategories(categoriesData as any);

    setLoading(false);
  };

  return (
    <>
      <AddTransactionDrawer
        visible={isAddDrawer}
        onClose={() => setIsAddDrawer(false)}
      />

      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base mb-6"> Transactions</h2>
        <Button
          type="primary"
          size="large"
          onClick={() => setIsAddDrawer(true)}
        >
          Add New Transaction
        </Button>
      </div>
      <div tw="w-6">
        <Select
          showSearch
          placeholder="Select Category"
          style={{ width: "300px", marginBottom: "20px" }}
          optionFilterProp="children"
          onChange={(value: number) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          <Select.Option key="all" value={null}>
            All
          </Select.Option>
          {categories.map((item: any) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div tw="flex mb-6 justify-between">
        <Input.Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
          placeholder="Search.." // onSearch={onSearch}
          style={{ width: 200 }}
        />
        <DatePicker.RangePicker
          tw="rounded-lg "
          value={selectedDateRange}
          onChange={(date) => setSelectedDateRange(date || [null, null])}
          ranges={DateRanges() as any}
          format={DATE_FORMAT}
          showTime
        />
      </div>

      <div tw="p-3 bg-white rounded-lg">
        <List
          loading={loading}
          dataSource={transactions}
          pagination={{
            onChange: (page) => {
              setPagination((old) => ({ ...old, current: page }));
            },
            ...pagination,
          }}
          renderItem={(item: ITransaction) => (
            <TransactionCard
              type={item.type.toLowerCase()}
              key={item.id}
              onClick={() => {
                navigate(`/transactions/${item.id}`);
              }}
            >
              <div className="title-container">
                <div className="image">
                  {item.categories?.emoji || item.categories?.name.charAt(0)}
                </div>
                <div>
                  <h2>
                    {item.categories?.name}
                    <span tw="text-gray-600 font-medium">
                      {item?.sub_categories?.name &&
                        ` - ${item.sub_categories?.name}`}
                    </span>
                    <span tw="text-blue-700 mr-1">{`${
                      item.invoice_no ? " - #" + item?.invoice_no : ""
                    }`}</span>
                    {item.transaction_tags.map((item: any) => (
                      <Tag color={getUniqueColor(item.tags.name)}>
                        {item.tags.name}
                      </Tag>
                    ))}
                  </h2>
                  <p className="date">
                    {moment(item.transaction_date).format("DD-MM-YYYY")}
                  </p>
                </div>
              </div>
              <div tw="flex flex-col">
                <div className="money">
                  {item.type === "INCOME" ? "+" : "-"}
                  {item.amount}
                </div>
                <p tw="text-gray-500 text-xs">
                  {item.comment} -{" "}
                  <span tw="font-semibold text-xs text-gray-600">
                    {item.account}
                  </span>
                </p>
              </div>
            </TransactionCard>
          )}
        />
      </div>
    </>
  );
};
export default Transactions;
