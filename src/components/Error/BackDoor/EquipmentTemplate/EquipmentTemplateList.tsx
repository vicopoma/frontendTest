import React, { useState } from 'react';
import { Button } from 'antd';
import { useBodyFilterParams } from '../../../../hook/customHooks/customHooks';
import { ASCEND, EMPTY_ARRAY, EQUIPMENT_TEMPLATE, NEW, TABLE_EDIT_NAME } from '../../../../constants/constants';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';
import { useEquipmentTemplate } from '../../../../hook/customHooks/backdoor';
import './../BackDoor.scss';
import { DetailLayout } from '../../../Shared/DetailLayout/DetailLayout';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import { API } from '../../../../settings/server.config';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { history } from '../../../../store/reducers';
import { BackDoorConfigKeys, ROUTES } from '../../../../settings/routes';
import Icon from '../../../Shared/CommomIcons/Icons';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { SuccessMessage } from '../../../Shared/Messages/Messages';

export const EquipmentTemplateList = () => {
  const { addBodyFilter } = useBodyFilterParams(EQUIPMENT_TEMPLATE); 

  const [, setTriggerEq] = useState<number>(0);

  const updateTrigger = () => {
    setTriggerEq((trigger) => {
      addBodyFilter({
        trigger: trigger
      });
      return trigger + 1;
    })
  }

  const {  
    deleteEquipmentTemplate,
  } = useEquipmentTemplate('');

  const columns: Array<Columns> = [
    {
      title: 'Equipment Type',
      dataIndex: 'name',
      // defaultSortOrder: ASCEND,
      key: 'title',
      sorter: false,
      render: () => 'Helmet',
    },
    {
      title: 'Template Name',
      dataIndex: 'name',
      defaultSortOrder: ASCEND,
      key: 'name',
      sorter: false,
    },
    {
      title: '',
      key: 'edit',
      dataIndex: 'name',
      align: 'right',
      show: true,
      width: 4,
      render: (a: any, b: any) => {
        return (
          <>
            <Button
              id={`eEditEqTemplate-${b.name}`}
              onClick={(e) => {
                history.push(ROUTES.BACKDOOR.DETAIL(BackDoorConfigKeys.EQUIPMENT_TEMPLATE, b.id))
              }}
              style={{border: 'none', boxShadow: 'none'}}>
              <img
                className="img-h anticon"
                src={'/images/edit.svg'}
                alt="" width="18px"
                height="18px"
              />
            </Button>
          </>
        );
      }
    },
    {
      title: '',
      key: 'delete',
      dataIndex: 'name',
      align: 'right',
      show: true,
      width: 3,
      render: (a: any, b: any) => {
        return (
          <>
            <Button
              id={`eDeleteEqTemplate-${b.name}`}
              onClick={(e) => {
                ConfirmationModal('Delete', `Are you sure to delete this Equipment Template: ${b.name}?`, () => {
                  deleteEquipmentTemplate(b, () => {
                    updateTrigger()
                    SuccessMessage({ description: `The Equipment Template: ${b.name} was deleted`})
                  });
                });
              }}
              style={{border: 'none', boxShadow: 'none'}}>
              <Icon.Delete 
                width="18px"
                style={{  
                  border: '0px', 
                  marginRight: '5px', 
                  display:'flex', 
                  alignItems: 'center', 
                  justifyContent:'center', 
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              />
            </Button>
          </>
        );
      }
    },
  ];

  return (
    <DetailLayout 
      disableBackButton={true}
    >
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">EquipmentTemplate</span>
            </div>
          }
          navigationRoute={
            [{
              path: '#',
              breadcrumbName: 'Equipment Template',
            }]
          }
          rightBar={[
            <div style={{marginRight: '13px'}}>
              <Button
                icon={<img className="img-h anticon" src="/images/plus-icon.svg" alt="" width="14px"/>}
                className="btn-green"
                onClick={() => {
                  history.push(ROUTES.BACKDOOR.DETAIL(BackDoorConfigKeys.EQUIPMENT_TEMPLATE, NEW));
                }}
              > NEW EQUIPMENT TEMPLATE </Button>
            </div>
          ]}
        />
        <InfiniteTable
          url={API.EQUIPMENT_TEMPLATE.BASE()}
          fetchType="GET"
          columns={columns}
          componentName={''}
          filters={EMPTY_ARRAY}
          filterName={EQUIPMENT_TEMPLATE}
          columnEditName={TABLE_EDIT_NAME.EQUIPMENT_TEMPLATE}
          defaultFiltersObject={{
            sort: {
              params: ['title', 'asc'],
            },
            page: {
              params: ['0']
            },
            size: {
              params: [50]
            },
          }}
        />     
      </div>
    </DetailLayout>
  );
};
