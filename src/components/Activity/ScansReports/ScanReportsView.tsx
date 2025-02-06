import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Button, Dropdown, Layout, Menu } from 'antd';
import { DownOutlined, StarFilled, SyncOutlined } from '@ant-design/icons';
import moment from 'moment/moment';
import ReactShortcut from 'react-shortcut';

import { useScanState } from '../../../hook/hooks/scan';
import { LoaderButton } from '../../Shared/LoaderButton/LoaderButton';
import { ACTIVITY, BODY_FILTER, DATE_FORMATS, FILTER } from '../../../constants/constants';
import { NavigationBar, NavigationBarState } from '../../Shared/NavigationBar/NavigationBar';
import './ScanReport.scss';
import { ActivityTabs, ROUTES } from '../../../settings/routes';
import Image from '../../Shared/Image/Image';
import { useActivitiesDispatch } from '../../../hook/hooks/activity';
import { history } from '../../../store/reducers';
import { ScanReportsByList } from './ScansReportsByList/ScanReportsByList';
import { ScanReportsByPlayer } from './ScansReportsByPlayer/ScanReportsByPlayer';
import { ScanGraph } from './ScanGraph/ScanGraph';
import { useBodyFilterParams, useFilterParams } from '../../../hook/customHooks/customHooks';

export const ScanRefactorView = () => {
  
  const filterName = ACTIVITY + FILTER;
  const bodyFilterName = ACTIVITY + BODY_FILTER;
  
  const { addBodyFilter } = useBodyFilterParams(bodyFilterName);
  const { addFilter } = useFilterParams(filterName);
  const {activityScan} = useScanState();
  const {loadActivity} = useActivitiesDispatch();
  
  const [reload, setReload] = useState<number>(0);
  const [scanReportType, setScanReportType] = useState<number>(1);
  const getPlayerView = () => setScanReportType(1);
  
  const {pathname} = useLocation();
  const path = pathname.split('/');
  const type = path[path.length - 2];
  const sessionId = path[path.length - 1];
  
  useEffect(() => {
    loadActivity(sessionId);
  }, [loadActivity, sessionId]);
  
  const partOptionsBar: Array<any> = [
    <LoaderButton
      icon={<SyncOutlined/>}
      size="small"
      style={scanReportType ? {display: 'none'} : {}}
      className="btn-blue-border" onClick={() => {
      setReload(reload => reload + 1);
    }}>
      Refresh
    </LoaderButton>,
    <div className="header_drawer_item">
      <Image
        src={`/images/numplay-bg-large.svg`}
        srcDefault={'/images/numplay-bg-large.svg'}
        alt="logo"
        width="110px"
        className="background-image"
      />
      <Image
        src={`/images/teams/logos/${activityScan.homeTeamName}.svg`}
        srcDefault={'/images/team-icon.svg'}
        height="38px" alt="logo-home"
        // loader={'/images/team-icon.svg'}
      />
      <div className="header_drawer_team">
        <span style={{zIndex: 1}}>      <StarFilled style={{color: '#FF9200'}}/>HOME</span>
        <label htmlFor="" style={{zIndex: 1}}>{activityScan.homeTeamName}</label>
      </div>
    </div>,
    activityScan.visitTeamName && activityScan.homeTeamName !== activityScan.visitTeamName &&
    <div className="icon-game-vs">
        VS
    </div>,
    activityScan.visitTeamName && activityScan.homeTeamName !== activityScan.visitTeamName ?
      <div className="header_drawer_item" style={{marginRight: 15}}>
        <Image
          src={`/images/teams/logos/${activityScan.visitTeamName}.svg`}
          srcDefault={'/images/team-icon.svg'}
          height="38px" alt="logo-visitor"
        />
        <div className="header_drawer_team">
          <span>VISITOR</span>
          <label htmlFor="">{activityScan.visitTeamName}</label>
        </div>
      </div> : <div style={{marginLeft: 35}}/>
  ];
  
  const navigationBar: NavigationBarState = {
    navTitle: (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu
            onClick={e => {
              const key = e.key;
              const changeTab = async (tab: string) => {
                addFilter({
                  page: {
                    params: ['0']
                  },
                  type: {
                    params: [tab.toUpperCase()]
                  }
                });
                
                addBodyFilter({
                  type: tab.toUpperCase()
                });
              };
              changeTab(key).then(() => {
                history.push(ROUTES.ACTIVITY.PAGE(key));
              });
            }}
          >
            <Menu.Item key={ActivityTabs.GAME}> <span className="type-text">
              <img className="navigation-icon" src="/images/icon-03.svg" alt="" width="18px"/> Game
            </span>
            </Menu.Item>
            <Menu.Item key={ActivityTabs.PRACTICE}> <span className="type-text">
							<img
                className="navigation-icon"
                src="/images/practice-icon.svg"
                alt=""
                width="18px"/> Practice </span>
            </Menu.Item>
            <Menu.Item key={ActivityTabs.CUSTOM}> <span className="type-text">
							<img
                className="navigation-icon"
                src="/images/custom-icon.svg" alt=""
                width="18px"/> Custom </span>
            </Menu.Item>
          </Menu>
        }>
        <Button
          icon={<>
            {ActivityTabs.GAME === path[2] &&
            <img src="/images/icon-03.svg" className="navigation-icon" alt="" width="24px"/>}
            {ActivityTabs.PRACTICE === path[2] &&
            <img src="/images/practice-icon.svg" className="navigation-icon" alt="" width="24px"/>}
            {ActivityTabs.CUSTOM === path[2] &&
            <img src="/images/custom-icon.svg" className="navigation-icon" alt="" width="24px"/>}
          </>}
          className="navigation-button">
          <div className="navigation-text">
            <h4>{path[2]}</h4>
            <DownOutlined/>
          </div>
        </Button>
      </Dropdown>
    ),
    navigationRoute: [
      {
        path: ROUTES.ACTIVITY.PAGE(type),
        breadcrumbName: type + ' list'
      },
      {
        path: ROUTES.ACTIVITY.SELECTOR(type, ''),
        breadcrumbName: (
          `${activityScan.homeTeamName !== activityScan.visitTeamName ?
            (activityScan.visitTeamName + ' @ ' + activityScan.homeTeamName) : (activityScan.homeTeamName)}
                  - Date: ${moment(activityScan.startGameDate).local().format(DATE_FORMATS.monthDayYearHourMin)}`
        )
      },
    
    ],
    rightBar: partOptionsBar
  };
  
  return (
    <Layout>
      
      <div className="card-container">
        <NavigationBar {...navigationBar}/>
        { scanReportType === 0 && <ScanReportsByList setScanReportType={setScanReportType} scanReportType={scanReportType} reload={reload} /> }
        { scanReportType === 1 && <ScanReportsByPlayer scanReportType={scanReportType} setScanReportType={setScanReportType}/> }
        { scanReportType === 2 && <ScanGraph goBack={getPlayerView}/> }
      </div>
      <ReactShortcut
        keys="d a t a v i e w"
        onKeysPressed={() => {
          setScanReportType(2);
        }}
      />
    </Layout>
  );
};
