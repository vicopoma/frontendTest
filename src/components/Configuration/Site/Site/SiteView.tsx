import React from 'react';
import { ACCOUNT_ROLES, ASCEND, pageSize, SITE_FILTER, TABLE_EDIT_NAME } from '../../../../constants/constants';
import { Layout } from 'antd/es';
import { UndoOutlined } from '@ant-design/icons';
import { roleCanModify, } from '../../../../helpers/Utils';
import { useAccountState } from '../../../../hook/hooks/account';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import { Button, Input, Tooltip } from 'antd';
import { useSiteDispatch } from '../../../../hook/hooks/site';
import { SiteState } from '../../../../store/types';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../../settings/server.config';
import { history } from '../../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../../settings/routes';
import { useFilterParams } from '../../../../hook/customHooks/customHooks';

enum siteColumns {
  name = 'name'
}

export const Site = () => {
  
  const { filter: siteFilter, addFilter } = useFilterParams(SITE_FILTER);
  const {syncronized} = useSiteDispatch();
  
  const {account} = useAccountState();
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'siteEdit',
      key: 'siteEdit',
      nonErasable: true,
      width: 3,
      align: 'right',
      render: (a: string, b: SiteState) => {
        return (
          <>
            {
              canModify &&
              <Button
                  id="editSiteButton"
                  onClick={() => {
                    history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.SITE, b.id));
                  }}
                  style={{border: 'none', boxShadow: 'none'}}>
                  <Tooltip title="More information">
                      <img
                          className="img-h anticon"
                          src={!canModify ? '/images/eye-icon.svg' : '/images/edit.svg'}
                          alt="" width="18px"
                          height="18px"
                      />
                  </Tooltip>
              </Button>
            }
          </>
        
        );
      }
    },
    {
      title: 'Site Name',
      dataIndex: 'name',
      key: siteColumns.name,
      width: 50,
      defaultSortOrder: ASCEND,
      sorter: true,
    },
    {
      title: 'Latitude',
      dataIndex: 'lat',
      key: 'lat',
      width: 70,
    },
    {
      title: 'Longitude',
      dataIndex: 'lng',
      key: 'lng',
      width: 70,
    },
  ];
  
  const partFilters: Array<any> = [
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
          defaultValue={siteFilter['keyword'] ? siteFilter['keyword'].params[0] : undefined}
          placeholder="Search..."
        />
      )
    },
    {
      query: 'button',
      display: (
        <Button
          id="syncButton"
          onClick={() => syncronized()}
          size="small"
          className="search-btn-head"
        >
          <UndoOutlined style={{ color: '#013369' }}/>Sync
        </Button>
      )
    }
  ];
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Sites</span>
            </div>
          }
        />
        <InfiniteTable
          filters={partFilters}
          componentName=""
          columns={columns}
          filterName={SITE_FILTER}
          columnEditName={TABLE_EDIT_NAME.SITE_COLUMN}
          url={API.SITE.SITES()}
          defaultFiltersObject={{
            sort: {
              params: [siteColumns.name, 'asc']
            },
            page: {
              params: ['0']
            },
            size: {
              params: [pageSize]
            }
          }}
          paged
        />
      </div>
    </Layout>
  );
};
