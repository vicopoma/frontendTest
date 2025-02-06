import React from 'react';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Layout } from 'antd/es';
import {
  ACCOUNT_ROLES,
  ASCEND,
  EQUIPMENT_TYPE_FILTER,
  LIST_EQUIPMENT_TYPE,
  NEW,
  TABLE_EDIT_NAME
} from '../../../constants/constants';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { EquipmentType } from '../../../store/types';
import { roleCanModify } from '../../../helpers/Utils';
import { useAccountState } from '../../../hook/hooks/account';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';


export const ConfigInventoryType = () => {
  
  const {account} = useAccountState();
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'editType',
      key: 'editType',
      nonErasable: true,
      fixed: 'left',
      width: 1,
      align: 'right',
      render: (a: any, b: EquipmentType) => {
        return (
          <>
            <Tooltip title={canModify ? 'Edit' : 'View'}>
              <Button id={`cETEditView${b.nameEquipmentType}`} onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_TYPE, b.id));
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
      title: 'Name Equipment Type',
      dataIndex: 'nameEquipmentType',
      key: 'nameEquipmentType',
      width: 30,
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 60,
    },
    
  ];
  
  const partOptionsBar: Array<any> = [
    <Button id="cETNew" size="small" className="btn-green" onClick={() => {
      history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_TYPE, NEW));
    }}>
      NEW <PlusOutlined/>
    </Button>
  
  ];
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{LIST_EQUIPMENT_TYPE}</span>
            </div>
          }
          rightBar={partOptionsBar}
        />
        <InfiniteTable
          url={API.EQUIPMENT_TYPE.GET_EQUIPMENT_TYPE_LIST()}
          fetchType="GET"
          columns={columns}
          filterName={EQUIPMENT_TYPE_FILTER}
          componentName={''}
          columnEditName={TABLE_EDIT_NAME.EQUIPMENT_TYPE_COLUMN}
          optionsBar={partOptionsBar}
          defaultFiltersObject={{}}
          paged={false}
        />
      </div>
    </Layout>
  );
};
