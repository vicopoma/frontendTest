import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { Layout } from 'antd/es';
import { dateFormatTableSec, pageSize, TAGS_SCANS_HISTORY, TAG_HISTORY_TREE_SITE, TAG_HISTORY_TREE_TEAM, TAG_SCANS_HISTORY_FILTER, worldDateFormat } from '../../../constants/constants';
import { hexToAscii } from '../../../helpers/ConvertUtils';
import { generateEquipmentTypeName } from '../../../helpers/Utils';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { useAccountState } from '../../../hook/hooks/account';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { API } from '../../../settings/server.config';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { Select } from '../../Shared/Select/Select';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { SitesSelector } from '../../Shared/TreeSelectors/SitesSelector';
import { TeamsSelector } from '../../Shared/TreeSelectors/TeamsSelector';
import moment from 'moment';
import { RangePicker } from '../../Shared/DatePicker/RangePicker';

export const TagHistoryConfiguration = () => {
  const { bodyFilter: tagHistoryBodyParams,  addBodyFilter } = useBodyFilterParams(TAG_SCANS_HISTORY_FILTER);
  const [keyword, setKeyword] = useState<string>('');
  const {equipmentTypeList} = useEquipmentTypeState();
  const {account} = useAccountState();
  const { teamList, siteLocationList } = account;
  const [reset, setReset] = useState<number>(0);
  
  useEffect(() => {
    if (!!tagHistoryBodyParams) {
      setKeyword(tagHistoryBodyParams?.keyword ? tagHistoryBodyParams?.keyword : '');
    }
  }, [tagHistoryBodyParams, tagHistoryBodyParams?.keyword]);

  useEffect(() => {
    if (tagHistoryBodyParams?.siteNames?.length === 0 && siteLocationList?.length > 0 && reset === 0) {
      addBodyFilter({
        siteNames: siteLocationList.map(site => site.name),
        zoneNames: siteLocationList.map(site => site.zoneName).flat(),
      });
      setReset(prevState => prevState - 1);
    }
  }, [addBodyFilter, setReset, siteLocationList, reset, tagHistoryBodyParams]);

  const bodyFilter = {
    equipmentTypeId: '',
    endDate: moment().endOf("day").format(worldDateFormat),
    keyword: '',
    startDate: moment().startOf("day").format(worldDateFormat),
    teamIds: teamList.map(team => team.teamId),
    siteNames: siteLocationList.map(site => site.name),
    zoneNames: siteLocationList.map(site => site.zoneName).flat(),
  };
  
  const columns: Array<Columns> = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      defaultSortOrder: 'tag',
      key: 'tag',
      width: 20,
      sorter: true,
      render: (tag: string) => {
        return hexToAscii(tag);
      },
      show: true
    },
    {
      title: 'Site',
      dataIndex: 'siteName',
      key: 'site_name',
      sorter: true,
      width: 20,
      show: true
    },
    {
      title: 'Zone',
      dataIndex: 'zoneName',
      key: 'zone_name',
      width: 20,
      show: true,
      sorter: true,
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team_id',
      width: 20,
      show: true
    },
    {
      title: 'Equipment Type',
      dataIndex: 'equipmentType',
      key: 'equipment_type_id',
      width: 20,
      show: true
    },
    {
      title: 'Equipment Code',
      dataIndex: 'equipmentCode',
      key: 'e.equipment_code',
      width: 10,
      show: true
    },
    {
      title: 'Activity Type',
      dataIndex: 'type',
      key: 'team.full_name',
      width: 20,
      show: true
    },
    {
      title: 'Last Scan Date',
      dataIndex: 'updatedDate',
      key: 'team.updated_date',
      width: 20,
      show: true,
      render: (date: string) => {
        return date ? moment(date).local().format(dateFormatTableSec) : '';
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
            }}
            onSearch={e => {
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
      query: 'Team',
      display: (
        <TeamsSelector 
          name={TAG_HISTORY_TREE_TEAM}
          onChange={(teams => {
            addBodyFilter({
              teamIds: teams,
            });
          })}
        />
      )
    },
    {
      query: 'Site',
      display: (
        <SitesSelector 
          name={TAG_HISTORY_TREE_SITE}
          onApply={(dataPerLevel) => {
            addBodyFilter({
              siteNames: Array.from(dataPerLevel[0]),
              zoneNames: Array.from(dataPerLevel[1]),
            });
          }}
        />
      )
    },
    {
      query: 'Equipment Type',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Equipment Type</label>
          <Select
            className="filters-selector"
            validateValue
            selectAllValue=""
            id="cEquipmentTypeInput"
            size={'small'}
            style={{width: '100%', minWidth: '160px'}}
            onChange={(value) => {
              addBodyFilter({
                equipmentTypeId: value,
              });
            }}
            value={tagHistoryBodyParams['equipmentTypeId'] ? tagHistoryBodyParams['equipmentTypeId'] : (equipmentTypeList[5]?.id || '')}
            options={equipmentTypeList.map(eqType => ({
              display: generateEquipmentTypeName(eqType.nameEquipmentType),
              value: eqType.id
            }))}
          />
        </Form.Item>
      )
    },
    {
      query: 'RangeDate',
      display: (
        
          <RangePicker 
            value={[moment(tagHistoryBodyParams?.startDate), moment(tagHistoryBodyParams?.endDate)]}
            validDates={{
              endDate: (startDate, endDate) => {
                return endDate.diff(startDate, 'weeks') === 0;
              }
            }}
            onOk={([startDate, endDate]) => {
              addBodyFilter({
                endDate: endDate.format(worldDateFormat),
                startDate: startDate.format(worldDateFormat),
              })
            }}
          />
        
      )
    },
  ];
  
  const tagHistoryDefaultFiltersObject: Object = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    /*sort: {
      params: ['start_date', 'desc']
    }*/
  };
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{TAGS_SCANS_HISTORY}</span>
            </div>
          }
        />
        <InfiniteTable
          url={API.TAG.SCANS_HISTORY()}
          fetchType="POST"
          columns={columns}
          // componentName={''}
          bodyFilters={bodyFilter}
          filterName={TAG_SCANS_HISTORY_FILTER}
          defaultFiltersObject={tagHistoryDefaultFiltersObject}
          filters={tagFilters}
          columnEditName={'' /*TABLE_EDIT_NAME.TAGS_COLUMNS*/}
          paged={true}
        />
      </div>
    </Layout>
  );
}