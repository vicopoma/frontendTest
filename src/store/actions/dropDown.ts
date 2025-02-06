import { ACCOUNT_ROLES, OK, ROLE_HIERARCHY } from '../../constants/constants';
import { OKListResponse } from '../../settings/Backend/Responses';
import { getRequest, getToken } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { AccountState, EquipmentModel, Manufacturer, TeamState } from '../types';
import { DROP_DOWN_ACTIONS } from '../types/dropDown';
import { PartTypeRelatedEquipmentModel } from '../types/partType';
import { replaceInitialTeamId } from './team';
import { RootState } from '../reducers';

export const replaceManufacturerList = (manufacturerList: Array<Manufacturer>) => {
  return {
    type: DROP_DOWN_ACTIONS.REPLACE_MANUFACTURER_LIST_DROP_DOWN,
    manufacturerList
  };
};

export const replaceEquipmentModelList = (equipmentModelList: Array<EquipmentModel>) => {
  return {
    type: DROP_DOWN_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST_DROP_DOWN,
    equipmentModelList
  };
};

export const replacePartTypeList = (partTypeList: Array<PartTypeRelatedEquipmentModel>) => {
  return {
    type: DROP_DOWN_ACTIONS.REPLACE_PART_TYPES_LIST_DROP_DOWN,
    partTypeList
  };
};

export const replaceUserTeamList = (teamList: Array<TeamState>) => {
  return {
    type: DROP_DOWN_ACTIONS.REPLACE_USER_TEAM_LIST_DROP_DOWN,
    teamList
  };
};

export const replaceAllTeamList = (teamList: Array<TeamState>) => {
  return {
    type: DROP_DOWN_ACTIONS.REPLACE_ALL_TEAM_LIST_DROP_DOWN,
    teamList
  };
};

export const getManufacturerByEquipmentType = (equipmentTypeId: string) => {
  return async (dispatch: Function) => {
    if (!!equipmentTypeId) {
      const data: OKListResponse<Manufacturer> = await getRequest(API.MANUFACTURER.GET_BY_EQUIPMENT_TYPE(equipmentTypeId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceManufacturerList(data?.body));
      }
    } else {
      dispatch(replaceManufacturerList([]));
    }
  };
};

export const getPartTypeByEquipmentTypeAndEquipmentModelId = (equipmentTypeId: string, equipmentModelId?: string) => {
  return async (dispatch: Function) => {
    if (!!equipmentTypeId) {
      const data: OKListResponse<PartTypeRelatedEquipmentModel> = await getRequest(API.PART_TYPE.PART_TYPE_BY_EQUIPMENT_TYPE_AND_EQUIPMENT_MODEL_ID(equipmentTypeId, equipmentModelId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replacePartTypeList(data.body));
      }
    } else {
      dispatch(replacePartTypeList([]));
    }
  };
};

export const getEquipmentModelByEquipmentTypeManufacturerType = (equipmentTypeId: string, manufacturerId: string) => {
  return async (dispatch: Function) => {
    if (equipmentTypeId && manufacturerId) {
      const data: OKListResponse<EquipmentModel> = await getRequest(API.EQUIPMENT_MODEL.GET_BY_EQUIPMENT_TYPE_MANUFACTURER_TYPE(equipmentTypeId, manufacturerId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceEquipmentModelList(data.body));
      }
    } else {
      dispatch(replaceEquipmentModelList([]));
    }
  };
};

export const getPartTypeByModelId = (id: string) => {
  return async (dispatch: Function, getState: Function) => {
    const data: OKListResponse<PartTypeRelatedEquipmentModel> = await getRequest(API.PART_TYPE.PART_TYPE_BY_MODEL_ID(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(replacePartTypeList(data.body));
    } else {
      dispatch(replacePartTypeList([]));
    }
  };
};

export const getUserTeamList = () => {
  return async (dispatch: Function, getState: Function) => {
    const store: RootState = getState();
    if (!store.dropDown.userTeamList.length) {
      const account = (getState().account as AccountState).account;
      const role = account.role.name;
      const data: OKListResponse<TeamState> = ROLE_HIERARCHY[role as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ADMIN_USER] ?
        await getRequest(API.TEAM.TEAMS(), getToken()) : await getRequest(API.TEAM.USER_TEAMS(), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceInitialTeamId(data?.body.filter(data => data.players > 0)[0]?.teamId));
        dispatch(replaceUserTeamList(data?.body));
      }
    }
  };
};

export const getAllTeamList = () => {
  return async (dispatch: Function, getState: Function) => {
    const store: RootState = getState();
    if (!store.dropDown.allTeamList.length) {
      const data: OKListResponse<TeamState> = await getRequest(API.TEAM.TEAMS(), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceAllTeamList(data?.body));
      }
    }
  };
};
