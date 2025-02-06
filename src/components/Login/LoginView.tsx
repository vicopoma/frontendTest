import React, { useEffect, useState } from 'react';
import { Button, Col, Layout, Row } from 'antd';

import * as httpClient from '../../settings/httpClients';
import { useAccountState } from '../../hook/hooks/account';
import { ROUTES } from '../../settings/routes';
import { history } from '../../store/reducers';
import { OktaAuthView } from '../Authentication/OktaAuthView';

import './LoginView.scss';
import { ZebraAuthView } from '../Authentication/ZebraAuthView';
import { APP_DATE_VERSION, REDIRECT } from '../../constants/constants';


export const LoginView = () => {
  const {tokenAuth} = useAccountState();
  const token = httpClient.getToken();
  const [showZebraForm, setZebraForm] = useState<boolean>(false);

  useEffect(() => {
    if (token && tokenAuth) {
      const redirect = JSON.parse(localStorage.getItem(REDIRECT) || '{}');
      if (redirect?.path) {
        history.push(redirect.path + redirect.search);
        localStorage.removeItem(REDIRECT);
      } else {
        history.push(ROUTES.HOME.PAGE());
      }
    }
  }, [token, tokenAuth]);

  const versionApp = process.env.REACT_APP_VERSION + "-" + APP_DATE_VERSION;

  return (
    <Layout className="back_login" style={{
      height: '100vh',
      backgroundColor: '#013369',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'center',
    }}>
      <img className="back_login_img" src="images/nfl-logoback-login.svg" alt="wallpaper login"/>
      <div className="card_login">
        <Row align="middle" justify="space-around">
          <Col className="login-icons" span={12} xs={24} sm={18} md={10} lg={12}>
            <img src="images/logo-2vl-darkblue.svg" alt="" width="80%"/>
            <img src="images/icons-football.svg" alt="" width="80%"/>
            <div className="type-text "
                 style={{opacity: 0.5, marginBottom: '10px', fontSize: 11}}> Version: {versionApp} </div>
          </Col>
          <Col span={12} xs={24} sm={18} md={10} lg={10}>
            <h4>User Login</h4>
            {
              showZebraForm ?
                <ZebraAuthView setZebraForm={setZebraForm}/>
                : (
                  <>
                    <OktaAuthView className="login-form-button"/>
                    <div className="login_input">
                      <Button
                        onClick={() => setZebraForm(true)}
                        id="loginZebraButton"
                        key="1"
                        type="default"
                        block
                        style={{
                          marginTop: '5px'
                        }}
                        icon={<img src="images/logo-zebra-black.svg" alt="" width="80px"/>}
                        className="login-form-button"/>
                    </div>
                  </>
                )
            }

          </Col>
        </Row>
        <div className="footer_login">
          <p>Powered by.-</p>
          <img src="images/logo-zebra-white.svg" alt=""/>
        </div>
      </div>
    </Layout>
  );
};
