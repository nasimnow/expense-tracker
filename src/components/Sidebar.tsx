import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { Card, Home } from "react-ionicons";
import { useLocation, useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";
import useZustandStore from "../stores/useZustandStore";

const Header = () => {
  const [selectedPage, setSelectedPage] = useState("");
  const pathname = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useZustandStore();

  interface NavItemProps {
    selected: boolean;
  }

  const NavContainer = styled.div`
    ${tw` flex flex-col bg-white fixed top-0 left-0 h-full p-10 mb-3`}
    z-index: "100";
    @media (max-width: 768px) {
      display: none;
    }
  `;

  const NavItem = styled.div`
    ${tw`text-lg flex gap-3 items-center`}
    font-weight: ${({ selected }: NavItemProps) =>
      selected ? "bold" : "normal"};
    color: ${({ selected }: NavItemProps) => (selected ? "#65a9f7" : "#000")};
    &:hover {
      cursor: pointer;
    }
  `;

  const MobileNav = styled.div`
    z-index: 100;

    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;
    ${tw`flex justify-between items-center fixed bottom-0 w-full px-4 pb-3 bg-white pt-2`}
    div {
      ${tw`flex flex-col justify-center items-center text-sm`}
    }
    @media (min-width: 768px) {
      display: none;
    }
  `;

  useEffect(() => {
    setSelectedPage(pathname);
    if (!pathname) {
      setSelectedPage("");
    }
  }, [pathname]);

  const navItems = [
    {
      path: "transactions",
      name: "Transactions",
      icon: <Card color="#404040" />,
      iconFilled: <Card color="#65a9f7" />,
    },
    {
      path: "overview",
      name: "Overview",
      icon: <Home color="#404040" />,
      iconFilled: <Home color="#65a9f7" />,
    },
  ];

  return (
    <>
      <NavContainer>
        <h2 tw="font-bold text-4xl">Expensio</h2>
        <div tw="flex flex-col justify-between mb-3 mt-16 gap-8 mr-12">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              onClick={() => {
                setSelectedPage(item.path);
                navigate(item.path);
              }}
              selected={selectedPage === item.path}
            >
              {selectedPage === item.path ? item.iconFilled : item.icon}
              {item.name}
            </NavItem>
          ))}
        </div>
        <div tw="flex gap-4 mt-6 items-center">
          <Avatar size={50} tw="bg-red-600 uppercase">
            {loggedInUser?.slice(0, 2)}
          </Avatar>
          <div>
            <p tw="capitalize text-xl font-bold">{loggedInUser}</p>
            <p>Logged in</p>
          </div>
        </div>
        <Button
          tw="mt-5"
          size="large"
          danger
          onClick={() => {
            setLoggedInUser(null);
            location.reload();
          }}
        >
          Logout
        </Button>
      </NavContainer>

      <MobileNav>
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              setSelectedPage(item.path);
              navigate(item.path);
            }}
          >
            {selectedPage === item.path ? item.iconFilled : item.icon}
            <h2
              style={{
                color: selectedPage === item.path ? "#65a9f7" : "#000",
              }}
            >
              {item.name}
            </h2>
          </div>
        ))}
      </MobileNav>
    </>
  );
};
export default Header;
