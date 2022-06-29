import { Button } from "antd";

const ButtonNew = ({ children, ...props }) => {
  return (
    <Button size="large" {...props}>
      {children}
    </Button>
  );
};

export default ButtonNew;
