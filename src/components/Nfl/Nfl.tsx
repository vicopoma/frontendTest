import React, { useEffect, useState } from 'react';
import { Col, Divider, Row } from 'antd';
import { Layout } from 'antd/es';

import { useLocation } from 'react-router-dom';
import { paramsToObject } from '../../helpers/Utils';
import { history } from '../../store/reducers';
import { ROUTES } from '../../settings/routes';
import './Nfl.scss';

export const Nfl = () => {
  
  const {search} = useLocation();
  const [response, setResponse] = useState<string>('');
  const urlParams = new URLSearchParams(search);
  const entries = urlParams.entries();
  const params = paramsToObject(entries);
  
  useEffect(() => {
    if (params?.ans) {
      switch (params?.ans) {
        case 'OK':
          setResponse('Session Started Correctly');
          break;
        case 'ERROR':
          setResponse('An error has occurred');
          break;
        case 'UNAUTHORIZED':
          setResponse('Unauthorized');
          break;
        case 'LOGOUT':
          setResponse('Logout Okta successfully');
          window.location.replace('com.virtuallocker.app://login');
          break;
        default:
          history.push(ROUTES.LOGIN.PAGE());
      }
    }
  }, [params?.ans, search]);
  
  return (
    <Layout>
      <div>
        <Row>
          <Col span={24}>
            <div className="redirect-nfl-header">
              <img src="/images/logo-2vl-w-02.svg" height="38px" alt=""/>
            </div>
          </Col>
        </Row>
        <Row className="redirect-nfl">
          <Col span={24}>
            <div className="redirect-img">
              <img src="/images/nfl_logo.png" width="42px" alt=""/>
              <img src="/images/vl-logo-mob.svg" width="40px" alt=""/>
            </div>
            <div className="redirect-nfl-body">
              <h5>{response}</h5>
              <Divider>
                {params?.ans === 'OK' && <img src="/images/check-good.svg" width="25px" alt=""/>}
                {params?.ans === 'LOGOUT' && <img src="/images/check-good.svg" width="25px" alt=""/>}
                {params?.ans === 'ERROR' && <img src="/images/error-icon.svg" width="25px" alt=""/>}
                {params?.ans === 'UNAUTHORIZED' && <img src="/images/warning-icon.svg" width="25px" alt=""/>}
              </Divider>
              <h4>Please Return to Virtual Locker App</h4>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};
