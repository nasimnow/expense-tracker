import tw, { styled } from "twin.macro";

export const AccountsCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 8px;
  margin-right: 12px;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
  font-weight: 600;
  .title {
    display: flex;
  }

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
  .image {
    ${tw`h-7 w-7 mr-2 p-1.5  flex items-center justify-center text-xs`}
    background-color: #d2e7fcab;
    border-radius: 8px;
  }
`;
