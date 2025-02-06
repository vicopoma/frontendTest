import React, { useState } from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useEquipmentDispatch } from '../../../hook/hooks/equipment';
import { LoaderButton } from '../../Shared/LoaderButton/LoaderButton';

export const Synchronize = () => {
  const {
    synchronizedCleatsModels,
    synchronizedHelmetModels,
    synchronizedHelmetParts,
    synchronizedShoulderPadsParts,
    synchronizedCleatParts,
    synchronizedShoulderPadModels,
    synchronizedPractices,
    synchronizedGames,
  } = useEquipmentDispatch();
  const [status, setStatus] = useState(false);
  
  return (
    <Layout>
      <div className="card-container">
        <div className="navigationbar-header-configuration">
          <span className="navigation-bar-configuration">Additional Tools</span>
        </div>
        <div className="image-background">
          <Row gutter={[16, 16]}>
            <Col span={24} className="backdoor">
              <h4>List of available options</h4>
              <div className="backdoor-body">
                <h5><SyncOutlined/> Synchronize</h5>
                <Row gutter={[16, 16]}>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={async () => {
                        await synchronizedCleatsModels(setStatus);
                      }}
                    >
                      Synchronize Cleat models
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={() => {
                        synchronizedShoulderPadModels(setStatus);
                      }}
                    >
                      Synchronize Shoulder Pad models
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={() => {
                        synchronizedHelmetModels(setStatus);
                      }}
                    >
                      Synchronize Helmet models
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={() => {
                        synchronizedHelmetParts(setStatus);
                      }}
                    >
                      Synchronize Parts of Helmet
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={() => {
                        synchronizedShoulderPadsParts(setStatus);
                      }}
                    >
                      Synchronize Parts of Shoulder Pads
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%',}}
                      disable={status}
                      onClick={() => {
                        synchronizedCleatParts(setStatus);
                      }}
                    >
                      Synchronize Parts of Cleat
                    </LoaderButton>
                  </Col>
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%', margin: '5px'}}
                      disable={status}
                      onClick={() => {
                        synchronizedGames(setStatus);
                      }}
                    >
                      Synchronize Games
                    </LoaderButton>
                  </Col>
                  
                  <Col span={6} xs={24} md={12} lg={8} xl={6}>
                    <LoaderButton
                      style={{width: '100%', margin: '5px'}}
                      disable={status}
                      onClick={() => {
                        synchronizedPractices(setStatus);
                      }}
                    >
                      Synchronize Practices
                    </LoaderButton>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      
      <div className="about-footer">
        <Divider/>
        <div className="footer">
          <img src="images/logo-zebra-black.svg" alt=""/> <span> © Zebra Technologies</span>
        </div>
      </div>
    </Layout>
  );
};
