import { useEffect, useState } from "react";
import tw from "twin.macro";
import { getTransactionsSumByCategories } from "../api/transaction.api";
import { TransactionCard } from "../styles/transactions.style.";

const Home2 = () => {
  const [transactionsTotalIncome, setTransactionsTotalIncome] = useState([]);
  const [transactionsTotalExpense, setTransactionsTotalExpense] = useState([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    const { data: incomeData } = await getTransactionsSumByCategories({
      type: "INCOME",
      start_date: "2020-01-01",
      end_date: "2022-08-31",
    });
    const { data: expenseData } = await getTransactionsSumByCategories({
      type: "EXPENSE",
      start_date: "2020-01-01",
      end_date: "2022-08-31",
    });

    setTotalIncome(
      incomeData.reduce((acc, curr) => acc + curr.amount, 0) -
        expenseData.reduce((acc, curr) => acc + curr.amount, 0)
    );

    setTransactionsTotalIncome(incomeData);
    setTransactionsTotalExpense(expenseData);
  };

  return (
    <div>
      <h2 tw="text-base font-bold pb-2">Balance</h2>
      <TransactionCard type={totalIncome < 0 ? "expense" : "income"}>
        <div className="title-container">
          <div className="image">💵</div>
          <h2>Balance</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">{totalIncome}</div>
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
            {transactionsTotalIncome.reduce((sum, n) => sum + n.amount, 0)}
          </div>
        </div>
      </TransactionCard>

      {transactionsTotalIncome.map((item) => (
        <TransactionCard type={"income"} key={item.name}>
          <div className="title-container">
            <div className="image"></div>
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
            {transactionsTotalExpense.reduce((sum, n) => sum + n.amount, 0)}
          </div>
        </div>
      </TransactionCard>
      {transactionsTotalExpense.map((item) => (
        <TransactionCard type={"expense"} key={item.name}>
          <div className="title-container">
            <div className="image"></div>
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
