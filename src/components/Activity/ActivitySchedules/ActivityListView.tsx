import React, { useState } from 'react';
import './ActivitySchedule.scss';
import { activityColumns } from '../ActivityView';
import {
  ACCOUNT_ROLES,
  ACTIVITY_TYPE,
  ASCEND,
  DATE_FORMATS,
  dateFormatTable,
  pageSize,
  REGENERATION_DETAILS,
  ROLE_HIERARCHY,
  TABLE_EDIT_NAME,
  worldDateFormat,
  SCAN_DETAIL_PLAYER_FILTER,
} from '../../../constants/constants';

import moment from 'moment';
import { Button, Tooltip  } from 'antd';

import { useScanDispatch } from '../../../hook/hooks/scan';
import { ActivityTabs, ROUTES } from '../../../settings/routes';
import { useLocation } from 'react-router';
import { useAccountDispatch, useAccountState } from '../../../hook/hooks/account';
import { ActivityState, FilterState } from '../../../store/types';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { history } from '../../../store/reducers';
import { FilterQuery } from '../../../Types/Types';
import Image from '../../Shared/Image/Image';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { API } from '../../../settings/server.config';
import { SuccessMessage, WarningMessage } from '../../Shared/Messages/Messages';
import { useScheduleFunctions } from '../../../hook/customHooks/schedule';
import { useNotificationContext } from '../../../context/notifications';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { isFuture, isRunning, toPrint } from '../../../helpers/Utils';
import { useFilterParams } from '../../../hook/customHooks/customHooks';
import { ActivityNote } from './ActivityNote';

export const ActivityList = ({addBodyFilter, component, enableFetch, type, filter, bodyFilter, filterName}: {
  addBodyFilter: Function,
  component: string,
  enableFetch: boolean,
  type: string,
  filter: Array<FilterQuery>,
  bodyFilter: any,
  filterName: string
}) => {
  
  const {account} = useAccountState();
  const {updateNotifications} = useAccountDispatch();
  const {role} = account;
  
  const {replaceActivityScans} = useScanDispatch();
  const {rebuildSchedule} = useScheduleFunctions();
  const { addFilter } = useFilterParams(SCAN_DETAIL_PLAYER_FILTER);
  
  const {updateProgressBar} = useNotificationContext();

  const [isNoteOpen, setIsNoteOpen] = useState<boolean>(false);
  const [activityNote, setActivityNote] = useState<ActivityState>();
  
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  const isGame = path === ActivityTabs.GAME;
  const columns: Array<Columns> = [
    {
      title: '',
      width: 3,
      dataIndex: 'activityEdit',
      fixed: 'left',
      key: 'activityEdit',
      nonErasable: true,
      align: 'right',
      render: (a: any, b: ActivityState) => {
        return (
          <>
          <div className='border-table'></div>
            <Button
              id={`${moment(new Date(b.startGameDate)).local().format(worldDateFormat)}-${b.homeTeamName}-view`}
              style={{border: 'none', boxShadow: 'none'}}
              onClick={() => {
                addFilter({
                  assigned: {
                      params: ['true']
                    },
                    status: {
                      params: ['']
                    },
                });
                history.push(ROUTES.ACTIVITY.SELECTOR(path, b.id));
              }}>
              <img
                className="img-h anticon"
                src="/images/eye-icon.svg"
                alt=""
                width="18px"
                height="18px"
              />
            </Button>
          </>
        );
      }
    },
    {
      title: '',
      key: 'activityStatus',
      dataIndex: 'activityStatus',
      width: 3,
      nonErasable: true,
      render: (a: string, b: ActivityState) => {
        return (
          <Tooltip title={REGENERATION_DETAILS[b.sessionStatus].value}>
            <div>
              <span className={`bar-info ${REGENERATION_DETAILS[b.sessionStatus].type}`}>  </span>
              <img width="20px" src={REGENERATION_DETAILS[b.sessionStatus].img} alt=""/>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: 'Home Team',
      dataIndex: 'homeTeamName',
      key: activityColumns.homeTeamName,
      sorter: true,
      defaultSortOrder: ASCEND,
      width: 10,
      render: (homeTeamId: string) => {
        return <span><Image key={homeTeamId} src={`/images/teams/logos/${homeTeamId}.svg`}
                            srcDefault={'/images/team-icon.svg'} alt="logo" width="20px"/> {homeTeamId}</span>;
      },
    },
    {
      title: 'Away Team',
      dataIndex: 'visitTeamName',
      key: activityColumns.visitTeamName,
      sorter: true,
      width: 10,
      render: (visitorTeam: string) => {
        return <span><Image key={visitorTeam} src={`/images/teams/logos/${visitorTeam}.svg`}
                            srcDefault={'/images/team-icon.svg'} alt="logo" width="20px"/> {visitorTeam}</span>;
      },
    },
    {
      title: 'Notes',
      dataIndex: 'note',
      key: activityColumns.notes,
      sorter: false,
      width: 10,
      align: 'center',
      render: (note: string, a: ActivityState) => {
        return (
          <div onClick={() => {
            setIsNoteOpen(true);
            setActivityNote(() => a)
          }}>
            <Image src={`/images/activity/${!!note ? '': 'no-'}notes.svg`}
                              srcDefault={''} alt="notes" width="20px"/>
          </div>
        );
      },
    },
    {
      title: 'Location',
      dataIndex: 'gameSite',
      key: activityColumns.gameSite,
      sorter: true,
      exactWidth: path === ACTIVITY_TYPE.PRACTICE ? 300: 180,
    },
    {
      title: `${path === ACTIVITY_TYPE.PRACTICE ? 'Practice' : 'Custom activity'} Name`,
      dataIndex: activityColumns.title,
      key: activityColumns.title,
      sorter: true,
      width: 15,
      render: (a: string) => {
        return <div style={{ minWidth: "220px" }}>{a}</div>
      }
    },
    {
      title: 'Start Time',
      dataIndex: 'startGameDate',
      key: activityColumns.startGameDate,
      width: 10,
      sorter: true,
      defaultSortOrder: ASCEND,
      render: (date: string) => moment(new Date(date)).local().format(dateFormatTable),
    },
    {
      title: 'End Time',
      dataIndex: 'endGameDate',
      key: activityColumns.endGameDate,
      sorter: true,
      render: (date: string) => moment(new Date(date)).local().format(dateFormatTable),
      width: 15,
    },
    {
      title: 'Season',
      dataIndex: activityColumns.season,
      key: activityColumns.season,
      sorter: true,
      width: 15,
    },
    {
      title: 'Season Type',
      dataIndex: 'seasonType',
      key: activityColumns.seasonType,
      sorter: true,
      width: 20,
    },
    {
      title: 'Last Date Regenerated',
      dataIndex: 'lastRegenerateDate',
      key: 'lastRegenerateDate',
      render: (a: any, b: ActivityState) => {
        return b.lastRegenerateDate ? moment(b.lastRegenerateDate).format(DATE_FORMATS.monthDayYearHourMin) : '';
      }
    },
    {
      title: '',
      dataIndex: 'rebuildButton',
      key: 'rebuildButton',
      align: 'right',
      nonErasable: true,
      render: (a: any, b: ActivityState) => {
        const canEditPractice = path !== ACTIVITY_TYPE.CUSTOM
          && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN];
        return (
          canEditPractice && (
            <Tooltip title={`Regenerate ${path}`}>
						  <Button
                disabled={isRunning(b) || isFuture(b)}
                id={`${moment(new Date(b.startGameDate)).local().format(worldDateFormat)}-${b.homeTeamName}`}
                size="small"
                style={{border: 'none', backgroundColor: 'transparent'}}
                icon={<img className="img-h anticon" src="/images/regenerated-practice-icon.svg" alt="" height="18px"/>}
                onClick={() => {
                  ConfirmationModal(`${toPrint(path)} generation`,
                    <>
                      Are you sure you want to regenerate
                      <b> {`${b?.homeTeamName}
			                ${moment(b?.startGameDate).format(DATE_FORMATS.monthDayYear)}
			                ${moment(b?.startGameDate).format(DATE_FORMATS.hourMin)}-${moment(b?.endGameDate).format(DATE_FORMATS.hourMin)} `}
                      </b>
                      {path.toLowerCase()}?
                    </>,
                    () => {
                      rebuildSchedule(
                        b.id,
                        'true',
                        (res, httpResponse) => {
                          SuccessMessage({description: httpResponse.message });
                          updateProgressBar();
                          updateNotifications(true);
                        },
                        (res, httpResponse) => {
                          WarningMessage({
                            description: httpResponse.message
                          });
                        });
                    });
                
                }}>
						  </Button>
            </Tooltip>
          )
        );
      }
    },
    {
      title: '',
      width: 3,
      dataIndex: 'activityEdit',
      key: 'activityWarning',
      nonErasable: true,
      align: 'right',
      render: (a: any, b: ActivityState) => {
        return (
          <>
            {
              (!b.timeZone && path?.trim() !== 'custom') && (
                <Tooltip title="No time zone">
                  <img src="/images/warning-icon.svg" width="25px" alt=""/>
                </Tooltip>
              )
            }
          </>
        );
      }
    }
  ];
  
  const dataColumns = () => {
    let arrayData;
    if (!isGame) {
      if (path === ACTIVITY_TYPE.CUSTOM) {
        arrayData = columns.filter(({dataIndex}) => (
          dataIndex !== activityColumns.seasonType &&
          dataIndex !== activityColumns.season &&
          dataIndex !== 'visitTeamName' &&
          dataIndex !== activityColumns.action
        ));
      } else {
        if (role.name === ACCOUNT_ROLES.ZEBRA_ADMIN || role.name === ACCOUNT_ROLES.ADMIN_USER) {
          arrayData = columns.filter(({dataIndex}) => (dataIndex !== activityColumns.seasonType && dataIndex !== activityColumns.season && dataIndex !== 'visitTeamName'));
        } else {
          arrayData = columns.filter(({dataIndex}) => (dataIndex !== activityColumns.seasonType && dataIndex !== activityColumns.season && dataIndex !== 'homeTeamName' && dataIndex !== 'visitTeamName'));
        }
      }
    } else {
      arrayData = columns.filter(({dataIndex}) => (dataIndex !== activityColumns.scheduleStatus && dataIndex !== activityColumns.title && dataIndex !== activityColumns.endGameDate));
    }
    return arrayData;
  };
  
  const defaultFilters: FilterState = {
    sort: {
      params: [activityColumns.startGameDate, 'desc']
    },
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    type: {
      params: [type]
    }
  };
  
  const onRowClick = (data: ActivityState) => {
    replaceActivityScans({
      visitTeamName: data.visitTeamName,
      visitTeamId: data.visitTeamId,
      startGameDate: data.startGameDate,
      id: data.id,
      homeTeamName: data.homeTeamName,
      homeTeamId: data.homeTeamId
    });
  };

  return <>
    {enableFetch ? 
    <>
      {isNoteOpen && 
      <ActivityNote 
        activity={activityNote} 
        addBodyFilter={addBodyFilter}
        onCancel={() => setIsNoteOpen(false)}
        filterName={filterName}
      />}
      <InfiniteTable
        <ActivityState>
        url={API.SCHEDULE.SCHEDULE_SEARCH()}
        fetchType="POST"
        columns={dataColumns()}
        enableFetch={enableFetch}
        filterName={filterName}
        columnEditName={TABLE_EDIT_NAME.ACTIVITY_COLUMN + path}
        filters={filter}
        defaultFiltersObject={defaultFilters}
        bodyFilters={bodyFilter}
        onRowClick={onRowClick}
        paged={true}
      />
    </> : <div />}
  </>
};
