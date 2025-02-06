import React from 'react';
import { Col, Form, Row } from 'antd';
import { Input } from '../Shared/CustomInput/CustomInput';
import { ACCOUNT_ROLES, ROLE_HIERARCHY } from '../../constants/constants';
import { useAccountState } from '../../hook/hooks/account';

export const ProfileInformation = () => {
  const {account} = useAccountState();
  return (
    <>
      <p>
        <h5> Information </h5>
      </p>
      
      <div className="drawer_body" style={{padding: '5px 20px'}}>
        <Row>
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <div
              className="card-play"
              style={{
                height: '80px',
                width: '80px'
              }}>
              <img
                style={{
                  height: '70px',
                  width: '70px'
                }}
                src={`https://static.nfl.com/static/content/public/static/img/fantasy/transparent/200x200/player.esbId.png`}
                alt=""/>
            </div>
          </Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={14}>
            <Row justify="space-around">
              <Col span={24}>
                <Form.Item label="Name">
                  <Input
                    isInput={false}
                    value={account.name}
                    style={{
                      width: '80%'
                    }}
                    size="small"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="User Name">
                  <Input
                    value={account.login}
                    isInput={false}
                    style={{
                      width: '80%'
                    }}
                    size="small"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Role">
                  <Input
                    value={account?.role?.name}
                    isInput={false}
                    style={{
                      width: '80%'
                    }}
                    size="small"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Email">
                  <Input
                    value={account.email}
                    isInput={false}
                    style={{
                      width: '80%'
                    }}
                    size="small"
                  />
                </Form.Item>
              </Col>
              {
                ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] === ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] &&
                <Col span={24}>
                    <Form.Item label="Team">
                        <Input
                            value={account.teamList[0].fullName}
                            isInput={false}
                            style={{
                              width: '80%'
                            }}
                            size="small"
                        />
                    </Form.Item>
                </Col>
              }
            </Row>
          
          </Col>
        </Row>
      </div>
    </>
  );
};
