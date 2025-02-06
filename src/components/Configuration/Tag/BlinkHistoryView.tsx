import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Switch } from 'antd';
import { Layout } from 'antd/es';
import { 
  BLINKS_HISTORY_FILTER, 
  dateFormatTableSec, 
  pageSize, 
  RAW_BLINKS_HISTORY, 
  TAG_BLINK_HISTORY_TREE_SITE, 
  worldDateFormat } from '../../../constants/constants';
import { hexToAscii } from '../../../helpers/ConvertUtils';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { API } from '../../../settings/server.config';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { SitesSelector } from '../../Shared/TreeSelectors/SitesSelector';
import moment from 'moment';
import { RangePicker } from '../../Shared/DatePicker/RangePicker';
import { useAccountState } from '../../../hook/hooks/account';

export const TagBlinkHistoryConfiguration = () => {
  const { bodyFilter: tagBlinkHistoryBodyParams,  addBodyFilter } = useBodyFilterParams(BLINKS_HISTORY_FILTER);
  const [keyword, setKeyword] = useState<string>('');
  const { account } = useAccountState();
  const { siteLocationList } = account;
  const [reset, setReset] = useState<number>(0);
  const [enableBlinkFetch, setEnableBlinkFetch] = useState<boolean>(false);
  
  useEffect(() => {
    if (!!tagBlinkHistoryBodyParams) {
      setKeyword(tagBlinkHistoryBodyParams?.keyword ? tagBlinkHistoryBodyParams?.keyword : '');
    }
  }, [tagBlinkHistoryBodyParams, tagBlinkHistoryBodyParams?.keyword]);

  useEffect(() => {
    if (tagBlinkHistoryBodyParams?.siteNames?.length === 0 && siteLocationList?.length > 0 && reset === 0) {
      addBodyFilter({
        siteNames: siteLocationList.map(site => site.name),
        zoneNames: siteLocationList.map(site => site.zoneName).flat(),
      });
      setReset(prevState => prevState - 1);
    }
  }, [addBodyFilter, setReset, siteLocationList, reset, tagBlinkHistoryBodyParams]);

  const bodyFilter = {
    allTags: false,
    endDate: moment().endOf("day").format(worldDateFormat),
    keyword: '',
    startDate: moment().startOf("day").format(worldDateFormat),
    siteNames: siteLocationList.map(site => site.name),
    zoneNames: siteLocationList.map(site => site.zoneName).flat(),
  };
  
  const columns: Array<Columns> = [
    {
      title: 'Tag (ASCII)',
      dataIndex: 'tags',
      key: 'tags',
      width: 10,
      render: (tag: string) => {
        return hexToAscii(tag);
      },
      show: true,
      sorter: true,
    },
    {
      title: 'Tag (HEX)',
      dataIndex: 'tags',
      key: 'tags-ascii',
      width: 10,
      show: true,
    },
    {
      title: 'Site',
      dataIndex: 'siteName',
      key: 'sitename',
      sorter: true,
      width: 30,
      show: true
    },
    {
      title: 'Zone',
      dataIndex: 'zoneName',
      key: 'zonename',
      width: 30,
      show: true,
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 30,
      show: true,
      sorter: true,
      defaultSortOrder: 'date',
      render: (date: string) => {
        return date ? moment.utc(date).local().format(dateFormatTableSec) : '';
      }
    },
    
  ];
  const tagFilters: Array<any> = [
    {
      query: 'Search',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cEMInputSearch"
            placeholder="Search..."
            style={{width: '100%', minWidth: '160px'}}
            onChange={e => {
              setKeyword(e.target.value);
              addBodyFilter({
                keyword: e.target.value,
              });
              setEnableBlinkFetch(false);
            }}
            onSearch={e => {
              setEnableBlinkFetch(true);
              addBodyFilter({
                keyword: e,
              });
            }}
            value={keyword}
            size={'small'}
          />
        </Form.Item>
      )
    },
    {
      query: 'Site',
      display: (
        <SitesSelector 
          name={TAG_BLINK_HISTORY_TREE_SITE}
          onApply={(dataPerLevel) => {
            setEnableBlinkFetch(false);
            addBodyFilter({
              siteNames: Array.from(dataPerLevel[0]),
              zoneNames: Array.from(dataPerLevel[1]),
            });
          }}
        />
      )
    },
    {
      query: 'RangeDate',
      display: (
          <RangePicker 
            value={[moment(tagBlinkHistoryBodyParams?.startDate), moment(tagBlinkHistoryBodyParams?.endDate)]}
            validDates={{
              endDate: (startDate, endDate) => {
                return endDate.diff(startDate, 'days') <= 1;
              }
            }}
            onOk={([startDate, endDate]) => {
              setEnableBlinkFetch(false);
              addBodyFilter({
                endDate: endDate.format(worldDateFormat),
                startDate: startDate.format(worldDateFormat),
              })
            }}
          />
        
      )
    },
    {
      query: 'switchAllBlinks',
      display: <Form.Item className="select-label-up" style={{ width: '120px' }}>
        <label className="label-switch"> Show All Blinks </label>
        <Switch
          checked={tagBlinkHistoryBodyParams?.allTags}
          className="filters-switch" 
          onChange={e => {
            setEnableBlinkFetch(false);
          addBodyFilter({
            allTags: e,
          });
        }}/>
      </Form.Item>
    },
    {
      query: 'search',
      display: <Form.Item className="select-label-up" style={{ width: '120px' }}>
        <Button size="small" className="btn-green" onClick={() => {
          setEnableBlinkFetch(true);
        }}>
          SEARCH
        </Button>
      </Form.Item>
    },
  ];
  
  const tagHistoryDefaultFiltersObject: Object = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    sort: {
      params: ['date', 'desc']
    }
  };
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{RAW_BLINKS_HISTORY}</span>
            </div>
          }
        />
        <InfiniteTable
          url={API.TAG.BLINKS_HISTORY()}
          fetchType="POST"
          columns={columns}
          // componentName={''}
          bodyFilters={bodyFilter}
          filterName={BLINKS_HISTORY_FILTER}
          defaultFiltersObject={tagHistoryDefaultFiltersObject}
          filters={tagFilters}
          columnEditName={'' /*TABLE_EDIT_NAME.TAGS_COLUMNS*/}
          paged={true}
          enableFetch={enableBlinkFetch}
        />
      </div>
    </Layout>
  );
}