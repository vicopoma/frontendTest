import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import { ActivityTabs } from '../../../../settings/routes';
import { toPrint } from '../../../../helpers/Utils';

export const ActivityLegends = () => {
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  const isPractice = path === ActivityTabs.PRACTICE;
  const menu = (
    <Menu>
      {isPractice && <Menu.Item>
          <div className="bar-info success">
              <img src="/images/practice-status/reg-ico-green.svg" alt="" width="25px"/>
              Generated
          </div>
      </Menu.Item>}
      {isPractice && <Menu.Item>
          <div className="bar-info reset">
              <img src="/images/practice-status/reg-ico-warning.svg" alt="" width="25px"/>
              Warnings
          </div>
      </Menu.Item>}
      <Menu.Item>
        <div className="bar-info more">
          <img src="/images/practice-status/reg-ico-incoming.svg" alt="" width="25px"/>
          Future
        </div>
      </Menu.Item>
      <Menu.Item>
        <div className="bar-info info">
          <img src="/images/practice-status/reg-ico-running.svg" alt="" width="25px"/>
          Running
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <div>
        <b> {toPrint(path)} legend </b>
        <Button size="small" style={{width: '35px', marginRight: '8px'}}
                icon={<ClockCircleOutlined style={{fontSize: 15, color: '#013369'}}/>}/>
      </div>
    </Dropdown>
  );
};
