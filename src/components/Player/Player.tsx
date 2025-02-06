import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Select, Tooltip } from 'antd';
import { Layout } from 'antd/es';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

import { usePlayersState } from '../../hook/hooks/players';
import { InfiniteTable } from '../Shared/Table/InfiniteTable';
import { PlayerState } from '../../store/types/players';
import CustomInput from  '../Shared/CustomInput/Input'
import {
  ACCOUNT_ROLES,
  ASCEND,
  EQUIPMENT_TYPES,
  EQUIPMENT_TYPE_SETTER,
  pageSize,
  PLAYERS_FILTER,
  ROLE_HIERARCHY,
  TABLE_EDIT_NAME,
  dateFormatTableSec,
} from '../../constants/constants';
import { Report } from '../Shared/Report/ReportView';
import { debounce, downloadCsv, roleCanModify } from '../../helpers/Utils';
import { useAccountState } from '../../hook/hooks/account';
import { PlayerProfileDrawer } from './PlayerDrawer';
import { NavigationBar } from '../Shared/NavigationBar/NavigationBar';
import { history } from '../../store/reducers';
import { ROUTES } from '../../settings/routes';
import { FilterQuery, playerColumns } from '../../Types/Types';
import { Columns } from '../Shared/Table/CustomTable/Table';
import { API } from '../../settings/server.config';
import { useBodyFilterParams, useFilterParams, useSorterColumnSelector } from '../../hook/customHooks/customHooks';
import './Player.scss';
import Icon from '../Shared/CommomIcons/Icons';
import { EquipmentCounterBadge } from '../Equipment/EquipmentCounterBadge/EquipmentCounterBadge';
import { useScheduleFunctions } from '../../hook/customHooks/schedule';
import { useFilterStates } from '../../hook/hooks/filters';
import { usePlayerList } from '../../hook/customHooks/players';
import { SelectOptions } from '../Shared/Select/Select';
import { PlayerImportModal } from './PlayerImportModal';
import moment from 'moment';

export const Player = () => {

  const { players } = usePlayersState();

  const { addFilter } = useFilterParams(PLAYERS_FILTER);
  const playersFilter = useFilterStates(PLAYERS_FILTER);
  
  const { bodyFilter: bodyFilterState, addBodyFilter } = useBodyFilterParams(PLAYERS_FILTER);
  
  const { account, teamSelected } = useAccountState();
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);
  const [tags, setTags] = useState<Array<SelectOptions> > (() => {
    if(bodyFilterState?.keys) {
      const currentTags: Array<SelectOptions> = []
      bodyFilterState.keys.forEach((data: any) => {
        currentTags.push({
          value: data,
          display: data,
        })
      })
      return currentTags
    }
    return []
  });

  useEffect(() => {
    if(bodyFilterState?.keys) {
      setTags(bodyFilterState?.keys.map((data: string) => ({
        value: data,
        display: data
      })))
    }
  }, [bodyFilterState?.keys])

  const closeProfileDrawer = () => setShowProfileDrawer(false);

  const closeReports = () => setShowReport(false);
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ADMIN_USER);
  const createPlayer: boolean = (process.env.REACT_APP_CREATE_PLAYER === 'true' && roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN));

  const { equipmentCounter: { loadEquipmentCount, equipmentCount } } = useScheduleFunctions();
  const { changeChosenColumn } = useSorterColumnSelector();
  const { playerKeyList: { playerKeys, getPlayerKeys }} = usePlayerList();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	
	const playerBodyFilter = {
		teamId: teamSelected.teamId,
	}

  useEffect(() => {
    loadEquipmentCount(bodyFilterState);
  }, [loadEquipmentCount, bodyFilterState]);

  const equipmentsColumns = [EQUIPMENT_TYPES.CLEAT, EQUIPMENT_TYPES.HELMET, EQUIPMENT_TYPES.SHOULDER_PAD, EQUIPMENT_TYPES.KNEE_BRACE, EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR];

  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'edit',
      fixed: 'left',
      key: 'edit',
      nonErasable: true,
      width: 1,
      align: 'right',
      render: (a: any, b: PlayerState) => {
        return (
          <>
            <div className='border-table'></div>
            <Button
              id="cPView" onClick={() => {
                history.push(ROUTES.PLAYER.DETAIL(b.id));
              }} style={{ border: 'none', boxShadow: 'none' }}
            >
              <Tooltip title="More information">
                <img
                  className="img-h anticon"
                  src={'/images/edit.svg'}
                  alt="" width="18px"
                  height="18px"
                />
              </Tooltip>
            </Button>
          </>
        );
      },
    },
    {
      title: 'Player ID',
      dataIndex: playerColumns.playerId,
      key: playerColumns.playerId,
      width: 10,
      align: 'left',
      sorter: true,
      defaultSortOrder: ASCEND,
      render: (a: string, b: PlayerState) => {
        return `${b.playerId ?? ''}`;
      },
    },
    {
      title: 'First Name',
      dataIndex: playerColumns.displayName,
      key: playerColumns.displayName,
      width: 10,
      align: 'left',
      sorter: true,
      defaultSortOrder: ASCEND,
      render: (a: string, b: PlayerState) => {
        return `${b.firstName}`;
      },
    },
    {
      title: 'Last Name',
      dataIndex: playerColumns.displayLastName,
      key: playerColumns.displayLastName,
      width: 10,
      align: 'left',
      sorter: true,
      render: (a: string, b: PlayerState) => {
        return `${b.lastName}`;
      },
    },
    {
      title: 'Football Name',
      dataIndex: playerColumns.displayFootballName,
      key: playerColumns.displayFootballName,
      width: 10,
      align: 'left',
      sorter: true,
      render: (a: string, b: PlayerState) => {
        return `${b.footballName}`;
      },
    },
    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] &&
      ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER] ? {
      title: 'Team',
      dataIndex: 'teamAbbr',
      key: 'currentTeam.abbr',
      align:'left',
      width: 5,
    } :
      {
        title: '',
        key: '',
        dataIndex: '',
      },
    {
      title: 'Jersey #',
      dataIndex: "jerseyNumber",
      key: playerColumns.jerseyNumber,
      width: 5,
      sorter: true,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'statusShortDescription',
      key: 'status_short_description',
      width: 10,
      sorter: true,
      align: 'left',
    },
    {
      title: 'Assigned Equipment',
      hideTitle: true,
      subTitle: (
        <div style={{
          padding: '0px 0px 5px 0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            Assigned Equipment
          </div>
          <EquipmentCounterBadge
            customEquipments={equipmentsColumns}
            equipmentAssigned={equipmentCount}
            initialValue={playersFilter?.sort?.params?.[0]}
            onClick={(equipmentType) => {
              changeChosenColumn(equipmentType, (column, orderType) => {
                addFilter({
                  sort: {
                    params: [EQUIPMENT_TYPE_SETTER[column as EQUIPMENT_TYPES]?.sort, orderType]
                  }
                });
              });
            }}
          />
        </div>
      ),
      dataIndex: 'equipmenTypeRelated',
      key: 'equipmenTypeRelated',
      width: 25,
      render: (a: any, b: PlayerState) => {
        return <EquipmentCounterBadge customEquipments={equipmentsColumns} equipmentAssigned={b.equipmentAssigned} />;
      }
    },
    {
      title: '',
      dataIndex: 'button',
      key: 'button',
      nonErasable: true,
      width: 15,
      align: 'right',
      render: (a: any, b: PlayerState) => {
        let tagsNumber = 0;
        for (const equipment of b.equipmentVMList) {
          if (equipment.tags.length === 0 && !equipment.archived) {
            tagsNumber++;
          }
        }
        return (
          <>
            {
              tagsNumber > 0 && b.equipmentVMList.length > 0 ? (
                <Tooltip placement="topLeft" title={`Player has ${tagsNumber} ${tagsNumber === 1 ? 'piece' : 'pieces'}  of equipment without tags assigned.`}>
                  <span>
                    <Icon.Warning width="20px" />
                  </span>
                </Tooltip>
              ) : <div />
            }
          </>
        );
      },
    },
  ];

  const filters = {
    sort: {
      params: [playerColumns.displayName, 'asc'],
    },
    page: {
      params: ['0'],
    },
    size: {
      params: [pageSize],
    },
    teamId: {
      params: [teamSelected?.teamId],
    },
  };
  


  const partOptionsBar: Array<any> = [
    createPlayer ? (
      <Button
        id="cPlayerNew"
        className="btn-green"
        style={{ marginRight: '5px' }}
        size="small" type="primary"
        onClick={() => {
          setShowProfileDrawer(true);
        }}
      >
        NEW <PlusOutlined />
      </Button>
    ) : <div />,
    canModify && players.length > 0 ? (
      <Button
        id="cPReport"
        className="btn-blue"
        size="small"
        onClick={() => {
          addFilter({
            playerId: {
              params: [''],
            },
          });
          setShowReport(true);
        }}
      > REPORT </Button>
    ) : <div />,
  ];

  const searchKeysFunction = (value: string) => {
    getPlayerKeys({
      teamId: teamSelected.teamId,
      keyword: value,
      status: bodyFilterState?.status ?? '',
    })
  }
  const debouncedSearchKeys = useCallback(debounce(searchKeysFunction, 600), []);

  const playersFilters: Array<FilterQuery> = [
    {
      query: 'searchWithTags',
      display: (
        <CustomInput.SearchAndTag
          id='cPInputSearch'
          inputKey="PlayerSearchTag"
          placeholder="Search..."
          size="small"
          style={{minWidth: '400px'}}
          nameView='player'
          bodyFilterName={PLAYERS_FILTER}
          onChange={(value: SelectOptions[])=> {
            setTags(value)
            const keys: Array<string> = []
            value.forEach(val => {
              keys.push(val.display + '')
            })
            addBodyFilter({
              keys: keys
            })
          }}
          onOperatorChange={(operator: string) => {
            addBodyFilter({
              operator: operator
            })
          }}
          operator={bodyFilterState?.operator ? bodyFilterState?.operator : 'AND'}
          onSearch={debouncedSearchKeys}
          tagValues={tags}
          options={playerKeys.map(key => ({
            value: key,
            display: key
          }))}
        />
      )
    },
    {
      query: 'status',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'> Player status</label>
          <Select
            className="filters-selector"
            id="cPStatus"
            size="small"
            style={{ width: '100%', minWidth: '150px' }}
            onChange={(value: string) => {
              addBodyFilter({
                status: value
              });
              addFilter({
                page: {
                  params: ['0'],
                },
              });
            }}
            value={bodyFilterState?.status ?? ''}
          >
            <Select.Option key="allStatus" value={''}> All </Select.Option>
            <Select.Option key="activeStatus" value={'ACT'}> Active </Select.Option>
            <Select.Option key="deactiveStatus" value={'DEC'}> Inactive </Select.Option>
          </Select>
        </Form.Item>
      ),
    },
  ];
  
  useEffect(() => {
    addBodyFilter({
      teamId: teamSelected?.teamId,
      operator: bodyFilterState?.operator ? bodyFilterState?.operator : 'AND',
    });
  }, [addBodyFilter, addFilter, teamSelected?.teamId, bodyFilterState?.operator]);

  return (
    <Layout>
      <PlayerImportModal open={isModalOpen} setOpen={setIsModalOpen} />
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header">
              <img src="/images/player-icon.svg" alt="" width="20px" />
              <span className="navigation-bar">players</span>
            </div>
          }
          rightBar={partOptionsBar}
        />
        <InfiniteTable
          url={API.PLAYER.PLAYERS_PAGE()}
          filterLabels="vertical"
          fetchType="POST"
          columns={columns}
          filters={playersFilters}
          bodyFilters={playerBodyFilter}
          filterName={PLAYERS_FILTER}
          columnEditName={TABLE_EDIT_NAME.PLAYER_COLUMNS}
          defaultFiltersObject={filters}
          downloadButtons={{
            title: 'Import/Export',
            buttonArray: [{
              title: 'Download Apparel CSV',
              onClick: (a: any, disableLoader: any) => {
                downloadCsv(
                  `apparel-export-${teamSelected.abbr}-${moment().local().format(dateFormatTableSec)}.csv`,
                  API.APPAREL.EXPORT_CSV(teamSelected.teamId),
                  'POST',
                  bodyFilterState, 'application/json', () => disableLoader());
              }},
              {
                title: 'Import Apparel CSV',
                icon: <UploadOutlined style={{ color: '#013369', marginRight: "8px" }} />,
                onClick: (a: any, disableLoader: any) => {
                  setIsModalOpen(true);
                  disableLoader();
              }}
            ],
          }}
          onSearch="column"
          paged
        />
        <PlayerProfileDrawer openDrawer={showProfileDrawer} closeDrawer={closeProfileDrawer} />
        {showReport && <Report closeModal={closeReports} showModal={showReport} />}
      </div>
    </Layout>
  );
};

