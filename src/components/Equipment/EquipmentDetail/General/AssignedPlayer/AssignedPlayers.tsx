import React, { useEffect, useState } from 'react';

import { DEFAULT_ASSIGNED_PLAYER } from '../../../../../store/types';
import { Col, Form, Popconfirm, Row, Select } from 'antd';
import { useEquipmentDispatch } from '../../../../../hook/hooks/equipment';
import { ClearOutlined } from '@ant-design/icons';
import './AssignedPlayer.scss';
import { usePlayerFunctions, usePlayerList } from '../../../../../hook/customHooks/players';
import { useEquipmentContext } from '../../../../../context/equipment';
import { useAccountState } from '../../../../../hook/hooks/account';
import { isOemRole } from '../../../../../helpers/Utils';
import Image from '../../../../Shared/Image/Image';
import { useBodyFilterParams } from '../../../../../hook/customHooks/customHooks';
import { RECLAIM } from '../../../../../constants/constants';

export const AssignedPlayerSection = ({currentTeam}: {
  currentTeam?: string,
}) => {
  const { account } = useAccountState();
  const teamSelected = account.teamList.filter(team => team.teamId === currentTeam)?.[0];

  const {replaceAssignedPlayerList} = useEquipmentDispatch();
  
  const {values, setFieldValue} = useEquipmentContext();
  const {
    assignedPlayerToEquipment: {
      assignedPlayer,
      setAssignedPlayer,
      getAssignedPlayerToEquipment
    }
  } = usePlayerFunctions();
  const {assignedPlayersToEquipment: {assignedPlayersList, getAssignedPlayersToEquipment}} = usePlayerList();
  const [playerSelect, setPlayerSelect] = useState<string>('');
  const { bodyFilter: reclaimBodyFilter } = useBodyFilterParams(RECLAIM);

  useEffect(() => {
    if (values.playerId && !reclaimBodyFilter?.reclaimEquipment) {
      getAssignedPlayerToEquipment('', values.playerId, currentTeam);
    }
  }, [getAssignedPlayerToEquipment, values.playerId, currentTeam]);

  useEffect(() => {
    if (!values.id) {
      setAssignedPlayer(DEFAULT_ASSIGNED_PLAYER);
    }
  }, [values.id, setAssignedPlayer]);

  useEffect(() => {
    if (reclaimBodyFilter?.reclaimEquipment) {
      setAssignedPlayer(DEFAULT_ASSIGNED_PLAYER);
      setFieldValue('playerId', '');
      setFieldValue('displayName', '');
    }
  }, [reclaimBodyFilter, setAssignedPlayer, setFieldValue]);
  
  return (
    <div className="assigned-player">
      <Form>
        <Row>
          <Col span={24}>
            <div className="player-assign-info">
              {!isOemRole(account.role.name) && 
                <div>
                  {assignedPlayer?.id ? <h5>{assignedPlayer.jerseyNumber}</h5> : <div/>}
                </div>
              }
              {isOemRole(account.role.name) && 
                <div className='assign-team-name'>
                    <Image
                      style={{ }}
                      key={teamSelected?.fullName}
                      src={`/images/teams/logos/${teamSelected?.fullName}.svg`}
                      srcDefault={'/images/team-icon.svg'} alt="logo" width="30px"
                    />
                  <b style={{ color: '#013369', fontSize: '1rem', fontWeight: 'bold', marginLeft: '2px', zIndex: '2' }}> {teamSelected?.fullName} </b>
                  <img className="bg-play" src="/images/numplay-bg-left-01.svg" alt=""/>
                </div>
              }
              <Popconfirm
                overlayStyle={{ zIndex: 1 }}
                title={
                  <Select
                    id="eIPlayerAssignedPlayer"
                    showSearch
                    value={playerSelect ? playerSelect : 'Change or assign a new player'}
                    style={{width: 220}}
                    placeholder="Change or assign a new player"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={(value: string) => getAssignedPlayersToEquipment(value, currentTeam)}
                    onChange={(value: string) => setPlayerSelect('' + value)}
                    notFoundContent={null}
                  >
                    {
                      assignedPlayersList.map((player, index: number) => (
                        <Select.Option value={player.id} key={index}>
                          {
                            `${player.firstName} ${player.lastName} ${player.jerseyNumber} ${player.currentTeam}`
                          }
                        </Select.Option>
                      ))
                    }
                  </Select>
                }
                okText="Assign"
                cancelText="Cancel"
                onConfirm={async () => {
                  if (playerSelect) {
                    const player = assignedPlayersList.filter(assigned => assigned.id === playerSelect)[0];
                    setFieldValue('playerId', playerSelect);
                    setFieldValue('displayName', `${player?.firstName} ${player?.lastName}`);
                    setAssignedPlayer(player);
                  }
                }}
                onCancel={() => {
                  if (values.playerId) {
                    replaceAssignedPlayerList([assignedPlayer]);
                  } else {
                    replaceAssignedPlayerList([]);
                  }
                }}
              >
                <div>
                  {
                    assignedPlayer?.id ?
                      <div onClick={() => setPlayerSelect('')} className="player-name">
                        {
                          assignedPlayer?.id &&
                          <h5>{`${assignedPlayer.firstName} ${assignedPlayer.lastName}`}</h5>
                        }
                      </div>
                      :
                      <div className="player-name-not-assigned">
                        <h5>Not Assigned</h5>
                      </div>
                  }
                </div>
              </Popconfirm>
              <ClearOutlined title={'Clean'} onClick={() => {
                setAssignedPlayer(DEFAULT_ASSIGNED_PLAYER);
                setFieldValue('playerId', '');
                setFieldValue('displayName', '');
              }}/>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
