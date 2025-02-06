import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router';
import { Button, Popover } from 'antd';
import { PlusSquareFilled } from '@ant-design/icons';

import { ActivityState } from '../../../store/types';
import {
  ACTIVITY_TYPE,
  CALENDAR,
  DATE_FORMATS,
  dateFormat,
  REGENERATION_DETAILS,
  WEEK_IN_HOURS,
} from '../../../constants/constants';
import { useActivitiesDispatch, useActivitiesState } from '../../../hook/hooks/activity';
import { MonthCalendar } from '../../Shared/Calendar/MonthCalendar';
import { useBodyFilterParams, useFilterParams } from '../../../hook/customHooks/customHooks';
import { ROUTES } from '../../../settings/routes';
import { history } from '../../../store/reducers';
import Icon from '../../Shared/CommomIcons/Icons';
import { isInAllowedTime, isInAllowedTimeStartOf } from '../../../helpers/Utils';

interface Month {
  month: number,
  year: number,
}



export const ActivityCalendar = ({
                                   component,
                                   enableFetch,
                                   setShowDrawerNewActivity,
                                   filters,
                                   setTeamsPractice,
                                   bodyFilter,
                                   filterName
                                 }: {
  component: string,
  enableFetch: boolean,
  setShowDrawerNewActivity: React.Dispatch<React.SetStateAction<boolean>>,
  filters: Array<{ query: string, display: JSX.Element }>,
  setTeamsPractice: Function,
  bodyFilter: Object,
  filterName: string,
}) => {
  
  const [loader, setLoader] = useState<boolean>(false);
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  const activityType = paths[paths.length - 1];
  
  const objectCalendar = component + CALENDAR;
  
  const {activities} = useActivitiesState();
  const {loadActivitiesAsCalendar} = useActivitiesDispatch();
  
  const { addFilter } = useFilterParams(objectCalendar);
  
  const { bodyFilter: activityBodyParams, addBodyFilter } = useBodyFilterParams(filterName, bodyFilter);
  const dateValue: string[] = activityBodyParams?.date ? activityBodyParams?.date.split('-') : [];
  const defaultDate: Month | undefined = dateValue.length ? {
    month: +dateValue[1],
    year: +dateValue[0]
  } : undefined;
  
  useEffect(() => {
    const date = moment(new Date());
    addFilter({
      year: {
        params: [dateValue.length ? +dateValue[0] : date.year() + '']
      },
      month: {
        params: [dateValue.length ? +dateValue[1] : (date.month() + 1) + '']
      },
      type: {
        params: [path.toUpperCase()]
      }
    });
    
    addBodyFilter({
      type: path.toUpperCase()
    });
    // eslint-disable-next-line
  }, [path]);
  
  useEffect(() => {
    if(!filterName.includes('no-calendar')) {
      setLoader(true);
      loadActivitiesAsCalendar(filterName, bodyFilter)
      .then(() => {
        setLoader(false);
      });
    }
  }, [activityBodyParams, loadActivitiesAsCalendar, setLoader, filterName]);
  
  const getListData = (value: moment.Moment) => {
    let listData: Array<ActivityState> = [];
    activities.forEach(data => {
      const currentDate = moment(new Date(data.startGameDate)).local().format(dateFormat);
      if (currentDate === value.format(dateFormat)) {
        listData.push(data);
      }
    });
    return listData || [];
  };
  
  // const canEditPractice = path !== ACTIVITY_TYPE.GAME && path !== ACTIVITY_TYPE.CUSTOM
  //   && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN];
  const dateCellRender = (value: moment.Moment, day: string, dateString: string) => {
    const listData = getListData(value);
    const cellRender = ({data}: { data: ActivityState }) => {
      // const isPresentComingPractice = isRunning(data) || isFuture(data);
      let path = `/images/teams/logos/${data.homeTeamName}.svg`;
      let path2 = `/images/teams/logos/${data.visitTeamName}.svg`;
      return (
        <div
          id={`${data.homeTeamId}-${moment(data.startGameDate).format(DATE_FORMATS.monthDayYearHourMin)}`}
          className={`bar-info ${REGENERATION_DETAILS[data.sessionStatus].type}`}
          // style={{cursor: isEditablePastPractice ? 'pointer' : 'auto'}}
          onClick={() => {
            if (data?.type === 'PRACTICE') {
              setTeamsPractice({
                date: moment(data.startGameDate).format(DATE_FORMATS.monthDayYearHourMin),
                teams: listData,
                sessionId: data.id,
                reProcessed: data.isReProcessed,
                isEdit: data.isEdit,
              });
              setShowDrawerNewActivity(true);
            }
          }}
        >
          {
            data?.type === 'GAME' ?
              <>
                {/*isPresentComingGame ? <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <div className="info-team">
                      <span>{data.homeTeamName}</span>
                      <img src={path} alt=""/>
                      <span>-</span>
                      <img src={path2} alt=""/>
                      <span>{data.visitTeamName}</span>
                    </div>
                    <span>{`${moment(data.startGameDate).local().format(DATE_FORMATS.hourMin)} - ${moment(data.endGameDate).local().format(DATE_FORMATS.hourMin)}`}</span>
                  </div> : */<Popover overlayClassName="game-calendar-tooltip" content={<Button className="btn-header"
                  style={{ padding: '3px 15px', margin: '2px 4px 0', }}
                  icon={<Icon.Activity type={activityType as ACTIVITY_TYPE} width="18px" style={{ paddingRight: '6px' }} />}
                  onClick={() => {
                    history.push(ROUTES.ACTIVITY.SELECTOR(activityType, data.id || ''));
                  }}
                  >
                    Open Game
                  </Button>} trigger="click"
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <div className="info-team">
                      <span>{data.homeTeamName}</span>
                      <img src={path} alt=""/>
                      <span>-</span>
                      <img src={path2} alt=""/>
                      <span>{data.visitTeamName}</span>
                    </div>
                    <span>{`${moment(data.startGameDate).local().format(DATE_FORMATS.hourMin)} - ${moment(data.endGameDate).local().format(DATE_FORMATS.hourMin)}`}</span>
                  </div>
                </Popover>}
              </>
              :
              <>
                <div className="info-team">
                  <img src={path} alt=""/>
                  <span>{data.homeTeamName}</span>
                </div>
                <span>{`${moment(data.startGameDate).local().format(DATE_FORMATS.hourMin)} - ${moment(data.endGameDate).local().format(DATE_FORMATS.hourMin)}`}</span>
              </>
          }
        </div>
      );
    };
    
    return (
      <div id={moment(dateString).format(DATE_FORMATS.yearMonthDay)}>
        <div className="day-value">
          {day}
        </div>
        <div className="day-content">
          {
            listData?.map((data: ActivityState, index) => {
              if (index < 2) {
                return cellRender({data});
              }
              return <div/>;
            })
          }
          {
            listData?.length > 2 && (
              <Popover
                className="bar-info more"
                placement="bottom"
                content={() => {
                  return (
                    <div
                      style={{
                        overflowY: 'auto',
                        maxHeight: '200px',
                        width: '200px'
                      }}
                      className="day-content blue-scroll">
                      {
                        listData?.map((data: ActivityState, index) => {
                          if (index >= 2) {
                            return cellRender({data});
                          }
                          return <div/>;
                        })
                      }
                    </div>
                  );
                }}
              >
                <div className="info-team">
                  <img src="/images/dots-01.svg" alt=""/>
                  <span> {listData?.length - 2} +</span>
                </div>
              </Popover>
            )
          }
          {
            isInAllowedTimeStartOf(dateString + '', 2 * WEEK_IN_HOURS, 'day') && path !== ACTIVITY_TYPE.GAME && path !== ACTIVITY_TYPE.CUSTOM &&
            <PlusSquareFilled
                className="plus-button"
                onClick={() => {
                  setTeamsPractice({
                    date: dateString,
                    teams: listData,
                    sessionId: undefined,
                    reProcessed: false
                  });
                  setShowDrawerNewActivity(true);
                }}
            />
          }
        </div>
      </div>
    );
  };
  
  return (
    <MonthCalendar
      loading={loader}
      defaultValue={defaultDate}
      dataCellRender={dateCellRender}
      onChange={values => {
        addFilter({
          year: {
            params: [values.year]
          },
          month: {
            params: [values.month]
          }
        });
        addBodyFilter({
          date: `${values.year}-${('' + values.month).length === 1 ? ('0' + values.month) : values.month}-01`,
          season: null,
        });
      }}
      filters={filters}
    />
  );
};
