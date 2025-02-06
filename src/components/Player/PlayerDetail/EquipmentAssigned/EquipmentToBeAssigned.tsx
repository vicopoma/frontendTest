import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Button, Checkbox, Col, Row, Select, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { EquipmentInformation } from '../../../../store/types';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { usePlayerContext } from '../../../../context/player';
import { cleanEquipmentAssigned, verifyScannerInput } from '../../../../helpers/Utils';
import { useEquipmentToBeAssigned } from '../../../../hook/hooks/equipment';
import { usePlayersDispatch } from '../../../../hook/hooks/players';
import { usePlayerCrud } from '../../../../hook/customHooks/players';
import { DATE_FORMATS, EQUIPMENT_TYPES, NEW } from '../../../../constants/constants';
import moment from 'moment';
import Icon from '../../../Shared/CommomIcons/Icons';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { useLoaderDispatch } from '../../../../hook/hooks/loader';
import { Columns, Table } from '../../../Shared/Table/CustomTable/Table';
import { ROUTES } from '../../../../settings/routes';
import { history } from '../../../../store/reducers';
import { useSocketDSProvider } from '../../../../context/socketDS';

export const EquipmentToBeAssigned = ({sessionId, setCount}: {
  sessionId?: string
  setCount: Function
}) => {
  

  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  const {values, loadPlayer} = usePlayerContext();
  const {getEquipmentByTagOrCode} = usePlayersDispatch();
  const {player} = usePlayerCrud(path);
  const {showLoader} = useLoaderDispatch();
  
  const {
    equipmentsToBeAssigned,
    addEquipment,
    getEquipments,
    equipmentSelected,
    checksSelected,
    deleteEquipment,
    postEquipment,
    allChecks,
    changeCheck,
    addEquipmentList
  } = useEquipmentToBeAssigned(values.id);

  let validEquipmentsSize = 0;
  equipmentSelected.forEach(equipment => {
    if(equipment.tags.length > 0 && !equipment.archived) {
      validEquipmentsSize++;
    }
  }) 

  const {values: equipmentAssigned} = usePlayerContext();
  const equipmentAssignedSelected = sessionId ? equipmentAssigned.equipmentVMList : equipmentAssigned.equipmentVMList.filter(equipment => !equipment.archived)

  let tagsAssigned: Set<string> = new Set();
  equipmentAssignedSelected.forEach(equipment => {
    equipment.tags.forEach(tag => tagsAssigned.add(tag));
  });
  
  useEffect(() => {
    if (!!sessionId && !!player && !!values) {
      addEquipmentList(cleanEquipmentAssigned(player?.equipmentVMList, values.equipmentVMList, values.currentTeamId));
    }
    // eslint-disable-next-line
  }, [player, values]);
  
  const columnsEquipmentList: Columns[] = [
    {
      title: '',
      subTitle: (
        <Checkbox 
          checked={validEquipmentsSize > 0 && Array.from(checksSelected).length === validEquipmentsSize}
          id={'pEAllToBeAssigned'}
          onChange={e => {
            allChecks(e.target.checked);
          }}
        />
      ),
      key: 'none',
      dataIndex: 'none',
      width: 3,
      render: (a: any, b: EquipmentInformation) =>
        <Checkbox
          checked={checksSelected.has(b.id)}
          disabled={b.tags.length === 0}
          id={`pEToBeAssigned${hexToAscii(b.tags?.[0] ?? '')}`}
          onChange={(e) => {
            changeCheck(b.id, e.target.checked);
          }}
        />
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
      title: 'Equipment Code',
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
      width: 13,
      render: (eqCode: string, eqInformation: EquipmentInformation) => {
        const url = `/equipment/${eqInformation?.equipmentTypeId}/${eqInformation?.id}`;
        if (!sessionId) return eqCode;
        return (
          <a href={url} rel="noreferrer" target="_blank">{eqCode}</a>
        )
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 13,
      render(tags: any) {
        return (
          <>
            {
              tags?.length ? <Tag color="default">
                {tags[0] ? hexToAscii(tags[0]) : ''}
              </Tag> : <Tag color="red">No Tag</Tag>
            }
            {
              tags?.length > 1 && <Tag>
                  <PlusOutlined/> {tags?.length - 1}
              </Tag>
            }
          </>
        );
      }
    },
    !sessionId ? {
      title: 'Player',
      dataIndex: 'displayName',
      key: 'displayName',
      width: 10
    } : {
      title: '',
      dataIndex: '',
      key: '',
      width: 1
    },
    !sessionId ? {
      title: 'Team',
      dataIndex: 'teamName',
      key: 'teamName',
      width: 6
    } : {
      title: '',
      dataIndex: '',
      key: '',
      width: 0
    },
    !!sessionId ? {
      title: 'Note',
      key: 'note',
      dataIndex: 'note',
      width: 10
    } : {
      title: '',
      dataIndex: '',
      key: '',
      width: 0
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
    {
      title: '',
      dataIndex: 'archived',
      key: 'archived',
      align: 'right' as 'right',
      width: 2,
      render: (archived: boolean, b: EquipmentInformation) => {
        return (
          <>
            {
              !!sessionId && values.currentTeamId === b.teamId && archived && (
                <Tooltip title={`Archived on ${moment(b.archivedDate).local().format(DATE_FORMATS.monthDayYearHourMin)}`}>
                  <Icon.Archive archive width="20px"/>
                </Tooltip>
              )
            }
          </>
        )
      }
    },
    {
      title: '',
      dataIndex: '',
      key: 'status',
      width: 5,
      render: (a: any, b: EquipmentInformation) => {
        return !sessionId ? (
          <>
            <Button
              id="cPEAdd"
              size="small"
              style={{marginLeft: '4px', border: 'none'}}
              onClick={() => {
                deleteEquipment(b.id);
              }}
              icon={<img className="img-h anticon" src="/images/unassign-icon.svg" alt="" height="18px"/>}
            >
            </Button>
          </>
        ) : '';
      }
    },
  ];
  
  const [message, setMessage] = useState<string>('');
  const [trigger, setTrigger] = useState<number>(0);
  const [archived, setArchived] = useState<boolean>(false);
  
  useEffect(() => {
    if (!!message) {
      getEquipmentByTagOrCode(message, values.id, sessionId,
        (res) => {
          addEquipment(res);
          setMessage('')
        });
    }
  }, [trigger, message, values.id, sessionId, getEquipmentByTagOrCode, addEquipment, setMessage]);
  
  const dataSource = equipmentSelected.filter(equipment => !equipment.archived || (archived && !sessionId));
  
  useEffect(() => {
    setCount(dataSource.length);
  }, [dataSource.length, setCount]);

  const { setHandleSuscribe } = useSocketDSProvider();

  const suscribeFunction = useCallback((message: string) => {
    const value = verifyScannerInput(message);
    setTrigger((trigger) => trigger + 1);
    setMessage(value);
  }, [setMessage, setTrigger]);

  useEffect(() => {
    setHandleSuscribe(() => suscribeFunction);
  }, [setHandleSuscribe, suscribeFunction]);

  return (
    <div>
      <Row align="middle" justify="space-between" gutter={[16, 16]}>
        {!sessionId && <Col span={24}>
            <div style={{display: 'flex'}}>
                <h4
                  style={{
                    color: '#3DAC86'
                  }}
                >
                  Search Equipment
                </h4>
                <Select
                    id="cPESearchByCode"
                    showSearch
                    style={{width: 380, marginLeft: 10, marginRight: '8px'}}
                    placeholder="Search by code and tag"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    size="small"
                    onSearch={(value: string) => {
                      getEquipments(value, values.id, archived);
                    }}
                    onSelect={(value) => {
                      const addEquipmentToList: EquipmentInformation[] = equipmentsToBeAssigned.filter(equipment => equipment.id === value);
                      if (addEquipmentToList.length) {
                        addEquipment({...addEquipmentToList[0]});
                      }
                    }}
                    notFoundContent={null}
                >
                  {
                    equipmentsToBeAssigned.map((equipment, index: number) => (
                      <Select.Option value={equipment.id} key={index}>
                        {`${equipment.nameEquipmentType} - ${equipment.nameManufacturer} - ${equipment.nameModel} - ${equipment.equipmentCode}`}
                      </Select.Option>
                    ))
                  }
                </Select>
                <Checkbox checked={archived} onChange={e => setArchived(e.target.checked)}> <label> Include archived </label> </Checkbox>
            </div>
        </Col>}
        <Col span={24}>
          <Row align="stretch" justify="space-around" className="card-layout">
            <Row className="header-info-assign">
              <div className="header_drawer_title_equip" style={{margin:'3px 0px'}} />
              {paths[1] === 'activity' && <Col className="foot-button">
                <Button 
                  style={{marginRight:'12px'}}
                  className='btn-green'
                  icon={<img className="img-h anticon" src="/images/plus-icon.svg" alt="" width="14px"/>}
                  onClick={() => {
                    history.push(ROUTES.ACTIVITY.PLAYER_EDIT_EQUIPMENT(paths[2], paths[3], paths[4], NEW, NEW));
                  }}
                >
                  NEW EQUIPMENT
                </Button>
              </Col>}
            </Row>
            <Col span={24}>
              <div className="blue-scroll player-table">
                <Table
                  dataSource={dataSource}
                  columns={columnsEquipmentList}
                  sortParams={[]}
                  noDataClassname="no-data-player"
                />
              </div>
            </Col>
            <Col span={24}>
              <Row justify="end">
                <Col className="foot-button">
                  <Button
                    className="btn-blue-antd"
                    icon={<img className="img-h anticon" src="/images/assign-icon.svg" alt="" width="14px"/>}
                    onClick={() => {
                      let playerNumber = 0;
                      const assignedToAnother = new Set(equipmentSelected.filter(equipment => {
                        const isChecked = checksSelected.has(equipment.id) && !equipment.archived;
                        return !!equipment.playerId && equipment.playerId !== player.id && isChecked;
                      }).map(equipment => {
                        playerNumber = equipment.jerseyNumber;
                        return equipment.displayName
                      }));
                      let tagsSelected: Array<string> = [];
                      equipmentSelected
                        .filter(equipment => {
                          return !equipment.archived && checksSelected.has(equipment.id)})
                        .map(equipment => equipment.tags)
                        .forEach(tags => tags.forEach(tag => {
                          tagsSelected.push(tag);
                        }));

                      let duplicatedTags: Array<string> = [];
                      tagsSelected.forEach(tag => {
                        if(tagsAssigned.has(tag)) {
                          duplicatedTags.push(tag);
                        }
                      });
                      if(checksSelected.size > 0) {
                        if(!sessionId) {
                          ConfirmationModal('Assign equipment', 
                            <>
                              {assignedToAnother.size === 0 && `Woudl you like to assign ${checksSelected.size === 1 ? 'this' : 'these'} equipment to this Player?`}
                              {assignedToAnother.size === 1 && `${checksSelected.size === 1 ? 'This equipment is' : 'These equipment are'} currently assigned to ${Array.from(assignedToAnother)?.[0]} #${playerNumber}, would you like to continue with assigning to this Player?`}
                              {assignedToAnother.size > 1 && `These equipment are currently assigned to another players, would you like to continue with assigning to this Player?`}
                              <br />
                            </>, () => {
                            showLoader(true);
                            postEquipment(equipmentSelected, values.id, checksSelected, loadPlayer, sessionId, () => {
                              showLoader(false);
                            });
                          })
                        } else {
                          if(duplicatedTags.length > 0) {
                            ConfirmationModal('Assign equipment', 
                              <>
                                Are you sure to save {duplicatedTags.length === 1 ? 'this scan' : 'these scans'}? <br />
                                {duplicatedTags.map(tag => hexToAscii(tag)).join(', ')} <br />
                                {duplicatedTags.length === 1 ? 'It already has' : 'They already have'} assigned in this activity.
                              </>, () => {
                              showLoader(true);
                              postEquipment(equipmentSelected, values.id, checksSelected, loadPlayer, sessionId, () => {
                                showLoader(false);
                              });
                            })
                          } else {
                            ConfirmationModal('Assign equipment', 
                              <>
                                Are you sure to save {checksSelected.size === 1 ? 'this scan' : 'these scans'}? <br />
                              </>, () => {
                              showLoader(true);
                              postEquipment(equipmentSelected, values.id, checksSelected, loadPlayer, sessionId, () => {
                                showLoader(false);
                              });
                            })
                          }
                        }
                      }
                    }}>
                    ASSIGN
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
