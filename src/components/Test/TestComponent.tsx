import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import './TestComponent.scss';

export const TestComponent = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const onClose = () => {
    setVisible(false);
  };
  const showDrawerClick = () => {
    setVisible(true);
  };
  
  return (
    <div className="site-drawer-render-in-current-wrapper">
      Render in this
      <div style={{marginTop: 16}}>
        <Button type="primary" onClick={showDrawerClick}>
          Open
        </Button>
      </div>
      <Drawer
        closable={visible}
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        visible={visible}
        keyboard={false}
        maskClosable={false}
        getContainer={false}
        width="60%"
        style={{position: 'absolute'}}
      >
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};
