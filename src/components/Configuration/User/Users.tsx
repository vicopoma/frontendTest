import React, { useEffect} from 'react';
import { Badge, Button, Form, Input, Select, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Layout } from 'antd/es';
import { UserState } from '../../../store/types/users';
import { ACCOUNT_ROLES, ASCEND, DATE_FORMATS, NEW, pageSize, TABLE_EDIT_NAME, USER_FILTER } from '../../../constants/constants';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { useAccountState } from '../../../hook/hooks/account';
import { progressBarSessionStorageHandler, roleCanModify } from '../../../helpers/Utils';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { useBodyFilterParams, useFilterParams } from '../../../hook/customHooks/customHooks';
import moment from 'moment';
import { useDownloadFunctions } from '../../../hook/customHooks/download';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { useNotificationContext } from '../../../context/notifications';


export const Users = () => {
  
  const { account } = useAccountState();
  const { teamList } = account;
  
  const { filter: UserFilters } = useFilterParams(USER_FILTER);
  const { bodyFilter: userBodyFilter, addBodyFilter } = useBodyFilterParams(USER_FILTER);
  
  const { downloadUserList } = useDownloadFunctions();
  const { updateProgressBar } = useNotificationContext();

  const isNotOEM = account.role.name !== ACCOUNT_ROLES.OEM_ADMIN && account.role.name !== ACCOUNT_ROLES.OEM_TEAM_USER;

  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN) || roleCanModify(account.role.name, ACCOUNT_ROLES.ADMIN_USER) || account.role.name === ACCOUNT_ROLES.OEM_ADMIN;
  
  useEffect(() => {
    addBodyFilter({
      keyword: '',
    })
  }, [addBodyFilter]);

  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'editUser',
      key: 'editUser',
      nonErasable: true,
      width: 1,
      fixed: 'left',
      align: 'right',
      render: (a: any, b: UserState) => {
        return (
          <>
            <Tooltip title={canModify ? 'Edit' : 'View'}>
              <Button
                id="cUsersEditView"
                onClick={() => {
                  history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.USERS, b.id));
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      defaultSortOrder: ASCEND,
      sorter: true,
    },
    {
      title: 'User Name',
      dataIndex: 'login',
      key: 'login',
      sorter: true,
    },
    {
      title: 'Roles',
      dataIndex: 'roleName',
      key: 'role_name',
      sorter: true,
    },
    isNotOEM ? {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'abbr',
      sorter: true,
    } : {
      title: '',
      dataIndex: '',
      show: false,
      key: 'abbr',
    },
    /*isOEMOrZebraAdmin ? {
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: 'name_manufacturer',
      sorter: true,
    } : {
      title: '',
      dataIndex: '',
      show: false,
      key: 'name_manufacturer',
    },*/
    {
      title: 'User status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (active ? <Badge color="#1DAB35" text="ACTIVE"/> :
        <Badge color="#D9D9D9" text="INACTIVE"/>)
    },
  ];
  
  const userFilters: Array<{ query: string, display: JSX.Element }> = [
    {
      query: 'name',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cUsersInputSearch"
            defaultValue={UserFilters['keyword'] ? UserFilters['keyword'].params[0] : undefined}
            placeholder="Search..."
            onSearch={(value) => {
              addBodyFilter({
                keyword: value,
              })
            }}
            style={{width: '100%'}}
            size={'small'}
          />
        </Form.Item>
      )
    },
    {
      query: 'status',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Status</label>
          <Select
            className="filters-selector"
            id="cUsersInputStatus"
            style={{width: '100%', minWidth: '150px'}}
            size={'small'}
            optionFilterProp="children"
            value={userBodyFilter.active ?? ''}
            onChange={(value) => {
              addBodyFilter({
                active: value,
              })
            }}
          >
            <Select.Option value="" title="All"> All </Select.Option>
            <Select.Option value="true" title="Active"> Active </Select.Option>
            <Select.Option value="false" title="Inactive"> Inactive </Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'checkBoxTeam',
      display: account.role.name === ACCOUNT_ROLES.ZEBRA_ADMIN ? (
        <Form.Item className='select-label-up'>
          <label className='label-select'> Team</label>
          <Select
            className="filters-selector"
            size="small"
            style={{width: '140px'}}
            value={userBodyFilter?.teamId ?? 'All'}
            onChange={(value) => {
              addBodyFilter({
                teamId: value
              });
            }}
          >
            <Select.Option value=""> All </Select.Option>
            {teamList.map(team => {
              return (
                <Select.Option value={team.teamId}>{team.abbr}</Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      ) : <></>
    },
  ];
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Users</span>
            </div>
          }
          rightBar={
            [
              canModify ? <Button id="cUsersNew" size="small" className="btn-green" onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.USERS, NEW));
              }}>
                NEW <PlusOutlined/>
              </Button> : <div/>
            ]
          }
        />
        <InfiniteTable
          url={API.USER.PAGE()}
          bodyFilters={{
            keyword: '',
            active: ''
          }}
          fetchType="POST"
          columns={columns}
          componentName={''}
          filters={userFilters}
          filterName={USER_FILTER}
          columnEditName={TABLE_EDIT_NAME.USER_COLUMNS}
          defaultFiltersObject={{
            sort: {
              params: ['name', 'asc']
            },
            page: {
              params: ['0']
            },
            size: {
              params: [pageSize]
            },
          }}
          onDownloadButtonClick={(values, disableLoader, params) => {
            downloadUserList(userBodyFilter, params, (res, httpResponse) => {
              const currentDate = moment().format(DATE_FORMATS.yearMonthDay);
              const code = `user-list-${currentDate}.csv`;
              const key = typeof res === 'string' ? res : '';
              progressBarSessionStorageHandler(code, key);
              SuccessMessage({description: httpResponse.message});
              updateProgressBar(true);
              disableLoader();
            },);
          }}
          paged={true}/>
      </div>
    </Layout>
  );
};
