import React from 'react';
import { Button, Col, Dropdown, Input, Menu, Modal, Row } from 'antd';
import { DownOutlined, EditOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a onClick={e => e.preventDefault()} href="/login">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a onClick={e => e.preventDefault()} href="/login">2nd menu item</a>
    </Menu.Item>
  </Menu>
);

export const EquipmentModal = () => {
  return (
    <Modal
      centered
      visible={true}
      onOk={() => {
      }}
      onCancel={() => {
      }}
      className="modal-activity"
      width="650px"
      okText="Save"
      cancelText="Cancel"
    >
      <h2><img className="img-h anticon" src="/images/helmet.svg" alt="" width="18px"/> ADD HELMET</h2>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <p>Helmet ID</p>
          <Input placeholder=""/>
        </Col>
        <Col span={8}>
          <p>Helmet Ref</p>
          <Input placeholder=""/>
        </Col>
        <Col span={8}>
          <p>Last Recertification Date</p>
          <Input placeholder=""/>
        </Col>
      </Row>
      
      <div className="modal-bg" style={{marginBottom: '10px'}}>
        <Row gutter={16}>
          <Col span={8}>
            <p>Manufacture</p>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button className="btn-select">
                Select <DownOutlined/>
              </Button>
            </Dropdown>
          </Col>
          <Col span={8}>
            <p>Model</p>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button className="btn-select">
                Select <DownOutlined/>
              </Button>
            </Dropdown>
          </Col>
          <Col span={8}>
            <p>Initial Season</p>
            <Input placeholder=""/>
          </Col>
        </Row>
      </div>
      
      <Row gutter={16}>
        <Col span={14}>
          <h3>PARTS</h3>
          <div className="modal-bg">
            <Row gutter={16}>
              <Col span={12}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select" style={{marginBottom: '5px'}}>
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
                <br></br>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select" style={{marginBottom: '5px'}}>
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
                <br></br>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select">
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
              </Col>
              <Col span={12}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select" style={{marginBottom: '5px'}}>
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
                <br></br>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select" style={{marginBottom: '5px'}}>
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
                <br></br>
                <Dropdown overlay={menu} trigger={['click']}>
                  <Button className="btn-select">
                    Select <DownOutlined/>
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={10}>
          <h3>ASSIGNED ATHLETE</h3>
          <div className="modal-bg">
            <p>Name</p>
            <Input placeholder="" style={{width: '188px', marginRight: '5px'}}/> <EditOutlined/>
            <div className="card-play">
              {/* <img className='img-h anticon' src='/images/player-icon.svg' alt=''/> */}
              <div>
                <p>John Doe</p>
                <h5>40</h5>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    
    </Modal>
  );
};
