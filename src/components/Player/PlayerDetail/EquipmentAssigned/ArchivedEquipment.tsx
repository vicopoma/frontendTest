import React, { useMemo } from 'react';
import { Button, Checkbox, Col, Row, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { usePlayerContext } from '../../../../context/player';
import { useLocation } from 'react-router';
import { ROUTES } from '../../../../settings/routes';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { history } from '../../../../store/reducers';
import { EquipmentInformation, MULTICHECK_EQUIPMENT_ACTIONS } from '../../../../store/types';
import moment from 'moment';
import { DATE_FORMATS, EMPTY_ARRAY, EQUIPMENT_TYPES } from '../../../../constants/constants';
import Image from '../../../Shared/Image/Image';
import Icon from '../../../Shared/CommomIcons/Icons';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { useEquipmentFunctions } from '../../../../hook/customHooks/equipment';
import { useArraySelector } from '../../../../hook/customHooks/customHooks';
import { Columns, Table } from '../../../Shared/Table/CustomTable/Table';

export const ArchivedEquipment = ({sessionId} : { sessionId?: string}) => {

  const {values, loadPlayer} = usePlayerContext();
  const equipmentIds = useMemo(() => {
    return (values.equipmentVMList.filter(equipment => equipment.archived)).map(equipment => equipment.id)
  }, [values]);

  const { add, addAll, erase, eraseAll, hasAll, value: eqSelected } = useArraySelector({
    initialValues: EMPTY_ARRAY,
    nonErasableValues: EMPTY_ARRAY,
    totalDefaultValues: equipmentIds,
  });

  const columns: Columns[] = [
    {
      title: '',
      dataIndex: 'edit',
      key: 'edit',
      fixed: 'left',
      width: 1,
      render: (_: any, b: EquipmentInformation) => {
        return (
          <div style={{ display: 'flex'}}>
            {
              !sessionId && values.currentTeamId === b.teamId ? (
                <Button
                  id={`"eEdit${b?.tags?.length ? hexToAscii(b?.tags[0]) : ''}`}
                  onClick={() => {
                    history.push(ROUTES.PLAYER.EDIT_EQUIPMENT(playerId, b.equipmentTypeId, b.id));
                  }}
                  style={{border: 'none', boxShadow: 'none', marginTop: '5px' }}>
                  <img
                    className="img-h anticon"
                    src={'/images/edit.svg'}
                    alt="" width="18px"
                    height="18px"
                  />
                </Button>
              ) : <span/>
            }
          </div>
        )
      }
    },
    {
      title: '',
      subTitle: (
        <Checkbox 
          checked={hasAll && eqSelected.length > 0}
          id="pEAllArchived"
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
          id={`pEArchived${hexToAscii(b.tags?.[0] ?? '')}}`}
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
      width: 15
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tvaluesags',
      width: 12,
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
      width: 10,
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
        <div id={`"cEArchRecondition${b?.tags?.length ? hexToAscii(b?.tags[0]) : ''}`}>{a ? 'Yes': 'No'}</div>
      )
    },
    {
      title: 'Last seen',
      key: 'modifiedDate',
      dataIndex: 'modifiedDate',
      width: 12,
      render: (a: any, b: EquipmentInformation) => {
        if(b.lastSessionScan) {
          return moment(b.lastSessionScan).format(DATE_FORMATS.monthDayYearHourMin);
        }
        return '';
      },
    },
  ]
  
  const paths = useLocation().pathname.split('/');
  const playerId = paths[paths.length - 1]
  
  const { unassignPlayerEqList, multiCheckList } = useEquipmentFunctions()
  
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
                      <div style={{ marginRight: '15px', display: 'inline-flex' }}>({eqSelected.length})</div>
                    {!sessionId /*&& values.currentTeamId === b.teamId*/ && (
                      <Tooltip title="Unarchive Equipment">
                        <Button
                          icon={<Icon.Archive archive={false} className="img-h anticon" width="18px"/>}
                          id="pEArchivedUnarchive"
                          style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                          size="small"
                          onClick={() => {
                            eqSelected.length > 0 && ConfirmationModal(
                              `Unarchive Equipment`,
                              `Do you want to unarchive ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from this player?`,
                              () => {
                                const body = { ids: eqSelected, option: MULTICHECK_EQUIPMENT_ACTIONS.ARCHIVE, archived: false };
                                  multiCheckList(body, () => {
                                    loadPlayer();
                                    eraseAll();
                                  });
                              })
                          }}
                        />
                      </Tooltip>
                    )}
                    {
                      !sessionId && (
                        <Tooltip title="Delete Equipment">
                          <Button
                            icon={<Icon.Delete width="15px"/>}
                            id="pEArchivedDelete"
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
                            id="pEArchivedUnassign"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center', background: 'transparent'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Unassign equipment`,
                                `Do you want to unassign ${eqSelected.length > 1 ? 'these equipment': 'this equipment'} from this player?`
                                , () => {
                                  const body = sessionId ? {
                                    equipmentIds: eqSelected,
                                    playerId: values.id,
                                    sessionId: sessionId,
                                  } : {
                                    equipmentIds: eqSelected,
                                    playerId: values.id,
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
                        <Tooltip title="Out for Recondition">
                          <Button
                            icon={<img className="img-h anticon" src="/images/out-recondition-icon.svg" alt="" height="20px"/>}
                            id="pEArchivedOutRecondition"
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
                            id="pEArchivedReceivedRecondition"
                            style={{border: '0px', marginRight: '12px', display:'flex', alignItems: 'center', justifyContent:'center'}}
                            size="small"
                            onClick={() => {
                              eqSelected.length > 0 && ConfirmationModal(
                                `Equipment Received from Recondition`,
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
              columns={columns}
              dataSource={values.equipmentVMList.filter(equipment => equipment.archived)} 
              noDataClassname="no-data-player"
              sortParams={[]}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}