import React, { useState } from 'react';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import { SiteLocationDrawer } from './SiteLocationDrawer';
import { useSiteLocationDispatch } from '../../../../hook/hooks/siteLocation';
import { Button, Input, Select } from 'antd';
import { SiteLocationState } from '../../../../store/types/siteLocation';
import { SITE_LOCATION_FILTER, TABLE_EDIT_NAME } from '../../../../constants/constants';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { useFilterParams } from '../../../../hook/customHooks/customHooks';

enum SiteLocationColumns {
  siteLocationType = 'siteLocationType',
  siteLocationCode = 'siteLocationCode',
  largeName = 'largeName',
  siteName = 'siteName'
}

export const SiteLocation = () => {
    
  const {loadSiteLocationById, deleteSiteLocationById} = useSiteLocationDispatch();
  const { addFilter } = useFilterParams(SITE_LOCATION_FILTER);
  
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const closeDrawer = () => setShowDrawer(false);
  
  const columns: Array<Columns> = [
    {
      title: 'Site Location Code',
      width: 80,
      dataIndex: SiteLocationColumns.siteLocationCode,
      key: SiteLocationColumns.siteLocationCode,
      sorter: true,
    },
    {
      title: 'Name',
      width: 80,
      dataIndex: SiteLocationColumns.largeName,
      key: SiteLocationColumns.largeName,
      sorter: true,
    },
    {
      title: 'Site Location Type',
      width: 80,
      dataIndex: SiteLocationColumns.siteLocationType,
      key: SiteLocationColumns.siteLocationType,
      sorter: true,
    },
    {
      title: 'Site',
      width: 80,
      dataIndex: SiteLocationColumns.siteName,
      key: SiteLocationColumns.siteName,
      sorter: true,
    },
    /*
    {
      title: '',
      render: (a: any, b: SiteLocationState) => {
        return <>
          <Button
            style={{border: 'none', boxShadow: 'none'}}
            onClick={() => {
              deleteSiteLocationById(b.id);
          }}>
            Eliminar
          </Button>
        </>
      }
    },
     */
    // {
    //   title: '',
    //   width: 20,
    //   render: (a: any, b: SiteLocationState) => {
    //     return <>
    //       {
    //         <Button onClick={() => {
    //           loadSiteLocationById(b.id).then(() => {
    //             setShowDrawer(true);
    //           });
    //         }} style={{ border: 'none', boxShadow: 'none' }}>
    //           <img className='img-h anticon'
    //             src='/images/edit.svg'
    //             alt='' width='18px'
    //             height='18px' />
    //         </Button>
    //       }
    //     </>
    //   }
    // },
    {
      title: '',
      key: 'editLocation',
      dataIndex: 'editLocation',
      width: 40,
      align: 'right',
      render: (a: any, b: SiteLocationState) => {
        return (
          <>
            <>
              {
                <Button onClick={() => {
                  loadSiteLocationById(b.id).then(() => {
                    setShowDrawer(true);
                  });
                }} style={{border: 'none', boxShadow: 'none'}}>
                  <img className="img-h anticon"
                       src="/images/edit.svg"
                       alt="" width="18px"
                       height="18px"/>
                </Button>
              }
            </>
            <Button
              shape="circle" danger
              icon={<DeleteFilled/>}
              onClick={() => {
                ConfirmationModal('Delete', `Are you sure to delete ${b.largeName}?`, () => deleteSiteLocationById(b.id));
              }}/>
          </>
        );
      }
    }
  ];
  
  
  const partFilters: Array<any> = [{
    query: 'keyword',
    display: (
      <Input
        style={{width: 200, marginRight: '8px'}}
        placeholder="Search..."
        size="small"
        onChange={(value) => {
          addFilter({
            keyword: {
              params: [value.target.value]
            }
          });
        }}
      />
    )
  },
    {
      query: '',
      display: (
        <Select
          id="siteIdFilterSelect"
          showSearch
          style={{width: 150, marginRight: '8px', marginLeft: '8px',}}
          placeholder="All"
          optionFilterProp="children"
          size={'small'}
          onChange={(value) => {
            addFilter({
              siteId: {
                params: [value]
              }
            });
          }}
        >
          <Select.Option value=""> All Sites </Select.Option>
          {
            // sites.map(site => (
            //   <Select.Option value={site.id} > {site.largeName}</Select.Option>
            // ))
          }
        </Select>
      )
    }];
  
  const partOptionsBar: Array<any> = [{
    display: (
      <Button type="primary" style={{backgroundColor: '#1DAB35', color: '#FFF',}} onClick={() => {
        loadSiteLocationById('').then(() => {
          setShowDrawer(true);
        });
      }}>
        NEW SITE LOCATION <PlusOutlined/>
      </Button>
    )
  }];
  return (
    <>
      <InfiniteTable
        filters={partFilters}
        componentName="SITE LOCATION"
        columnEditName={TABLE_EDIT_NAME.SITE_LOCATION_COLUMN}
        optionsBar={partOptionsBar}
        columns={columns}
        filterName={SITE_LOCATION_FILTER}
        defaultFiltersObject={{}}
      />
      <SiteLocationDrawer showDrawer={showDrawer} closeDrawer={closeDrawer}/>
    </>
  );
};
