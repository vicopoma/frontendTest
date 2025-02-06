import { useCallback } from "react";
import { API } from "../../settings/server.config";
import { useObjectFetch } from "./fetchs";

const urlEquipment = API.EQUIPMENT.BASE();

export interface EquipmentRedirect {
  equipmentTypeId: string,
  equipmentId: string,
}

export const DEFAULT_EQUIPMENT_REDIRECT: EquipmentRedirect = {
  equipmentTypeId: '',
  equipmentId: '',
}

export interface EquipmentByTagRedirect {
  equipmentModel: string,
  equipmentType: string,
  equipmentTypeId: string,
  equipmentId: string,
  manufacturer: string,
  playerName: string,
  teamId: string,
}

export const DEFAULT_EQUIPMENT_BY_TAG_REDIRECT: EquipmentByTagRedirect = {
  equipmentModel: '',
  equipmentType: '',
  equipmentTypeId: '',
  equipmentId: '',
  manufacturer: '',
  playerName: '',
  teamId: '',
}

export const useEquipmentRedirect = () => {
  const {
    values: equipmentInfo,
    loadObject: getEquipmentInfo,
  } = useObjectFetch<EquipmentRedirect>({url: urlEquipment, defaultValue: DEFAULT_EQUIPMENT_REDIRECT});
  const {
    values: tagInfo,
    loadObject: getTagInfo,
  } = useObjectFetch<EquipmentByTagRedirect>({url: urlEquipment, defaultValue: DEFAULT_EQUIPMENT_BY_TAG_REDIRECT});
  return {
    equipmentInfo,
    getEquipmentInfo: useCallback((equipmentCode: string, onSucceed?: any, onError?: any) => {
      getEquipmentInfo(API.EQUIPMENT.REDIRECT(equipmentCode), onSucceed, onError);
    }, [getEquipmentInfo]),
    tagInfo,
    getTagInfo: useCallback((tag: string, onSucceed?: any, onError?: any) => {
      getTagInfo(API.EQUIPMENT.REDIRECT_TAG(tag), onSucceed, onError);
    }, [getTagInfo]),
  };
};

const urlActivity = API.SCHEDULE.BASE();

export interface ActivityRedirect {
  gameId: string,
  sessionId: string,
  playerId: string,
}

export const DEFAULT_ACTIVITY_REDIRECT: ActivityRedirect = {
  gameId: '',
  sessionId: '',
  playerId: '',
}

export const useActivityRedirect = () => {
  const {
    values: activityInfo,
    loadObject: getActivityInfo,
  } = useObjectFetch<ActivityRedirect>({url: urlActivity, defaultValue: DEFAULT_ACTIVITY_REDIRECT });
  return {
    activityInfo,
    getActivityInfo: useCallback((gameKey: string, sessionId: string, playerId: string, onSucceed?: any, onError?: any) => {
      getActivityInfo(API.SCHEDULE.REDIRECT(gameKey, sessionId, playerId), onSucceed, onError);
    }, [getActivityInfo]),
  };
};