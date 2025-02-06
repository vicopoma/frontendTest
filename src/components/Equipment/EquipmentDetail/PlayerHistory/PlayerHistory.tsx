import React from 'react';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import { API } from '../../../../settings/server.config';
import { DATE_FORMATS, EQUIPMENT, pageSize } from '../../../../constants/constants';
import { useLocation } from 'react-router-dom';
import { FilterState } from '../../../../store/types';
import moment from 'moment';

export const PlayerHistory = () => {

  const columns: Array<Columns> = [
    {
      title: 'Player Assigned',
      dataIndex: 'playerName',
      key: 'playerName'
    },
    {
      title: 'Team',
      dataIndex: 'teamAbbr',
      key: 'teamAbbr'
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => !!date ? moment(date).local().format(DATE_FORMATS.monthDayYearHourMin) : '-'
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => !!date ?  moment(date).local().format(DATE_FORMATS.monthDayYearHourMin) : '-',
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      width: 50
    }
  ];
  
  const paths = useLocation().pathname.split('/');
  const equipmentId = paths[paths.length - 1];
  
  const defaultFilters: FilterState = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    equipmentId: {
      params: [equipmentId]
    }
  };

  return (
    <InfiniteTable
      url={[API.PLAYER.BASE(), API.PLAYER.PLAYER_HISTORY()].join('')}
      columnEditName=""
      columns={columns}
      defaultFiltersObject={defaultFilters}
      filterName={[EQUIPMENT, 'sessionhistory', equipmentId].join(',')}
     />
  )
}