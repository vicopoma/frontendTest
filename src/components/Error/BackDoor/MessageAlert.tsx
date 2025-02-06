import React from 'react';
import { Button, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { API } from '../../../settings/server.config';
import { ASCEND, DATE_FORMATS, EMPTY_ARRAY, MESSAGE_ALERT, TABLE_EDIT_NAME } from '../../../constants/constants';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import moment from 'moment';

export const MessageAlertList = (
  { setShowDrawerNewMessageAlert, setMessageAlertId } : 
  { setShowDrawerNewMessageAlert: any, setMessageAlertId: Function }
) => {
  const columns: Array<Columns> = [
    {
      title: 'Title',
      dataIndex: 'title',
      defaultSortOrder: ASCEND,
      key: 'title',
      sorter: true
    },
    {
      title: 'Description',
      dataIndex: 'description',
      defaultSortOrder: ASCEND,
      key: 'description',
      sorter: true,
      exactWidth: 175,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      sorter: false,
      exactWidth: 175,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      render: (date: string) => date ? moment(new Date(date)).local().format(DATE_FORMATS.monthDayYearHourMin) : '',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: true,
      render: (date: string) => date ? moment(new Date(date)).local().format(DATE_FORMATS.monthDayYearHourMin) : '',
    },
    
    {
      title: 'Created By',
      dataIndex: 'createBy',
      key: 'createBy',
      sorter: true,
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: true,
      show: true,
      align: 'center',
      render: (a: string) => {
        return a ? moment(new Date(a), DATE_FORMATS.yearMonthDay).local().format(DATE_FORMATS.monthDayYearHourMin) : '';
      }
    },
    {
      title: 'Modified By',
      dataIndex: 'modifiedBy',
      key: 'modifiedBy',
      sorter: true,
    },
    {
      title: 'Modified Date',
      dataIndex: 'modifiedDate',
      key: 'modifiedDate',
      sorter: true,
      show: true,
      align: 'center',
      render: (a: string) => {
        return a ? moment(new Date(a), DATE_FORMATS.yearMonthDay).local().format(DATE_FORMATS.monthDayYearHourMin) : '';
      }
    },
    {
      title: '',
      key: 'edit',
      dataIndex: 'size',
      align: 'right',
      show: true,
      render: (a: any, b: any) => {
        const toSessionStorage = {
          selectedValuesPerNode: {0: [...b.roleList.map((role: any) => role.roleId)]},
          selectedValuesPerLevel: [[...b.roleList.map((role: any) => role.roleId)]],
        }
        sessionStorage.setItem(`roleSelector${b.id}`, JSON.stringify(toSessionStorage));
        return (
          <>
            <Button
              id={`eEditSeason`}
              onClick={(e) => {
                setShowDrawerNewMessageAlert(true);
                setMessageAlertId(b?.id);
              }}
              style={{border: 'none', boxShadow: 'none'}}>
              <img
                className="img-h anticon"
                src={'/images/edit.svg'}
                alt="" width="18px"
                height="18px"
              />
            </Button>
          </>
        );
      }
    },
  ];

  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Message Alert</span>
            </div>
          }
          rightBar={[
            <Button id="eNew" className="btn-green" onClick={() => {
              if(setShowDrawerNewMessageAlert) {
                setShowDrawerNewMessageAlert(true);
              }
            }} style={{ width: "190px"}}>
              <PlusOutlined/> NEW MESSAGE ALERT
            </Button>,
          ]}
        />
        <InfiniteTable
          url={API.MESSAGE_ALERT.LIST()}
          fetchType="GET"
          columns={columns}
          componentName={''}
          filters={EMPTY_ARRAY}
          filterName={MESSAGE_ALERT}
          columnEditName={TABLE_EDIT_NAME.MESSAGE_ALERT}
          defaultFiltersObject={{
            sort: {
              params: ['title', 'asc'],
            },
            page: {
              params: ['0']
            },
            size: {
              params: [50]
            },
          }}
          paged
       />
      </div>
    </Layout>
  );
};
