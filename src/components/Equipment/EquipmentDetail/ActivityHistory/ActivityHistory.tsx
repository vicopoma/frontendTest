import React from 'react';
import '../EquipmentDetail.scss';
import Icon from '../../../Shared/CommomIcons/Icons';
import {
  ACTIVITY_TYPE,
  ASCEND,
  DATE_FORMATS,
  EQUIPMENT,
  pageSize
} from '../../../../constants/constants';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import moment from 'moment';
import { ActivityHistory, EQ_INFORMATION_VAR, FilterState } from '../../../../store/types';
import { useLocation } from 'react-router-dom';
import { API } from '../../../../settings/server.config';
import { toPrint } from '../../../../helpers/Utils';
import { useEquipmentContext } from '../../../../context/equipment';
import { Collapse } from 'antd';
import { HistoryHeader } from './HistoryHeader';
import './HistoryHeader.scss';

export const Activity = () => {
  
  const paths = useLocation().pathname.split('/');
  const equipmentId = paths[paths.length - 1]
  
  const { values } = useEquipmentContext();
  
  const columns: Columns[] = [
    {
      title: 'Activity Type',
      key: 'type',
      dataIndex: 'type',
      render: (type: string) => toPrint(type)
    },
    {
      title: 'Activity Name',
      key: 'title',
      dataIndex: 'title',
      render: (a: any, b: ActivityHistory) => {
        if(b.type.toLowerCase() === ACTIVITY_TYPE.GAME) {
          return <span> {b.visitorTeamName} <b> @ </b> {b.homeTeamName}</span>
        }
        return b.title;
      }
    },
    {
      title: 'Start Date',
      key: 'session.start_game_date',
      dataIndex: 'startGameDate',
      sorter: true,
      defaultSortOrder: ASCEND,
      render: (date: string) => moment(date).local().format(DATE_FORMATS.monthDayYearHourMin)
    },
    {
      title: 'End Date',
      key: 'session.end_game_date',
      dataIndex: 'endGameDate',
      sorter: true,
      render: (date: string) => moment(date).local().format(DATE_FORMATS.monthDayYearHourMin)
    },
    {
      title: 'Team',
      key: 'team',
      dataIndex: 'team',
      render: (a: any, b: ActivityHistory) => {
        return b.teamNameAssigned;
      }
    },
    {
      title: 'Player Assigned',
      key: 'player.display_name',
      dataIndex: 'playerName',
      sorter: true,
    }
  ]
  
  const defaultFilters: FilterState = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    equipmentId: {
      params: [equipmentId]
    },
    sort: {
      params: ['session.start_game_date', 'desc']
    }
  };

  const activityType = [
    ACTIVITY_TYPE.GAME,
    ACTIVITY_TYPE.PRACTICE,
  ]

  return (
    <>
      <div className="info_body_back ">
        <div className="in-row">
          <div className="info-icon">
            <Icon.Equipment type={values[EQ_INFORMATION_VAR.NAME_EQUIPMENT_TYPE]} width="35px"/>
          </div>
          <div className="info-tag">
            {values[EQ_INFORMATION_VAR.EQUIPMENT_CODE]}
          </div>
          <div>
            <div className="info-title">
              Manufacturer
            </div>
            <div className="info-data">
              {values[EQ_INFORMATION_VAR.NAME_MANUFACTURER]}
            </div>
          </div>
          <div>
            <div className="info-title">
              Model
            </div>
            <div className="info-data">
              {values[EQ_INFORMATION_VAR.NAME_MODEL]}
            </div>
          </div>
        </div>
      </div>
      <Collapse>
        {
          activityType.map(type => (
            <Collapse.Panel key={type} header={<HistoryHeader activityType={type} defaultFiltersObject={{...defaultFilters, type: { params: [`${type}`] }}}/>} className='first-level-header ant-collapse'>
              <InfiniteTable
                paged
                columns={columns}
                columnEditName=""
                defaultFiltersObject={{...defaultFilters, type: { params: [`${type}`] }}}
                hideTableHeader={true}
                url={[API.SCANNER.SCAN_BASE(), API.SCANNER.SESSION_HISTORY()].join('')}
                filterName={[EQUIPMENT, 'sessionhistory', equipmentId, type].join(',')}
                noDataClassName="no-data-activity-history"
              />    
            </Collapse.Panel>
          ))
        }
      </Collapse>
    </>
  )
}
