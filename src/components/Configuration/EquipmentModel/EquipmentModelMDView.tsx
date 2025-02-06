import React, { useEffect } from 'react';
import { Button, Form, Input, Tooltip, Layout } from 'antd';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import {
  ACCOUNT_ROLES,
  ASCEND,
  EQUIPMENT_MODEL_FILTER,
  LIST_EQUIPMENT_MODEL,
  pageSize,
  TABLE_EDIT_NAME
} from '../../../constants/constants';
import { useEquipmentModelDispatch } from '../../../hook/hooks/equipmentModel';
import { EquipmentModel } from '../../../store/types';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useManufacturerDispatch, useManufacturerState } from '../../../hook/hooks/manufacturer';
import { PlusOutlined } from '@ant-design/icons';
import { useAccountState } from '../../../hook/hooks/account';
import { roleCanModify } from '../../../helpers/Utils';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { Select } from '../../Shared/Select/Select';
import { useFilterParams } from '../../../hook/customHooks/customHooks';

export const EquipmentModelList = () => {
  
  const {getEquipmentModelList} = useEquipmentModelDispatch();
  
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const {getManufacturerByEquipmentType, replaceManufacturerList} = useManufacturerDispatch();
  const {manufacturerList} = useManufacturerState();
  
  const { filter: inventoryModel, addFilter } = useFilterParams(EQUIPMENT_MODEL_FILTER);
  const {account} = useAccountState();
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  useEffect(() => {
    if (inventoryModel['equipmentTypeId']) {
      getManufacturerByEquipmentType(inventoryModel['equipmentTypeId'].params[0]);
    } else {
      replaceManufacturerList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'editModel',
      dataIndex: 'editModel',
      fixed: 'left',
      width: 1,
      nonErasable: true,
      align: 'right',
      render: (a: any, b: EquipmentModel) => {
        return (
          <>
            <Tooltip title={canModify ? 'Edit' : 'View'}>
              <Button id="cEMEditView" onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_MODEL, b.id));
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
      title: 'Name Model',
      dataIndex: 'nameModel',
      key: 'nameModel',
      width: 20,
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturerName',
      key: 'manufacturer.nameManufacturer',
      width: 20,
      sorter: true,
    },
    {
      title: 'Equipment Type',
      dataIndex: 'equipmentTypeName',
      key: 'equipmentType.nameEquipmentType',
      width: 20,
      sorter: true,
    },
    {
      title: 'Model Year',
      dataIndex: 'modelYear',
      key: 'modelYear',
      width: 10,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'statusDescription',
      key: 'statusDescription',
      width: 15,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 20,
    },
  ];
  
  const partOptionsBar: Array<any> = [
    canModify ? <Button id="cEMNew" size="small" className="btn-green" onClick={() => {
      history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_MODEL, 'new'));
    }}>
      NEW <PlusOutlined/>
    </Button> : <> </>
  ];
  
  const partFilters: Array<any> = [
    {
      query: 'name',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cEMInputSearch"
            placeholder="Search..."
            onSearch={e => {
              addFilter({
                keyword: {
                  params: [e]
                }
              });
            }}
            defaultValue={inventoryModel['keyword'] ? inventoryModel['keyword'].params[0] : undefined}
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
            selectAllValue=""
            validateValue
            id="cPTEquipmentType"
            size="small"
            style={{width: '100%', minWidth: '160px'}}
            showSearch
            value={inventoryModel['equipmentTypeId']?.params[0] ? inventoryModel['equipmentTypeId'].params[0] : ''}
            onChange={(value) => {
              addFilter({
                equipmentTypeId: {
                  params: [value]
                },
                manufacturerId: {
                  params: []
                }
              });
              if (!!value) {
                getManufacturerByEquipmentType(value + '');
              } else {
                replaceManufacturerList([]);
              }
              getEquipmentModelList(() => {
              }, 3);
            }}
            options={equipmentTypeList.map(eqType => ({
              display: eqType.nameEquipmentType,
              value: eqType.id
            }))}
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
            selectAllValue=""
            validateValue
            size="small"
            id="cPTManufacturers"
            showSearch
            style={{width: '100%', minWidth: '160px'}}
            value={inventoryModel['manufacturerId']?.params[0] ? inventoryModel['manufacturerId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                manufacturerId: {
                  params: [value]
                }
              });
              getEquipmentModelList(() => {
              }, 3);
            }}
            options={manufacturerList.map(manufacturer => ({display: manufacturer.nameManufacturer, value: manufacturer.id}))}
          />
        </Form.Item>
      )
    },
  ];
  
  const partDefaultFiltersObject: Object = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    sort: {
      params: ['nameModel', 'asc']
    }
  };
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{LIST_EQUIPMENT_MODEL}</span>
            </div>
          }
          rightBar={partOptionsBar}
        />
        <InfiniteTable
          url={API.EQUIPMENT_MODEL.GET_EQUIPMENT_MODEL_LIST()}
          fetchType="GET"
          columns={columns}
          componentName={''}
          filterName={EQUIPMENT_MODEL_FILTER}
          defaultFiltersObject={partDefaultFiltersObject}
          filters={partFilters}
          columnEditName={TABLE_EDIT_NAME.EQUIPMENT_MODEL_COLUMN}
          paged={true}
        />
        {/* <EquipmentModelDetail openDrawer={openDrawer} closeDrawer={closeDrawer} /> */}
      </div>
    </Layout>
  );
};

