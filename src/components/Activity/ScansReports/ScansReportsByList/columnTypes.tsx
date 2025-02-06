import { ScanState } from '../../../../store/types';
import moment from 'moment/moment';
import { ACTIVITY_TYPE, ASCEND, dateFormatTable } from '../../../../constants/constants';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import React from 'react';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { dateToString } from '../../../../helpers/Utils';

export const equipmentGeneralInformation = (type: string): Array<Columns> => [
  {
    title: type === ACTIVITY_TYPE.GAME ? 'Game Key' : 'Session ID',
    dataIndex: 'gameId',
    key: 'activity_nfl_id',
    sorter: true,
    render: (id: string) => {
      if (id !== 'null') {
        return id;
      } else {
        return '';
      }
    },
  },
  {
    title: 'Date',
    dataIndex: 'gameDate',
    width: 10,
    key: 'activity_date',
    sorter: true,
    render: (date: string) => {
      if (date) {
        return moment(date).local().format(dateFormatTable);
      } else {
        return '';
      }
    },
  },
  {
    title: 'TAG ID',
    dataIndex: 'tag',
    defaultSortOrder: ASCEND,
    width: 12,
    key: 'tag',
    sorter: true,
    render: (a: any, b: ScanState) => {
      return <span> {hexToAscii(b.tag)}</span>;
    },
  },
  {
    title: 'Equipment Code',
    dataIndex: 'equipmentCode',
    width: 12,
    key: 'equipment_code',
    sorter: true
  },
  {
    title: 'Manufacturer ID',
    dataIndex: 'manufacturerIdNfl',
    key: 'manufacturer_nfl_id',
    sorter: true
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturer',
    width: 10,
    key: 'name_manufacturer',
    sorter: true
  },
  {
    title: 'Model ID',
    dataIndex: 'modelIdNfl',
    key: 'model_nfl_id',
    sorter: true
  },
  {
    title: 'Equipment Model',
    dataIndex: 'equipmentModel',
    key: 'name_model',
    sorter: true,
    render: (a: string) => {
      return <div style={{ minWidth: "230px" }}>{a}</div>
    }
  },
  {
    title: 'Initial Season',
    dataIndex: 'initialSeason',
    key: 'model_year',
    sorter: true,
  },
  {
    title: 'Device Type',
    dataIndex: 'deviceType',
    key: 'device',
    sorter: true,
  },
];


export const playerInfoColumn: Array<Columns> = [
  {
    title: 'Player ID',
    dataIndex: 'playerIdNfl',
    key: 'player_nfl_id',
    sorter: true
  },
  {
    title: 'Player Name',
    dataIndex: 'playerName',
    width: 15,
    key: 'display_name',
    sorter: true
  },
  {
    title: 'Jersey #',
    dataIndex: 'jerseyNumber',
    key: 'jersey_number',
    sorter: true
  },
  {
    title: 'Note',
    dataIndex: 'note',
    key: 'note',
    sorter: true,
    render: (a: string) => {
      return <div style={{ minWidth: "400px" }}>{a}</div>
    }
  },
  {
    title: 'Created Date',
    dataIndex: 'createdDate',
    key: 'created_date',
    sorter: true,
    render: (a: string) => {
      return dateToString(a, dateFormatTable);
    }
  },
  {
    title: 'Last Updated',
    dataIndex: 'updatedDate',
    key: 'updated_date',
    sorter: true,
    render: (a: string) => {
      return dateToString(a, dateFormatTable);
    }
  },
  {
    title: 'Team Name',
    dataIndex: 'team',
    key: 'team_name',
    sorter: true
  },
];