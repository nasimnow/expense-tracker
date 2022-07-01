import { BrowserRouter, Route, Routes } from "react-router-dom";
import tw, { styled } from "twin.macro";
import Header from "./components/Header";
import Categories from "./pages/categories";
import EditTransactions from "./pages/editTransactions";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Transactions from "./pages/transactions";

const App = () => {
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

  return (
    <BrowserRouter>
      <Header />
      <MainContainer>
        <Routes>
          <Route path="/" element={<Home2 />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<EditTransactions />} />
          <Route path="/transactions/" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </MainContainer>
    </BrowserRouter>
  );
};

export default App;
