import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Layout, Menu, Radio } from 'antd';
import { CalendarFilled, DownloadOutlined, DownOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';

import {
	ACCOUNT_ROLES,
	ACTION_CHECKBOX_ACTIVITY,
	ACTION_CHECKBOX_SCAN,
	ACTIVITY,
	ACTIVITY_TYPE, DATE_FORMATS,
	dateFormat,
	FILTER,
	ROLE_HIERARCHY,
	SESSION_STORAGE,
	STATUS_CHECKBOX,
  GAMES_TEAMS_CHOSEN_TYPES,
  ActivityType
} from '../../constants/constants';
import { useFilterDispatch, useFilterStates } from '../../hook/hooks/filters';
import { ActivityDrawer } from './ActivityDrawer';
import { ActivityTab } from './ActivityTab';
import { ActivityTabs } from '../../settings/routes';
import { history } from '../../store/reducers';
import { useBodyFilterDispatch, useBodyFilterState } from '../../hook/hooks/bodyFilter';
import { NavigationBar } from '../Shared/NavigationBar/NavigationBar';
import Image from '../Shared/Image/Image';
import store from '../../store';
import { useAccountState } from '../../hook/hooks/account';
import moment from 'moment';
import { LoaderButton } from '../Shared/LoaderButton/LoaderButton';
import { useDownloadFunctions } from '../../hook/customHooks/download';
import { SuccessMessage, WarningMessage } from '../Shared/Messages/Messages';
import { ConfirmationModal } from '../Shared/Modals/Modals';
import { progressBarSessionStorageHandler } from '../../helpers/Utils';
import Icon from '../Shared/CommomIcons/Icons';

export enum activityColumns {
  visitTeamName = 'visit_name',
  homeTeamName = 'home_name',
  gameDate = 'gameDate',
  gameDay = 'gameDay',
  gameSite = 'game_site',
  startGameDate = 'start_game_date',
  endGameDate = 'end_game_date',
  season = 'season',
  action = 'action',
  seasonType = 'season_type',
  scheduleStatus = 'scheduleStatus',
  title = 'title',
  notes = 'notes',
}

export const ActivityView = ({component, componentRouterFunction}: {
  component: string,
  componentRouterFunction: Function
}) => {
  
  const [showDrawerNewActivity, setShowDrawerNewActivity] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [teamsPractice, setTeamsPractice] = useState();
  
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  
  const [filterName, setFilterName] = useState<string>(component + FILTER + path);
  const activityFilter = useFilterStates(filterName);
  const activityBodyFilter = useBodyFilterState(filterName);
  const {account} = useAccountState();
  const {updateBodyFilter} = useBodyFilterDispatch();
  const {updateFilters} = useFilterDispatch();
  
  const {downloadAllScans, downloadAllScansBySeasonWeek} = useDownloadFunctions();
  
  const {teamList} = account;
  
  const closeDrawerNewActivity = () => setShowDrawerNewActivity(false);

  const [triggerProgresBar, setTriggerProgressBar] = useState<number>(0);
  
  const bodyFilter = {
    action: (component === ACTIVITY) ? ACTION_CHECKBOX_ACTIVITY.map(action => action.key) : ACTION_CHECKBOX_SCAN.map(action => action.key),
    date: moment(new Date()).format(dateFormat),
    homeTeamId: teamList.map(team => team.teamId),
    keyword: '',
    operator: 'AND',
    status: STATUS_CHECKBOX.map(status => status.key),
    type: path.toUpperCase(),
    typeTeam: 'BOTH',
    visitTeamId: teamList.map(team => team.teamId),
  };
  
  useEffect(() => {
    setFilterName(component + FILTER + path);
  }, [component, path, showCalendar]);
  
  return (
    <>
      {
        showDrawerNewActivity && (
          <ActivityDrawer
            filterName={filterName}
            teamsPractice={teamsPractice}
            isCalendar={showCalendar}
            showDrawer={showDrawerNewActivity}
            closeDrawer={closeDrawerNewActivity}/>
        )
      }
      <Layout>
        <div className="card-container">
          <NavigationBar
            navTitle={
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    onClick={e => {
                      const key = e.key;
                      const changeTab = async (tab: string) => {
                        const newComponentFilter = component + FILTER + tab;
                        const activityBodyParamsOptional = store.getState().bodyFilter[newComponentFilter];
                        const localStorageBody = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.FILTERS_BODY_PARAMS) || '{}');
                        const storageBody = localStorageBody[component + FILTER + tab];
                        updateFilters(newComponentFilter, {
                          ...activityFilter,
                          page: {
                            params: ['0']
                          },
                          type: {
                            params: [tab.toUpperCase()]
                          }
                        });
                        const storage = storageBody ? {...storageBody} : {...bodyFilter};
                        const body = !!activityBodyParamsOptional ? {...activityBodyParamsOptional} : storage;
                        updateBodyFilter(newComponentFilter, {
                          ...body,
                          type: tab.toUpperCase()
                        });
                      };
                      changeTab(key).then(() => {
                        history.push(componentRouterFunction(key));
                      });
                    }}
                  >
                    <Menu.Item key={ActivityTabs.GAME}> <span className="type-text">
                      <Image
                        className="bg-team-icon"
                        src={`/images/icon-03.svg`}
                        srcDefault={''}
                        width="18px"
                        alt="logo-game"
                      /> Games
                    </span>
                    </Menu.Item>
                    <Menu.Item key={ActivityTabs.PRACTICE}> <span className="type-text">
                      <Image
                        className="bg-team-icon"
                        src={`/images/practice-icon.svg`}
                        srcDefault={''}
                        width="18px"
                        alt="logo-practice"
                      /> Practice
                    </span>
                    </Menu.Item>
                    <Menu.Item key={ActivityTabs.CUSTOM}> <span className="type-text">
                      <Image
                        className="bg-team-icon"
                        src={`/images/custom-icon.svg`}
                        srcDefault={''}
                        width="18px"
                        alt="logo-practice"
                      /> Custom
                    </span>
                    </Menu.Item>
                  </Menu>
                }>
                <Button
                  icon={<>
                    <Icon.Activity alt="" className="navigation-icon" type={path as ActivityType} width="24px"/>
                  </>}
                  className="navigation-button">
                  <div className="navigation-text">
                    <h4>{path}</h4>
                    <DownOutlined/>
                  </div>
                </Button>
              </Dropdown>
            }
            rightBar={[
                ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] ? 
                (
                !showCalendar && <LoaderButton
                disable={
                  (((activityBodyFilter?.season?.weekList?.length || 0) === 0 || Object.keys(activityBodyFilter?.season).length === 0) && !activityBodyFilter?.date) ||
                  (((activityBodyFilter?.homeTeamId?.length || 0) + (activityBodyFilter?.visitTeamId?.length || 0)) === 0) ||
                  ((ActivityTabs.GAME !== path || activityBodyFilter?.typeTeam === 'NONE') && ActivityTabs.PRACTICE !== path && (ActivityTabs.CUSTOM !== path || !activityBodyFilter?.date))
                }
                size="small"
                style={{marginRight: '8px'}}
                triggerProgressBar={triggerProgresBar}
                onClick={() => {
                  const activityType = path;
                  ConfirmationModal('Download', 'Are you sure to download the report?', () => {
                    let teamId = [];
                    if(activityBodyFilter?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.BOTH || activityBodyFilter?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.HOME || activityBodyFilter?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.NONE) {
                      teamId = activityBodyFilter?.homeTeamId;
                    } else {
                      teamId = activityBodyFilter?.visitTeamId;
                    }
                    if(!activityBodyFilter?.date) {
                      downloadAllScansBySeasonWeek({ 
                        season: activityBodyFilter?.season, 
                        activityType: activityBodyFilter?.type as ACTIVITY_TYPE, 
                        typeTeam: activityBodyFilter?.typeTeam, 
                        teams: teamId, 
                        keys: activityBodyFilter?.keys, 
                        operator: activityBodyFilter?.operator
                      },
                        (res, httpResponse) => {
                          const currentDate = moment().format(DATE_FORMATS.yearMonthDay);
                          const code = `${activityType.toUpperCase()}-scans-by-week-${currentDate}.csv`;
                          const key = typeof res === 'string' ? res : '';
                          progressBarSessionStorageHandler(code, key);
                          SuccessMessage({description: httpResponse.message});
                          setTriggerProgressBar(prevState => prevState + 1);
                        },
                        (res, httpResponse) => {
                          WarningMessage({description: httpResponse.message});
                        });
                    } else {
                      downloadAllScans({
                        date: activityBodyFilter?.date,
                        activityType: activityBodyFilter?.type as ACTIVITY_TYPE,
                        typeTeam: activityBodyFilter?.typeTeam,
                        teams: activityBodyFilter?.homeTeamId,
                        keys: activityBodyFilter?.keys,
                        operator: activityBodyFilter?.operator,
                      },
                        (res, httpResponse) => {
                      	  const code = `${activityType.toUpperCase()}-${activityBodyFilter?.date}.csv`;
                          const key = typeof res === 'string' ? res : '';
                          progressBarSessionStorageHandler(code, key);
                          SuccessMessage({description: httpResponse.message});
                          setTriggerProgressBar(prevState => prevState + 1);
                        },
                        (res, httpResponse) => {
                          WarningMessage({description: httpResponse.message});
                        });
                    }
                  });
                }}
              >
                <DownloadOutlined style={{ color: '#013369' }} />
                Download All
              </LoaderButton>
                ) : <div/>,
              component === ACTIVITY &&
              <div style={{marginRight: '13px'}}>
                  <Radio.Group size="middle" defaultValue="a">
                      <Radio.Button id="aViewList" value="a"
                                    onChange={(e) => setShowCalendar(false)}><UnorderedListOutlined/></Radio.Button>
                      <Radio.Button id="aViewSchedule" value="b"
                                    onChange={(e) => setShowCalendar(true)}><CalendarFilled/></Radio.Button>
                  </Radio.Group>
              </div>
            ]}
          />
          <ActivityTab
            component={component}
            setShowDrawerNewActivity={setShowDrawerNewActivity}
            showCalendar={showCalendar}
            type={path.toUpperCase()}
            setTeamsPractice={setTeamsPractice}
            filterName={filterName}
          />
        </div>
      </Layout>
    </>
  );
};
