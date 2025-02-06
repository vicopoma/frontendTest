import { useCallback } from 'react';
import { EMPTY_ARRAY } from '../../constants/constants';
import { API } from '../../settings/server.config';
import { EquipmentAssign } from '../../store/types/players';
import { ResponseObjectType, useObjectFetch } from './fetchs';

const url = API.SCHEDULE.BASE();
const _url = API.PLAYER.BASE();

export const useScheduleFunctions = () => {
  const {loadObject: rebuildSchedule} = useObjectFetch<any>({
    url,
    defaultValue: null
  });
  
  const {updateObject: loadEquipmentCount, values: equipmentCount} = useObjectFetch<Array<EquipmentAssign>>({
    defaultValue: EMPTY_ARRAY,
    url: _url
  });
  
  return {
    rebuildSchedule: useCallback((sessionId: string, allZones: string, onSucceed?: ResponseObjectType<any>, onError?: ResponseObjectType<any>) => {
      rebuildSchedule(API.SCHEDULE.REBUILD(sessionId, allZones), onSucceed, onError);
    }, [rebuildSchedule]),
    equipmentCounter: {
      loadEquipmentCount: useCallback((body: any) => {
        loadEquipmentCount(body, API.SCHEDULE.EQUIPMENT_COUNT());
      }, [loadEquipmentCount]),
      equipmentCount
    }
  };
};