import React, { useEffect } from 'react';
import { Button, Form, Input, Tooltip, Layout } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';

import { PartTypeState } from '../../../store/types/partType';
import {
  ACCOUNT_ROLES,
  ASCEND,
  LIST_PART_TYPE,
  NEW,
  pageSize,
  PART_TYPE_FILTER,
  TABLE_EDIT_NAME
} from '../../../constants/constants';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useAccountState } from '../../../hook/hooks/account';
import { generateEquipmentTypeName, roleCanModify } from '../../../helpers/Utils';
import { useManufacturerDispatch, useManufacturerState } from '../../../hook/hooks/manufacturer';
import { useEquipmentDispatch, useEquipmentState } from '../../../hook/hooks/equipment';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { Select } from '../../Shared/Select/Select';
import { useFilterParams } from '../../../hook/customHooks/customHooks';

enum partTypeColumns {
  nameEquipmentType = 'equipmentType.nameEquipmentType',
  nameManufacturer = 'equipmentModel.manufacturer.nameManufacturer',
  nameEquipmentModel = 'equipmentModel.nameModel',
  namePartType = 'namePartType'
}

export const PartType = () => {
  
  const {getManufacturerByEquipmentType, replaceManufacturerList} = useManufacturerDispatch();
  const {manufacturerList} = useManufacturerState();
  const {equipmentModelVMs} = useEquipmentState();
  const {getEquipmentModelByEquipmentTypeIdManufacturerType, replaceEquipmentModelList} = useEquipmentDispatch();
  
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const { filter: partTypeFilter, addFilter } = useFilterParams(PART_TYPE_FILTER);
  
  const {account} = useAccountState();
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  useEffect(() => {
    if (partTypeFilter['equipmentTypeId']) {
      getManufacturerByEquipmentType(partTypeFilter['equipmentTypeId'].params[0]);
      if (partTypeFilter['manufacturerId']) {
        getEquipmentModelByEquipmentTypeIdManufacturerType(partTypeFilter['equipmentTypeId']?.params[0], partTypeFilter['manufacturerId'].params[0]);
      } else {
        replaceEquipmentModelList([]);
      }
    } else {
      replaceManufacturerList([]);
      replaceEquipmentModelList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'editPartType',
      dataIndex: 'editPartType',
      nonErasable: true,
      fixed: 'left',
      width: 1,
      align: 'right',
      render: (a: any, b: PartTypeState) => {
        return (
          <>
            <Tooltip title="Edit">
              <Button id="cPTEditView" onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART_TYPE, b.id));
              }} style={{border: 'none', boxShadow: 'none'}}>
                <img
                  className="img-h anticon"
                  src={!canModify ? '/images/eye-icon.svg' : '/images/edit.svg'}
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
      title: 'Equipment Type',
      dataIndex: 'nameEquipmentType',
      key: partTypeColumns.nameEquipmentType,
      width: 15,
      sorter: true,
    },
    
    {
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: partTypeColumns.nameManufacturer,
      width: 15,
      sorter: true,
    },
    {
      title: 'Equipment Model',
      dataIndex: 'nameEquipmentModel',
      key: partTypeColumns.nameEquipmentModel,
      width: 15,
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'namePartType',
      key: partTypeColumns.namePartType,
      width: 15,
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 30,
    },
  ];
  
  const partDefaultFiltersObject: Object = {
    sort: {
      params: ['namePartType', 'asc']
    },
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    }
  };
  
  const partOptionsBar: Array<any> = [
    canModify ? <Button id="cPTNew" size="small" className="btn-green" onClick={() => {
      history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART_TYPE, NEW));
    }}>
      NEW <PlusOutlined/>
    </Button> : <div/>
  ];
  
  const partFilters: Array<any> = [
    {
      query: 'keyword',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cPTInputSearch"
            style={{width: '100%'}}
            defaultValue={partTypeFilter['keyword'] ? partTypeFilter['keyword'].params[0] : undefined}
            placeholder="Search..."
            onSearch={e => {
              addFilter({
                keyword: {
                  params: [e]
                }
              });
            }}
            size={'small'}
          />
        </Form.Item>
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
            id="cPTEquipmentType"
            style={{width: '100%', minWidth: '150px'}}
            size={'small'}
            showSearch
            value={partTypeFilter['equipmentTypeId']?.params[0] ? partTypeFilter['equipmentTypeId'].params[0] : (equipmentTypeList[5]?.id || '')}
            onChange={(value) => {
              addFilter({
                equipmentTypeId: {
                  params: [value]
                },
                manufacturerId: {
                  params: []
                },
                equipmentModelId: {
                  params: []
                }
              });
              if (!!value) {
                getManufacturerByEquipmentType(value + '');
              } else {
                replaceManufacturerList([]);
              }
              replaceEquipmentModelList([]);
            }}
            options={equipmentTypeList.map(eqType => ({ display: generateEquipmentTypeName(eqType.nameEquipmentType), value: eqType.id}))}
          />
        </Form.Item>
      )
    },
    {
      query: 'Manufacturer',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'> Manufacturers</label>
          <Select
            className="filters-selector"
            validateValue
            selectAllValue=""
            id="cPTManufacturers"
            style={{width: '100%', minWidth: '140px'}}
            size={'small'}
            showSearch
            value={partTypeFilter['manufacturerId']?.params[0] ? partTypeFilter['manufacturerId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                manufacturerId: {
                  params: [value]
                },
                equipmentModelId: {
                  params: []
                }
              });
              if (!!value) {
                getEquipmentModelByEquipmentTypeIdManufacturerType(partTypeFilter['equipmentTypeId']?.params[0], value);
              } else {
                replaceEquipmentModelList([]);
              }
            }}
            options={manufacturerList.map(manufacturer => ({display: manufacturer.nameManufacturer, value: manufacturer.id}))}
          />
        </Form.Item>
      )
    },
    {
      query: 'EquipmentModel',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Equipment Model</label>
          <Select
            className="filters-selector"
            validateValue
            selectAllValue=""
            id="cPTEquipmentModel"
            style={{width: '100%', minWidth: '260px'}}
            size={'small'}
            showSearch
            value={partTypeFilter['equipmentModelId']?.params[0] ? partTypeFilter['equipmentModelId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                equipmentModelId: {
                  params: [value]
                }
              });
            }}
            options={equipmentModelVMs.map(equipmentModel => ({
              display: equipmentModel.nameModel + (!!equipmentModel.modelYear ? ` (${equipmentModel.modelYear})` : ''),
              value: equipmentModel.id
            }))}
          />
        </Form.Item>
      )
    },
  ];
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{LIST_PART_TYPE}</span>
            </div>
          }
          rightBar={partOptionsBar}
        />
        <InfiniteTable
          url={API.PART_TYPE.PAGE()}
          fetchType="GET"
          componentName=""
          columns={columns}
          filterName={PART_TYPE_FILTER}
          columnEditName={TABLE_EDIT_NAME.PART_TYPE_COLUMNS}
          defaultFiltersObject={partDefaultFiltersObject}
          filters={partFilters}
          paged
        />
      </div>
    </Layout>
  );
};
