import { Button, Dropdown, Menu, Tooltip } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import { useNotificationContext } from "../../../context/notifications";

type ButtonGroup = {
  title: string,
  icon?: ReactNode,
  hoverText?: string,
  onClick?: () => void,
}

type DropDownButtonGroupProps = {
  icon?: ReactNode,
  label: string;
  buttonArray: ButtonGroup[],
  disabled?: boolean,
  triggerProgressBar?: number,
}

export const DropdownButtonGroup = ({ disabled, label, buttonArray, icon, triggerProgressBar } : DropDownButtonGroupProps) => {
  const [loader, ] = useState<boolean>(false);

  const { updateProgressBar } = useNotificationContext();

  useEffect(() => {
    if(triggerProgressBar && triggerProgressBar > 0) {
      updateProgressBar();
    }
  }, [triggerProgressBar]);

  return (
    <Dropdown placement="bottomLeft" disabled={disabled} overlay={(
      <Menu>
        {buttonArray.map((button, index) => (
          <Menu.Item 
            key={index}
            style={{ marginRight: "8px"}}
            onClick={() => {
              button.onClick?.();
            }}
          >
            <Tooltip  placement="topLeft" title={button.hoverText}>
              <div>
                {button?.icon}
                {button.title}
              </div>
            </Tooltip>
          </Menu.Item>
        ))}
      </Menu>
      )}
    >
      <Button size="small" style={{ marginRight: "16px" }} loading={loader}>
        {!loader && icon}
        {label}
      </Button>
    </Dropdown>
  )
};