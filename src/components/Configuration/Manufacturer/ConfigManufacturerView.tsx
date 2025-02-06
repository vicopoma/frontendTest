import React from 'react';
import { Button, Tooltip } from 'antd';
import { Layout } from 'antd/es';
import { PlusOutlined } from '@ant-design/icons';
import { Manufacturer } from '../../../store/types';
import {
  ACCOUNT_ROLES,
  ASCEND,
  LIST_MANUFACTURER,
  MANUFACTURER_FILTER,
  TABLE_EDIT_NAME
} from '../../../constants/constants';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { roleCanModify } from '../../../helpers/Utils';
import { useAccountState } from '../../../hook/hooks/account';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';


export const ConfigManufacturerView = () => {
  const {account} = useAccountState();
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  const columns: Array<Columns> = [
    {
      title: '',
      key: 'manufacturerEdit',
      dataIndex: 'manufacturerEdit',
      width: 1,
      nonErasable: true,
      align: 'right',
      render: (a: any, b: Manufacturer) => {
        return (
          <>
            <Tooltip title={canModify ? 'Edit' : 'View'}>
              <Button id={`cMEditView${b.nameManufacturer}`} onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANUFACTURER, b.id));
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
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: 'nameManufacturer',
      width: 50,
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 100,
    },
  ];
  
  const partOptiontsBar: Array<any> = [
    canModify ? <Button id="cMNew" size="small" className="btn-green" onClick={() => {
      history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANUFACTURER, 'new'));
    }}>
      NEW <PlusOutlined/>
    </Button> : <div/>
  ];
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">{LIST_MANUFACTURER}</span>
            </div>
          }
          rightBar={partOptiontsBar}
        />
        <InfiniteTable
          url={API.MANUFACTURER.GET_MANUFACTURER_LIST()}
          fetchType="GET"
          columns={columns}
          columnEditName={TABLE_EDIT_NAME.MANUFACTURER_COLUMN}
          filterName={MANUFACTURER_FILTER}
          defaultFiltersObject={{}}
          componentName=""
          optionsBar={partOptiontsBar}
          paged={false}
        />
      </div>
    </Layout>
  );
};

