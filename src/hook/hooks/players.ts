import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { PlayersState, PlayerState } from '../../store/types/players';
import { useCallback } from 'react';
import {
  addEquipment,
  assignedEquipment,
  deleteEquipment,
  getEquipmentAssigned,
  getEquipmentByTagOrCode,
  loadPlayerById,
  postPlayer,
  putPlayer,
  replaceEquipmentSelected,
  replacePlayer
} from '../../store/actions/players';
import { EquipmentInformation } from '../../store/types';

const selectPlayersState: ParametricSelector<RootState, undefined, {
  players: Array<PlayerState>,
  player: PlayerState,
  allState: PlayersState,
  pageNumber: number,
}> =
  createSelector<RootState, Array<PlayerState>, PlayerState, PlayersState, number,
    {
      players: Array<PlayerState>
      player: PlayerState
      allState: PlayersState,
      pageNumber: number,
    }>
  (
    state => state.players.players,
    state => state.players.player,
    state => state.players,
    state => state.players.pageable.pageNumber,
    (players: Array<PlayerState>, player, allState, pageNumber) => ({
      players, player, allState, pageNumber
    })
  );

export const usePlayersState = () => {
  return useSelector((state: RootState) => selectPlayersState(state, undefined));
};

export const usePlayersDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadPlayerById: useCallback((id: string, sessionId?: string) => dispatch(loadPlayerById(id, sessionId)), [dispatch]),
    postPlayer: async (player: PlayerState, onSucceed: any) => dispatch(postPlayer(player, onSucceed)),
    putPlayer: async (player: PlayerState, onSucceed: any) => dispatch(putPlayer(player, onSucceed)),
    replacePlayer: useCallback(async (player: PlayerState) => dispatch(replacePlayer(player)), [dispatch]),
    getEquipmentByTagOrCode: async (code: string, playerId: string, sessionId?: string, callback?: (res: EquipmentInformation) => void) => dispatch(getEquipmentByTagOrCode(code, playerId, sessionId, callback)),
    getEquipmentAssigned: useCallback(async (playerId: string, sessionId?: string) => dispatch(getEquipmentAssigned(playerId, sessionId)), [dispatch]),
    assignedEquipment: async (playerId: string, equipmentId: string) => dispatch(assignedEquipment(playerId, equipmentId)),
    addEquipment: async (equipment: EquipmentInformation) => dispatch(addEquipment(equipment)),
    deleteEquipment: async (equipment: EquipmentInformation) => dispatch(deleteEquipment(equipment)),
    replaceEquipmentSelected: useCallback(async (equipmentSelected: EquipmentInformation[]) => dispatch(replaceEquipmentSelected(equipmentSelected)), [dispatch]),
  };
};