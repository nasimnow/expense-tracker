import { useQuery } from "@tanstack/react-query";
import { DatePicker, Input, List, Select, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { getSingleAccount } from "../api/account.api";
import { getCategories } from "../api/category.api";
import { getTransactions } from "../api/transaction.api";
import AddTransactionDrawer from "../components/addTransactionDrawer";
import { DateRanges, DATE_FORMAT } from "../constants";
import useZustandStore from "../stores/useZustandStore";
import { TransactionCard } from "../styles/transactions.style.";
import { ITransaction } from "../types/transactions.types";
import getPagination from "../utils/getPagination";
import getUniqueColor from "../utils/getUniqueColor";

type TDateRange = [moment.Moment | null, moment.Moment | null];

const AccountDetails = () => {
  const { id: accountId } = useParams();

  const [selectedDateRange, setSelectedDateRange] = useState<TDateRange>([
    null,
    null,
  ]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const pagination = useZustandStore((state) => state.pagination);
  const setPagination = useZustandStore((state) => state.setPagination);

  const isAddDrawer = useZustandStore((state) => state.isAddDrawer);
  const setIsAddDrawer = useZustandStore((state) => state.setIsAddDrawer);

  const scrollPosition = useZustandStore((state) => state.scrollPosition);
  const setScrollPosition = useZustandStore((state) => state.setScrollPosition);

  const getData = async () => {
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
      category_ids: selectedCategory ? [selectedCategory] : [],
      account_ids: accountId ? [Number(accountId)] : [],
    });
    setPagination({ total: count });
    return data;
  };

  const transactionQuery = useQuery<any>(["transactions"], getData);
  const categoriesQuery = useQuery<any>(["categories"], getCategories);
  const accountQuery = useQuery<any>(["accounts", accountId], () =>
    getSingleAccount(Number(accountId))
  );

  const navigate = useNavigate();

  useEffect(() => {
    transactionQuery.refetch();
  }, [pagination.current, selectedDateRange, search, selectedCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagination.current]);

  useEffect(() => {
    if (!isAddDrawer) {
      transactionQuery.refetch();
    }
  }, [isAddDrawer]);

  useEffect(() => {
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }
  }, [scrollPosition]);

  return (
    <>
      <AddTransactionDrawer
        visible={isAddDrawer}
        onClose={() => setIsAddDrawer(false)}
      />

      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base"> Account Details</h2>
      </div>
      <h2 tw="font-medium text-2xl mb-6">
        {accountQuery.isSuccess && accountQuery.data.name}
      </h2>
      <div tw="w-6">
        <Select
          loading={categoriesQuery.isLoading}
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
          {categoriesQuery.isSuccess &&
            categoriesQuery?.data.map((item: any) => {
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
          loading={transactionQuery.isFetching}
          dataSource={transactionQuery.data}
          pagination={{
            onChange: (page) => {
              setPagination({ current: page });
            },
            ...pagination,
          }}
          renderItem={(item: ITransaction) => (
            <TransactionCard
              type={item.type.toLowerCase()}
              key={item.id}
              onClick={() => {
                setScrollPosition(window.scrollY);
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
                      <Tag
                        color={getUniqueColor(item.tags.name)}
                        style={{ fontSize: "10px" }}
                      >
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
export default AccountDetails;
