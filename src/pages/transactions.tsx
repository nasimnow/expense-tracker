import { Button, DatePicker, Input, List, Select, Tag } from "antd";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import deepEqual from "deep-equal";

import { getCategories, getSubCategories } from "../api/category.api";
import { getTransactions } from "../api/transaction.api";
import AddTransactionDrawer from "../components/addTransactionDrawer";
import { DateRanges, DATE_FORMAT } from "../constants";
import { TransactionCard } from "../styles/transactions.style.";
import { ITransaction } from "../types/transactions.types";
import getPagination from "../utils/getPagination";
import getUniqueColor from "../utils/getUniqueColor";
import useZustandStore, {
  defaultFilterValues,
} from "../stores/useZustandStore";
import { getAccounts } from "../api/account.api";
import { getTags } from "../api/tag.api";

const getFiltersData = async () => {
  const accounts = await getAccounts();
  const categories = await getCategories();
  const tags = await getTags();
  return {
    accounts: accounts?.data || [],
    categories: categories?.data || [],
    tags: tags?.data || [],
  };
};

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const pagination = useZustandStore((state) => state.pagination);
  const setPagination = useZustandStore((state) => state.setPagination);

  const transactionFilters = useZustandStore(
    (state) => state.transactionFilters
  );
  const setTransactionFilters = useZustandStore(
    (state) => state.setTransactionFilters
  );

  const {
    filter_accounts,
    filter_categories,
    filter_tags,
    filter_type,
    filter_date_range,
  } = transactionFilters;

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
      startDate:
        filter_date_range && filter_date_range[0]
          ? filter_date_range[0].format("YYYY-MM-DD")
          : moment("2000-01-01").format("YYYY-MM-DD"),
      endDate:
        filter_date_range && filter_date_range[1]
          ? filter_date_range[1].format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
      search,
      category_ids: filter_categories,
      account_ids: filter_accounts,
      tag_ids: filter_tags,
      transaction_type: filter_type,
    });
    setPagination({ total: count });
    return data;
  };

  const transactionQuery = useQuery<any>(["transactions"], getData);

  const filtersDataQuery = useQuery<any>(["filtersData"], getFiltersData);

  const categoriesQuery = useQuery<any>(["categories"], getCategories);

  const navigate = useNavigate();

  useEffect(() => {
    transactionQuery.refetch();
  }, [pagination.current, transactionFilters, search, selectedCategory]);

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

  const FilterElement = ({
    label,
    element,
  }: {
    label: string;
    element: ReactNode;
  }) => {
    return (
      <div>
        <div tw="text-xs mb-1">{label}</div>
        {element}
      </div>
    );
  };

  return (
    <>
      <AddTransactionDrawer
        visible={isAddDrawer}
        onClose={() => setIsAddDrawer(false)}
      />

      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base mb-6">Transactions</h2>
        <Button
          type="primary"
          size="large"
          onClick={() => setIsAddDrawer(true)}
        >
          Add New Transaction
        </Button>
      </div>

      <div tw="flex mb-2 justify-between">
        <Input.Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
          placeholder="Search.."
          style={{ width: 400 }}
        />
        <DatePicker.RangePicker
          tw="rounded-lg "
          value={filter_date_range}
          onChange={(date) =>
            setTransactionFilters({ filter_date_range: date || [null, null] })
          }
          ranges={DateRanges() as any}
          format={DATE_FORMAT}
          showTime
        />
      </div>
      <div tw="flex gap-3 mb-6 mt-4">
        <FilterElement
          label="Account"
          element={
            <Select
              placeholder="Account"
              mode="multiple"
              tw="w-36"
              showSearch
              optionFilterProp="children"
              value={filter_accounts}
              onChange={(value) =>
                setTransactionFilters({ filter_accounts: value })
              }
            >
              {filtersDataQuery.isSuccess &&
                filtersDataQuery.data.accounts.map((item: any) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          }
        />
        <FilterElement
          label="Category"
          element={
            <Select
              placeholder="Categories"
              mode="multiple"
              tw="w-36"
              showSearch
              optionFilterProp="children"
              value={filter_categories}
              onChange={(value) =>
                setTransactionFilters({ filter_categories: value })
              }
            >
              {filtersDataQuery.isSuccess &&
                filtersDataQuery.data.categories.map((item: any) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          }
        />

        <FilterElement
          label="Tag"
          element={
            <Select
              placeholder="Tags"
              showSearch
              optionFilterProp="children"
              mode="multiple"
              tw="w-36"
              value={filter_tags}
              onChange={(value: number[]) =>
                setTransactionFilters({ filter_tags: value })
              }
            >
              {filtersDataQuery.isSuccess &&
                filtersDataQuery.data.tags.map((item: any) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
            </Select>
          }
        />
        <FilterElement
          label="Type"
          element={
            <Select
              placeholder="Transaction Type"
              tw="w-36"
              onChange={(value) =>
                setTransactionFilters({ filter_type: value })
              }
              value={filter_type}
            >
              <Select.Option value={null}>All</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
              <Select.Option value="income">Income</Select.Option>
            </Select>
          }
        />

        <Button
          type={
            deepEqual(transactionFilters, defaultFilterValues)
              ? "default"
              : "primary"
          }
          tw="self-end"
          onClick={() => setTransactionFilters(defaultFilterValues)}
        >
          Reset Filters
        </Button>
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
                    <span tw="font-bold">
                      {item.accounts?.name && `${item.accounts?.name} - `}
                    </span>
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
export default Transactions;
