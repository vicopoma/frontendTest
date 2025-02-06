import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import { useAccountState } from '../../hook/hooks/account';
import './WelcomeView.scss';

export const Welcome = () => {
  
  const {account} = useAccountState();
  
  const [current, setCurrent] = useState<number>(-1);
  useEffect(() => {
    if (!account.role || account.teamList.length === 0) {
      setCurrent(0);
    }
  }, [account]);
  
  return (
    <Modal
      className="welcome_layout"
      closable={true}
      footer={null}
      visible={current === 0}
      onCancel={() => setCurrent(-1)}>
      <Row align="middle">
        <Col className="welcome_icons" span={12} xs={24} sm={24} lg={12}>
          <img src="images/logo-2vl-darkblue.svg" alt="" height="85px"/>
          {/* <img src="images/equipmentracker-logo.svg" alt="" height="30px" /> */}
          <img src="images/icons-football.svg" alt="" height="30px"/>
        </Col>
        <Col className="welcome_right" span={11} xs={24} sm={24} lg={12}>
          <div className="welcome_body">
            <label className="welcome_title"> Before start...</label>
            {/* <img src="images/after-login-img.svg" alt="" height="100px" /> */}
            <p> You do not have a role or a team. Please contact the administrator. </p>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};


