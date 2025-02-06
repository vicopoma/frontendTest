import React from 'react';
import { DatePicker, Space, Tag } from 'antd';
import {
  ASCEND,
  dateFormat,
  dateFormatTable,
  datePickerFormat,
  DESCEND,
  TABLE_EDIT_NAME,
  TAG_FILTER
} from '../../../../constants/constants';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import moment from 'moment';
import './TagHistory.scss';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { API } from '../../../../settings/server.config';
import { useLocation } from 'react-router-dom';
import { useFilterParams } from '../../../../hook/customHooks/customHooks';

export const TagHistory = () => {
  
  const path = useLocation().pathname.split('/');
  const equipmentId = path[path.length - 1];
  
  const componentName = `${TAG_FILTER}${equipmentId}`;
  const { filter: tagFilter, addFilter } = useFilterParams(componentName);
  
  const columns = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      width: 20,
      sorter: true,
      sortDirections: [ASCEND, DESCEND, ASCEND],
      render: (tag: string) => {
        return hexToAscii(tag);
      }
    },
    {
      title: 'Assign By',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 20,
    },
    {
      title: 'Unassigned by',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      width: 20,
    },
    {
      title: 'Since',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 20,
      render: (date: string) => {
        return <span>{moment(new Date(date)).local().format(dateFormatTable)}</span>;
      }
    },
    {
      title: 'Until',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 20,
      render: (date: string) => {
        if (!!date) {
          return <span>{moment(new Date(date)).local().format(dateFormatTable)}</span>;
        }
        return '';
      }
    },
    {
      title: 'Status',
      dataIndex: 'endDate',
      key: 'status',
      width: 20,
      render: (date: string) => {
        return <div className="auth-request">
          {!date ? <Tag className="role-tag" color="green"> Assigned </Tag> :
            <Tag className="role-tag"> Unassigned </Tag>}
        </div>;
      }
    }
  ];
  
  const startingFilter = {
    date: {
      params: [moment(new Date(), dateFormat).format(dateFormat)]
    },
    equipmentId: {
      params: [equipmentId]
    }
  };
  
  const partFilters: Array<any> = [{
    query: 'date',
    display: (
      <Space direction="vertical">
        <DatePicker
          id="eITagHisDate"
          size="small"
          disabledDate={(date) => {
            return (new Date(date.format(dateFormat)) > new Date());
          }}
          value={moment(tagFilter?.date?.params[0])}
          format={datePickerFormat}
          allowClear={false}
          onChange={e => {
            addFilter({
              date: {
                params: [e ? e.format(dateFormat) : '']
              }
            });
          }}
        />
      </Space>
    )
  }];
  
  return (
    <>
      <InfiniteTable
        url={API.TAG.EQUIPMENT_TAG()}
        fetchType="GET"
        columns={columns}
        filterName={componentName}
        componentName={''}
        filters={partFilters}
        columnEditName={TABLE_EDIT_NAME.TAG_HISTORY_COLUMNS}
        defaultFiltersObject={startingFilter}
      />
    </>
  );
};
