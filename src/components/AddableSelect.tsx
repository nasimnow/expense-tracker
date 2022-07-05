import { PlusOutlined } from "@ant-design/icons";
import { Button, Select, Input, Space, Typography } from "antd";
import { useState } from "react";
import "twin.macro";

const AddableSelect = ({
  children,
  onAddOption = () => {},
  addButtonLoading = false,
  ...props
}: any) => {
  const [newOptionValue, setNewOptionValue] = useState<string>("");

  return (
    <Select
      {...props}
      dropdownRender={(menu) => (
        <div>
          <div style={{ maxHeight: "120px", overflowY: "auto" }}> {menu}</div>

          <Space align="center" tw="pl-3">
            <Input
              placeholder="Add New"
              value={newOptionValue}
              onChange={(val) => setNewOptionValue(val.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={addButtonLoading}
              disabled={newOptionValue === null || newOptionValue === ""}
              tw="m-2"
              onClick={() => {
                onAddOption(newOptionValue);
                setNewOptionValue("");
              }}
            >
              Add Tag
            </Button>
          </Space>
        </div>
      )}
    >
      {children}
    </Select>
  );
};

export default AddableSelect;
