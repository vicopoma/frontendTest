import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAccountDispatch } from '../../hook/hooks/account';
import { Redirect } from 'react-router-dom';
import { ROUTES } from '../../settings/routes';
import { useLocation } from 'react-router';
import { history } from '../../store/reducers';
import { API } from '../../settings/server.config';
import { REDIRECT, TOKEN } from '../../constants/constants';
import { Divider } from 'antd/es';
import { paramsToObject } from '../../helpers/Utils';

export const OktaAuthView = ({className}: { className: string }) => {
  return (<>
      <Button
        href={API.USER.OKTA_AUTH_REDIRECT()}
        id="loginOktaButton"
        key="1"
        type="default"
        block
        className={className}
        style={{
          marginTop: '5px'
        }}
      >
        <img src="/images/nfl-icon-log.svg" alt="" height="27px"/>
      </Button>
      <Divider className="okta-sign-in">or sign in with</Divider>
    </>
  );
};

export const OktaReDirect = () => {
  
  const {search} = useLocation();
  const {replaceToken} = useAccountDispatch();
  const {replaceUserInformation} = useAccountDispatch();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const entries = urlParams.entries();
    const params = paramsToObject(entries);
    const response = atob(params?.ans).split('|');
    const status = response[1].split('=')[1];
    const jwt = response[2].split('=')[1];
    
    if (+status === 200) {
      replaceToken(jwt).then(() => {
        replaceUserInformation();
        localStorage.setItem(TOKEN, jwt);
        const redirect = JSON.parse(localStorage.getItem(REDIRECT) || '{}');
        if (redirect?.path && redirect?.search !== '') {
          history.push(redirect.path + redirect.search);
          localStorage.removeItem(REDIRECT);
        } else {
          history.push(ROUTES.HOME.PAGE());
        }
      });
    }
  }, [replaceToken, replaceUserInformation, search]);
  
  return <Redirect to={{
    pathname: ROUTES.HOME.PAGE()
  }}/>;
};
