import React, { useEffect, useState } from 'react';
import { Form, Layout, Menu } from 'antd';
import { DEFAULT_TAB_CONTROLLER, SessionStorageController } from '../../../constants/constants';
import './Sidebar.scss';

export const SideBar = (
  {
    items,
    component,
  }: {
    items: Array<JSX.Element>,
    component: string
  }) => {
  
  const {Sider} = Layout;
  const [siderControl, setSiderControl] = useState<SessionStorageController>(JSON.parse(sessionStorage.getItem(component) || JSON.stringify(DEFAULT_TAB_CONTROLLER)));
  useEffect(() => {
      sessionStorage.setItem(component, JSON.stringify(siderControl));
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [siderControl]);
  
  return <>
    <Form>
      <Sider
        breakpoint="lg"
        className="sidebar"
        collapsible
        collapsed={siderControl.collapsed}
        onCollapse={(collapsed, type) => {
          setSiderControl({
            ...siderControl,
            collapsed: collapsed
          });
        }}
      >
        <Menu
          key={siderControl.collapsed + ''}
          theme="light"
          defaultOpenKeys={siderControl.subMenu}
          defaultSelectedKeys={[siderControl.menuItem ? siderControl.menuItem : '']}
          mode="inline"
          onOpenChange={(test) => {
            setSiderControl({
              ...siderControl,
              subMenu: test
            });
          }}
          onSelect={(param) => {
            setSiderControl({
              ...siderControl,
              menuItem: param.key
            });
            
          }}
          openKeys={!siderControl.collapsed ? siderControl.subMenu : []}
        >
          {
            items.map(item => {
              return item;
            })
          }
        </Menu>
      </Sider>
    </Form>
  </>;
};

