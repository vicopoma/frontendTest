import React from 'react';
import { Tag } from 'antd';
import { Layout } from 'antd/es';
import { dateFormatTable, TABLE_EDIT_NAME, TAGS_FILTER_DETAILS } from '../../../constants/constants';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { API } from '../../../settings/server.config';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { useLocation } from 'react-router';
import { hexToAscii } from '../../../helpers/ConvertUtils';
import { dateToString } from '../../../helpers/Utils';

export const TagDetailConfiguration = () => {
  const path = useLocation().pathname.split('/');
  const tag = path[path.length - 1];
  
  const columns: Array<Columns> = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      width: 20,
      render: (tag: string) => {
        return hexToAscii(tag);
      }
    },
    {
      title: 'Status',
      dataIndex: 'endDate',
      key: 'end_date',
      width: 20,
      render: (date: string) => {
        return <div className="auth-request">
          {!date ? <Tag className="role-tag" color="green"> Assigned </Tag> :
            <Tag className="role-tag"> Unassigned </Tag>}
        </div>;
      }
    },
    {
      title: 'Equipment Type',
      dataIndex: 'equipmentTypeName',
      key: 'equipment.equipment_type_id',
      width: 20
    },
    {
      title: 'Equipment Code',
      dataIndex: 'equipmentCode',
      key: 'equipment.equipment_code',
      width: 10
    },
    {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'team.full_name',
      width: 20
    },
    {
      title: 'Player Name',
      dataIndex: 'playerName',
      key: 'player.first_name',
      width: 20
    },
    {
      title: 'Assigned By',
      dataIndex: 'createBy',
      key: 'create_by',
      width: 20
    },
    
    {
      title: 'Assigned Date',
      dataIndex: 'startDate',
      key: 'start_date',
      width: 20,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      }
    },
    {
      title: 'Unassigned By',
      dataIndex: 'modifiedBy',
      key: 'modified_by',
      width: 20,
      render: (a: any, b: any) => {
        return (
          <>
            <div className="auth-request">
              {(!b.endDate && !b.modifiedBy) ? b.modifiedBy : ''}
            </div>
          </>
        );
      }
    },
    {
      title: 'Deallocated date',
      dataIndex: 'endDate',
      key: 'end_date',
      width: 20,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      }
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
      }
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
      width: 20,
      render: (y: string) => {
        if (!!y && y !== '0.0') {
          return y;
        }
        return '';
      }
    },
    {
      title: 'Last Blink Date',
      dataIndex: 'lastBlinkDate',
      key: 'last_blink_date',
      width: 20,
      render: (date: string) => {
        return <span>{dateToString(date, dateFormatTable)}</span>;
      }
    }
  ];
  
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">TAG</span>
            </div>
          }
          navigationRoute={[
            {
              path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAGS),
              breadcrumbName: 'Tag List'
            },
            {
              path: '',
              breadcrumbName: hexToAscii(tag)
            }
          ]}
        />
        <InfiniteTable
          url={API.TAG.TAG_HISTORICAL(tag)}
          fetchType="GET"
          columns={columns}
          componentName={''}
          filterName={TAGS_FILTER_DETAILS}
          defaultFiltersObject={{}}
          columnEditName={TABLE_EDIT_NAME.TAGS_DETAILS}
        />
      </div>
    </Layout>
  );
};
