import React from 'react';
import { Layout } from 'antd';
import { Welcome } from '../Welcome/WelcomeView';
import { useAccountState } from '../../hook/hooks/account';
import { typeOfMobile } from '../../helpers/Utils';
import './HomeView.scss';
import { Mobile } from '../Mobile/Mobile';
import { ROUTES } from '../../settings/routes';
import { Dashboard } from './Dashboard/Dashboard';
import { ACCOUNT_ROLES, APP_DATE_VERSION } from '../../constants/constants';

const { Content } = Layout;

export const HomeView = () => {
  const { account } = useAccountState();
  const isAndroid = typeOfMobile(navigator.userAgent, 'Android');
  const versionApp = process.env.REACT_APP_VERSION + "-" + APP_DATE_VERSION;
  const isOem = account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  return (
    <Content style={{ padding: '0px' }}>
      {isOem && !isAndroid && <Dashboard />}
      {(!isOem || (isOem && isAndroid)) && <>
        <div className="home">
          <div className="home-p">
            <h1>Welcome to!</h1>
            <img src="images/logo-2vl-w-02.svg" alt="" width="300px" />
            {
              isAndroid && <Mobile type={ROUTES.PARAMS.HOME} />
            }
          </div>
        </div>
      </>}
      {(!account.role || account.teamList.length === 0) && <Welcome />}
      {
        <div className="version-app">
          <div style={isOem ? { color: 'black', opacity: 1 } : { color: 'white', opacity: 0.5 }}> Version: {versionApp} </div>
        </div>
      }
    </Content>
  );
};
