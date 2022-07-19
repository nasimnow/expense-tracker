import { DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import tw from "twin.macro";
import { getTransactionsSumByCategories } from "../api/transaction.api";
import { DateRanges, DATE_FORMAT } from "../constants";
import { TransactionCard } from "../styles/transactions.style.";

interface TotalData {
  name: string;
  amount: number;
  emoji?: string;
}

const Home2 = () => {
  const [transactionsTotalIncome, setTransactionsTotalIncome] = useState([]);
  const [transactionsTotalExpense, setTransactionsTotalExpense] = useState([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [selectedDateRange, setSelectedDateRange] = useState<any>([null, null]);

  useEffect(() => {
    getData();
  }, [selectedDateRange]);

  const getData = async () => {
    const { data: incomeData }: any = await getTransactionsSumByCategories({
      type: "INCOME",
      start_date: selectedDateRange[0]
        ? selectedDateRange[0].format("YYYY-MM-DD")
        : moment("2000-01-01").format("YYYY-MM-DD"),
      end_date: selectedDateRange[1]
        ? selectedDateRange[1].format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
    });
    const { data: expenseData }: any = await getTransactionsSumByCategories({
      type: "EXPENSE",
      start_date: selectedDateRange[0]
        ? selectedDateRange[0].format("YYYY-MM-DD")
        : moment("2000-01-01").format("YYYY-MM-DD"),
      end_date: selectedDateRange[1]
        ? selectedDateRange[1].format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
    });

    setTotalIncome(
      incomeData.reduce(
        (acc: number, curr: TotalData) => acc + curr.amount,
        0
      ) -
        expenseData.reduce(
          (acc: number, curr: TotalData) => acc + curr.amount,
          0
        )
    );

    setTransactionsTotalIncome(incomeData);
    setTransactionsTotalExpense(expenseData);
  };

  return (
    <div>
      <div tw="flex mb-6 justify-end">
        <DatePicker.RangePicker
          tw="rounded-lg "
          value={selectedDateRange}
          onChange={(date) => setSelectedDateRange(date || [null, null])}
          ranges={DateRanges() as any}
          format={DATE_FORMAT}
          showTime
        />
      </div>
      <h2 tw="text-base font-bold pb-2">Balance</h2>
      <TransactionCard type={totalIncome < 0 ? "expense" : "income"}>
        <div className="title-container">
          <div className="image">💵</div>
          <h2>Balance</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">{totalIncome.toFixed(2)}</div>
        </div>
      </TransactionCard>

      <h2 tw="text-base font-bold pb-2 pt-2">Income</h2>
      <TransactionCard type={"income"}>
        <div className="title-container">
          <div className="image">=</div>
          <h2>Total</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">
            {transactionsTotalIncome.reduce(
              (sum: number, n: TotalData) => sum + n.amount,
              0
            )}
          </div>
        </div>
      </TransactionCard>

      {transactionsTotalIncome
        .sort((a: any, b: any) => b.amount - a.amount)
        .map((item: TotalData) => (
          <TransactionCard type={"income"} key={item.name}>
            <div className="title-container">
              <div className="image">{item.emoji || item.name.charAt(0)}</div>
              <h2>{item.name}</h2>
            </div>
            <div tw="flex flex-col">
              <div className="money">{item.amount}</div>
            </div>
          </TransactionCard>
        ))}

      <h2 tw="text-base font-bold pb-2 pt-2">Expense</h2>
      <TransactionCard type={"expense"}>
        <div className="title-container">
          <div className="image">=</div>
          <h2>Total</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">
            {transactionsTotalExpense.reduce(
              (sum: number, n: TotalData) => sum + n.amount,
              0
            )}
          </div>
        </div>
      </TransactionCard>

      {transactionsTotalExpense
        .sort((a: any, b: any) => b.amount - a.amount)
        .map((item: TotalData) => (
          <TransactionCard type={"expense"} key={item.name}>
            <div className="title-container">
              <div className="image">{item.emoji || item.name.charAt(0)} </div>
              <h2>{item.name}</h2>
            </div>
            <div tw="flex flex-col">
              <div className="money">{item.amount}</div>
            </div>
          </TransactionCard>
        ))}
    </div>
  );
};
export default Home2;
