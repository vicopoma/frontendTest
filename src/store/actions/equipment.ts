import { getRequest, getToken, postFormData, postRequest } from '../../settings/httpClients';
import {
  AssignedPlayer,
  DEFAULT_EQUIPMENT_INFORMATION,
  DEFAULT_EQUIPMENT_MODEL_DETAIL,
  DEFAULT_TAG_STATE,
  EquipmentInformation,
  EquipmentModel,
  EquipmentModelDetail,
  EquipmentParam,
  EquipmentState,
  EquipmentTag,
  EQUIPMET_ACTIONS,
  FilterState,
  ManufacturerWithModels,
  TagList,
  TeamWithPlayers
} from '../types';
import { API } from '../../settings/server.config';
import { EQUIPMENT, NEW, OK, TAG_FILTER } from '../../constants/constants';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { paramBuilder } from '../../helpers/Utils';
import { updateLoader } from './loader';
import { PartTypeRelatedEquipmentModel } from '../types/partType';
import { ErrorMessage, SuccessMessage } from '../../components/Shared/Messages/Messages';

export const replaceEquipmentParam = (equipmentParam: EquipmentParam) => {
  return (dispatch: Function) => {
    dispatch({type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_PARAM, equipmentParam});
  };
};

export const replaceEquipments = (equipments: Array<EquipmentState>, forward: number) => {
  return {
    type: EQUIPMET_ACTIONS.GET_EQUIPMENTS,
    data: {
      equipments,
      forward
    }
  };
};

export const replaceEquipmentElements = (totalPages: number, numberOfElements: number, totalElements: number, number: number) => {
  return {
    type: EQUIPMET_ACTIONS.REPLACE_TOTAL_ELEMENTS,
    elements: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const getEquipments = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    if (getState()?.equipment?.equipmentParam?.manufacturerIds?.length > 0
      && getState()?.equipment?.equipmentParam?.equipmentModelIds?.length > 0
    ) {
      if (getState().equipment.equipmentParam.equipmentTypeId) {
        const paramsSort: FilterState = getState().filters[EQUIPMENT];
        const bodyParams: any = getState().equipment.equipmentParam;
        let query = '';
        if (paramsSort) query = paramBuilder(paramsSort);
        setLoader(true);
        dispatch(updateLoader(true));
        const data: OkPagedListResponse<EquipmentState> = await postRequest(API.EQUIPMENT.EQUIPMENTS() + query, bodyParams, getToken());
        dispatch(updateLoader(false));
        setLoader(false);
        if (data?.httpStatus === OK) {
          dispatch(replaceEquipments(data?.body.content, forward));
          dispatch(replaceEquipmentElements(data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.totalElements, data?.body?.number));
        }
      }
    } else {
      dispatch(replaceEquipments([], 3));
    }
  };
};

export const replaceEquipmentOnListEquipment = (equipmentInformation: EquipmentInformation) => {
  return async (dispatch: Function, getState: Function) => {
    const equipmentList = getState().equipment.equipments.map((equipment: any) => equipment.id !== equipmentInformation.id ?
      equipment : {
        id: equipmentInformation.id,
        lastCertification: equipmentInformation.lastCertification,
        equipmentCode: equipmentInformation.equipmentCode,
        nameModel: equipmentInformation.nameModel,
        nameManufacturer: equipmentInformation.nameManufacturer,
        displayName: equipmentInformation.displayName,
        nameEquipmentType: equipmentInformation.nameEquipmentType,
        teamName: equipmentInformation.teamName
      }
    );
    dispatch(replaceEquipments(equipmentList, 3));
  };
};

export const importEquipmentCsv = (file: any, callback: Function) => {
  let formData = new FormData();
  formData.append('file', file.file, file.file.name);
  return async (dispatch: Function) => {
    await postFormData(API.EQUIPMENT.IMPORT(), formData, getToken());
    callback(false);
  };
};

export const getEquipmentById = (id: string) => {
  return async (dispatch: Function) => {
    if (id && id !== NEW) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.EQUIPMENT_BY_ID(id), getToken());
      dispatch(updateLoader(false));
      if (data?.httpStatus === OK) {
        dispatch({
          type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_INFORMATION,
          equipmentInformation: data?.body
        });
        dispatch(replaceEquipmentInformation(data?.body));
      }
    } else {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_INFORMATION,
        equipmentInformation: DEFAULT_EQUIPMENT_INFORMATION
      });
      dispatch(replaceEquipmentInformation({...DEFAULT_EQUIPMENT_INFORMATION}));
    }
  };
};

export const replaceEquipmentInformation = (equipmentInformation: EquipmentInformation) => {
  return {
    type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_INFORMATION,
    equipmentInformation
  };
};

export const getEquipmentModelByEquipmentTypeId = (id: string) => {
  return async (dispatch: Function) => {
    if (id) {
      const data: OkPagedListResponse<EquipmentInformation> = await getRequest(API.EQUIPMENT.EQUIPMENT_MODEL_BY_EQUIPMENT_TYPE_ID(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch({
          type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
          equipmentModelVMs: data?.body
        });
      }
    } else {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
        equipmentModelVMs: []
      });
    }
  };
};

export const replaceEquipmentModelList = (equipmentModelVMs: EquipmentModel[]) => {
  return {
    type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
    equipmentModelVMs
  };
};

export const getEquipmentModelByEquipmentTypeManufacturerType = (equipmentTypeId: string, manufacturerId: string) => {
  return async (dispatch: Function) => {
    if (equipmentTypeId && manufacturerId) {
      const data: OKListResponse<EquipmentModel> = await getRequest(API.EQUIPMENT_MODEL.GET_BY_EQUIPMENT_TYPE_MANUFACTURER_TYPE(equipmentTypeId, manufacturerId), getToken());
      if (data?.httpStatus === OK) {
        dispatch({
          type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
          equipmentModelVMs: data?.body
        });
      }
    } else {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
        equipmentModelVMs: []
      });
    }
  };
};


export const getAssignedPlayers = (name: string, playerId: string, teamId?: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<AssignedPlayer[]> = await getRequest(API.PLAYER.ASSIGNED_PLAYER_LIST(name, playerId, teamId), getToken());
    if (data?.httpStatus === OK) {
      if (playerId && data.body.length) {
        dispatch(replaceAssignedPlayer(data.body[0]));
      }
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER_LIST,
        assignedPlayerList: data?.body
      });
    } else {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER_LIST,
        assignedPlayerList: []
      });
    }
  };
};

export const replaceAssignedPlayerList = (assignedPlayerList: AssignedPlayer[]) => {
  return async (dispatch: Function) => {
    dispatch({
      type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER_LIST,
      assignedPlayerList
    });
  };
};

export const replaceAssignedPlayer = (assignedPlayer: AssignedPlayer) => {
  return async (dispatch: Function) => {
    dispatch({
      type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER,
      assignedPlayer
    });
  };
};

export const getEquipmentModelDetail = (setFieldValue: Function, equipmentModelId: string, equipmentId: string) => {
  return async (dispatch: Function) => {
    if (!!equipmentModelId) {
      const data: OKObjectResponse<EquipmentModelDetail> = await getRequest(API.CUSTOM_FIELD.LIST(equipmentModelId, equipmentId), getToken());
      if (data.httpStatus === OK) {
        setFieldValue('customfield', data.body.customField);
      } else {
        setFieldValue('customfield', []);
      }
    } else {
      dispatch(replaceEquipmentModelDetail(DEFAULT_EQUIPMENT_MODEL_DETAIL));
    }
  };
};

export const getEquipmentTypePlayerCode = (equipmentTypeId: string) => {
  return async (dispatch: Function) => {
    if (equipmentTypeId) {
      const data: OKObjectResponse<any> = await getRequest(API.EQUIPMENT.EQUIPMENT_CODE_GENERATOR(equipmentTypeId), getToken());
      if (data?.httpStatus === OK) {
        return data?.body?.newCode;
      }
    }
    return '';
  };
};

export const replaceEquipmentModelDetail = (equipmentModelDetail: EquipmentModelDetail) => {
  return async (dispatch: Function) => {
    dispatch({
      type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MODEL_DETAIL,
      equipmentModelDetail
    });
  };
};

export const relateTagWithEquipment = (tagList: TagList, setState: Function, equipmentId: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<TagList> = await postRequest(API.TAG.RELATE_TAG_EQUIPMENT(), tagList, getToken());
    if (data.httpStatus === OK) {
      setState(DEFAULT_TAG_STATE);
      dispatch(getTagsByEquipment(equipmentId));
      dispatch(getTagsByEquipmentAsigned(equipmentId));
    }
  };
};

export const getTagsByEquipment = (equipmentId: string) => {
  
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[TAG_FILTER];
    let query = '';
    if (params) {
      query = paramBuilder(params);
    }
    query = query.replace('?', '&');
    const data: OKListResponse<EquipmentTag> = await getRequest(API.TAG.EQUIPMENT_TAG(equipmentId) + query, getToken());
    if (data.httpStatus === OK) {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG,
        equipmentTags: data.body
      });
    }
  };
};

export const getTagsByEquipmentAsigned = (equipmentId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<EquipmentTag> = await getRequest(API.TAG.EQUIPMENT_TAG(equipmentId), getToken());
    if (data.httpStatus === OK) {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG_LIST,
        equipmentTagList: data.body
      });
    }
  };
};

export const getManufacturerWithModels = (equipmentTypeId: string) => {
  return async (dispatch: Function) => {
    if (!!equipmentTypeId) {
      const data: OKListResponse<ManufacturerWithModels> = await getRequest(API.MANUFACTURER.GET_MANUFACTURER_WITH_MODEL(equipmentTypeId), getToken());
      if (data.httpStatus === OK) {
        dispatch({
          type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS,
          manufacturerWithModels: data.body
        });
      }
    } else {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS,
        manufacturerWithModels: []
      });
    }
  };
};

export const getTeamWithPlayers = (teamId?: string, equipmentTypeId?: string) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKListResponse<TeamWithPlayers> = await getRequest(API.PLAYER.TEAM_WITH_PLAYERS(teamId, equipmentTypeId), getToken());
    dispatch(updateLoader(false));
    if (data.httpStatus === OK) {
      dispatch({
        type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TEAM_WITH_PLAYERS,
        teamWithPlayers: data.body
      });
    }
  };
};

export const getPartTypeAndPartsByEquipmentModel = (setFieldValue: Function, equipmentTypeId: string, equipmentModel: string, equipmentId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<PartTypeRelatedEquipmentModel> = await getRequest(API.PART_TYPE.PARTS(equipmentTypeId, equipmentModel, equipmentId), getToken());
    if (data.httpStatus === OK) {
      setFieldValue('partTypeWithPartDTOList', data.body);
    } else {
      setFieldValue('partTypeWithPartDTOList', []);
    }
  };
};

export const synchronizedHelmetModels = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_HELMET_MODELS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};

export const synchronizedShoulderPadModels = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_SHOULDER_PADS_MODELS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};

export const synchronizedCleatsModels = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_CLEATS_MODELS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};

export const synchronizedParts = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_PARTS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};
export const synchronizedHelmetParts = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_HELMET_PARTS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};
export const synchronizedShoulderPadsParts = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_SHOULDER_PADS_PARTS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};
export const synchronizedCleatParts = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<EquipmentTag> = await getRequest(API.EQUIPMENT.SYNCHRONIZED_CLEAT_PARTS(), getToken());
    setStatus(false);
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
  };
};

export const synchronizeGames = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<any> = await getRequest(API.SCHEDULE.SYNCHRONIZED_GAMES(), getToken());
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
    setStatus(false);
  };
};

export const synchronizePractices = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<any> = await getRequest(API.SCHEDULE.SYNCHRONIZED_PRACTICES(), getToken());
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Sync'});
    } else {
      ErrorMessage({description: data.message});
    }
    setStatus(false);
  };
};

export const addCoachToPlayer = (setStatus: Function) => {
  return async (dispatch: Function) => {
    setStatus(true);
    const data: OKListResponse<any> = await getRequest(API.TAG.ADD_COACH_TO_PLAYER(), getToken());
    if (data.httpStatus === OK) {
      SuccessMessage({description: 'Successful Add'});
    } else {
      ErrorMessage({description: data.message});
    }
    setStatus(false);
  };
};