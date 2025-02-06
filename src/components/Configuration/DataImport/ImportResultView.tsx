import React from 'react';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { Badge, Button, DatePicker, Form, Input, Select } from 'antd';
import { LogHistory } from '../../../store/types/importData';
import moment from 'moment';
import {
  ACCOUNT_ROLES,
  dateFormat,
  dateFormatTable,
  DESCEND,
  EQUIPMENT_TYPES,
  EXPORT_FILES,
  FILTERS,
  IMPORT_STATUS,
  IMPORT_TYPES,
  MASTER_DATA,
  pageSize,
  TABLE_EDIT_NAME,
} from '../../../constants/constants';
import { downloadCsv, statusImportColor } from '../../../helpers/Utils';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { useFilterParams } from '../../../hook/customHooks/customHooks';
import { useAccountState } from '../../../hook/hooks/account';

enum ImportResultColumns {
  date = 'date',
  fileName = 'fileName',
  type = 'type',
  ip = 'ip',
  message = 'message',
  userName = 'userName'
}

export const ImportResultView = () => {

  const {account} = useAccountState();
  
  const { filter: importResultFilter, addFilter } = useFilterParams(FILTERS.IMPORT_RESULT);
  const isZebraAdmin = account.role.name === ACCOUNT_ROLES.ZEBRA_ADMIN;
  const isOEM = account.role.name === ACCOUNT_ROLES.OEM_ADMIN || account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  
  const { equipmentTypeDTOList } = account;
  const hasShoulderPad = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '2');
  const hasHelmet = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '1');
  
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'checkDetails',
      dataIndex: 'checkDetails',
      fixed: 'left',
      nonErasable: true,
      align: 'right',
      render: (a: any, b: LogHistory) => {
        return (
          <>
            <Button
              id="eEdit" onClick={() => {
              history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANAGEMENT_DATA_IMPORT, b.id));
            }} style={{border: 'none', boxShadow: 'none'}}
            >
              <img
                className="img-h anticon"
                src={'/images/eye-icon.svg'}
                alt="" width="18px"
                height="18px"
              />
            </Button>
          </>
        );
      },
    },
    {
      title: `${(importResultFilter?.isImported?.params[0] === 'false' ? 'Export' : 'Import')} Date`,
      dataIndex: 'date',
      key: ImportResultColumns.date,
      sorter: true,
      defaultSortOrder: DESCEND,
      render: (a: any, b: LogHistory) => {
        return moment(new Date(b.date)).local().format(dateFormatTable);
      }
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      sorter: true,
      key: ImportResultColumns.fileName,
      render: (a: any, b: LogHistory) => {
        return <span
          onClick={() => downloadCsv(b.fileName, API.IMPORT.GET_CSV(b.id), 'GET')}
          style={{cursor: 'pointer', color: '#1DAB35', textDecoration: 'underline'}}> {a} </span>;
      }
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      sorter: true,
      key: ImportResultColumns.userName,
    },
    {
      title: `${(importResultFilter?.isImported?.params[0] === 'false' ? 'Export' : 'Import')} Type`,
      dataIndex: 'type',
      sorter: true,
      key: ImportResultColumns.type,
      render: (typeEquipmentType: string) => {
        let typeEquip: string = typeEquipmentType;
        if (typeEquipmentType === MASTER_DATA.SHOULDER.toUpperCase()) {
          typeEquip = EQUIPMENT_TYPES.SHOULDER_PAD;
        }
        if (typeEquipmentType === EXPORT_FILES.MASTER_FTP.toUpperCase()) {
          typeEquip = EXPORT_FILES.MASTER_FTP_EXPORT;
        }
        if (typeEquipmentType === EXPORT_FILES.SCAN_FTP.toUpperCase()) {
          typeEquip = EXPORT_FILES.SCAN_FTP_EXPORT;
        }
        if (typeEquipmentType === EXPORT_FILES.CLUB_INVENTORY_ENUM.toUpperCase()) {
          typeEquip = EXPORT_FILES.CLUB_INVENTORY;
        }
        if (typeEquipmentType === EXPORT_FILES.CLUB_TAG_INVENTORY_ENUM.toUpperCase()) {
          typeEquip = EXPORT_FILES.CLUB_TAG_INVENTORY;
        }
        if (typeEquipmentType === EXPORT_FILES.OEM_SHOULDER_PADS_ENUM.toUpperCase()) {
          typeEquip = EXPORT_FILES.OEM_SHOULDER_PADS;
        }
        return <p className="capital-letter">{typeEquip.toLowerCase()}</p>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'message',
      sorter: true,
      key: ImportResultColumns.message,
      render: (a: any, b: any) => {
        return <Badge
          color={statusImportColor(a)}
          text={a}
        />;
      },
    },
  ];

  const isExport = importResultFilter?.isImported?.params[0] === 'false' ? 'Export' : 'Import';
  
  const filters: Array<{ query: string, display: JSX.Element }> = [
    {
      query: 'search',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            defaultValue={importResultFilter?.keyword?.params[0] ? importResultFilter?.keyword?.params[0] : undefined}
            placeholder="Search..."
            style={{width: '100%'}}
            size="small"
            onSearch={(e) => {
              addFilter({
                keyword: {
                  params: [e]
                }
              });
            }}
          />
        </Form.Item>
      )
    },
    {
      query: 'isImported',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Import/Export Data</label>
          <Select
            className="filters-selector"
            defaultValue={'Import'}
            value={importResultFilter?.isImported?.params[0] ? isExport : undefined}
            style={{width: '100%', minWidth: '150px'}}
            size="small"
            onChange={(value: string) => {
              addFilter({
                isImported: {
                  params: [value === 'Export' ? 'false' : 'true']
                }
              });
            }}
          >
            <Select.OptGroup label={IMPORT_TYPES.EXPORT_IMPORT}>
              <Select.Option value="Import"> Import </Select.Option>
              {!isOEM && <Select.Option value="Export"> Export </Select.Option>}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'type',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Type</label>
          <Select
            className="filters-selector"
            value={importResultFilter?.type?.params[0] ? importResultFilter?.type?.params[0] : ''}
            style={{width: '100%', minWidth: '200px'}}
            showSearch
            size="small"
            onChange={(value: string) => {
              addFilter({
                type: {
                  params: [value.toUpperCase()]
                }
              });
            }}
          >
             <Select.Option value="" title="All"> All </Select.Option>
            {!isOEM && <Select.OptGroup label={IMPORT_TYPES.SITE_CONFIG}>
              {/*<Select.Option value="" title="All"> All </Select.Option>*/}
             {/*<Select.Option value={MASTER_DATA.DEVICE.toUpperCase()}
                            title={MASTER_DATA.DEVICE}> {MASTER_DATA.DEVICE}</Select.Option>
              <Select.Option value={MASTER_DATA.SITE.toUpperCase()}
                            title={MASTER_DATA.SITE}> {MASTER_DATA.SITE}</Select.Option>
              <Select.Option value={MASTER_DATA.ZONES.toUpperCase()}
                            title={MASTER_DATA.ZONES}> {MASTER_DATA.ZONES}</Select.Option>*/}
              <Select.Option value={MASTER_DATA.CLEAT.toUpperCase()}
                            title={EQUIPMENT_TYPES.CLEAT}> {EQUIPMENT_TYPES.CLEAT}</Select.Option>
              <Select.Option value={MASTER_DATA.SHOULDER.toUpperCase()}
                            title={EQUIPMENT_TYPES.SHOULDER_PAD}> {EQUIPMENT_TYPES.SHOULDER_PAD} </Select.Option>
              <Select.Option value={MASTER_DATA.HELMET.toUpperCase()}
                            title={EQUIPMENT_TYPES.HELMET}> {EQUIPMENT_TYPES.HELMET}</Select.Option>
              <Select.Option value={EXPORT_FILES.MASTER_FTP.toUpperCase()}
                            title={EXPORT_FILES.MASTER_FTP_EXPORT}> {EXPORT_FILES.MASTER_FTP_EXPORT}</Select.Option>
              <Select.Option value={EXPORT_FILES.SCAN_FTP.toUpperCase()}
                            title={EXPORT_FILES.SCAN_FTP_EXPORT}> {EXPORT_FILES.SCAN_FTP_EXPORT}</Select.Option>
              <Select.Option value={EXPORT_FILES.CLUB_INVENTORY_ENUM.toUpperCase()}
                            title={EXPORT_FILES.CLUB_INVENTORY}> {EXPORT_FILES.CLUB_INVENTORY}</Select.Option>
              <Select.Option value={EXPORT_FILES.CLUB_TAG_INVENTORY_ENUM.toUpperCase()}
                            title={EXPORT_FILES.CLUB_TAG_INVENTORY}> {EXPORT_FILES.CLUB_TAG_INVENTORY}</Select.Option>
            </Select.OptGroup>}
            <Select.OptGroup label={IMPORT_TYPES.OEM_EQUIPMENT_TYPE}>
              {(hasShoulderPad || isZebraAdmin) && <Select.Option value={MASTER_DATA.OEM_SHOULDER}> {EQUIPMENT_TYPES.SHOULDER_PAD} </Select.Option>}
              {(hasHelmet || isZebraAdmin) && <Select.Option value={MASTER_DATA.OEM_HELMET}> {EQUIPMENT_TYPES.HELMET} </Select.Option>}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      ),
    },
    {
      query: 'status',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Status</label>
          <Select
            className="filters-selector"
            value={importResultFilter?.logs?.params[0] ? importResultFilter?.logs?.params[0] : ''}
            style={{ minWidth: '120px'}}
            showSearch
            size="small"
            onChange={(value: string
            ) => {
              addFilter({
                logs: {
                  params: [value]
                }
              });
            }}
          >
            <Select.Option value="" title="All"> All </Select.Option>
            <Select.Option value={IMPORT_STATUS.SUCCESS}
                          title={IMPORT_STATUS.SUCCESS}> {IMPORT_STATUS.SUCCESS}</Select.Option>
            <Select.Option value={IMPORT_STATUS.WARNING}
                          title={IMPORT_STATUS.WARNING}> {IMPORT_STATUS.WARNING}</Select.Option>
            <Select.Option value={IMPORT_STATUS.ERROR} title={IMPORT_STATUS.ERROR}> {IMPORT_STATUS.ERROR}</Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'date',
      display: (
        <Form.Item className='select-label-up'>
          <DatePicker
            value={importResultFilter?.date?.params[0] ? moment(importResultFilter?.date?.params[0]) : undefined}
            style={{width: '100%'}}
            size="small"
            onChange={(date: moment.Moment | null, dateString: string) => {
              addFilter({
                date: {
                  params: [date?.format(dateFormat)]
                }
              });
            }}
          />
        </Form.Item>
      )
    },
  ];
  
  const importDefaultFiltersObject: Object = {
    sort: {
      params: [ImportResultColumns.date, 'desc']
    },
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    }
  };
  
  return (
    <InfiniteTable
      url={API.IMPORT.LOGS()}
      fetchType="GET"
      columns={columns}
      filterName={FILTERS.IMPORT_RESULT}
      columnEditName={TABLE_EDIT_NAME.IMPORT_DATA_COLUMN}
      filters={filters}
      defaultFiltersObject={importDefaultFiltersObject}
      paged={true}
      // height="calc(100Vh - 295px)"
      height="calc(100Vh - 295px)"
      noDataClassName="no-data-import"
    />
  );
};
