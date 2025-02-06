import React, { useEffect } from 'react';
import { PlayerDetail } from '../../../Player/PlayerDetail/PlayerDetail';
import { ActivityTabs, ROUTES } from '../../../../settings/routes';
import moment from 'moment/moment';
import { ACTIVITY, BODY_FILTER, DATE_FORMATS, FILTER } from '../../../../constants/constants';
import { useScanState } from '../../../../hook/hooks/scan';
import { useLocation } from 'react-router-dom';
import { NavigationBarState } from '../../../Shared/NavigationBar/NavigationBar';
import { Button, Dropdown, Menu } from 'antd';
import { history } from '../../../../store/reducers';
import { DownOutlined, StarFilled } from '@ant-design/icons';
import { useActivitiesDispatch } from '../../../../hook/hooks/activity';
import Image from '../../../Shared/Image/Image';
import { usePlayerCrud } from '../../../../hook/customHooks/players';
import { useBodyFilterParams, useFilterParams } from '../../../../hook/customHooks/customHooks';

export const ScanReportsByPlayerDetails = () => {
  
  const filterName = ACTIVITY + FILTER;
  const bodyFilterName = ACTIVITY + BODY_FILTER;
  
  const { addBodyFilter } = useBodyFilterParams(bodyFilterName);
  const { addFilter } = useFilterParams(filterName);
  const {activityScan} = useScanState();
  
  const {loadActivity} = useActivitiesDispatch();
  
  const {pathname} = useLocation();
  const path = pathname.split('/');
  const type = path[path.length - 3];
  const sessionId = path[path.length - 2];
  const playerId = path[path.length - 1];
  
  const {player} = usePlayerCrud(playerId, sessionId);
  
  useEffect(() => {
    loadActivity(sessionId);
  }, [loadActivity, sessionId]);
  
  const partOptionsBar: Array<JSX.Element> = [
    <div key="home" className="header_drawer_item">
      <Image style={{position: 'absolute', zIndex: 0, marginLeft: 27}}
             key={'logo'} src={`/images/numplay-bg-large.svg`} srcDefault={'/images/numplay-bg-large.svg'} alt="logo"
             width="110px"/>
      <Image
        src={`/images/teams/logos/${activityScan.homeTeamName}.svg`}
        srcDefault={'/images/team-icon.svg'}
        height="38px" alt="logo-home"
      />
      <div className="header_drawer_team">
        <span style={{zIndex: 1}}>      <StarFilled style={{color: '#FF9200'}}/>HOME</span>
        <label htmlFor="" style={{zIndex: 1}}>{activityScan.homeTeamName}</label>
      </div>
    </div>,
    activityScan.visitTeamName && activityScan.homeTeamName !== activityScan.visitTeamName ?
      <div key="vs" className="icon-game-vs">
        VS
      </div> : <div key="vs" />,
    activityScan.visitTeamName && activityScan.homeTeamName !== activityScan.visitTeamName ?
      <div className="header_drawer_item" key="visitor" style={{marginRight: 15}}>
        <Image
          src={`/images/teams/logos/${activityScan.visitTeamName}.svg`}
          srcDefault={'/images/team-icon.svg'}
          height="38px" alt="logo-visitor"
        />
        <div className="header_drawer_team">
          <span>VISITOR</span>
          <label htmlFor="">{activityScan.visitTeamName}</label>
        </div>
      </div> : <div key="visitor" style={{marginLeft: 35}}/>
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
            <Menu.Item key={ActivityTabs.GAME}> <span className="type-text"><img className="navigation-icon"
                                                                                 src="/images/icon-03.svg" alt=""
                                                                                 width="18px"/> Game</span>
            </Menu.Item>
            <Menu.Item key={ActivityTabs.PRACTICE}> <span className="type-text"><img className="navigation-icon"
                                                                                     src="/images/practice-icon.svg"
                                                                                     alt=""
                                                                                     width="18px"/> Practice </span>
            </Menu.Item>
            <Menu.Item key={ActivityTabs.CUSTOM}> <span className="type-text"><img className="navigation-icon"
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
        path: ROUTES.ACTIVITY.SELECTOR(type, sessionId),
        breadcrumbName:
          `${activityScan.homeTeamName !== activityScan.visitTeamName ?
            (activityScan.visitTeamName + ' @ ' + activityScan.homeTeamName) : (activityScan.homeTeamName)}
                  - Date: ${moment(activityScan.startGameDate).local().format(DATE_FORMATS.monthDayYearHourMin)}`
      },
      {
        path: '',
        breadcrumbName: `${player.firstName} ${player.lastName} #${player.jerseyNumber}`
      }
    ],
    rightBar: [partOptionsBar]
  };
  
  return (
    <PlayerDetail
      openDrawer={true}
      onClose={() => {
      }}
      navigationBar={navigationBar}
      sessionId={sessionId}
    />
  );
};
