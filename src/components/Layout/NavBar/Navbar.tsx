import React, { useEffect, useState } from 'react';
import { Badge, Drawer, Dropdown, Menu, Popover, Tooltip } from 'antd';
import { BellOutlined, CaretDownOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import moment from 'moment-timezone';

import * as httpClient from '../../../settings/httpClients';
import { useAccountDispatch, useAccountState } from '../../../hook/hooks/account';
import { ActivityTabs, ConfigurationKeys, ConfigurationTabs, ROUTES } from '../../../settings/routes';
import {
  ACCOUNT_ROLES,
  ACTIVITY_FILTER,
  CONFIGURATION_SIDER,
  EQUIPMENT,
  ROLE_HIERARCHY,
  SessionStorageController,
  STORAGE_NAMES
} from '../../../constants/constants';
import { history } from '../../../store/reducers';
import { useFilterStates } from '../../../hook/hooks/filters';
import { Profile } from '../../Profile/ProfileView';
import Image from '../../Shared/Image/Image';
import './Navbar.scss';
import { useBodyFilterState } from '../../../hook/hooks/bodyFilter';
import { API } from '../../../settings/server.config';
import { GeneralNotifications } from './Notifications/GeneralNotifications';
import { useNotificationContext } from '../../../context/notifications';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { useSocketDSProvider } from '../../../context/socketDS';
import { NavbarSearch } from './NavbarSearch';
import { typeOfMobile } from '../../../helpers/Utils';

export const Navbar = () => {
  
  const {resetUserInformation, replaceAccountSelectedTeam, updateNotifications} = useAccountDispatch();
  const {account, teamSelected, loginType, notifications} = useAccountState();
  const activityFilter = useFilterStates(ACTIVITY_FILTER);
  
  const location = useLocation();
  
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);
  const [checkDrawerMenu, setCheckDrawerMenu] = useState<boolean>(false);
  const [newVersion, setNewVersion] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  
  const closeNotifications = () => setShowNotifications(false);
  const url = location.pathname.split('/');
  const path = url[1];
  const timezone = (new Date()).toString().match(/\((.*)\)/)?.pop();
  
  const cannotChooseTeam = path === ROUTES.PARAMS.ACTIVITY;
  const sessionTabControl = sessionStorage.getItem(CONFIGURATION_SIDER);

  const {progressBarData} = useNotificationContext();

  const { equipmentTypeDTOList } = account;

  useEffect(() => {
    const browserVersion = localStorage.getItem(STORAGE_NAMES.VERSION);
    if (browserVersion !== loginType.version && !!loginType.version) {
      setNewVersion(true);
      localStorage.setItem(STORAGE_NAMES.VERSION, loginType.version);
    } else {
      setNewVersion(false);
    }
  }, [loginType.version]);
  
  const equipmentParam = useBodyFilterState(EQUIPMENT);
  const closeDrawer = () => setShowProfileDrawer(false);
  const showDrawer = () => setCheckDrawerMenu(!checkDrawerMenu);

  const { addBodyFilter } = useBodyFilterParams(EQUIPMENT);

  const isOem = account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  
  useEffect(() => {
    if (sessionTabControl) {
      setTabControl(JSON.parse(sessionTabControl));
    }
  }, [sessionTabControl]);
  
  useEffect(() => {
    if(isOem) {
      addBodyFilter({
        equipmentTypeId: equipmentTypeDTOList[0] ? equipmentTypeDTOList[0].id : undefined
      })
    }
    if (!sessionStorage.getItem(CONFIGURATION_SIDER)) {
      if (account?.role?.name === ACCOUNT_ROLES.ZEBRA_ADMIN) {
        setTabControl((prevState) => {
          return ({
            ...prevState,
            menuItem: `teams`,
            subMenu: [''],
          });
        });
      } else {
        if (account?.role?.name === ACCOUNT_ROLES.ADMIN_USER) {
          sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
            collapsed: false,
            menuItem: `users`,
            params: '',
            subMenu: [''],
          }));
        }
      }
    }
  }, [account?.role?.name, addBodyFilter, equipmentTypeDTOList, isOem]);
  
  const [tabControl, setTabControl] = useState<SessionStorageController>({
    collapsed: false,
    menuItem: 'management-data-import',
    params: '',
    subMenu: [ConfigurationTabs.MANAGEMENT],
  });
  
  const menu = (
    <Menu>
      <Menu.Item
        icon={<img className="img-h anticon" src="/images/user-icon.svg" alt="" width="13px"/>}
        id="profile" onClick={() => {
        setShowProfileDrawer(true);
      }}>
        My Profile
      </Menu.Item>
      
      <Menu.Item
        icon={<img className="img-h anticon" src="/images/logout-icon.svg" alt="" width="13px"/>}
        id="logout" onClick={() => {
        httpClient.logout();
        if (account?.source === 'okta') {
          window.location.href = API.USER.OKTA_LOGOUT_REDIRECT();
        } else {
          resetUserInformation();
        }
      }}>
        Logout
      </Menu.Item>
    </Menu>
  );
  const teamsMenu = (
    <Menu className="profile-team-selector blue-scroll">
      {
        account.teamList.map((team, index) => {
          let pathImage = `/images/teams/logos/${team.fullName}.svg`;
          return (
            <Menu.Item
              key={index}
              onClick={() => {
                replaceAccountSelectedTeam(team);
              }}>
              <div className="logo-team-name">
                <Image key={team.fullName} src={pathImage} srcDefault={'/images/team-icon.svg'} alt="logo"/>
                <span style={{color: 'var(--blue-dark)', fontWeight: 'bold'}}>
                  {
                    team.fullName
                  }
                </span>
              </div>
            </Menu.Item>
          );
        })
      }
    </Menu>
  );

  const { warning, connectionResponse } = useSocketDSProvider();
  const isAndroid = typeOfMobile(navigator.userAgent, 'Android');
  
  return (
    <>
      {showNotifications && <GeneralNotifications closeNotifications={closeNotifications}/>}
      <header className="header-test">
        <nav className="nav">
          <div className="nav-section">
            {teamSelected?.season && <Tooltip title={`Season ${teamSelected?.season}`}>
              <div className="nav-logo" id="logo-home">
                <div key={ROUTES.HOME.PAGE()} onClick={() => history.push(ROUTES.HOME.PAGE())}>
                  <img className="logo" src="/images/logo-2vl-w-02.svg" height="40px" alt=""/>
                  <img className="logo-mobile" src="/images/logo-mobile.svg" height="40px" alt=""/>
                </div>
              </div>
            </Tooltip>}
            <input type="checkbox" id="checkbox" className="checked" onClick={() => showDrawer()}
                   defaultChecked={checkDrawerMenu}/>
            <label className="checkbox-img" htmlFor="checkbox">
              <img className="menu-navbar" src="/images/menu-navbar.svg" height="25px" alt=""/>
            </label>
            <ul className="nav-section">
              {
                account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] && !isAndroid &&
                <li
                    id="activity"
                    className="nav-element"
                    key={ROUTES.PARAMS.ACTIVITY}
                    onClick={() => {
                      history.push(ROUTES.ACTIVITY.PAGE((activityFilter?.type?.params?.[0]) ? ((activityFilter.type.params[0] as string).toLowerCase() as ActivityTabs) : ActivityTabs.PRACTICE));
                    }}
                >
                    <button className={path === ROUTES.PARAMS.ACTIVITY ? 'button-activate' : ''}>
                        ACTIVITY
                    </button>
                </li>
              }
              {
                account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_TEAM_USER] && !isAndroid &&
                <li className="nav-element" id="equipment" key={ROUTES.PARAMS.EQUIPMENT} onClick={() => {
                  history.push(ROUTES.EQUIPMENT.PAGE(equipmentParam?.equipmentTypeId ?? "-"));
                }}>
                    <button className={path === ROUTES.PARAMS.EQUIPMENT ? 'button-activate' : ''}>
                        EQUIPMENT
                    </button>
                </li>
              }
              {
                account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] && !isAndroid &&
                <li className="nav-element" id="players" key={ROUTES.PARAMS.PLAYER}
                    onClick={() => history.push(ROUTES.PLAYER.PAGE())}>
                    <button className={path === ROUTES.PARAMS.PLAYER ? 'button-activate' : ''}>
                        PLAYERS
                    </button>
                </li>
              }
              {
                account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_TEAM_USER] && !isAndroid &&
                <li className="nav-element" id="configuration" key={ROUTES.PARAMS.CONFIGURATION}
                    onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(tabControl.menuItem as ConfigurationKeys))}>
                    <button className={path === ROUTES.PARAMS.CONFIGURATION ? 'button-activate' : ''}>
                        CONFIGURATION
                    </button>
                </li>
              }
              {
                account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] && !isAndroid &&
                <li className="nav-element" id="scan-distribution" key={ROUTES.PARAMS.SCAN_DISTRIBUTION}
                    onClick={() => history.push(ROUTES.SCAN_DISTRIBUTION.PAGE('team'))}>
                    <button className={path === ROUTES.PARAMS.SCAN_DISTRIBUTION ? 'button-activate' : ''}>
                        SCAN DISTRIBUTION
                    </button>
                </li>
              }
              {
                account.teamList.length !== 0 && account && account.role && (
                  <li className="nav-element" style={{width: '85px'}} id="about" key={ROUTES.PARAMS.ABOUT}
                      onClick={() => history.push(ROUTES.ABOUT.PAGE())}>
                    <button onClick={() => {
                      setNewVersion(false);
                    }} className={path === ROUTES.PARAMS.ABOUT ? 'button-activate' : ''}>
                      <Badge
                        count={newVersion ? <ExclamationCircleFilled style={{borderRadius: '10px', color: '#f5222d', background: '#fff'}}/> : 0}>
	                      <span style={{color: 'white'}}>
                          ABOUT
	                      </span>
                      </Badge>
                    </button>
                  </li>
                )
              }
            </ul>
          </div>
          
          <ul>
            {/*
              account.importId && currentImportDetails.percentage >= 0 && <li>
                <span
                    style={{
                      marginRight: '20px'
                    }}
                >
                  Import status:
                </span>
                {(currentImportDetails.percentage !== -1) && <Progress
                    style={{
                      marginRight: '20px'
                    }}
                    width={40}
                    type="circle"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    format={(per) =>
                      <span style={{color: 'white'}}> {per}</span>
                    }
                    percent={Math.round(currentImportDetails.percentage)}
                />}
              </li>
            */}
            <li>
              {!isAndroid && <NavbarSearch />}
            </li>
            <li>
              {!isAndroid && <div className={`device-icon ${warning ? '': 'bdr-green'}`}>
                {!!connectionResponse.type ? <Popover 
                content={connectionResponse.description}
                >
                  <img 
                    className="img-h anticon" 
                    src={`/images/devices/device-${warning ? 'off' : 'success'}.svg`} 
                    alt="" 
                    width="22px"
                  />
                </Popover> :
                <img 
                  className="img-h anticon" 
                  src={`/images/devices/device-${warning ? 'off' : 'success'}.svg`} 
                  alt="" 
                  width="22px"
                />   
                }
              </div>}
            </li>
            <li>
              {
                progressBarData.length > 0 && <Badge
                  count={notifications ? <ExclamationCircleFilled
                    style={{borderRadius: '10px', color: '#f5222d', background: '#fff', marginRight: '30px'}}/> : 0}>
                  <BellOutlined
                    style={{fontSize: '30px', color: 'white', marginRight: '30px', cursor: 'pointer'}}
                    onClick={() => {
                      setShowNotifications(true);
                      updateNotifications(false);
                    }}
                  />
                </Badge>
              }
            </li>
            <li>
              {
                account?.teamList?.length > 0 && (
                  <div className="nav-profile-team" /* disabled={cannotChooseTeam} */
                       style={{
                         position: 'inherit',
                         opacity: cannotChooseTeam && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] > ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] ? '0.7' : '1',
                         cursor: path === ROUTES.PARAMS.ACTIVITY || path === ROUTES.PARAMS.CONFIGURATION ? 'none' : 'pointer'
                       }}
                  >
                    {
                      ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] > ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_ADMIN] ?
                        <Dropdown disabled={cannotChooseTeam || account.teamList?.length <= 1} overlay={teamsMenu}
                                  trigger={['click']}>
                          <div style={{marginTop: '0px'}} className="nav-drowpdown-team">
                            <img className="nav-profile-team-background" src="/images/bg-select-team.svg" width="100px"
                                alt=""/>
                            <span className="nav-profile-team-logo">
                              <Image
                                key={teamSelected?.fullName}
                                src={`/images/teams/logos/${teamSelected?.fullName}.svg`}
                                srcDefault={'/images/team-icon.svg'} alt="logo" width="35px"/>
                            </span>
                            <span className="nav-profile-team">
                              <b> {teamSelected?.fullName} </b>
                              <span className="nav-profile-team-arrow ">
                                {!cannotChooseTeam && account.teamList?.length > 1 ? <CaretDownOutlined width="10px"/> :
                                  <div/>}
                              </span>
                            </span>
                          </div>
                        </Dropdown> :
                        /*<div />*/
                        <div style={{justifyContent: 'center'}} className="nav-drowpdown-team">
                          <img className="nav-profile-team-background" src="/images/bg-select-manufacturer.svg" width="140px"
                              alt="" style={{height: '64px', width: '161px', position: 'relative', margin: '0px'}}/>
                          <span className="nav-profile-team-logo" style={{position:'absolute'}}>
                            <Image
                              key={account.nameManufacturer}
                              src={`/images/manufacturers/logos/${account.nameManufacturer?.toLowerCase().replaceAll(' ', '-')}.svg`}
                              srcDefault={'/images/manufacturers/logos/oem-default.svg'} alt="logo" width="70px"/>
                          </span>
                        </div>
                    }
                  </div>
                )
              }
            </li>
            <li className="nav-profile">
              <div className="nav-profile-description">
                <span className="nav-profile-role"><p>{account.name}</p></span>
                <span className="nav-profile-time-zone">
                  <p><b>Time Zone:</b> {`${timezone} (${moment.tz(moment.tz.guess()).format('z')})`}</p>
                </span>
              </div>
              <Dropdown className="nav-profile-photo" overlay={menu} trigger={['click']}>
                <a id="logoutAdmin"
                   onClick={e => e.preventDefault()}
                   href="/login">
                  <img src="/images/icon-01.svg" alt="" height="40px"/>
                </a>
              </Dropdown>
            </li>
          </ul>
        </nav>
        {
          showProfileDrawer && <Profile closeDrawer={closeDrawer}/>
        }
        <Drawer
          title={<h2 className="menu-title">MENU</h2>}
          placement="top"
          closable={false}
          onClose={showDrawer}
          visible={checkDrawerMenu}
          className="drawer-navbar"
          getContainer={false}
          height="auto"
        >
          <div className="drawer-menu">
          {
              account && account.role &&
              <div
                  id="activity-drawer"
                  className="nav-element"
                  key={ROUTES.PARAMS.ACTIVITY}
                  onClick={() => {
                    history.push(ROUTES.HOME.PAGE());
                    setCheckDrawerMenu(false);
                  }}
              >
                  <button className={path === ROUTES.PARAMS.HOME ? 'button-activate' : ''}>
                    HOME
                  </button>
              </div>
            }
            {
              account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] && !isAndroid &&
              <div
                  id="home-drawer"
                  className="nav-element"
                  key={ROUTES.PARAMS.HOME}
                  onClick={() => {
                    history.push(ROUTES.ACTIVITY.PAGE(activityFilter?.type ? ((activityFilter.type.params[0] as string).toLowerCase() as ActivityTabs) : ActivityTabs.PRACTICE));
                    setCheckDrawerMenu(false);
                  }}
              >
                  <button className={path === ROUTES.PARAMS.ACTIVITY ? 'button-activate' : ''}>
                      ACTIVITY
                  </button>
              </div>
            }
            {
              account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_TEAM_USER] && !isAndroid &&
              <div className="nav-element" id="equipment-drawer"
                   key={ROUTES.PARAMS.EQUIPMENT}
                   onClick={() => {
                     history.push(ROUTES.EQUIPMENT.PAGE(equipmentParam?.equipmentTypeId));
                     setCheckDrawerMenu(false);
                   }}
              >
                  <button className={path === ROUTES.PARAMS.EQUIPMENT ? 'button-activate' : ''}>
                      EQUIPMENT
                  </button>
              </div>
            }
            {
              account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] && !isAndroid &&
              <div className="nav-element" id="players-drawer" key={ROUTES.PARAMS.PLAYER}
                   onClick={() => {
                     history.push(ROUTES.PLAYER.PAGE());
                     setCheckDrawerMenu(false);
                   }}
              >
                  <button className={path === ROUTES.PARAMS.PLAYER ? 'button-activate' : ''}>
                      PLAYERS
                  </button>
              </div>
            }
            {
              account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_TEAM_USER] && !isAndroid &&
              <div className="nav-element" id="configuration-drawer" key={ROUTES.PARAMS.CONFIGURATION}
                   onClick={() => {
                     history.push(ROUTES.CONFIGURATION.PAGE(tabControl.menuItem as ConfigurationKeys));
                     setCheckDrawerMenu(false);
                   }}
              >
                  <button className={path === ROUTES.PARAMS.CONFIGURATION ? 'button-activate' : ''}>
                      CONFIGURATION
                  </button>
              </div>
            }
            {
              account.teamList.length !== 0 && account && account.role && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] && !isAndroid &&
              <div className="nav-element" id="scan-distribution-drawer" key={ROUTES.PARAMS.SCAN_DISTRIBUTION}
                onClick={() => {
                  history.push(ROUTES.SCAN_DISTRIBUTION.PAGE('team'));
                  setCheckDrawerMenu(false);
                }}
              >
                <button className={path === ROUTES.PARAMS.SCAN_DISTRIBUTION ? 'button-activate' : ''}>
                  SCAN DISTRIBUTION
                </button>
              </div>
            }
            {
              account.teamList.length !== 0 && account && account.role &&
              <div className="nav-element" id="configuration-drawer" key={ROUTES.PARAMS.ABOUT}
                   onClick={() => {
                     history.push(ROUTES.ABOUT.PAGE());
                     setCheckDrawerMenu(false);
                   }}>
                  <button className={path === ROUTES.PARAMS.ABOUT ? 'button-activate' : ''}>
                      ABOUT
                  </button>
              </div>
            }
            {
              <div className="nav-element" id="scan-distribution-drawer" key={ROUTES.PARAMS.SCAN_DISTRIBUTION}
                onClick={() => {
                  httpClient.logout();
                  if (account?.source === 'okta') {
                    window.location.href = API.USER.OKTA_LOGOUT_REDIRECT();
                  } else {
                    resetUserInformation();
                  }
                }}
              >
                <button>LOGOUT</button>
              </div>
            }
          </div>
        </Drawer>
      </header>
    </>
  );
};
