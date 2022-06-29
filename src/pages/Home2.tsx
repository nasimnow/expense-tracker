import tw from "twin.macro";
import { TransactionCard } from "../styles/transactions.style.";

const Home2 = () => {
  return (
    <div>
      <h2 tw="text-base font-bold pb-6">Balance</h2>
      <TransactionCard type={"income"}>
        <div className="title-container">
          <div className="image"></div>
          <h2>Balance</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">+200</div>
        </div>
      </TransactionCard>

      <TransactionCard type={"income"}>
        <div className="title-container">
          <div className="image"></div>
          <h2>Electrical Work</h2>
        </div>
        <div tw="flex flex-col">
          <div className="money">+200</div>
        </div>
      </TransactionCard>
    </div>
  );
};
export default Home2;
