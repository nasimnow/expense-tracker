import { DatePicker, Button, List } from "antd";
import moment from "moment";
import { DateRanges, DATE_FORMAT } from "../constants";
import tw from "twin.macro";
import { useEffect, useState } from "react";
import AddTransactionDrawer from "../components/addTransactionDrawer";
import { TransactionCard } from "../styles/transactions.style.";
import { getTransactions } from "../api/transaction.api";
import getPagination from "../utils/getPagination";

const Transactions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    getData();
  }, [pagination.current]);

  useEffect(() => {
    if (!isModalVisible) {
      getData();
    }
  }, [isModalVisible]);

  const getData = async () => {
    setLoading(true);
    const { from, to } = getPagination(pagination.current, pagination.pageSize);
    console.log(from, to);
    const { data, error, count } = await getTransactions({ from, to });
    setPagination((old) => ({ ...old, total: count }));
    setTransactions(data);
    setLoading(false);
  };

  return (
    <>
      <AddTransactionDrawer
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base mb-6"> Transactions</h2>
        <Button
          type="primary"
          size="large"
          onClick={() => setIsModalVisible(true)}
        >
          Add New Transaction
        </Button>
      </div>
      <div tw="flex mb-6 justify-end">
        <DatePicker.RangePicker
          tw="rounded-lg "
          defaultValue={[moment(), moment()]}
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
          renderItem={(item) => (
            <TransactionCard type={item.type.toLowerCase()} key={item.id}>
              <div className="title-container">
                <div className="image">
                  {item.categories.emoji || item.categories.name.charAt(0)}
                </div>
                <div>
                  <h2>
                    {item.categories.name}
                    <span tw="text-gray-600 font-medium">
                      {item?.sub_categories?.name &&
                        ` - ${item.sub_categories.name}`}
                    </span>
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
