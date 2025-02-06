import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Checkbox, Col, Row, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { EquipmentInformation, MULTICHECK_EQUIPMENT_ACTIONS } from '../../../../store/types';
import { history } from '../../../../store/reducers';
import { ROUTES } from '../../../../settings/routes';
import Image from '../../../Shared/Image/Image';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { usePlayerContext } from '../../../../context/player';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { useEquipmentFunctions } from '../../../../hook/customHooks/equipment';
import Icon from '../../../Shared/CommomIcons/Icons';
import moment from 'moment';
import { ACTIVITY_TYPE, DATE_FORMATS, EMPTY_ARRAY, EQUIPMENT_TYPES } from '../../../../constants/constants';
import { useArraySelector } from '../../../../hook/customHooks/customHooks';
import { Columns, Table } from '../../../Shared/Table/CustomTable/Table';
import { useFormik } from 'formik';
import { useExtraCleatFunctions } from '../../../../hook/customHooks/scan';
import { SuccessMessage } from '../../../Shared/Messages/Messages';

export const EquipmentAssigned = ({hasEqType, sessionId}: {
  sessionId?: string,
  hasEqType?: (eqType: string) => {},
}) => {
  
  const {values: player, loadPlayer} = usePlayerContext();
  const { unassignPlayerEqList, multiCheckList } = useEquipmentFunctions();
  const paths = useLocation().pathname.split('/');
  const playerId = paths[paths.length - 1];
  const activityType = paths[paths.length - 3];

  const prevEquipmentIds = useRef<Array<string>>(EMPTY_ARRAY);

  const dataSource = useMemo(() => {
    return (sessionId ? player.equipmentVMList : player.equipmentVMList.filter(equipment => !equipment.archived)).filter(equipment => {
      if(hasEqType) {
        return hasEqType(equipment.nameEquipmentType + '');
      } 
      return true;
    })}, [hasEqType, sessionId]);

  const equipmentIds = useMemo(() => {
    return dataSource.map(equipment => equipment.id)
  }, [dataSource]);

  const initialEquipmentIds = useMemo(() => {
    return dataSource
      .filter(equipment => prevEquipmentIds.current.indexOf(equipment.id) >= 0)
      .map(equipment => equipment.id);
  }, [dataSource]);
  
  const { add, addAll, erase, eraseAll, hasAll, value: eqSelected } = useArraySelector({
    initialValues: initialEquipmentIds,
    nonErasableValues: EMPTY_ARRAY,
    totalDefaultValues: equipmentIds,
  });

  useEffect(() => {
    prevEquipmentIds.current = eqSelected;
  }, [eqSelected]);

  const { values, setFieldValue } = useFormik({
    initialValues: dataSource,
    enableReinitialize: true,
    onSubmit(values: EquipmentInformation[]) {
      //intentionally empty
    }
  });

  const { updateExtraCleats } = useExtraCleatFunctions();
  
  const columnsEquipmentAssigned: Columns[] = [
    {
      title: '',
      dataIndex: 'archived',
      key: 'archived',
      align: 'right' as 'right',
      fixed: 'left',
      width: 1,
      render: (archived: boolean, b: EquipmentInformation) => {
        return (
          <div style={{ display: 'flex'}}>
            {
              !sessionId && player.currentTeamId === b.teamId ? (
                <Button
                  id={`"eEdit${b?.tags?.length ? hexToAscii(b?.tags[0]) : ''}`}
                  onClick={() => {
                    history.push(ROUTES.PLAYER.EDIT_EQUIPMENT(playerId, b.equipmentTypeId, b.id));
                  }}
                  style={{ border: 'none', boxShadow: 'none', marginTop: '5px' }}>
                  <img
                    className="img-h anticon"
                    src={'/images/edit.svg'}
                    alt="" width="18px"
                    height="18px"
                  />
                </Button>
              ) : <Button
                style={{ border: 'none', boxShadow: 'none', visibility: 'hidden' }}>
                <img
                  className="img-h anticon"
                  src={'/images/edit.svg'}
                  alt="" width="18px"
                  height="18px"
                />
              </Button>
            }
          </div>
        );
      }
    },
    {
      title: '',
      subTitle: (
        <Checkbox 
          checked={hasAll && eqSelected.length > 0}
          id="pEAllAssigned"
          onChange={e => {
            if(e.target.checked) {
              addAll()
            } else {
              eraseAll();
            }
          }}
        />
      ),
      dataIndex: 'archived',
      key: 'checkbox',
      width: 3,
      render: (a: boolean, b: EquipmentInformation) => {
        return <Checkbox 
          checked={eqSelected.indexOf(b.id) >= 0}
          id={`pEAssigned${hexToAscii(b.tags?.[0] ?? '')}`}
          onChange={e => {
            if(e.target.checked) {
              add(b.id);
            } else {
              erase(b.id);
            }
          }}
        />
      }
    },
    {
      title: 'Equipment Type',
      dataIndex: 'nameEquipmentType',
      key: 'nameEquipmentType',
      width: 10,
      render: (a: string, b: EquipmentInformation) => {
        return (
          <div>
            <Icon.Equipment className="navigation-icon" type={b.nameEquipmentType as EQUIPMENT_TYPES} width="20px"/>
            {a}
          </div>
        )
      }
    },
    {
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: 'nameManufacturer',
      width: 10
    },
    {
      title: 'Model',
      dataIndex: 'nameModel',
      key: 'nameModel',
      width: 13
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tvaluesags',
      width: 13,
      render(tags: Array<any>) {
        if (!!tags) {
          return (
            <>
              {
                tags?.length ? <Tag color="default">
                    {hexToAscii(tags[0])}
                  </Tag> :
                  <Tag style={{width: 60}} color="var(--red)">No Tag</Tag>
                
              }
              {
                tags?.length > 1 && <Tag>
                    <PlusOutlined/> {tags?.length - 1}
                </Tag>
              }
            </>
          );
        } else {
          return (
            <>
              <Tag style={{width: 60}} color="var(--red)">No Tag</Tag>
            </>
          );
        }
        
      }
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      width: 5,
      render: (a: any, b: EquipmentInformation) => {
        let path = `/images/teams/logos/${b.teamName}.svg`;
        return <Image key={b.teamId} src={path} srcDefault={'/images/team-icon.svg'} alt="logo" width="30px" />
      }
    },
    sessionId ? {
      title: '',
      dataIndex: '',
      key: '',
      width: 0,
    } : {
      title: 'Activity Count',
      dataIndex: 'activityCount',
      key: 'activityCount',
      width: 5,
      align: 'center'
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 12
    },
    {
      title: 'Out for Recondition',
      dataIndex: 'reconditionStatus',
      key: 'recondition_status',
      width: 3,
      align: 'center',
      render: (a: boolean, b: EquipmentInformation) => (
        <div id={`"cEAssRecondition${b?.tags?.length ? hexToAscii(b?.tags[0]) : ''}`}>{a ? 'Yes': 'No'}</div>
      )
    },
    {
      title: 'Last seen',
      key: 'modifiedDate',
      dataIndex: 'modifiedDate',
      width: 10,
      render: (a: any, b: EquipmentInformation) => {
        if (b.copyLastScan) {
          return moment(b.copyLastScan).format(DATE_FORMATS.monthDayYearHourMin);
        } else if(b.lastSessionScan) {
          return moment(b.lastSessionScan).format(DATE_FORMATS.monthDayYearHourMin);
        }
        return '';
      },
    },
  ];

  const gameWornCleatColumn: Columns[] = [
    {
      title: 'Game Worn Cleat',
      key: 'extraCleat',
      dataIndex: 'extraCleat',
      width: 10,
      align: 'center',
      render: (a: any, b: EquipmentInformation, c: any) => {
        return (
          b.nameEquipmentType === EQUIPMENT_TYPES.CLEAT ? <Checkbox 
            checked={!values[c]?.extraCleat} 
            id={b.tag}
            onChange={(e) => {
              setFieldValue(`${c}.extraCleat`, !e.target.checked);
              updateExtraCleats(sessionId + '', [{
                ...b,
                extraCleat: !e.target.checked,
              }], () => {
                if (!e.target.checked) {
                  SuccessMessage({
                    description: 'This cleat was marked as not used for this game.',
                  });
                } else {
                  SuccessMessage({
                    description: 'This cleat was marked as used for this game.',
                  });
                }
              });
            }}
          /> : <></>
        )
      }
    },
  ];
  
  return (
    <div className="card-layout">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div>
            <Row className="header-info-assign">
              <Col>
                <div className="bg-assign">
                  <div className="bg-assign-team" style={{display: 'flex', alignItems: 'center'}}>
                    <>
                      <div style={{ marginRight: '15px', display: 'inline-flex'}}>({eqSelected.length})</div>
                    {
                      !sessionId && (
                        <Tooltip title="Archive Equipment">
                          <Button
                            icon={<Icon.Archive archive width="18px"/>}
                            id="pEAssignedArchive"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Archive Equipment`,
                                `Do you want to archive ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from this player?`,
                                () => {
                                  const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.ARCHIVE, archived: true };
                                  multiCheckList(body, () => {
                                    loadPlayer();
                                    eraseAll();
                                  });
                                })
                            }}
                          />
                        </Tooltip>
                      )
                    }
                    {
                      !sessionId && (
                        <Tooltip title="Delete Equipment">
                          <Button
                            icon={<Icon.Delete width="15px"/>}
                            id="pEAssignedDelete"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Delete Equipment`,
                                `Do you want to delete ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from this player?`,
                                () => {
                                  const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.DELETE };
                                  multiCheckList(body, () => {
                                    loadPlayer();
                                    eraseAll();
                                  });
                                })
                            }}
                          />
                        </Tooltip>
                      )
                    }
                    {
                      (
                        <Tooltip title="Unassign Equipment">
                          <Button
                            icon={<img className="img-h anticon" src="/images/unassign-icon.svg" alt="" height="18px"/>}
                            id="pEAssignedUnassign"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Unassign equipment`,
                                `Do you want to unassign ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from this player?`
                                , () => {
                                  const body = sessionId ? {
                                    equipmentIds: eqSelected,
                                    playerId: player.id,
                                    sessionId: sessionId,
                                  } : {
                                    equipmentIds: eqSelected,
                                    playerId: player.id,
                                  } 
                                  unassignPlayerEqList(body, () => {
                                    loadPlayer();
                                    eraseAll();
                                  });
                                }
                              )
                            }}
                          />
                        </Tooltip>
                      )
                    }
                    {
                      !sessionId && (
                        <Tooltip title="Equipment Out for Recondition">
                          <Button
                            icon={<img className="img-h anticon" src="/images/out-recondition-icon.svg" alt="" height="20px"/>}
                            id="pEAssignedOutRecondition"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Recondition equipment`,
                                `Do you want to mark ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} Out for Recondition?`
                                , () => {
                                  const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.RECONDITION, recondition: true };
                                  multiCheckList(body, () => {
                                    eraseAll();
                                    loadPlayer();
                                  });
                                }
                              )
                            }}
                          />
                        </Tooltip>
                      )
                    }
                    {
                      !sessionId && (
                        <Tooltip title="Received from Recondition">
                          <Button
                            icon={<img className="img-h anticon" src="/images/received-recondition-icon.svg" alt="" height="20px"/>}
                            id="pEAssignedReceivedRecondition"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Equipment${eqSelected.length > 1 ? 's': ''} received from Recondition`,
                                `Do you want to mark ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} as Received from Recondition?`
                                , () => {
                                  const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.RECONDITION, recondition: false };
                                  multiCheckList(body, () => {
                                    eraseAll();
                                    loadPlayer();
                                  });
                                }
                              )
                            }}
                          />
                        </Tooltip>
                      )
                    }
                    </>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="blue-scroll player-table">
            <Table
              dataSource={dataSource}
              columns={activityType === ACTIVITY_TYPE.GAME ? [...columnsEquipmentAssigned, ...gameWornCleatColumn] : columnsEquipmentAssigned}
              noDataClassname="no-data-player"
              sortParams={[]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
