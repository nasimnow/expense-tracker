import { Modal } from "antd";
import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import tw, { styled } from "twin.macro";
import LoginComponent from "./components/LoginComponent";
import Header from "./components/Sidebar";
import EditTransactions from "./pages/editTransactions";
import Home2 from "./pages/overview";
import Transactions from "./pages/transactions";
import useZustandStore from "./stores/useZustandStore";

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
  const { loggedInUser, setLoggedInUser } = useZustandStore();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Modal closable={false} visible={!loggedInUser} footer={null} centered>
        <LoginComponent setLoggedInUser={setLoggedInUser} />
      </Modal>
      <MainContainer>
        <Routes>
          <Route path="/" element={<Navigate to="/transactions" />} />
          <Route path="/overview" element={<Home2 />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<EditTransactions />} />
        </Routes>
      </MainContainer>
    </BrowserRouter>
  );
};

export default App;
