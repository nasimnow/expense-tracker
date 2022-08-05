import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import tw, { styled } from "twin.macro";
import Header from "./components/Sidebar";
import AccountDetails from "./pages/accountDetails";
import Accounts from "./pages/accounts";
import Categories from "./pages/categories";
import EditTransactions from "./pages/editTransactions";
import Home2 from "./pages/overview";
import Transactions from "./pages/transactions";
import useLocalStorage from "./hooks/useLocalStorage";
import { Modal } from "antd";
import LoginComponent from "./components/LoginComponent";

const MainContainer = styled.div`
  @media (min-width: 768px) {
    ${tw`mx-14 mt-8 `}
    margin-left: 320px;
  }
  @media (max-width: 768px) {
    ${tw`mx-6 mt-10`}
    padding-bottom: 100px;
  }
`;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Modal closable={false} visible={!isLoggedIn} footer={null} centered>
        <LoginComponent setIsLoggedIn={setIsLoggedIn} />
      </Modal>
      <MainContainer>
        <Routes>
          <Route path="/" element={<Navigate to="/transactions" />} />
          <Route path="/overview" element={<Home2 />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<EditTransactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:id" element={<AccountDetails />} />
        </Routes>
      </MainContainer>
    </BrowserRouter>
  );
};

export default App;
