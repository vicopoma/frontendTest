import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import moment from 'moment';
import { DatePicker, Form, Input } from 'antd';

import { ActivityList } from './ActivitySchedules/ActivityListView';
import { ActivityCalendar } from './ActivitySchedules/ActivityCalendarView';
import CustomInput from  '../Shared/CustomInput/Input';
import { SelectOptions } from '../Shared/Select/Select';
import { TreeNode } from '../Shared/TreeFormComponents/TreeFormTypes';
import {
	ACCOUNT_ROLES,
	ACTION_CHECKBOX_ACTIVITY,
	ACTION_CHECKBOX_SCAN,
	ACTIVITY,
	DATE_FORMATS,
	dateFormat,
	GAMES_TEAMS_CHOSEN_TYPES,
	ROLE_HIERARCHY,
	STATUS_CHECKBOX,
} from '../../constants/constants';
import { useAccountState } from '../../hook/hooks/account';

import { ActivityTabs } from '../../settings/routes';
import { SelectorTree, SelectorTreeStorage } from '../Shared/TreeFormComponents/SelectorTree/SelectorTree';
import { FilterQuery } from '../../Types/Types';
import { ActivityLegends } from './ActivitySchedules/ActivityLegends/ActivityLegends';
import { TeamsSelector } from '../Shared/TreeSelectors/TeamsSelector';
import { SeasonWeekSelector } from '../Shared/TreeSelectors/SeasonWeekSelector';
import { useBodyFilterParams } from '../../hook/customHooks/customHooks';
import { useActivityList } from '../../hook/customHooks/activity';
import { Season } from '../../store/types';
import { debounce } from '../../helpers/Utils';

export const TREE_SELECTOR = {
  TEAMS: 'activity-tree-teams',
  LOCATION: 'activity-tree-location'
};

const ACTIVITY_SEASON_WEEK_SELECTOR_TREE = {
  SEASON_WEEK: 'activity-season-week-tree'
};

export const ActivityTab = ({ showCalendar, type, setShowDrawerNewActivity, component, setTeamsPractice, filterName }: {
  component: string
  showCalendar: boolean,
  type: string,
  create?: boolean,
  setShowDrawerNewActivity: React.Dispatch<React.SetStateAction<boolean>>,
  setTeamsPractice: Function,
  filterName: string
}) => {

  const {account} = useAccountState();

  const {teamList, seasonList} = account;
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];

  const { bodyFilter: activityBodyParams, addBodyFilter } = useBodyFilterParams(filterName);
  const { activityKeyList: { activityKeys, getActivityKeys }} = useActivityList();

  const [typeTeamFilterSelector, setTypeTeamFilterSelector] = useState<Array<TreeNode>>([]);
  const [selectedTeams, setSelectedTeams] = useState<Array<string>>(() => {
    const selectorTreeStorage: SelectorTreeStorage = JSON.parse(sessionStorage.getItem(`${TREE_SELECTOR.TEAMS}-${path}${showCalendar ? '-calendar' : ''}`) || '{}');
    if (Object.keys(selectorTreeStorage).length > 0) {
      return selectorTreeStorage.selectedValuesPerLevel[0];
    }
    return teamList.map(team => team.teamId);
  });

  const [reset, setReset] = useState<number>((activityBodyParams?.date && !showCalendar && activityBodyParams?.date !== '' && Object.keys(activityBodyParams.season || {}).length === 0)  ? 1 : 0);

  const [selectedTypeTeams, setSelectedTypeTeams] = useState<Array<string>>(['HOME', 'VISIT']);

  const [keyword, setKeyword] = useState<string>(activityBodyParams?.keyword ? activityBodyParams?.keyword : '');
  const [tags, setTags] = useState<Array<SelectOptions> > (() => {
    if(activityBodyParams?.keys) {
      const currentTags: Array<SelectOptions> = []
      activityBodyParams.keys.forEach((data: any) => {
        currentTags.push({
          value: data,
          display: data,
        })
      })
      return currentTags
    }
    return []
  });
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    setTrigger(prevState => prevState + 1);
  }, [path]);

  const [enableFetch, setEnableFetch] = useState(true);

  useEffect(() => {
    if(filterName.includes(path) && activityBodyParams.type === path.toUpperCase()) {
      setTimeout(() => {
        setEnableFetch(true);
      }, 200);
    } else {
      setEnableFetch(false);
    }
  }, [filterName, path, showCalendar, activityBodyParams.type])

  useEffect(() => {
    if (!!activityBodyParams) {
      setKeyword(activityBodyParams?.keyword ? activityBodyParams?.keyword : '');
    }
  }, [activityBodyParams, activityBodyParams?.keyword]);

  const bodyFilter = activityBodyParams?.homeTeamId ? activityBodyParams : {
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

  const [triggerReset, setTriggerReset] = useState(0);

  useEffect(() => {
    setReset(0);
    setTimeout(() => {
      setTriggerReset(prevState => prevState + 1);
    }, 500);
  }, [showCalendar, activityBodyParams.type, path]);

  useEffect(() => {
    if(!showCalendar && activityBodyParams.type === path.toUpperCase()) {
      setReset((prevState) => {
        if(activityBodyParams?.date && activityBodyParams?.date !== '' && Object.keys(activityBodyParams.season || {}).length === 0) {
          if(prevState > 0) return prevState + 1;
          else return 1; 
        } else {
          return 0;
        }
      })
    }
  }, [triggerReset, path]);

  const buildTypeTeamsFilter = useCallback((): TreeNode => {
    return {
      value: 'home/visit',
      name: 'Teams',
      display: 'Teams',
      icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
      className: 'filter-menu-select-first',
      children: [
        {
          value: 'home',
          name: 'Home',
          display: 'Home',
          icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
          className: 'filter-menu-select-first',
          shown: true,
          id: 'home',
        },
        {
          value: 'visit',
          name: 'Away',
          display: 'Away',
          icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
          className: 'filter-menu-select-first',
          shown: true,
          id: 'visitor',
        }
      ],
      shown: true,
      id: 'home/visit'
    };
  }, []);

  const searchKeysFunction = (value: string) => {
    getActivityKeys({
      ...activityBodyParams,
      keyword: value,
    })
  }
  const debouncedSearchKeys = useCallback(debounce(searchKeysFunction, 600), []);
  
  const filters: Array<FilterQuery> = [
    {
      query: 'search',
      display: (showCalendar ? 
        <Input.Search
          size="small"
          id="aSearchActivity"
          placeholder="Search..."
          allowClear
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          onSearch={(value: string) => {
            if (value) {
              addBodyFilter({
                keyword,
              });
            } else {
              addBodyFilter({
                keyword: '',
              });
            }
          }}
        /> :
        <CustomInput.SearchAndTag
          id='cPInputSearch'
          inputKey="PlayerSearchTag"
          placeholder="Search..."
          size="small"
          style={{minWidth: '400px'}}
          nameView={`activity_${path}`}
          bodyFilterName={filterName}
          onChange={(value: SelectOptions[])=> {
            setTags(value)
            const keys: Array<string> = []
            value.forEach(val => {
              keys.push(val.display + '')
            })
            addBodyFilter({
              keys: keys
            })
          }}
          onOperatorChange={(operator: string) => {
            addBodyFilter({
              operator: operator
            })
          }}
          operator={activityBodyParams?.operator ? activityBodyParams?.operator : 'AND'}
          onSearch={debouncedSearchKeys}
          tagValues={tags}
          options={activityKeys.map(key => ({
            value: key,
            display: key
          }))}
        />
      )
    },
    {
      query: 'seasonWeekTree',
      display: (
        (path === ActivityTabs.GAME || path === ActivityTabs.PRACTICE) && !showCalendar ? 
        <SeasonWeekSelector 
          name={ACTIVITY_SEASON_WEEK_SELECTOR_TREE.SEASON_WEEK + path}
          onApply={(dataPerLevel, dataPerNode) => {
            const weeks = Array.from(dataPerLevel[1]).map(week => {
              return week.split('|')[0];
            });
            addBodyFilter({
              date: undefined,
              season: {
                season: dataPerLevel[0].values().next().value,
                weekList: weeks
              }
            });
          }}
          reset={reset}
        /> : <></>
      ),
    },
    {
      query: 'home/visitor',
      width: '2',
      display: (
        path === ActivityTabs.GAME ? 
        <Form.Item className='select-label-up'>
          <label className='label-select'>Home/Away</label>
          <SelectorTree
            selectAll
            selectorTreeName={TREE_SELECTOR.LOCATION + path}
            nodes={typeTeamFilterSelector}
            placeholder="Home/Away"
            icon={<img className="img-h anticon" src="/images/home-visit-icon.svg" alt="" width="15px"/>}
            onChange={(dataPerLevel) => {
              setSelectedTypeTeams(Array.from(dataPerLevel[0]));
              if (dataPerLevel[0].size === 2) {
                addBodyFilter({
                  typeTeam: GAMES_TEAMS_CHOSEN_TYPES.BOTH,
                  visitTeamId: selectedTeams,
                  homeTeamId: selectedTeams
                });
                
              } else if (dataPerLevel[0].has('visit')) {
                addBodyFilter({
                  typeTeam: GAMES_TEAMS_CHOSEN_TYPES.VISIT,
                  visitTeamId: selectedTeams
                });
                
              } else if (dataPerLevel[0].has('home')) {
                addBodyFilter({
                  typeTeam: GAMES_TEAMS_CHOSEN_TYPES.HOME,
                  homeTeamId: selectedTeams
                });
              } else {
                addBodyFilter({
                  typeTeam: GAMES_TEAMS_CHOSEN_TYPES.NONE,
                  homeTeamId: [],
                  visitTeamId: []
                });
              }
            }}
          />
        </Form.Item> : <></>
      )
    },
    {
      query: 'teams',
      width: ( paths[2] === 'game' ? '2' : ''),
      display: (
        ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] &&
        ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER] ?
          <TeamsSelector 
            selectorKey={`${TREE_SELECTOR.TEAMS}-${path}-${trigger}`}
            name={`${TREE_SELECTOR.TEAMS}-${path}`}
            onChange={(dataPerLevel) => {
              setSelectedTeams(dataPerLevel);
              if ((activityBodyParams?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.BOTH
                || activityBodyParams?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.NONE)
                && selectedTypeTeams.length > 0) {
                addBodyFilter({
                  homeTeamId: Array.from(dataPerLevel),
                  visitTeamId: Array.from(dataPerLevel)
                });
              } else if (activityBodyParams?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.VISIT) {
                addBodyFilter({
                  visitTeamId: Array.from(dataPerLevel)
                });
              } else if (activityBodyParams?.typeTeam === GAMES_TEAMS_CHOSEN_TYPES.HOME) {
                addBodyFilter({
                  homeTeamId: Array.from(dataPerLevel),
                });
              }
            }}
          /> : <div/>
      )
    },
    {
      query: 'datePicker',
      display: (
        !showCalendar ? 
        <Form.Item className='select-label-up'>
          <DatePicker
            size="small"
            id="aDate"
            format={DATE_FORMATS.monthDayYear}
            style={{width: '100%'}}
            value={activityBodyParams?.date ? moment(activityBodyParams?.date) : undefined}
            onChange={async (date: moment.Moment | null, dateString: string) => {            
              setReset(prev => prev + 1);
              if(dateString === '') {
                if(reset > 0) {
                  setReset(prev => prev * -1);
                }
                let season = seasonList.filter(season => season.active)[0];
                if(!season) {
                  season = seasonList.sort((a: Season, b: Season) => b.id.localeCompare(a.id))[0];
                }
                const id = season.id;
                const weeks = season.weekList.map(week => week.id);
                addBodyFilter({
                  date: '',
                  season: {
                    season: id,
                    weekList: weeks,
                  },
                })
              } else {
                if(reset < 0) {
                  setReset(prev => prev * -1);
                }
                addBodyFilter({
                  date: date?.format(dateFormat),
                  season: {},
                });
              }
            }}
          />
        </Form.Item> : <div/>
      )
    },
    {
      query: 'legend',
      display: (
        <Form.Item className='select-label-up'>
          <ActivityLegends/>
        </Form.Item>
      )
    },
  ];
  
  useEffect(() => {
    setTypeTeamFilterSelector([buildTypeTeamsFilter()]);
  }, [showCalendar, path, buildTypeTeamsFilter]);
  
  return (
    <>
      {
        !showCalendar ?
          enableFetch && <ActivityList
            component={component}
            enableFetch={enableFetch}
            type={type}
            filter={filters}
            bodyFilter={bodyFilter}
            filterName={filterName}
            addBodyFilter={addBodyFilter}
          />
          : enableFetch && <ActivityCalendar
            component={component}
            enableFetch={enableFetch}
            setShowDrawerNewActivity={setShowDrawerNewActivity}
            setTeamsPractice={setTeamsPractice}
            filters={filters}
            bodyFilter={bodyFilter}
            filterName={filterName}
          />
      }
    </>
  );
};
