import React from 'react';
import { Button, Input } from 'antd';
import { Layout } from 'antd/es';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import { TeamState } from '../../../store/types';
import { ACCOUNT_ROLES, ASCEND, ROLE_HIERARCHY, TABLE_EDIT_NAME, TEAM_FILTER } from '../../../constants/constants';
import { useAccountState } from '../../../hook/hooks/account';
import Image from '../../Shared/Image/Image';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../settings/server.config';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { useFilterParams } from '../../../hook/customHooks/customHooks';

export const ConfigTeams = () => {
  
  const {account} = useAccountState();
  const { filter: TeamFilters, addFilter } = useFilterParams(TEAM_FILTER);
  
  const columns: Array<Columns> = [
    {
      title: '#',
      key: '#',
      dataIndex: '#',
      width: 5,
      align: 'left',
      render: (a: any, b: any, c: number) => {
        return <div> {c + 1} </div>;
      }
    },
    {
      title: 'Logo',
      dataIndex: 'logoTeam',
      key: 'logoTeam',
      width: 7,
      align: 'left',
      render: (a: any, b: TeamState, index: number) => {
        let path = `/images/teams/logos/${b.abbr}.svg`;
        return (
          <Image key={b.teamId} src={path} srcDefault={'/images/team-icon.svg'} alt="logo" width="50px"/>
        );
      }
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 20,
      align: 'left',
      sorter: true,
      defaultSortOrder: ASCEND,
    },
    {
      title: 'Stadium',
      dataIndex: 'statium',
      key: 'stadiumName',
      width: 20,
      sorter: true,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'cityState',
      width: 20,
      sorter: true,
    },
    {
      title: 'Players',
      dataIndex: 'players',
      key: 'players',
      width: 25,
    },
    {
      title: '',
      key: 'editTeam',
      dataIndex: 'editTeam',
      nonErasable: true,
      width: 1,
      align: 'right',
      render: (a: any, b: TeamState) => {
        if (ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER]) {
          return (
            <Button
              id="cTEditView"
              style={{border: 'none', boxShadow: 'none'}}
              onClick={() => {
                history.push(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.TEAMS, b.teamId));
              }}>
              <img
                className="img-h anticon"
                src="/images/eye-icon.svg"
                alt="" width="18px"
                height="18px"
              />
            </Button>
          
          );
        }
        return <> </>;
      }
    }];
  
  const partFilters: Array<any> = [
    {
      query: 'name',
      display: (
        <Input.Search
          id="cTInputSearch"
          defaultValue={TeamFilters['keyword'] ? TeamFilters['keyword'].params[0] : undefined}
          placeholder="Search..."
          onSearch={(e) => {
            const keyword = {
              params: [e]
            };
            addFilter({keyword});
          }}
          style={{width: '100%'}}
          size={'small'}
        />)
    }
  ];
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Teams</span>
            </div>
          }
        />
        <InfiniteTable
          url={API.TEAM.TEAMS()}
          fetchType="GET"
          columns={columns}
          filters={partFilters}
          componentName={''}
          filterName={TEAM_FILTER}
          columnEditName={TABLE_EDIT_NAME.TEAM_COLUMNS}
          defaultFiltersObject={{}}
        />
      </div>
    </Layout>
  );
};

