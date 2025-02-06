import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { Layout, Table } from 'antd/es';
import { DownloadOutlined, FilePdfFilled, SettingFilled } from '@ant-design/icons';
import { DS9908RDrawer } from './DS9908DrawerView';
import { useDeviceDS9908rDispatch, useDeviceDS9908rState } from '../../../../hook/hooks/deviceDS9908r';
import { InstallerState } from '../../../../store/types/deviceDS9908R';
import { API } from '../../../../settings/server.config';
import { useAccountDispatch } from '../../../../hook/hooks/account';
import './ScanDS9908View.scss';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';

export const DS9908R = () => {
  
  const {installers} = useDeviceDS9908rState();
  const {loadInstallers} = useDeviceDS9908rDispatch();
  
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  
  const closeDrawer = () => setShowDrawer(false);
  
  useEffect(() => {
    loadInstallers();
  }, [loadInstallers]);
  
  
  const timerDisable = () => {
    setTimeout(() => setDisableButton(false), 2000);
  };
  
  const columns = [
    {
      title: 'Driver Name',
      dataIndex: 'name'
    },
    {
      title: 'Version',
      dataIndex: 'version',
    },
    {
      title: 'Download Driver',
      dataIndex: 'downloadDriver',
      render: (a: any, b: InstallerState) => {
        return <Button size="small" id="cDDownload"
                       style={disableButton ? {cursor: 'not-allowed', pointerEvents: 'none'} : {}}
                       className="btn-green-border" href={API.DEVICES.DS9908R.DOWNLOAD_INSTALLER(b.installer)}
                       onClick={() => {
                         setDisableButton(true);
                         timerDisable();
                       }}
        > Download <DownloadOutlined/> </Button>;
      }
    }
  ];
  
  const {replaceUserInformation} = useAccountDispatch();
  useEffect(() => {
    replaceUserInformation();
  }, [replaceUserInformation]);
  
  return (
    <Layout>
      <div className="card-container scan-device-ds9908">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Device - DS9908R</span>
            </div>
          }
          rightBar={[
            <Button id="cDDS9Settings" size="small" className="btn-green" onClick={() => {
              setShowDrawer(true);
            }}
            >
              SETTINGS <SettingFilled/>
            </Button>
          ]}
        />
        {showDrawer && <DS9908RDrawer closerDrawer={closeDrawer} showDrawer={showDrawer}/>}
        <Row gutter={[16, 16]}>
          <Col>
            <Row align="middle" gutter={[16, 16]}>
              <Col xs={{offset: 4, span: 0}} sm={{offset: 0, span: 4}} md={{offset: 0, span: 4}}
                   lg={{offset: 0, span: 4}} xl={{offset: 0, span: 4}}>
                <div className="card-play">
                  <img alt="" src="/images/DS9908R.jpg"/>
                </div>
              </Col>
              <Col className="description-ds9908r" xs={24} sm={20} md={10} lg={10} xl={10}>
                <b> Information </b>
                <p style={{textAlign: 'justify'}}>
                  If you are already benefitting from RFID in your supply chain,
                  the DS9908R with RFID closes the RFID loop by capturing
                  RFID-tagged merchandise at the POS, as well as commissioning
                  RFID tags on returned goods and new items for faster processing. Complimentary
                  RFID data conversion software lets you read RFID tags without
                  modifying your existing POS application.
                </p>
              </Col>
              <Col className="drawer_config" xs={24} sm={24} md={10} lg={10} xl={10}>
                <div className="drawer_body_config">
                  <h5 style={{marginBottom: '15px'}}>Documents</h5>
                  <div className="info_body_back">
                    <Row align="middle" justify="space-between">
                      <span>Installation Guide </span>
                      <Button className="btn-blue-border" href="/files/manual-ds9908r-06-16-21.pdf">
                        Download<FilePdfFilled/>
                      </Button>
                    </Row>
                  </div>
                
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24} className="drawer_body_config">
                <Table
                  bordered={false}
                  rowKey={(obj, index) => index ? index : obj.name + index}
                  pagination={false}
                  columns={columns}
                  dataSource={installers}
                />
              </Col>
            </Row>
          </Col>
        
        </Row>
      </div>
    </Layout>
  );
};
