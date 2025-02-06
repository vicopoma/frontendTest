import { DEFAULT_PART, PART_ACTIONS, PartState } from '../types/part';
import { OKListResponse, OKObjectResponse, OkPagedListResponse, } from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError,
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK, PART_FILTER } from '../../constants/constants';
import { showLoader, updateLoader } from './loader';
import { paramBuilder } from '../../helpers/Utils';
import { EquipmentModel, FilterState, Manufacturer } from '../types';
import { PartTypeRelatedEquipmentModel } from '../types/partType';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';

export const replacePart = (part: PartState) => {
  return {
    type: PART_ACTIONS.REPLACE_PART,
    part
  };
};

export const replaceManufacturerList = (manufacturerList: Manufacturer[]) => {
  return {
    type: PART_ACTIONS.REPLACE_MANUFACTURER,
    manufacturerList
  };
};

export const replaceEquipmentModelList = (equipmentModelList: EquipmentModel[]) => {
  return {
    type: PART_ACTIONS.REPLACE_EQUIPMENT_MODEL,
    equipmentModelList
  };
};

export const replacePartTypeList = (partTypeList: PartTypeRelatedEquipmentModel[]) => {
  return {
    type: PART_ACTIONS.REPLACE_PART_TYPES_LIST,
    partTypeList
  };
};

export const replaceParts = (parts: Array<PartState>, forward: number) => {
  return {
    type: PART_ACTIONS.REPLACE_PARTS,
    data: {
      parts,
      forward
    }
  };
};

export const replacePartsTotalPages = (totalPages: number, numberOfElements: number, totalElements: number, number: number) => {
  return {
    type: PART_ACTIONS.REPLACE_PARTS_TOTAL_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const loadParts = (loader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[PART_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    loader(true);
    const data: OkPagedListResponse<PartState> = await getRequest(API.PART.PART() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceParts(data?.body?.content, forward));
      dispatch(replacePartsTotalPages(data?.body.totalPages, data?.body.numberOfElements, data?.body.totalElements, data?.body.number));
    }
    loader(false);
  };
};

export const loadPartById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(showLoader(true));
      const data: OKObjectResponse<PartState> = await getRequest(API.PART.PART(id), getToken());
      dispatch(showLoader(false));
      if (data?.httpStatus === OK) {
        dispatch(replacePart(data?.body));
      } else {
        dispatch(replacePart(DEFAULT_PART));
      }
    } else {
      dispatch(replacePart(DEFAULT_PART));
    }
  };
};

export const savePart = (part: PartState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<PartState> = await postRequest(API.PART.PART(), part, getToken());
    dispatch(showLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(loadParts(() => {
      }, 3));
      dispatch(replacePart(data?.body));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Part created Successfully'
      });
      
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const updatePart = (part: PartState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<PartState> = await putRequest(API.PART.PART(), part, getToken());
    dispatch(showLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(loadParts(() => {
      }, 3));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Part updated Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const deletePart = (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<any> = await deleteRequest(API.PART.PART(id), getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(loadParts(() => {
      }, 3));
      SuccessMessage({description: 'Part deleted successfully'});
      closeDrawer();
    } else {
      warningAndError(data, setResponse);
    }
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
