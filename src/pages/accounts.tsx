import { useQuery } from "@tanstack/react-query";
import { Input, List, Popconfirm } from "antd";
import { CloseOutline } from "react-ionicons";
import { getAccounts } from "../api/account.api";
import { AccountsCard } from "../styles/accounts.style";
import "twin.macro";
import useZustandStore from "../stores/useZustandStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const navigate = useNavigate();
  const accountSearch = useZustandStore((state) => state.accountSearch);
  const setAccountSearch = useZustandStore((state) => state.setAccountSearch);
  const accountsQuery = useQuery<any>(["accounts"], () =>
    getAccounts(accountSearch)
  );

  useEffect(() => {
    accountsQuery.refetch();
  }, [accountSearch]);

  return (
    <div>
      <Input
        placeholder="Search..."
        size="large"
        tw="mb-6 h-12"
        autoFocus
        onChange={(e) => setAccountSearch(e.target.value)}
        value={accountSearch}
      />
      <List
        loading={accountsQuery.isLoading}
        dataSource={accountsQuery.data?.data}
        renderItem={(item: any) => (
          <AccountsCard
            key={item.id}
            onClick={() => navigate(`/accounts/${item.id}`)}
          >
            <div className="title">
              <div className="image">{item.emoji || item.name.charAt(0)}</div>
              <h2>{item.name}</h2>
            </div>
            <Popconfirm
              title="Are you sure to delete this category?"
              onConfirm={async () => {
                // const { error } = await deleteCategory(item.id);
                // if (error) message.error(error.message || "Something went wrong");
                // else {
                //   message.success("Category deleted successfully");
                //   getData();
                // }
              }}
            >
              <CloseOutline color="red" />
            </Popconfirm>
          </AccountsCard>
        )}
      />
    </div>
  );
};

export default Accounts;
