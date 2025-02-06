import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';

import { Navbar } from './components/Layout/NavBar/Navbar';
import { ActivityTabs, BackDoorConfigKeys, ConfigurationKeys, ConfigurationTabs, KEY, KEY2, KEY3, KEY4, ROUTES, TAB, TEAM } from './settings/routes';
import { useAccountDispatch, useAccountState } from './hook/hooks/account';
import { LoginView } from './components/Login/LoginView';
import { HomeView } from './components/Home/HomeView';
import { ConfigurationView } from './components/Configuration/ConfigurationView';
import { EquipmentView } from './components/Equipment/EquipmentView';
import { Loader } from './components/Shared/Loader/Loader';
import { useLoaderState } from './hook/hooks/loader';
import { ACCOUNT_ROLES, BACKDOOR_SIDER, CONFIGURATION_SIDER, REDIRECT, ROLE_HIERARCHY, SCAN_DEVICE, SESSION_STORAGE } from './constants/constants';
import { getToken } from './settings/httpClients';
import { useFilterDispatch } from './hook/hooks/filters';
import { history } from './store/reducers';
import { ActivityRoute } from './components/Activity/ActivityRoute';
import { Player } from './components/Player/Player';
import { NotFound } from './components/Error/NotFound';
import { UnderConstraction } from './components/Error/UnderConstruction';
import { EquipmentDetail } from './components/Equipment/EquipmentDetail/EquipmentDetail';
import { PlayerDetail } from './components/Player/PlayerDetail/PlayerDetail';
import { ScanRefactorView } from './components/Activity/ScansReports/ScanReportsView';
import { EquipmentDetailsByPlayer } from './components/Player/PlayerDetail/NewEquipment/EquipmentDetailsByPlayer';
import { EquipmentDetailsByPlayerBySession } from './components/Player/PlayerDetail/NewEquipment/EquipmentDetailsByPlayerBySession';
import { ScanReportsByPlayerDetails } from './components/Activity/ScansReports/ScansReportsByPlayer/ScanReportsByPlayerDetails';
import { useImportDataDispatch } from './hook/hooks/importData';
import { OktaReDirect } from './components/Authentication/OktaAuthView';
import ReactShortcut from 'react-shortcut';
import { About } from './components/About/About';
import { Nfl } from './components/Nfl/Nfl';
import { useLocation } from 'react-router';
import { useBodyFilterDispatch } from './hook/hooks/bodyFilter';
import { NotificationProvider } from './context/notifications';
import { Test } from './components/Test/Test';
import { ScanDistribution } from './components/ScanDistribution/ScanDistribution';
import { BackDoorConfig } from './components/Error/BackDoor/BackDoorConfig';
import { RedirectActivity, RedirectEquipment } from './components/Redirect/Redirect';
import { SocketDSProvider } from './context/socketDS';
import { MessageAlertLayout } from './components/Shared/MessageAlert/MessageAlert';
import { typeOfMobile } from './helpers/Utils';

export const App = () => {
  
  const {account, tokenAuth} = useAccountState();
  const { equipmentTypeDTOList } = account;
  const {replaceUserInformation, replaceAccountSelectedTeam} = useAccountDispatch();
  
  const {updateStorageFilters} = useFilterDispatch();
  const {updateStorageBodyFilter} = useBodyFilterDispatch();
  
  const {getImportProcessStatus} = useImportDataDispatch();
  
  const [intervalId, setIntervalId] = useState<any>();
  const {getLoginType} = useAccountDispatch();
  
  useEffect(() => {
    getLoginType();
  }, [getLoginType]);
  
  const token = getToken();
  const path = useLocation().pathname.split('/');
  const mobileLogin = path[path.length - 1];
  const route = useLocation();

  const hasShoulderPad = equipmentTypeDTOList?.some(equipmentTypeElement => equipmentTypeElement?.nflId === '2');
  
  useEffect(() => {
    if (token) {
      replaceUserInformation();
    }
    // eslint-disable-next-line
  }, [replaceUserInformation]);
  
  useEffect(() => {
    if (!tokenAuth && !token && mobileLogin !== 'nfl') {
      if (mobileLogin !== ROUTES.PARAMS.LOGIN && mobileLogin !== ROUTES.PARAMS.OKTA_AUTH) {
        localStorage.setItem(REDIRECT, JSON.stringify({
          path: route.pathname,
          search: route.search,
        }))
      }
      history.push(ROUTES.LOGIN.PAGE());
    }
  }, [tokenAuth, token, mobileLogin]);
  
  useEffect(() => {
    const team = sessionStorage.getItem(SESSION_STORAGE.TEAM_SELECTED);
    if (team === 'undefined' || !team) {
      if (account?.teamList?.length > 0) {
        replaceAccountSelectedTeam(account?.teamList.filter(team => team.players > 0)[0]);
      }
    } else {
      replaceAccountSelectedTeam(JSON.parse(team));
    }
  }, [replaceAccountSelectedTeam, account?.teamList]);
  
  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.FILTERS) || '{}');
    updateStorageFilters(filters);
  }, [updateStorageFilters]);
  
  useEffect(() => {
    const filters = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.FILTERS_BODY_PARAMS) || '{}');
    updateStorageBodyFilter(filters);
  }, [updateStorageBodyFilter]);
  
  useEffect(() => {
    if (!sessionStorage.getItem(CONFIGURATION_SIDER)) {
      if (account?.role?.name === ACCOUNT_ROLES.ZEBRA_ADMIN) {
        sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
          collapsed: false,
          menuItem: `${ConfigurationKeys.TEAMS}`,
          params: '',
          subMenu: [''],
        }));
      } else if (account?.role?.name === ACCOUNT_ROLES.ADMIN_USER || account?.role?.name === ACCOUNT_ROLES.TEAM_MAINTAINER) {
        sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
          collapsed: false,
          menuItem: `${ConfigurationKeys.USERS}`,
          params: '',
          subMenu: [''],
        }));
      } else if (account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER) {
        if(hasShoulderPad) {
          sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
            collapsed: false,
            menuItem: `${ConfigurationKeys.MANAGEMENT_DATA_IMPORT}`,
            params: '',
            subMenu: [`${ConfigurationTabs.MANAGEMENT}`],
          }));
        } else if(account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN) {
          sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
            collapsed: false,
            menuItem: `${ConfigurationKeys.USERS}`,
            params: '',
            subMenu: [''],
          }));
        } else if(account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER) {
          sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
            collapsed: false,
            menuItem: `${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`,
            params: '',
            subMenu: [`${ConfigurationTabs.DEVICE}`],
          }));
        }
      } else if (account?.role?.name === ACCOUNT_ROLES.USER_TEAM) {
        sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
          collapsed: false,
          menuItem: `${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`,
          params: '',
          subMenu: [`${ConfigurationTabs.DEVICE}`],
        }));
      }
    }
  }, [account?.role?.name, hasShoulderPad]);
  
  useEffect(() => {
    if (!!account.importId) {
      const interval = setInterval(() => {
        getImportProcessStatus(account.importId);
      }, 3000);
      setIntervalId(interval);
    } else {
      clearInterval(intervalId);
    }
    // eslint-disable-next-line
  }, [account.importId, getImportProcessStatus]);

  useEffect(() => {
    if (!sessionStorage.getItem(BACKDOOR_SIDER)) {
      sessionStorage.setItem(BACKDOOR_SIDER, JSON.stringify({
        collapsed: false,
        subMenu: ['device'],
        menuItem: 'partition-backtool',
        params: '',
      }))
    }
  }, [account?.role?.name]);
  
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Switch>
        <Route key="5" path={ROUTES.NFL.PAGE()} component={Nfl}/>
        <Route key="3" path={ROUTES.OKTA.PAGE()} component={OktaReDirect}/>
        <Route key="4" path={ROUTES.LOGIN.PAGE() + '/' + ROUTES.OKTA.PAGE()} component={OktaReDirect}/>
        <Route key="1" path={ROUTES.LOGIN.PAGE()} component={LoginView}/>
        <Route key="2" path={'*'} component={Routing}/>
      </Switch>
    </Layout>
  );
};

export const Routing = () => {
  const {account} = useAccountState();
  const {showLoader} = useLoaderState();
  const isAndroid = typeOfMobile(navigator.userAgent, 'Android');
  const backdoorTab = JSON.parse(sessionStorage.getItem(BACKDOOR_SIDER) || '{}');
  const isOem = account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  return (
    <div>
      <SocketDSProvider>
      <NotificationProvider progressBarData={[]} updateProgressBar={() => {
      }} finishedStatus={new Set()}>
        <Navbar/>
        {showLoader > 0 && <Loader/>}
        <Layout className="main-layout">
          {/*path !== ROUTES.HOME.PAGE() && <Sidebar/>*/}
          {!isAndroid && <MessageAlertLayout />}
          <Layout>
            {!!account.login &&
            <Switch>
                <Route exact key="1" path={ROUTES.HOME.PAGE()} component={HomeView}/>
              {
                <Route key="2" path="*">
                  {
                    account.teamList.length !== 0 &&
                    account.role &&
                    ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_TEAM_USER] &&
                    (
                      <Switch>
                        <Route
                          exact
                          key="2"
                          path={ROUTES.ACTIVITY.PAGE(TAB)}
                          render={(match) => {
                            if (!isOem && (match.match?.params?.tab === ActivityTabs.GAME ||
                              match.match?.params?.tab === ActivityTabs.PRACTICE ||
                              match.match?.params?.tab === ActivityTabs.CUSTOM)
                            ) {
                              return <ActivityRoute/>;
                            }
                            return <Redirect to={ROUTES.ERROR.ERROR404()}/>;
                          }}
                        />
                        <Route exact key="21" path={ROUTES.ACTIVITY.SELECTOR(TAB, KEY)} 
                          render={() => {
                            if(isOem) {
                              return <Redirect to={ROUTES.ERROR.ERROR404()}/>;
                            }
                            return <ScanRefactorView /> 
                          }} />
                        <Route exact key="21" path={ROUTES.ACTIVITY.PLAYER_DETAIL(TAB, KEY, KEY2)}
                          render={() => {
                            if(isOem) {
                              return <Redirect to={ROUTES.ERROR.ERROR404()}/>;
                            }
                            return <ScanReportsByPlayerDetails /> 
                          }} />
                        {
                          !isOem ?
                          <Route exact key="21" path={ROUTES.ACTIVITY.PLAYER_EDIT_EQUIPMENT(TAB, KEY, KEY2, KEY3, KEY4)} component={EquipmentDetailsByPlayerBySession} /> :
                          <Route exact key="21" path={ROUTES.ACTIVITY.PLAYER_EDIT_EQUIPMENT(TAB, KEY, KEY2, KEY3, KEY4)} component={EquipmentDetailsByPlayerBySession}>
                            <Redirect to={ROUTES.ERROR.ERROR404()}/>
                          </Route> 
                        }
                        <Route exact key="3" path={ROUTES.EQUIPMENT.PAGE(TAB)} component={EquipmentView}/>
                        <Route exact key="31" path={ROUTES.EQUIPMENT.DETAIL(TAB, KEY)} component={EquipmentDetail}/>
                        {
                          ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] <= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_ADMIN] ?
                          <Route exact key="32" path={ROUTES.EQUIPMENT.DETAIL_OEM(TAB, TEAM, KEY)} component={EquipmentDetail}/> :
                          <Route exact key="32" path={ROUTES.EQUIPMENT.DETAIL_OEM(TAB, TEAM, KEY)} component={EquipmentDetail}>
                            <Redirect to={ROUTES.HOME.PAGE()}/>
                          </Route>
                        } 
                        <Route exact key="41" path={ROUTES.REDIRECT.EQUIPMENT()} component={RedirectEquipment} />
                        <Route exact key="42" path={ROUTES.REDIRECT.ACTIVITY()}
                          render={() => {
                            if(isOem) {
                              return <Redirect to={ROUTES.ERROR.ERROR404()}/>
                            }
                            return <RedirectActivity />
                          }}
                        />
                        {
                          ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] ?
                          <Route exact key="33" path={ROUTES.SCAN_DISTRIBUTION.PAGE(TAB)} component={ScanDistribution} /> :
                          <Route exact key="33" path={ROUTES.SCAN_DISTRIBUTION.PAGE(TAB)} component={ScanDistribution}>
                            <Redirect to={ROUTES.HOME.PAGE()}/>
                          </Route>
                        }
                        <Route exact key="6" path={ROUTES.CONFIGURATION.PAGE(TAB)} component={ConfigurationView}/>
                        <Route exact key="6" path={ROUTES.CONFIGURATION.DETAIL(TAB, KEY)}
                               component={ConfigurationView}/>
                        <Route exact key="7" path={ROUTES.PLAYER.PAGE()} 
                          render={() => {
                            if(isOem) {
                              return <Redirect to={ROUTES.ERROR.ERROR404()}/>
                            }
                            return <Player />
                          }} />
                        {
                          !isOem ?
                          <Route exact key="71" path={ROUTES.PLAYER.DETAIL(KEY)} component={PlayerDetail}/> :
                          <Route exact key="71" path={ROUTES.PLAYER.DETAIL(KEY)} component={PlayerDetail}>
                            <Redirect to={ROUTES.ERROR.ERROR404()}/>
                          </Route> 
                        }
                        {
                          !isOem ?
                          <Route exact key="72" path={ROUTES.PLAYER.EDIT_EQUIPMENT(TAB, KEY, KEY2)} component={EquipmentDetailsByPlayer}/> :
                          <Route exact key="72" path={ROUTES.PLAYER.EDIT_EQUIPMENT(TAB, KEY, KEY2)} component={EquipmentDetailsByPlayer}>
                            <Redirect to={ROUTES.ERROR.ERROR404()}/>
                          </Route> 
                        }
                        <Route exact key="100" path={ROUTES.ABOUT.PAGE()} component={About}/>
                        <Route exact key="101" path={ROUTES.NFL.PAGE()} component={Nfl}/>
                        <Route exact key="9" path={ROUTES.ERROR.ERROR502()} component={UnderConstraction}/>
                        <Route exact key="10" path={ROUTES.ERROR.ERROR404()} component={NotFound}/>
                        <Route exact key="1111" path="/test" component={Test}/>
                        <Route key="21" exact path="/">
                          <Redirect to={ROUTES.HOME.PAGE()}/>
                        </Route>
                        <Route key="*">
                          {
                            ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] &&
                            <Switch>
                                <Route exact key="11" path={ROUTES.BACKDOOR.PAGE(TAB)} component={BackDoorConfig}/>
                                <Route exact key="12" path={ROUTES.BACKDOOR.DETAIL(TAB, KEY)} component={BackDoorConfig}/>
                                <Redirect to={ROUTES.ERROR.ERROR404()}/>
                            </Switch>
                          }
                        </Route>
                      </Switch>
                    )
                  }
                </Route>
              }
                <Redirect to={ROUTES.ERROR.ERROR404()}/>
            </Switch>
            }
            {ROLE_HIERARCHY[account?.role?.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] && 
            <ReactShortcut
              keys="b a c k t o o l"
              onKeysPressed={() => {
                history.push(ROUTES.BACKDOOR.PAGE(backdoorTab?.menuItem ?? BackDoorConfigKeys.SYNCHRONIZE));
              }}
            />
            }
          </Layout>
        </Layout>
      </NotificationProvider>
      </SocketDSProvider>
    </div>
  );
};
