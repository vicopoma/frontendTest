import { API } from '../../settings/server.config';
import { DEFAULT_PLAYER, PlayerState, Apparel, DEFAULT_APPAREL } from '../../store/types/players';
import { ResponseObjectType, useListFetch, useObjectCrudFetch, useObjectFetch } from './fetchs';
import { useCallback } from 'react';
import { AssignedPlayer } from '../../store/types';
import { EMPTY_ARRAY, OK } from '../../constants/constants';
import { OKObjectResponse } from '../../settings/Backend/Responses';
import { getToken, postFormData } from '../../settings/httpClients';

const url = API.PLAYER.BASE();

export const usePlayerCrud = (playerId: string, sessionId?: string) => {
  
  const {value, createObject, updateObject, loadObject} = useObjectCrudFetch<PlayerState>({
    url: url,
    id: playerId?.length > 0 ? API.PLAYER.PLAYER_ID_AND_SESSION(playerId, sessionId) : '',
    defaultValue: DEFAULT_PLAYER
  });
  
  const loadPlayer = useCallback(() => {
    if (!!playerId) {
      loadObject(API.PLAYER.PLAYER_ID_AND_SESSION(playerId, sessionId));
    }
  }, [loadObject, sessionId, playerId]);
  
  return {
    player: value,
    loadPlayer,
    postPlayer: createObject,
    putPlayer: updateObject,
  };
};

export const usePlayerFunctions = () => {
  const {
    values: assignedPlayer,
    loadList: getAssignedPlayerToEquipment,
    setValues: setAssignedPlayer
  } = useListFetch<AssignedPlayer>({url});
  return {
    assignedPlayerToEquipment: {
      assignedPlayer: assignedPlayer?.[0],
      setAssignedPlayer: useCallback((player: AssignedPlayer) => {
        setAssignedPlayer([player]);
      }, [setAssignedPlayer]),
      getAssignedPlayerToEquipment: useCallback((name: string, playerId: string, teamId?: string) => {
        getAssignedPlayerToEquipment(API.PLAYER.ASSIGNED_PLAYER_TO_EQUIPMENT(name, playerId, teamId));
      }, [getAssignedPlayerToEquipment]),
    },
  };
};

export const usePlayerList = () => {
  const {values: assignedPlayersList, loadList: getAssignedPlayersToEquipment} = useListFetch<AssignedPlayer>({url});
  const {updateObject: getPlayerKeys, values: playerKeys} = useObjectFetch<Array<string>>({url, defaultValue: EMPTY_ARRAY});

  return {
    assignedPlayersToEquipment: {
      assignedPlayersList,
      getAssignedPlayersToEquipment: useCallback((name: string, teamId?: string, sessionId?: string) => {
        getAssignedPlayersToEquipment(API.PLAYER.ASSIGNED_PLAYER_TO_EQUIPMENT(name, '', teamId, sessionId));
      }, [getAssignedPlayersToEquipment]),
    },
    playerKeyList: {
      playerKeys,
      getPlayerKeys: useCallback((body: any, onSucceed?: ResponseObjectType<Array<string>>) => {
        getPlayerKeys(body, API.PLAYER.SEARCH_KEYS(), onSucceed)
      }, [getPlayerKeys]),
    },
  };
};

const urlPlayerApparel = API.APPAREL.BASE();

export const usePlayerApparel = () => {
  const { 
    values: playerApparel, 
    loadObject: getPlayerApparel,
    updateObject: updatePlayerApparel 
  } = useObjectFetch<Apparel>({ url: urlPlayerApparel, defaultValue: DEFAULT_APPAREL });
  return {
    playerApparel,
    getPlayerApparel: useCallback((playerId: string, onSucceed?: ResponseObjectType<any>) => {
      getPlayerApparel(API.APPAREL.PLAYER(playerId), onSucceed)
    }, [getPlayerApparel]),
    updatePlayerApparel: useCallback((body: any, playerId: string, onSucceed?: ResponseObjectType<any>) => {
      updatePlayerApparel(body, API.APPAREL.PLAYER(playerId), onSucceed);
    }, [updatePlayerApparel]),
  }
}

export const importPlayerCsv = async (
  form: FormData,
  setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  teamId: string,
) => {
  const data: OKObjectResponse<string> = await postFormData(API.APPAREL.IMPORT_CSV(teamId), form, getToken());
  if (data?.httpStatus === OK || data?.status === 200) {
    setFiles({});
  }
};