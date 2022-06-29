import { DatePicker } from "antd";
import moment from "moment";
import { DateRanges, DATE_FORMAT } from "../constants";
import tw, { styled } from "twin.macro";
import { WalletOutline, CashOutline } from "react-ionicons";
import ButtonNew from "../components/Button";
import { TransactionCard } from "../styles/transactions.style.";

const Home = () => {
  const MetricsContainer = styled.div`
    ${tw`flex gap-4 mb-6`}
    @media (max-width: 768px) {
      ${tw`flex-col gap-2`}
    }
    .sub-container {
      ${tw`flex gap-4`}
      @media (max-width: 768px) {
        ${tw`flex gap-1`}
      }
    }
  `;

  const MetricCard = styled.div`
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    padding: 15px;
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
    @media (max-width: 768px) {
      width: 100%;
    }
    h2 {
      ${tw`font-medium text-gray-400`}
    }
    .metric {
      ${tw`text-2xl mt-1 font-bold`}
    }
  `;

  return (
    <>
      <div tw="flex mb-6 justify-end">
        <DatePicker.RangePicker
          tw="rounded-lg "
          defaultValue={[moment(), moment()]}
          ranges={DateRanges() as any}
          format={DATE_FORMAT}
          showTime
        />
      </div>
      <MetricsContainer>
        <MetricCard>
          <div tw="flex gap-2">
            <WalletOutline color="blue" />
            <h2>Balance</h2>
          </div>
          <div className="metric">AED 1,000,000</div>
        </MetricCard>
        <div className="sub-container">
          <MetricCard>
            <div tw="flex gap-2">
              <CashOutline color="green" />
              <h2>Income</h2>
            </div>
            <div className="metric">1,000,000</div>
          </MetricCard>
          <MetricCard>
            <div tw="flex gap-2">
              <CashOutline color="red" />
              <h2>Expense</h2>
            </div>
            <div className="metric">1,000,000</div>
          </MetricCard>
        </div>
      </MetricsContainer>
      <div tw="flex justify-between items-center mb-6">
        <h2 tw="font-medium text-base mb-6">Latest Transactions</h2>
        <ButtonNew primary>Add New Transaction</ButtonNew>
      </div>

      <div tw="flex flex-col mt-2">
        <TransactionCard type="income">
          <div className="title-container">
            <div className="image">⛽</div>
            <div>
              <h2>Petrol - Lancer</h2>
              <p className="date">25 June 2022 </p>
            </div>
          </div>
          <div className="money">+200</div>
        </TransactionCard>
        <TransactionCard>
          <div className="title-container">
            <div className="image">⛽</div>
            <div>
              <h2>Petrol - Lancer</h2>
              <p className="date">25 June 2022 </p>
            </div>
          </div>
          <div className="money">-200</div>
        </TransactionCard>
        <TransactionCard>
          <div className="title-container">
            <div className="image">⛽</div>
            <div>
              <h2>Petrol - Lancer</h2>
              <p className="date">25 June 2022 </p>
            </div>
          </div>
          <div className="money">-200</div>
        </TransactionCard>
        <ButtonNew>See All Transactions</ButtonNew>
      </div>
    </>
  );
};
export default Home;
