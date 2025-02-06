import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Tag, Tooltip } from 'antd';
import { Layout } from 'antd/es';
import {
  dateFormat,
  dateFormatTable,
  datePickerFormat,
  pageSize,
  TABLE_EDIT_NAME,
  TAG_TREE_TEAM,
  TAGS_FILTER,
  TAGS_LIST
} from '../../../constants/constants';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { API } from '../../../settings/server.config';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useAccountState } from '../../../hook/hooks/account';
import moment from 'moment';
import { asciiToHex, hexToAscii } from '../../../helpers/ConvertUtils';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { dateToString, generateEquipmentTypeName } from '../../../helpers/Utils';
import { Select } from '../../Shared/Select/Select';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { TeamsSelector } from '../../Shared/TreeSelectors/TeamsSelector';

export const TagsConfiguration = () => {
  const { bodyFilter: tagBodyParams,  addBodyFilter } = useBodyFilterParams(TAGS_FILTER);
  const [keyword, setKeyword] = useState<string>('');
  const {equipmentTypeList} = useEquipmentTypeState();
  const {account} = useAccountState();
  const {teamList} = account;
  
  useEffect(() => {
    if (!!tagBodyParams) {
      setKeyword(tagBodyParams?.keyword ? tagBodyParams?.keyword : '');
    }
  }, [tagBodyParams, tagBodyParams?.keyword]);
  const bodyFilter = {
    teamIds: teamList.map(team => team.teamId),
    date: '',
    equipmentTypeId: '',
    tagStatus: 'ALL',
    keyword: '',
    tag: ''
  };
  
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'viewTag',
      dataIndex: 'viewTag',
      nonErasable: true,
      fixed: 'left',
      width: 1,
      align: 'right',
      render: (a: any, b: any) => {
        return (
          <>
            <Tooltip title={'View'}>
              <Button id="tagConfigView" onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.TAGS, b.tag));
              }} style={{border: 'none', boxShadow: 'none'}}>
                <img
                  className="img-h anticon"
                  src={'/images/eye-icon.svg'}
                  alt="" width="18px"
                  height="18px"
                />
              </Button>
            </Tooltip>
          </>
        );
      }
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      width: 20,
      sorter: true,
      render: (tag: string) => {
        return hexToAscii(tag);
      },
      show: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 20,
      render: (a: any, b: any) => {
        return (
          <>
            <div className="auth-request">
              {!b.endDate ? <Tag className="role-tag" color="green"> Assigned </Tag> :
                <Tag className="role-tag"> Unassigned </Tag>}
            </div>
          </>
        );
      }
    },
    {
      title: 'Equipment Type',
      dataIndex: 'equipmentTypeName',
      key: 'equipment.equipment_type_id',
      width: 20,
      sorter: true,
      show: true
    },
    {
      title: 'Equipment Code',
      dataIndex: 'equipmentCode',
      key: 'equipment.equipment_code',
      width: 10,
      sorter: true,
      show: true
    },
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'team.full_name',
      width: 20,
      sorter: true,
      show: true
    },
    {
      title: 'Player Name',
      dataIndex: 'playerName',
      key: 'player.first_name',
      width: 20,
      sorter: true,
      show: true
    },
    {
      title: 'Assigned By',
      dataIndex: 'createBy',
      key: 'create_by',
      width: 20,
      sorter: true,
      show: true
    },
    {
      title: 'Unassigned By',
      dataIndex: 'modifiedBy',
      key: 'modified_by',
      width: 20,
      sorter: true,
      show: true,
      render: (a: any, b: any) => {
        return (
          <>
            <div className="auth-request">
              {b.modifiedBy ? b.modifiedBy : ''}
            </div>
          </>
        );
      }
    },
    {
      title: 'Since',
      dataIndex: 'startDate',
      key: 'start_date',
      width: 20,
      sorter: true,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      },
      show: true
    },
    {
      title: 'Until',
      dataIndex: 'endDate',
      key: 'end_date',
      width: 20,
      sorter: true,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      },
      show: true
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
      width: 20,
      sorter: true,
      render: (x: string) => {
        if (!!x && x !== '0.0') {
          return x;
        }
        return '';
      },
      show: false
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
      width: 20,
      sorter: true,
      render: (y: string) => {
        if (!!y && y !== '0.0') {
          return y;
        }
        return '';
      },
      show: false
    },
    {
      title: 'Last Blink Date',
      dataIndex: 'lastBlinkDate',
      key: 'last_blink_date',
      width: 20,
      sorter: true,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      },
      show: true
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
                tag: asciiToHex(e.toUpperCase())
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
          name={TAG_TREE_TEAM}
          onChange={(teams => {
            addBodyFilter({
              teamIds: teams,
            })
          })}
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
            value={tagBodyParams['equipmentTypeId'] ? tagBodyParams['equipmentTypeId'] : (equipmentTypeList[5]?.id || '')}
            options={equipmentTypeList.map(eqType => ({
              display: generateEquipmentTypeName(eqType.nameEquipmentType),
              value: eqType.id
            }))}
          />
        </Form.Item>
      )
    },
    {
      query: 'Status',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Status</label>
          <Select
            className="filters-selector"
            id="cStatusInput"
            size={'small'}
            style={{width: '100%', minWidth: '160px'}}
            onChange={(value) => {
              addBodyFilter({
                tagStatus: value
              });
            }}
            value={tagBodyParams['tagStatus']}
            options={[
              { display: 'All',  value: 'ALL' },
              { display: 'Active',  value: 'ACTIVE' },
              { display: 'Unassigned',  value: 'UNASSIGNED'}
            ]}
          />
        </Form.Item>
      )
    },
    {
      query: 'Date',
      display: (
        <Form.Item className='select-label-up'>
          <DatePicker
            size="small"
            id="cTagDate"
            format={datePickerFormat}
            style={{width: '100%', minWidth: '160px'}}
            value={tagBodyParams?.date ? moment(tagBodyParams?.date) : undefined}
            onChange={(date: moment.Moment | null, dateString: string) => {
              addBodyFilter({
                date: date?.format(dateFormat)
              });
            }}
          />
        </Form.Item>
      )
    },
  ];
  
  const tagDefaultFiltersObject: Object = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    sort: {
      params: ['start_date', 'desc']
    }
  };
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{TAGS_LIST}</span>
            </div>
          }
        />
        <InfiniteTable
          url={API.TAG.LIST_TAG()}
          fetchType="POST"
          columns={columns}
          // componentName={''}
          bodyFilters={bodyFilter}
          filterName={TAGS_FILTER}
          defaultFiltersObject={tagDefaultFiltersObject}
          filters={tagFilters}
          columnEditName={TABLE_EDIT_NAME.TAGS_COLUMNS}
          paged={true}
        />
      </div>
    </Layout>
  );
};
