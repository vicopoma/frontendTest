import { getRequest, getToken, postRequest, putRequest } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import {
  OKListResponse,
  OKObjectResponse,
} from '../../settings/Backend/Responses';
import { DEFAULT_PLAYER, PLAYERS_ACTIONS, PlayerState } from '../types/players';
import { CREATED, NEW, OK } from '../../constants/constants';
import { DEFAULT_EQUIPMENT_INFORMATION, EquipmentInformation, EquipmentPlayer } from '../types';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { updateLoader } from './loader';
import store from '..';

export const replacePlayers = (players: Array<PlayerState>, forward: number) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_PLAYERS,
    players: {
      players,
      forward
    }
  };
};

export const replacePlayer = (player: PlayerState) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_PLAYER,
    player
  };
};

export const replaceEquipmentSelected = (equipmentSelected: EquipmentInformation[]) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_EQUIPMENT_SELECTED_PLAYER,
    equipmentSelected
  };
};

export const addEquipment = (equipment: EquipmentInformation) => {
  return {
    type: PLAYERS_ACTIONS.ADD_EQUIPMENT_TO_EQUIPMENT_LIST,
    equipment
  };
};

export const deleteEquipment = (equipment: EquipmentInformation) => {
  return {
    type: PLAYERS_ACTIONS.DELETE_EQUIPMENT_TO_EQUIPMENT_LIST,
    equipment
  };
};

export const replacePlayerTotalElements = (total: number) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_TOTAL_ELEMENTS,
    total
  };
};

export const replacePlayerNumberOfElements = (number: number) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_NUMBER_OF_ELEMENTS,
    number
  };
};

export const replaceEquipmentAssigned = (equipmentAssigned: Array<EquipmentInformation>) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_EQUIPMENT_ASSIGNED_PLAYER,
    equipmentAssigned
  };
};

export const replaceTotalPages = (totalPages: number, numberOfElements: number, totalElements: number, number: number) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_TOTAL_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number
    }
  };
};

export const replacePageable = (pageable: any) => {
  return {
    type: PLAYERS_ACTIONS.REPLACE_PAGEABLE,
    pageable
  };
};

export const loadPlayerById = (id: string, sessionId?: string) => {
  return async (dispatch: Function) => {
    if (id !== '' && id !== NEW) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<PlayerState> = await getRequest(API.PLAYER.PLAYER_BY_ID_AND_SESSION(id, sessionId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replacePlayer(data?.body));
        dispatch(replaceEquipmentAssigned(data?.body?.equipmentVMList));
      }
      dispatch(updateLoader(false));
    } else {
      dispatch(replacePlayer(DEFAULT_PLAYER));
    }
  };
};

export const postPlayer = (player: PlayerState, onSucceed: any) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<PlayerState> = await postRequest(API.PLAYER.PLAYERS(), player, getToken());
    if (data?.httpStatus === CREATED) {
      SuccessMessage({description: 'Player added Successfully'});
      dispatch(replacePlayer(data?.body));
      if(onSucceed) onSucceed();
    }
  };
};

export const putPlayer = (player: PlayerState, onSucceed: any) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<PlayerState> = await putRequest(API.PLAYER.PLAYERS(), player, getToken());
    if (data?.httpStatus === OK) {
      data.body.equipmentVMList = player.equipmentVMList;
      SuccessMessage({description: 'Player updated Successfully'});
      dispatch(replacePlayer(data?.body));
      if(onSucceed) onSucceed();
    }
  };
};


export const getEquipmentByTagOrCode = (code: string, playerId: string, sessionId?: string, callback?: (res: EquipmentInformation) => void) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.FIND_EQUIPMENT_BY_TAG_OR_CODE(code, playerId, sessionId), getToken());
    if (data.httpStatus === OK) {
      if (data?.body) {
        if (callback) {
          callback(data?.body);
        }
      }
    }
  };
};
export const getEquipmentList = (code: string, playerId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.SEARCH_EQUIPMENT_BY_CODE(code, playerId), getToken());
    if (data.httpStatus === OK) {
      dispatch({
        type: PLAYERS_ACTIONS.REPLACE_EQUIPMENTS_PLAYER,
        equipmentList: data.body
      });
    }
  };
};

export const getEquipmentAssigned = (playerId: string, sessionId?: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.EQUIPMENT_ASSIGNED_BY_PLAYER(playerId), getToken());
    if (data.httpStatus === OK) {
      dispatch({
        type: PLAYERS_ACTIONS.REPLACE_EQUIPMENT_ASSIGNED_PLAYER,
        equipmentAssigned: data.body
      });
    }
  };
};
export const unassignedEquipment = (playerId: string, equipmentId: string, sessionId?: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.UNASSIGNED_EQUIPMENT(playerId, equipmentId, sessionId), getToken());
    if (data.httpStatus === OK) {
      dispatch(loadPlayerById(playerId, sessionId));
    }
  };
};

export const assignedEquipment = (playerId: string, equipmentId: string) => {
  const assign: EquipmentPlayer = {
    playerId, equipmentId, checkPlayer: true
  };
  return async (dispatch: Function) => {
    const data: OKObjectResponse<EquipmentPlayer> = await postRequest(API.EQUIPMENT.ASSIGN_EQUIPMENT(), assign, getToken());
    if (data.httpStatus === OK) {
      const equipment: EquipmentInformation = {
        ...DEFAULT_EQUIPMENT_INFORMATION,
        id: equipmentId
      };
      dispatch(getEquipmentAssigned(playerId));
      dispatch(deleteEquipment(equipment));
    }
  };
};

export const assignEquipments = (playerId: string, selectedEquipments: Array<string>, sessionId?: string) => {
  return async (dispatch: Function, getState: Function) => {
    const body = {
      equipmentPlayerList:
        selectedEquipments.map(id => ({
          checkPlayer: true,
          equipmentId: id,
          playerId: playerId,
          sessionId: sessionId
        }))
    };
    
    const data: OKListResponse<any> = await postRequest(API.EQUIPMENT.ASSIGN_EQUIPMENTS(), body, getToken());
    const EquipmentSelected: Array<EquipmentInformation> = store.getState().players.equipmentSelected;
    
    const dataSelected: Array<EquipmentInformation> = [];
    for (let iterator in EquipmentSelected) {
      if (selectedEquipments.indexOf(EquipmentSelected[iterator].id) === -1) {
        dataSelected.push(EquipmentSelected[iterator]);
      }
    }
    if (data.httpStatus === OK) {
      dispatch(replaceEquipmentSelected(dataSelected));
      dispatch(loadPlayerById(playerId, sessionId));
    }
  };
};