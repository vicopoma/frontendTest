import React from 'react';
import { Button, Input, Layout, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { API } from '../../../settings/server.config';
import { useFilterParams } from '../../../hook/customHooks/customHooks';
import { ASCEND, DATE_FORMATS, SEASON, TABLE_EDIT_NAME } from '../../../constants/constants';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import moment from 'moment';

export const Season = ({ setShowDrawerNewSeason, setSeasonId } : { setShowDrawerNewSeason: any, setSeasonId: any}) => {
  const { addFilter } = useFilterParams(SEASON);

  const columns: Array<Columns> = [
    {
      title: 'Season',
      dataIndex: 'season',
      defaultSortOrder: ASCEND,
      key: 'season',
      sorter: true
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
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (status: boolean) => status ? <Tag color="green">Active</Tag> : <Tag color="red">InActive</Tag>
    },
    {
      title: 'Created By',
      dataIndex: 'createBy',
      key: 'createBy',
      sorter: true,
    },
    {
      title: '',
      key: 'edit',
      dataIndex: 'size',
      align: 'right',
      show: true,
      render: (a: any, b: any) => {
        return (
          <>
            <Button
              id={`eEditSeason`}
              onClick={(e) => {
                setShowDrawerNewSeason(true);
                setSeasonId(b?.id);
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

  const seasonFilters: Array<any> = [
    {
      query: 'keyword',
      display: (
        <Input.Search
          id="inputSiteFilterInput"
          style={{width: '100%'}}
          size="small"
          onSearch={(value => {
            addFilter({
              keyword: {
                params: [value]
              }
            });
          })}
          defaultValue={undefined}
          placeholder="Search..."
        />
      )
    },
  ];

  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Season List</span>
            </div>
          }
          rightBar={[
            <Button id="eNew" className="btn-green" onClick={() => {
              if(setShowDrawerNewSeason) {
                setShowDrawerNewSeason(true);
              }
            }} style={{ width: "150px"}}>
              <PlusOutlined/> NEW SEASON
            </Button>,
          ]}
        />
        <InfiniteTable
          url={API.SEASON.LIST()}
          fetchType="GET"
          columns={columns}
          componentName={''}
          filters={seasonFilters}
          filterName={SEASON}
          columnEditName={TABLE_EDIT_NAME.SEASON}
          defaultFiltersObject={{
            sort: {
              params: ['season', 'asc'],
            },
            page: {
              params: ['0']
            },
            size: {
              params: [50]
            },
          }}
       />
      </div>
    </Layout>
  );
};
