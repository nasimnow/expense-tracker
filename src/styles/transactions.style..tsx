import tw, { styled } from "twin.macro";

interface TransactionCardProps {
  type?: "income" | "expense";
}

export const TransactionCard = styled.div`
  background-color: #fff;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  .title-container {
    ${tw`flex items-center font-semibold capitalize`}
  }
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
    border: 1px solid #020202;
    border-radius: 7px;
  }
  .image {
    ${tw`h-7 w-7 mr-4 p-1.5  flex items-center justify-center text-xs`}
    background-color: #d2e7fcab;
    border-radius: 8px;
  }
  .date {
    ${tw`text-xs text-gray-400 capitalize`}
  }
  .money {
    ${tw`text-sm font-bold self-end`}
    color: ${({ type }: TransactionCardProps) =>
      type === "income" ? "#00b60f" : "#ff3737d3"};
    span {
      ${tw`font-medium`}
    }
  }
`;
