import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { LoginView } from './components/Login/LoginView';
import GoogleRedirect from './components/Google/Google';
import { AccountInformation } from './store/types';

import { ROUTES } from './settings/routes';

export default ({user}: { user: AccountInformation }) => {
  return (
    <Switch>
      <Route path={ROUTES.LOGIN.PAGE()} component={LoginView}/>
      {user.active && <>

      </>}
      <Route path={ROUTES.GOOGLE.PAGE()} component={GoogleRedirect}/>
      <Route exact path="/" render={() => (
        <Redirect to={ROUTES.LOGIN.PAGE()}/>
      )}/>
    </Switch>);
}
