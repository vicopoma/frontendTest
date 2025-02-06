import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Radio, Select, Switch, Tooltip } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

import { playerColumns } from '../../../../Types/Types';
import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import {
  ACCOUNT_ROLES,
  ACTIVITY_TYPE,
  ASCEND,
  EQUIPMENT_TYPE_SETTER,
  EQUIPMENT_TYPES,
  pageSize,
  ROLE_HIERARCHY,
  SCAN_DETAIL_PLAYER_FILTER,
  TABLE_EDIT_NAME,
  WEEK_IN_HOURS,
  SCAN_DETAIL_FILTER,
} from '../../../../constants/constants';
import { PlayerState } from '../../../../store/types/players';
import { useLocation } from 'react-router';
import { useActivitiesState } from '../../../../hook/hooks/activity';
import { ROUTES } from '../../../../settings/routes';
import { history } from '../../../../store/reducers';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { API } from '../../../../settings/server.config';
import { useAccountState } from '../../../../hook/hooks/account';
import { EquipmentCounterBadge } from '../../../Equipment/EquipmentCounterBadge/EquipmentCounterBadge';
import { useScheduleFunctions } from '../../../../hook/customHooks/schedule';
import {
  useBodyFilterParams,
  useFilterParams,
  useSorterColumnSelector
} from '../../../../hook/customHooks/customHooks';
import { debounce, isBoolean, isInAllowedTimeStartOf } from '../../../../helpers/Utils';
import moment from 'moment';
import CustomInput from '../../../Shared/CustomInput/Input';
import { SelectOptions } from '../../../Shared/Select/Select';
import { usePlayerList } from '../../../../hook/customHooks/players';
import { ExtraCleatDrawer } from './ExtraCleatDrawer';

export const ScanReportsByPlayer = ({ scanReportType, setScanReportType }: {
  setScanReportType: React.Dispatch<React.SetStateAction<number>>,
  scanReportType: number
}) => {

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const activityType = path[path.length - 2];
  const activityId = path[path.length - 1];

  const { activity } = useActivitiesState();
  
  const filterName = SCAN_DETAIL_PLAYER_FILTER + activityId;
  const { bodyFilter: scanBodyFilters, addBodyFilter } = useBodyFilterParams(filterName)
  const { filter: scanFilterParams, addFilter } = useFilterParams(filterName, {
    status: {
      params: ['']
    },
    assigned: {
      params: ['true']
    },
    size: {
      params: [pageSize]
    }
  });
  const equipmentsColumns = [EQUIPMENT_TYPES.CLEAT, EQUIPMENT_TYPES.HELMET, EQUIPMENT_TYPES.SHOULDER_PAD, EQUIPMENT_TYPES.KNEE_BRACE, EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR];

  const { equipmentCounter: { loadEquipmentCount, equipmentCount } } = useScheduleFunctions();
  const { playerKeyList: { playerKeys, getPlayerKeys }} = usePlayerList();

  const { account } = useAccountState();

  const { changeChosenColumn } = useSorterColumnSelector()
  const [tags, setTags] = useState<Array<SelectOptions> > ( scanBodyFilters?.keys ? scanBodyFilters.keys.map((data: string) => ({value: data, display: data})) : []);
  
  const component = SCAN_DETAIL_FILTER + activityId;
  const initExtraScanBodyFilter = {
    includeExtraEquipments: true,
    includeExtraCleats: true,
    includeExtraKneeBraces: true,
  }
  const { bodyFilter: scanDetailFilter } = useBodyFilterParams(component, initExtraScanBodyFilter);

  useEffect(() => {
    if (isBoolean(scanDetailFilter?.includeExtraEquipments) && !!scanBodyFilters.sessionId) {
      setTimeout(() => {
        addBodyFilter({
          includeExtraEquipments: !!scanDetailFilter?.includeExtraEquipments,
          includeExtraCleats: !!scanDetailFilter?.includeExtraCleats,
          includeExtraKneeBraces: !!scanDetailFilter?.includeExtraKneeBraces,
        });
      }, 400)
    }
  }, [addBodyFilter, scanDetailFilter, scanBodyFilters.sessionId]);

  useEffect(() => {
    if(scanBodyFilters?.keys) {
      setTags(scanBodyFilters?.keys.map((data: string) => ({
        value: data,
        display: data
      })))
    }
  }, [scanBodyFilters?.keys])
  
  useEffect(() => {
    addFilter({
      sessionId: {
        params: [activityId]
      },
      size: {
        params: [pageSize]
      },
      status: {
        params: ['ACT']
      },
    })
  }, [activityId, activityType, addFilter]);

  useEffect(() => {
    if (!!activityId) {
      loadEquipmentCount(scanBodyFilters);
    }
  }, [activityId, loadEquipmentCount, scanBodyFilters]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [playerInfo, setPlayerInfo] = useState<Partial<PlayerState>>({});

  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'button',
      key: 'button',
      nonErasable: true,
      width: 3,
      align: 'right',
      render: (a: any, b: PlayerState) => {
        const date = moment(activity.startGameDate).set({ hour: 23, minute: 59 }).utc().toISOString();
        const isAllowed = isInAllowedTimeStartOf(date, 2 * WEEK_IN_HOURS, 'day') || ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN];
        return (
          <Button
            disabled={!isAllowed}
            id="cPView" onClick={() => {
              history.push(ROUTES.ACTIVITY.PLAYER_DETAIL(activityType, activityId, b.id));
            }} style={{ border: 'none', boxShadow: 'none' }}>
            <Tooltip title="More information">
              <img className="img-h anticon"
                src={'/images/edit.svg'}
                alt="" width="18px"
                height="18px" />
            </Tooltip>
          </Button>
        );
      }
    },
    {
      title: 'First Name',
      dataIndex: playerColumns.displayName,
      key: playerColumns.displayName,
      width: 10,
      sorter: true,
      defaultSortOrder: ASCEND,
      align: 'left',
      render: (a: string, b: PlayerState) => {
        return `${b.firstName}`;
      }
    },
    {
      title: 'Last Name',
      dataIndex: 'displayLastName',
      key: playerColumns.displayLastName,
      width: 10,
      align: 'left',
      sorter: true,
      render: (a: string, b: PlayerState) => {
        return `${b.lastName}`;
      }
    },
    {
      title: 'Football Name',
      dataIndex: 'displayFootballName',
      key: playerColumns.displayFootballName,
      width: 10,
      align: 'left',
      sorter: true,
      render: (a: string, b: PlayerState) => {
        return `${b.footballName}`;
      }
    },
    activityType === ACTIVITY_TYPE.GAME ? {
      title: 'Team',
      dataIndex: '',
      sorter: true,
      key: playerColumns.teamAbbr,
      render: (a: any, b: PlayerState) => {
        return b.teamAbbr;
      }
    } : {
      title: '',
      key: '',
      dataIndex: '',
    },
    {
      title: 'Jersey #',
      dataIndex: 'jerseyNumber',
      key: playerColumns.jerseyNumber,
      width: 10,
      sorter: true,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'statusShortDescription',
      key: 'status_short_description',
      sorter: true,
      width: 12
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
            statisticsTooltip
            customEquipments={equipmentsColumns}
            equipmentAssigned={equipmentCount}
            initialValue={scanFilterParams?.sort?.params?.[0]}
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
        return (
          <EquipmentCounterBadge 
            customEquipments={equipmentsColumns} 
            equipmentAssigned={b.equipmentAssigned} 
            onClick={activityType === ACTIVITY_TYPE.GAME ? () => { 
              setIsDrawerOpen(true);
              setPlayerInfo({
                displayName: b.displayName,
                equipmentVMList: b.equipmentVMList.filter(equipment => {
                  return equipment.nameEquipmentType === EQUIPMENT_TYPES.CLEAT;
                }),
                jerseyNumber: b.jerseyNumber,
                status: b.statusShortDescription,
              });
            } : undefined}
            onClickEqType={[EQUIPMENT_TYPES.CLEAT]}
            warning 
          />
        );
      }
    },
    {
      title: '',
      dataIndex: 'button',
      key: 'empty',
      nonErasable: true,
      width: 10,
      align: 'right',
      render: () => (<></>),
    },
  ];

  const searchKeysFunction = (value: string) => {
    getPlayerKeys({
      status: scanBodyFilters?.status ?? '',
      keyword: value,
      sessionId: activityId,
      teamId: undefined
    });
  }
  const debouncedSearchKeys = useCallback(debounce(searchKeysFunction, 600), []);

  const scanFilters: Array<any> = [
    {
      query: 'tab',
      display: (
        <Form.Item className='select-label-up'>
          <Radio.Group size="large" defaultValue={scanReportType + ''} style={{
            top: '100px'
          }}>
            <Radio.Button
              id="aViewSchedule"
              value="1"
              onChange={() => {
                setScanReportType(1);
              }}>
              <img src="/images/player-icon.svg" width="14px" alt="" />
            </Radio.Button>
            <Radio.Button
              id="aViewList"
              value="0"
              onChange={() => setScanReportType(0)}>
              <UnorderedListOutlined />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      )
    },
    {
      query: 'searchWithTags',
      display: (
        <CustomInput.SearchAndTag
          id='cPInputSearch'
          inputKey="PlayerSearchTag"
          placeholder="Search..."
          size="small"
          style={{minWidth: '400px'}}
          nameView={`activity_${activityType}_scan_${activityId}_player`}
          bodyFilterName={filterName}
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
          operator={scanBodyFilters?.operator ? scanBodyFilters?.operator : 'AND'}
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
      query: 'team',
      display: (
        (activityType === ACTIVITY_TYPE.GAME && account?.role?.name === 'zebra-admin') &&
        (
          <Form.Item className='select-label-up'>
            <label className='label-select'>Team</label>
            <Select
              className="filters-selector"
              style={{ width: '125px' }}
              value={scanBodyFilters?.teamId ?? undefined}
              onChange={(value) => {
                addBodyFilter({
                  teamId: value
                })
              }}
              placeholder="Team"
              size="small">
              <Select.Option value=""> All </Select.Option>
              <Select.Option value={activity.homeTeamId}> {activity.homeTeamName}</Select.Option>
              <Select.Option value={activity.visitTeamId}> {activity.visitTeamName}</Select.Option>
            </Select>
          </Form.Item>
        )
      )
    },
    {
      query: 'status',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Player Status</label>
          <Select
            className="filters-selector"
            id="player-status"
            style={{ width: '125px' }}
            onChange={(value) => {
              addBodyFilter({
                status: value
              })
            }}
            placeholder="Status"
            size="small"
            value={scanBodyFilters?.status ?? undefined}
          >
            <Select.Option key="allStatus" value={''}> All </Select.Option>
            <Select.Option key="activeStatus" value={'ACT'}> Active </Select.Option>
            <Select.Option key="deactiveStatus" value={'DEC'}> Inactive </Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'assigned',
      display: (activityType === ACTIVITY_TYPE.GAME) && (
        <Form.Item className='select-label-up'>
          <Switch
            checked={scanBodyFilters?.assigned === 'false'}
            onChange={(e) => {
              addBodyFilter({
                assigned: !e + ''
              })
            }}
          />
          <b> Only assigned </b>
        </Form.Item>
      )
    }
  ];
  
  const playerBodyFilter = {
    teamId: '',
    sessionId: activityId,
    status: 'ACT',
    operator: 'AND'
  };

  const [, setTriggerEq] = useState<number>(0);
  const updateTrigger = () => {
    setTriggerEq((trigger) => {
      addBodyFilter({
        trigger: trigger
      });
      return trigger + 1;
    })
  }
  
  return (
    <>
    <ExtraCleatDrawer
      showDrawer={isDrawerOpen}
      closeDrawer={() => {
        setIsDrawerOpen(false);
        setPlayerInfo({});
      }}
      onSave={updateTrigger}
      playerInfo={playerInfo}
    />
    <InfiniteTable
      url={API.PLAYER.PLAYERS_PAGE()}
      fetchType="POST"
      columns={columns}
      bodyFilters={playerBodyFilter}
      filterName={filterName}
      filterLabels="vertical"
      columnEditName={TABLE_EDIT_NAME.SCAN_REPORT_PLAYER_COLUMN}
      filters={scanFilters}
      defaultFiltersObject={{}}
      paged
    />
    </>
  );
};
