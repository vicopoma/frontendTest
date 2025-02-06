import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Dropdown, Form, Layout, Menu, Select, Tag } from 'antd';
import CustomInput from '../Shared/CustomInput/Input';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Redirect, useLocation } from 'react-router-dom';
import moment from 'moment';

import { useEquipmentTypeState } from '../../hook/hooks/equipmentType';
import { EquipmentState, FilterState, ManufacturerWithModel, MULTICHECK_EQUIPMENT_ACTIONS } from '../../store/types';
import { InfiniteTable, MultiCheckProps } from '../Shared/Table/InfiniteTable';
import {
  ACCOUNT_ROLES, ASCEND,
  DATE_FORMATS,
  EMPTY_ARRAY,
  EQUIPMENT,
  EQUIPMENT_TYPES,
  NECK_RESTRAINT,
  NEW,
  pageSize,
  ROLE_HIERARCHY,
  TABLE_EDIT_NAME
} from '../../constants/constants';
import { useAccountState } from '../../hook/hooks/account';
import {
  debounce,
  downloadCsv,
  generateEquipmentTypeName,
  progressBarSessionStorageHandler,
  roleCanModify,
  toPrint,
  verifyScannerInput
} from '../../helpers/Utils';
import { TreeNode } from '../Shared/TreeFormComponents/TreeFormTypes';
import { history } from '../../store/reducers';
import { ROUTES } from '../../settings/routes';
import { NavigationBar } from '../Shared/NavigationBar/NavigationBar';
import { SelectorTree } from '../Shared/TreeFormComponents/SelectorTree/SelectorTree';
import { Columns } from '../Shared/Table/CustomTable/Table';
import { hexToAscii } from '../../helpers/ConvertUtils';
import { API } from '../../settings/server.config';
import { useEquipmentConstructor, useEquipmentFunctions } from '../../hook/customHooks/equipment';
import { useArraySelector, useBodyFilterParams } from '../../hook/customHooks/customHooks';
import Icon from '../Shared/CommomIcons/Icons';
import { SelectOptions } from '../Shared/Select/Select';
import Image from '../Shared/Image/Image';
import { TeamsSelector } from '../Shared/TreeSelectors/TeamsSelector';
import './EquipmentView.scss';
import { ConfirmationModal } from '../Shared/Modals/Modals';
import { useDownloadFunctions } from '../../hook/customHooks/download';
import { SuccessMessage } from '../Shared/Messages/Messages';
import { useNotificationContext } from '../../context/notifications';
import { useSocketDSProvider } from '../../context/socketDS';

enum equipmentColumns {
  activityCount = 'activity_count',
  checkbox = 'checkbox',
  createdBy = 'create_by',
  createdDate = 'create_date',
  equipmentCode = 'equipment_code',
  manufacturer = 'name_manufacturer',
  manufacturerId = 'manufacturer_nfl_id',
  model = 'name_model',
  modelId = 'model_nfl_id',
  modelCode = 'model_code',
  modelYear = 'model_year',
  modifiedBy = 'modified_by',
  modifiedDate = 'modified_date',
  note = 'notes',
  playerId = 'player_nfl_id',
  position = 'position',
  displayName = 'display_name',
  jerseyNumber = 'jersey_number',
  teamName = 'team_name',
  teamId = 'team_id',
  tag = 'tag_equipment',
  tags = 'tagsCode',
}

const EQUIPMENT_SELECTOR_TREE = {
  MANUFACTURER: 'equipment-manufacturer-tree',
  TEAMS: 'equipment-teams-tree',
};

export const EquipmentView = () => {
  const path = useLocation().pathname.split('/');
  const equipmentTypeId = path[path.length - 1];
  
  const {enableFetch, manufacturersWithModels, equipmentParams} = useEquipmentConstructor();
  
  const { equipmentKeyList: { equipmentKeys, getEquipmentKeys }} = useEquipmentFunctions();
  const {equipmentTypeList} = useEquipmentTypeState();
  const {bodyFilter: equipmentBodyFilter, addBodyFilter} = useBodyFilterParams(EQUIPMENT + equipmentTypeId);
  const { addBodyFilter: addEquipmentFilter } = useBodyFilterParams(EQUIPMENT);
  const {account, teamSelected} = useAccountState();
  const { manufacturerId, equipmentTypeDTOList } = account;
  const [subMenuTree, setSubMenuTree] = useState<Array<TreeNode>>([]);
  const [, setTag] = useState<string>('');

  const isOem = account.role.name === ACCOUNT_ROLES.OEM_ADMIN || account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  const isHelmetType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET && data.id === equipmentTypeId).length > 0;
  const isShoulderPadType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.SHOULDER_PAD && data.id === equipmentTypeId).length > 0;
  const { downloadTagHistory } = useDownloadFunctions();
  const { updateProgressBar } = useNotificationContext();

  const [tags, setTags] = useState<Array <SelectOptions>> (() => {
    if(equipmentBodyFilter?.keys) {
      const cur: Array<SelectOptions> = [];
      equipmentBodyFilter?.keys.forEach((data: string) => {
        cur.push({
          value: data,
          display: data
        })
      });
      return cur;
    }
    return []
  });

  const [, setTriggerEq] = useState<number>(0);

  const updateTrigger = () => {
    setTriggerEq((trigger) => {
      addBodyFilter({
        trigger: trigger
      });
      return trigger + 1;
    })
  }

  useEffect(() => {
    if(!equipmentBodyFilter?.operator) {
      addBodyFilter({
        operator: 'AND'
      })
    }
  });

  useEffect(() => {
    if(!equipmentBodyFilter?.importedByOem) {
      addBodyFilter({
        importedByOem: false,
      })
    }
  }, []);
  
  useEffect(() => {
    if(!!equipmentParams?.tag) {
      setTag(hexToAscii(equipmentParams?.tag));
    }
  }, [equipmentParams, equipmentParams?.tag]);
  
  useEffect(() => {
    if(equipmentBodyFilter?.keys) {
      setTags(equipmentBodyFilter?.keys.map((data: string) => ({
        value: data,
        display: data
      })))
    }
  }, [equipmentBodyFilter?.keys]);
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.OEM_TEAM_USER);
  const isUpToUserTeam: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.USER_TEAM);
  
  const currentEquipmentTypeSelected = equipmentTypeList.filter(type => type.id === equipmentTypeId)?.[0]?.nameEquipmentType;
  
  const currentType = equipmentTypeList.filter(type => type.id === equipmentTypeId);

  const { add, erase, eraseAll, value: eqSelected } = useArraySelector({
    initialValues: EMPTY_ARRAY,
    nonErasableValues: EMPTY_ARRAY,
    totalDefaultValues: EMPTY_ARRAY,
  });

  useEffect(() => {
    eraseAll();
  }, [teamSelected, eraseAll]);

  const { multiCheckList } = useEquipmentFunctions();

  const searchKeysFunction = (value: string) => {
    getEquipmentKeys({
      ...equipmentParams,
      keyword: value
    })
  }
  const debouncedSearchKeys = useCallback(debounce(searchKeysFunction, 600), []);
  
  const buildSubTreeNodeFromManufacturer = useCallback(
    (manufacturerWithModels: Array<ManufacturerWithModel>): TreeNode => {
      return {
        name: 'Manufacturer',
        id: '5',
        value: '0',
        display: 'Manufacturer',
        icon: <img className="img-h anticon" src="/images/manufacturer-icon.svg" width="16px" alt=""/>,
        shown: true,
        className: 'filter-menu-select-first',
        children: manufacturerWithModels.filter(manufacturer => (isOem && manufacturerId && manufacturerId === manufacturer.id) || !manufacturerId)
          .map((manufacturer) => {
          return {
            name: manufacturer.nameManufacturer,
            display: manufacturer.nameManufacturer,
            shown: true,
            id: manufacturer.nameManufacturer + '',
            checkbox: {
              checked: true,
            },
            className: 'filter-menu-select-second',
            children: manufacturer.models.map((models) => {
              return {
                name: models.nameModel,
                display: <span style={{fontSize: '12px'}}> {models.nameModel} </span>,
                value: `${models.id}|${manufacturer.id}`,
                id: models.nameModel + '',
                shown: true,
                checkbox: {
                  checked: true,
                },
              };
            }),
            value: manufacturer.id,
          };
        })
      };
    }, [manufacturerId, isOem]);
  
  const columns: Array<Columns> = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: equipmentColumns.checkbox,
      nonErasable: true,
      show: true,
      render: (a: boolean, b: EquipmentState) => {
        return <Checkbox 
          checked={eqSelected.indexOf(b.id) >= 0}
          id={`eC${b.tag}`}
          onChange={e => {
            if(e.target.checked) {
              add(b.id);
            } else {
              erase(b.id);
            }
          }}
          style={{ zIndex: -1}}
        />
      }
    },
    {
      title: 'Assigned',
      dataIndex: 'displayName',
      key: equipmentColumns.displayName,
      sorter: true,
      show: true,
      render: (a:string) => {
        return <div style={{ minWidth: "150px"}}>{a}</div>;
      }
    },
    {
      title: 'Jersey Number',
      dataIndex: 'jerseyNumber',
      key: equipmentColumns.jerseyNumber,
      sorter: true,
      show: true,
    },
    {
      title: 'Player Position',
      dataIndex: 'position',
      key: equipmentColumns.position,
      sorter: true,
      show: true,
    },
    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] &&
    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER] ? {
      title: 'Team',
      dataIndex: 'teamName',
      key: equipmentColumns.teamName,
      sorter: true,
      show: true,
      align: 'center',
    } : {
      title: '',
      dataIndex: '',
      key: equipmentColumns.teamName,
    },
    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.USER_TEAM] &&
    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] !== ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER] ? {
      title: 'Team ID',
      dataIndex: 'teamId',
      key: equipmentColumns.teamId,
      sorter: true,
      show: true,
      align: 'center',
    } : {
      title: '',
      dataIndex: '',
      key: equipmentColumns.teamId,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: equipmentColumns.manufacturer,
      sorter: true,
    },
    {
      title: 'Manufacturer ID',
      dataIndex: 'manufacturerId',
      key: equipmentColumns.manufacturerId,
      show: true,
      sorter: true
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: equipmentColumns.model,
      sorter: true,
      show: true,
      render: (a: string) => {
        return <div style={{ minWidth: "185px" }}>{a}</div>
      }
    },
    currentType[0]?.nflId !== '111' ? {
      title: 'Model Id',
      dataIndex: 'modelId',
      key: equipmentColumns.modelId,
      sorter: true,
      show: true,
    } : {
      title: '',
      dataIndex: '',
      show: false,
      key: 'modelId',
    },
    currentType[0]?.nflId === '1' ? {
      title: 'Model Code',
      dataIndex: 'modelCode',
      key: equipmentColumns.modelCode,
      sorter: true,
      show: true,
      render: (a: string) => {
        return <div style={{ minWidth: "120px" }}>{a}</div>
      }
    } : {
      title: '',
      dataIndex: '',
      show: false,
      key: 'modelCode',
    },
    {
      title: 'Model Year',
      dataIndex: 'modelYear',
      key: equipmentColumns.modelYear,
      sorter: true,
      show: true,
      align: 'center',
    },
    {
      title: 'Created By',
      dataIndex: 'createBy',
      key: equipmentColumns.createdBy,
      sorter: true,
      show: true,
      render: (a: string) => {
        return <div style={{ minWidth: "165px" }}>{a}</div>
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'createDate',
      key: equipmentColumns.createdDate,
      sorter: true,
      show: true,
      align: 'center',
      render: (a: string) => {
        return a ? moment(new Date(a), DATE_FORMATS.yearMonthDay).local().format(DATE_FORMATS.monthDayYearHourMin) : '';
      }
    },
    {
      title: 'Player ID',
      dataIndex: 'playerId',
      key: equipmentColumns.playerId,
      sorter: true,
      show: true,
      align: 'center',
    },
    {
      title: 'Activity Count',
      dataIndex: 'activityCount',
      key: equipmentColumns.activityCount,
      sorter: false,
      show: true,
      align: 'center',
    },
    (isShoulderPadType || isHelmetType) ?
    {
      title: `Last ${isShoulderPadType ? 'Recondition' : 'Recertification'} Date`,
      dataIndex: `last${isShoulderPadType ? 'Recondition' : 'Recertification'}Date`,
      key: 'lastRecertificationDate',
      sorter: false,
      show: true,
      align:'center',
      render: (a: string) => {
        return a ? moment(new Date(a), DATE_FORMATS.yearMonthDay).local().format(DATE_FORMATS.monthDayYear) : '';
      }
    } : {
      title: '',
      dataIndex: '',
      key: 'lastRecertificationDate',
    },
    {
      title: 'Last Update By',
      dataIndex: 'lastUpdateBy',
      key: equipmentColumns.modifiedBy,
      sorter: true,
      show: true,
      render: (a: string) => {
        return <div style={{ minWidth: "170px" }}>{a}</div>
      }
    },
    {
      title: 'Last Update Date',
      dataIndex: 'lastUpdatedDate',
      key: equipmentColumns.modifiedDate,
      sorter: true,
      show: true,
      render: (a: string) => {
        return moment(new Date(a), DATE_FORMATS.yearMonthDay).local().format(DATE_FORMATS.monthDayYearHourMin);
      }
    },
    {
      title: 'Last Seen',
      key: 'last_session_scan',
      dataIndex: 'lastSessionScan',
      sorter: true,
      width: 40,
      render: (a: string) => {
        if(a) {
          return moment(a).format(DATE_FORMATS.monthDayYearHourMin);
        }
        return '';
      },
    },
    isShoulderPadType ? {
      title: 'Imported by OEM',
      key: 'importedByOem',
      dataIndex: 'importedByOem',
      align: 'center',
      show: false,
      width: 20,
      render: (a: boolean) => {
        return <div>{a ? 'Yes' : 'No'}</div>
      }
    } : {
      title: '',
      dataIndex: '',
      key: 'importedByOem',
    },
    {
      title: 'Out for Recondition',
      dataIndex: 'reconditionStatus',
      key: 'recondition_status',
      width: 3,
      align: 'center',
      sorter: true,
      render: (a: boolean, b: EquipmentState) => (
        <div id={`"cERecondition${b?.tag ?? ''}`}>{a ? 'Yes': 'No'}</div>
      )
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: equipmentColumns.note,
      sorter: true,
      show: true,
      render: (a: string) => {
        return <div style={{ minWidth: "400px"}}>{a}</div>
      }
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: equipmentColumns.tag,
      show: true,
      render(a: any, b: EquipmentState) {
        if (!!b.tag) {
          const tag: Array<string> = b.tag.split(',');
          return <> {
            tag?.length ? <Tag color="default">
              {tag[0]}
            </Tag> : <></>
          }
            {
              tag.length > 1 && <Tag>
                  <PlusOutlined/> {tag.length - 1}
              </Tag>
            }
          </>;
        } else {
          return (
            <><Tag style={{width: 60}} color="var(--red)">No Tag</Tag></>
          );
        }
      }
    },
    {
      title: 'Equipment Code',
      dataIndex: 'equipmentCode',
      key: equipmentColumns.equipmentCode,
      defaultSortOrder: ASCEND,
      sorter: true,
    },
  ];
  
  const editEquipmentColumn: Array<Columns> = [
    {
      title: '',
      key: 'editEq',
      dataIndex: 'editEq',
      align: 'right',
      nonErasable: true,
      show: true,
      fixed: 'left',
      width: 1,
      render: (a: any, b: EquipmentState) => {
        const tags = b.tag.split(', ');
        const tagValue = tags.length ? tags[0] : '';
        return (
          <>
            <div className='border-table'></div>
            <Button
              id={`"eEdit${tagValue}`}
              onClick={(e) => {
                if(isOem) {
                  history.push(ROUTES.EQUIPMENT.DETAIL_OEM(equipmentTypeId, b.teamId, b.id));
                } else {
                  history.push(ROUTES.EQUIPMENT.DETAIL(equipmentTypeId, b.id));
                }
              }}
              style={{border: 'none', boxShadow: 'none'}}>
              <img
                className="img-h anticon"
                src={!canModify ? '/images/eye-icon.svg' : '/images/edit.svg'}
                alt="" width="18px"
                height="18px"
              />
            </Button>
          </>
        );
      }
    }
  ];
  
  const equipmentListFilters: Array<{ query: string, display: JSX.Element }> = [
  
    {
      query: 'test',
      display: (
        <CustomInput.SearchAndTag
          id='cPInputSearch'
          key={equipmentTypeId}
          placeholder="Search..."
          size="small"
          style={{minWidth: '400px'}}
          tagValues={tags}
          nameView={`equipment_${equipmentTypeList.filter(equipment => equipment.id === equipmentTypeId)[0]?.nameEquipmentType?.toLowerCase().replace(' ', '_')}`}
          bodyFilterName={EQUIPMENT + equipmentTypeId}
          onChange={(value: SelectOptions[]) => {
            setTags(value);
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
          operator={equipmentBodyFilter?.operator ? equipmentBodyFilter?.operator : 'AND'}
          onSearch={debouncedSearchKeys}
          options={equipmentKeys.map(key => ({
            value: key,
            display: key
          }))}/>
      )
    },
    {
      query: 'manufacturerTree',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'> Manufacturer</label>
          <SelectorTree
            style={{ minWidth: "190px"}}
            selectAll
            selectorTreeName={EQUIPMENT_SELECTOR_TREE.MANUFACTURER + equipmentTypeId}
            placeholder="Manufacturers"
            icon={
              <img src="/images/manufacturer-icon.svg" alt="" width="16px"/>
            }
            nodes={subMenuTree}
            isApply={(dataPerLevel, dataPerNode) => {
              const cleanedDataPerLevelTwo: Set<string> = new Set<string>();
              dataPerLevel[1].forEach(value => {
                cleanedDataPerLevelTwo.add(value.split('|')[0]);
              });
              addBodyFilter({
                ...equipmentParams,
                manufacturerIds: Array.from(dataPerLevel[0]),
                equipmentModelIds: Array.from(cleanedDataPerLevelTwo),
              });
            }}
          />
        </Form.Item>
      )
    },
    {
      query: 'teamsSelector',
      display: (
        isOem ? <TeamsSelector 
          name={EQUIPMENT_SELECTOR_TREE.TEAMS + equipmentTypeId}
          onChange={teams => {
            addBodyFilter({
              teamIds: teams
            })
          }}
        /> : <div />
      )
    }, 
    {
      query: 'checkBoxUnassigned',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'> Equipment Status</label>
          <Select
            className="filters-selector"
            size="small"
            style={{width: '140px'}}
            value={equipmentParams?.selected}
            onChange={(value) => {
              addBodyFilter({
                selected: value
              });
            }}
          >
            <Select.Option value="all"> All </Select.Option>
            <Select.Option value="assigned"> Assigned </Select.Option>
            <Select.Option value="unassigned"> Unassigned </Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'Archived',
      display: (
        <Form.Item className='select-label-up'>
          <Checkbox
            id="eCheckboxArchived"
            checked={equipmentParams?.archived}
            onChange={(e) => {
              addBodyFilter({
                archived: e.target.checked
              })
            }}>
            Show Archive
          </Checkbox>
        </Form.Item>
      )
    },
    isShoulderPadType ? {
      query: 'importedByOem',
      display: (
        <Form.Item className='select-label-up'>
          <Checkbox
            checked={equipmentParams?.importedByOem}
            onChange={(e) => {
              addBodyFilter({
                importedByOem: e.target.checked
              })
            }}>
            Imported Equipment
          </Checkbox>
        </Form.Item>
      )
    } : {
      query: '',
      display: <></>
    }
  ];

  const teamsMenu = (
    <Menu className="blue-scroll" style={{ width: "118px", height: "200px", left: "25px",  overflowY: "auto"}}>
      {
        account.teamList.map((team, index) => {
          let pathImage = `/images/teams/logos/${team.fullName}.svg`;
          return (
            <Menu.Item
              key={index}
              onClick={() => {
                history.push(ROUTES.EQUIPMENT.DETAIL_OEM(equipmentParams.equipmentTypeId, team.teamId,NEW));
            }}>
              <div>
                <Image key={team.fullName} src={pathImage} srcDefault={'/images/team-icon.svg'} style={{ width: "30px" }} alt="logo"/>
                <span style={{color: 'var(--blue-dark)', fontWeight: 'bold', marginLeft: "10px"}}>
                  {team.fullName}
                </span>
              </div>
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
  
  const partOptionsBar: Array<any> = [
    canModify ? (isUpToUserTeam ? 
      <Button id="eNew" size="small" className="btn-green" onClick={() => {
        history.push(ROUTES.EQUIPMENT.DETAIL(equipmentParams.equipmentTypeId, NEW));
      }}>
        <PlusOutlined/> NEW EQUIPMENT
      </Button> :
      <Dropdown overlay={teamsMenu} trigger={['click']}>
        <Button id="eNew" size="small" className="btn-green">
          <PlusOutlined/> NEW EQUIPMENT
        </Button>
      </Dropdown>
      ) : <div />
  ];
  
  const equipmentFilterDefault: FilterState = {
    sort: {
      params: [equipmentColumns.equipmentCode, 'asc']
    },
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    },
    teamId: {
      params: [teamSelected?.teamId]
    }
  };
  
  const partsColumns: Array<Columns> = currentType?.[0]?.extraInformation.length > 0 ? currentType?.[0]?.extraInformation?.filter(info => info !== NECK_RESTRAINT).map(info => (
    {
      title: toPrint(info),
      dataIndex: info,
      key: info.toLowerCase(),
      sorter: false,
      show: false,
      render: (a: any, b: EquipmentState, c: any, d: string) => {
        return b.components[d];
      }
    }
  )) : [];

  const neckRestraintColumns: Array<Columns> = isShoulderPadType ? [
    {
      title: NECK_RESTRAINT,
      dataIndex: NECK_RESTRAINT,
      key: 'neck restraint',
      sorter: false,
      show: false,
      render: (a: any, b: EquipmentState, c: any, d: string) => {
        return b.components[d];
      }
    },
    {
      title: `Note (${NECK_RESTRAINT})`,
      dataIndex: 'neckRestraintDesc',
      key: 'neck restraint desc',
      show: false,
    }
  ] : [];
  
  const equipmentColumn = [
    ...editEquipmentColumn,
    ...columns,
    ...partsColumns,
    ...neckRestraintColumns,
  ];
  
  
  useEffect(() => {
    setSubMenuTree([buildSubTreeNodeFromManufacturer(manufacturersWithModels)]);
  }, [buildSubTreeNodeFromManufacturer, manufacturersWithModels]);

  const multiCheckSection: MultiCheckProps = {
    count: eqSelected?.length ?? 0,
    actions: [
      equipmentParams?.archived ? {
        icon: <Icon.Archive archive={false} className="img-h anticon" width="18px" 
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}/>,
        id: 'eUnarchive',
        title: 'Unarchive Equipment',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Unarchive Equipment`,
            `Do you want to unarchive ${eqSelected.length > 1 ? 'these equipment': 'this equipment'}?`,
            () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.ARCHIVE, archived: false };
                multiCheckList(body, () => {
                  eraseAll();
                  updateTrigger();
                });
            })
        }
      } : {
        icon: <Icon.Archive archive width="18px"
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}/>,
        id: 'eArchive',
        title: 'Archive Equipment',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Archive Equipment`,
            `Do you want to archive ${eqSelected.length > 1 ? 'these equipment': 'this equipment'}?`,
            () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.ARCHIVE, archived: true };
              multiCheckList(body, () => {
                eraseAll();
                updateTrigger();
              });
            })
        }
      },
      {
        icon: <Icon.Delete width="15px"
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}/>,
        id: 'eDelete',
        title: 'Delete Equipment',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Delete Equipment`,
            `Do you want to delete ${eqSelected.length > 1 ? 'these equipment': 'this equipment'}?`,
            () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.DELETE };
              multiCheckList(body, () => {
                eraseAll();
                updateTrigger();
              });
            }
          )
        }
      },
      {
        icon: <img className="img-h anticon" src="/images/unassign-icon.svg" alt="" height="18px"
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}} />,
        id: 'eUnassign',
        title: 'Unassign Equipment',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Unassign Equipment`,
            `Do you want to unassign ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from their players?`,
            () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.UNASSIGNED };
              multiCheckList(body, () => {
                eraseAll();
                updateTrigger();
              });
            }
          )
        }
      },
      {
        icon: <img className="img-h anticon" src="/images/out-recondition-icon.svg" alt="" height="20px"
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}/>,
        id: 'eOutRecondition',
        title: 'Equipment Out for Recondition',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Recondition equipment`,
            `Do you want to mark ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} Out for Recondition?`
            , () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.RECONDITION, recondition: true };
              multiCheckList(body, () => {
                eraseAll();
                updateTrigger();
              });
            }
          )
        }
      },
      {
        icon: <img className="img-h anticon" src="/images/received-recondition-icon.svg" alt="" height="20px"
        style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}/>,
        id: 'eReceivedRecondition',
        title: 'Received from Recondition',
        onClick: () => {
          eqSelected.length > 0 && ConfirmationModal(
            `Equipment Received from Recondition`,
            `Do you want to mark ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} as Received from Recondition?`
            , () => {
              const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.RECONDITION, recondition: false };
              multiCheckList(body, () => {
                eraseAll();
                updateTrigger();
              });
            }
          )
        }
      },
    ]
  }

  const { setHandleSuscribe } = useSocketDSProvider();

  const suscribeFunction = useCallback((message: string) => {
    const value = verifyScannerInput(message);
    setTag(hexToAscii(value));
    const obj = {
      value: hexToAscii(value),
      display: hexToAscii(value)
    }
    if (!tags?.map(tag => tag.value)?.includes(obj?.value)) {
      const keys: Array<string> = []
      tags.forEach(val => {
        keys.push(val.display + '')
      })
      keys.push(hexToAscii(value));
      setTags([...tags]);
      addBodyFilter({
        keys: keys
      });
    }
  }, [tags, addBodyFilter]);

  useEffect(() => {
    setHandleSuscribe(() => suscribeFunction);
  }, [setHandleSuscribe, suscribeFunction]);

  if (equipmentTypeId === '-' && equipmentTypeList.length > 0) {
    return <Redirect to={ROUTES.EQUIPMENT.PAGE(equipmentTypeList[1].id)}/>;
  }

  return (
    <>
      <Layout>
        <div className="card-container">
          <NavigationBar
            rightBar={partOptionsBar}
            navTitle={
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    onClick={e => {
                      if (e.key !== equipmentParams?.equipmentTypeId) {
                        setTag('');
                        setTags([]);
                        addEquipmentFilter({
                          equipmentTypeId: e.key,
                        });
                        history.replace(ROUTES.EQUIPMENT.PAGE(e.key));
                      }
                    }}
                  >
                    {
                      isOem ? equipmentTypeDTOList.map(equipmentType => (
                        <Menu.Item key={equipmentType.id}> <span className="type-text">
                          <Icon.Equipment className="navigation-icon" type={equipmentType.nameEquipmentType as EQUIPMENT_TYPES} width="20px"/>
                            <label>
                              {
                                generateEquipmentTypeName(equipmentType.nameEquipmentType)
                              }
                            </label>
                        </span> </Menu.Item>
                      )) : equipmentTypeList.map(equipmentType => (
                        <Menu.Item key={equipmentType.id}> <span className="type-text">
                          <Icon.Equipment className="navigation-icon" type={equipmentType.nameEquipmentType as EQUIPMENT_TYPES} width="20px"/>
                            <label>
                              {
                                generateEquipmentTypeName(equipmentType.nameEquipmentType)
                              }
                            </label>
                        </span> </Menu.Item>
                      ))
                    }
                  </Menu>
                }
              >
                <Button
                  id="bESelectEquipmentType"
                  icon={
                    <Icon.Equipment className="navigation-icon" type={currentEquipmentTypeSelected as EQUIPMENT_TYPES} width="25px"/>
                  }
                  className="navigation-button-eq">
                  
                  <div className="navigation-text">
                    <h4>
                      {generateEquipmentTypeName(currentEquipmentTypeSelected)}
                    </h4>
                    <DownOutlined/>
                  </div>
                </Button>
              </Dropdown>
            }/>
          {
            (
              <InfiniteTable
                key={enableFetch + ''}
                columns={equipmentColumn}
                filterName={EQUIPMENT + equipmentTypeId}
                columnEditName={TABLE_EDIT_NAME.EQUIPMENT_COLUMN + equipmentTypeId}
                url={API.EQUIPMENT.EQUIPMENTS()}
                filterLabels="vertical"
                filters={equipmentListFilters}
                bodyFilters={{}}
                fetchType="POST"
                enableFetch={enableFetch}
                defaultFiltersObject={equipmentFilterDefault}
                downloadButtons={{
                  title: 'Download',
                  buttonArray: [
                    { 
                      title: 'Download CSV', 
                      onClick: (columns: any, disableLoader: any, params: any) => {
                        const newColumns: Array<string> = [];
                        for (const column of columns) {
                          if(!!column?.dataIndex) {
                            newColumns.push(column?.dataIndex ? column?.dataIndex : column?.key);
                          }
                        }
                        downloadCsv(
                          `equipment-export${isOem ? '' : '-' + teamSelected.fullName}-${currentEquipmentTypeSelected}-${moment(new Date()).format(DATE_FORMATS.monthDayYearHourMin)}.csv`,
                          API.EQUIPMENT.EXPORT_EQUIPMENT_CSV(equipmentParams?.teamId, equipmentParams.equipmentTypeId) + params.replace('?', '&'),
                          'POST',
                          {
                            ...equipmentParams,
                            columns: newColumns.filter(column => (column !== 'editEq' && column !== 'importedByOem' && column !== 'checkbox'))
                          }, 'application/json', () => disableLoader());
                      }
                    },
                    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] ? { 
                      title: 'Download All', 
                      onClick: (columns: any, disableLoader: any, params: any) => {
                        const newColumns: Array<string> = [];
                        for (const column of columns) {
                          if(!!column?.dataIndex) {
                            newColumns.push(column?.dataIndex ? column?.dataIndex : column?.key);
                          }
                        }
                        downloadCsv(
                          `equipment-export-all-teams-${currentEquipmentTypeSelected}-${moment(new Date()).format(DATE_FORMATS.monthDayYearHourMin)}.csv`,
                          API.EQUIPMENT.EXPORT_ALL_EQUIPMENT_CSV(equipmentParams.equipmentTypeId),
                          'POST',
                          {
                            ...equipmentParams,
                            tag: '',
                            selected: 'all',
                            playerIds: [],
                            teamIds: [],
                            columns: newColumns.filter(column => (column !== 'editEq' && column !== 'importedByOem'  && column !== 'checkbox'))
                          }, 'application/json', () => disableLoader());
                      }
                    } : undefined,
                    ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] ? { 
                      title: 'Download Tag History', 
                      onClick: (columns: any, disableLoader: any, params: any) => {
                        const body = {
                          ...equipmentBodyFilter,
                          equipmentTypeId: equipmentTypeId,
                          allEquipments: eqSelected.length === 0,
                          equipmentIds: eqSelected,
                        }
                        downloadTagHistory(body, (res, httpResponse) => {
													let code = `deatil-equipment-tag-history.csv`;
													const key = typeof res === 'string' ? res : '';
													progressBarSessionStorageHandler(code, key);
													SuccessMessage({description: httpResponse.message});
                          updateProgressBar();
                          disableLoader();
												});
                      }
                    } : undefined,
                  ],
                }}
                paged
                multiCheckSection={multiCheckSection}
              />
            )
          }
        </div>
      </Layout>
    </>
  );
};
