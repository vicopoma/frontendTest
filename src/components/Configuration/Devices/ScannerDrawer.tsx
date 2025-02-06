import React from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select, Switch } from 'antd';
import { ScanDevTypes } from '../../../constants/constants';

export const ScannerDrawer = () => {
  const {Option} = Select;
  return (
    <Drawer
      placement="right"
      closable={false}
      width={'auto'}
      onClose={() => {
      }}
      visible={true}
      getContainer={false}
      style={{position: 'absolute'}}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            id="cancelButton"
            style={{marginRight: 8}}
            danger
          >
            CANCEL
          </Button>
          <Button
            id="saveButton"
            type="primary"
          >
            SAVE
          </Button>
        </div>
      }
    >
      <div className="header_drawer" style={{width: 'auto'}}>
        <div>
          <div className="header_drawer_title_equip">
            <label>NEW DEVICE</label>
          </div>
          <div>
            <div className="drawer_body_config">
              <Form layout="vertical">
                <Row gutter={[16, 16]}>
                  <Col span={10}>
                    <Form.Item label="ID">
                      <Input size={'small'} placeholder=""/>
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item label="Description">
                      <Input size={'small'} placeholder=""/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={10}>
                    <Form.Item label="Type">
                      <Select
                        showSearch
                        style={{marginRight: '8px'}}
                        placeholder="Select"
                        optionFilterProp="children"
                        size={'small'}
                      >
                        {
                          ScanDevTypes.map(data => (
                            <Option value={data.id}> {data.devType}</Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label="Status">
                      <Switch/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
