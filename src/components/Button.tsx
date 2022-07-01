import { Button } from "antd";

const ButtonNew = ({ children, ...props }: any) => {
  return (
    <Button size="large" {...props}>
      {children}
    </Button>
  );
};

export default ButtonNew;
