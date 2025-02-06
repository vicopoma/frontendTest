import React from 'react';
import { Col, Row } from 'antd';
import './MC33View.scss';

export const MC33View = () => {
  
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  return (
    <div className="bg-device01">
      <img className="img-bg-01" src="/images/bg-device-app.png" alt=""/>
      <Row justify="space-around" align="middle">
        <Col span={12}>
          <div className="img-bg-02">
            <img src="/images/image-background-tc51/bg-tc51.svg" alt=""/>
          </div>
        </Col>
        <Col span={12}>
          <div className="bg-device03">
            <img src="/images/image-background-tc51/vl-logo-mob.svg" alt=""/>
            <h2>Download Virtual Locker App</h2>
          </div>
          <div>
            <a
              id="cDMC3Download"
              href={`${process.env.REACT_APP_API_URI}/mobile/download-apk?ts=${random}`}
              target="_blank"
              rel="noreferrer"
            >
              <img alt="Get it on Google Play" src="/images/zebra-badge.png" height="85px"/>
            </a>
          </div>
        </Col>
      </Row>
    </div>);
};

