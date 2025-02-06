import React, { useCallback, useEffect } from 'react';
import {
  ACCOUNT_ROLES,
  ASCEND,
  LIST_PARTS,
  pageSize,
  PART_FILTER,
  TABLE_EDIT_NAME
} from '../../../constants/constants';
import { Button, Form, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Layout } from 'antd/es';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { usePartDispatch } from '../../../hook/hooks/part';
import { PartState } from '../../../store/types/part';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { usePartTypeDispatch, usePartTypeState } from '../../../hook/hooks/partType';
import { useEquipmentDispatch, useEquipmentState } from '../../../hook/hooks/equipment';
import { generateEquipmentTypeName, roleCanModify } from '../../../helpers/Utils';
import { useAccountState } from '../../../hook/hooks/account';
import { useManufacturerDispatch, useManufacturerState } from '../../../hook/hooks/manufacturer';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { Select } from '../../Shared/Select/Select';
import { useFilterParams } from '../../../hook/customHooks/customHooks';

enum partColumns {
  namePart = 'namePart',
  nameEquipmentType = 'partType.equipmentType.nameEquipmentType',
  nameManufacturer = 'partType.equipmentModel.manufacturer.nameManufacturer',
  nameEquipmentModel = 'partType.equipmentModel.nameModel',
  namePartType = 'partType.namePartType',
  statusDescription = 'statusDescription',
}

export const Part = () => {
  
  const {loadParts} = usePartDispatch();
  
  const {getManufacturerByEquipmentType, replaceManufacturerList} = useManufacturerDispatch();
  const {manufacturerList} = useManufacturerState();
  
  const {getPartTypeByEquipmentModel, replaceObjectPartTypeByEquipmentModel} = usePartTypeDispatch();
  const {equipmentModelPartType} = usePartTypeState();
  
  const { filter: partFilter, addFilter } = useFilterParams(PART_FILTER);
  
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const {equipmentModelVMs} = useEquipmentState();
  const {getEquipmentModelByEquipmentTypeIdManufacturerType, replaceEquipmentModelList} = useEquipmentDispatch();
  const {account} = useAccountState();
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  useEffect(() => {
    if (partFilter['equipmentTypeId']) {
      getManufacturerByEquipmentType(partFilter['equipmentTypeId'].params[0]);
      if (partFilter['manufacturerId']) {
        getEquipmentModelByEquipmentTypeIdManufacturerType(partFilter['equipmentTypeId'].params[0], partFilter['manufacturerId'].params[0]);
        if (partFilter['equipmentModelId']) {
          getPartTypeByEquipmentModel(partFilter['equipmentModelId'].params[0]);
        } else {
          replaceEquipmentModelList([]);
        }
      } else {
        replaceEquipmentModelList([]);
        replaceObjectPartTypeByEquipmentModel({});
      }
    } else {
      replaceManufacturerList([]);
      replaceEquipmentModelList([]);
      replaceObjectPartTypeByEquipmentModel({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'editPart',
      dataIndex: 'editPart',
      nonErasable: true,
      fixed: 'left',
      width: 1,
      align: 'right',
      render: (a: any, b: PartState) => {
        return (
          <>
            <Tooltip title={canModify ? 'Edit' : 'View'}>
              <Button id="cPEditView" onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART, b.id));
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
      key: partColumns.nameEquipmentType,
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: partColumns.nameManufacturer,
      sorter: true,
    },
    {
      title: 'Equipment Model',
      dataIndex: 'nameModel',
      key: partColumns.nameEquipmentModel,
      sorter: true,
    },
    {
      title: 'Part Types',
      dataIndex: 'namePartType',
      key: partColumns.namePartType,
      sorter: true,
    },
    {
      title: 'Parts',
      dataIndex: partColumns.namePart,
      key: partColumns.namePart,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: partColumns.statusDescription,
      key: partColumns.statusDescription,
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    
  ];
  
  const partOptionsBar: Array<any> = [
    canModify ? <Button id="cPNew" size="small" className="btn-green" onClick={() => {
      history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART, 'new'));
    }}>
      NEW <PlusOutlined/>
    </Button> : <div/>
  ];
  
  const partDefaultFiltersObject: Object = {
    sort: {
      params: [partColumns.nameEquipmentType, 'asc']
    },
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    }
  };
  
  const partFilters: Array<any> = [
    {
      query: 'keyword',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cPInputSearch"
            defaultValue={partFilter['keyword'] ? partFilter['keyword'].params[0] : undefined}
            placeholder="Search..."
            onSearch={e => {
              addFilter({
                keyword: {
                  params: [e]
                }
              });
            }}
            style={{width: '100%'}}
            size="small"
          />
        </Form.Item>
      )
    },
    {
      query: 'EquipmentType',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Equipment Type</label>
          <Select
            className="filters-selector"
            selectAllValue=""
            name="Equipment Type"
            validateValue
            id="cPEquipmentType"
            style={{width: '100%', minWidth: '160px', marginBottom: "5px"}}
            options={equipmentTypeList.map(eqType => ({ display: generateEquipmentTypeName(eqType.nameEquipmentType),  value: eqType.id }))}
            size="small"
            value={partFilter['equipmentTypeId']?.params[0] ? partFilter['equipmentTypeId'].params[0] : (equipmentTypeList[5]?.id || '')}
            onChange={useCallback((value) => {
              addFilter({
                equipmentTypeId: {
                  params: [value]
                },
                manufacturerId: {
                  params: []
                },
                equipmentModelId: {
                  params: []
                },
                partTypeId: {
                  params: []
                }
              });
              if (!!value) {
                getManufacturerByEquipmentType(value);
              } else {
                replaceManufacturerList([]);
              }
              replaceEquipmentModelList([]);
              replaceObjectPartTypeByEquipmentModel({});
              loadParts(() => {
              }, 3);
            }, [getManufacturerByEquipmentType, loadParts, replaceEquipmentModelList, replaceManufacturerList, replaceObjectPartTypeByEquipmentModel, addFilter])}
          />
        </Form.Item>
      )
    },
    {
      query: 'Manufacturer',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Manufacturer</label>
          <Select
            className="filters-selector"
            validateValue
            selectAllValue=""
            style={{width: '100%', minWidth: '160px'}}
            size="small"
            id="cPManufacturer"
            showSearch
            value={partFilter['manufacturerId']?.params[0] ? partFilter['manufacturerId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                manufacturerId: {
                  params: [value]
                },
                equipmentModelId: {
                  params: []
                },
                partTypeId: {
                  params: []
                }
              });
              if (!!value) {
                getEquipmentModelByEquipmentTypeIdManufacturerType(partFilter['equipmentTypeId']?.params[0], value);
              } else {
                replaceEquipmentModelList([]);
              }
              replaceObjectPartTypeByEquipmentModel({});
              loadParts(() => {
              }, 3);
            }}
            options={manufacturerList.map(manufacturer => ({ display: manufacturer.nameManufacturer, value: manufacturer.id}))}
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
            id="cPEquipmentModel"
            style={{width: '100%', minWidth: '260px'}}
            size={'small'}
            showSearch
            value={partFilter['equipmentModelId']?.params[0] ? partFilter['equipmentModelId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                equipmentModelId: {
                  params: [value]
                },
                partTypeId: {
                  params: []
                }
              });
              if (!!value) {
                getPartTypeByEquipmentModel(value + '');
              } else {
                replaceObjectPartTypeByEquipmentModel({});
              }
              loadParts(() => {
              }, 3);
            }}
            options={equipmentModelVMs.map((equipmentModel => ({
              display: equipmentModel.nameModel + (!!equipmentModel.modelYear ? ` (${equipmentModel.modelYear})` : ''),
              value: equipmentModel.id
            })))}
          />
        </Form.Item>
      )
    },
    {
      query: 'type',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Part Type</label>
          <Select
            className="filters-selector"
            validateValue
            selectAllValue=""
            id="cPInputPartType"
            size="small"
            showSearch
            style={{width: '100%', minWidth: '150px'}}
            value={partFilter['partTypeId']?.params[0] ? partFilter['partTypeId'].params[0] : undefined}
            onChange={(value) => {
              addFilter({
                partTypeId: {
                  params: [value]
                },
              });
              loadParts(() => {
              }, 3);
            }}
            options={Object.values(equipmentModelPartType).map(partType => ({
              display: partType.namePartType,
              value: partType.id
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
              <span className="navigation-bar-configuration">{LIST_PARTS}</span>
            </div>
          }
          rightBar={partOptionsBar}
        />
        <InfiniteTable
          url={API.PART.PART()}
          fetchType="GET"
          columns={columns}
          filterName={PART_FILTER}
          columnEditName={TABLE_EDIT_NAME.PARTS_COLUMN}
          defaultFiltersObject={partDefaultFiltersObject}
          filters={partFilters}
          paged
        />
      </div>
    </Layout>
  );
};
