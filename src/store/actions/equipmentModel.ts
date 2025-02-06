import { CREATED, EQUIPMENT_MODEL_FILTER, OK } from '../../constants/constants';
import {
  OKListResponse,
  OKObjectResponse,
  OkPagedListResponse,
} from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';

import { CustomField, EQUIPMENT_MODEL_ACTIONS, EQUIPMENT_MODEL_DEFAULT, EquipmentModel, FilterState } from '../types';
import { paramBuilder } from '../../helpers/Utils';
import store from '../index';
import { updateLoader } from './loader';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';


export const replaceEquipmentModelList = (equipmentModelList: EquipmentModel[]) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST,
    equipmentModelList,
  };
};

export const replaceEquipmentModelListByPage = (equipmentModelList: Array<EquipmentModel>, forward: number) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_BY_PAGE,
    status: {
      equipmentModelList,
      forward
    }
  };
};

export const replaceEquipmentModel = (equipmentModel: EquipmentModel) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL,
    equipmentModel
  };
};

export const replaceTotalElements = (totalElements: number, totalPages: number, numberOfElements: number, number: number) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_TOTAL_ELEMENTS,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replaceCustomField = (customField: CustomField) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD,
    customField
  };
};

export const replaceCustomFieldList = (customFieldList: CustomField[]) => {
  return {
    type: EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD_LIST,
    customFieldList
  };
};

export const getEquipmentModelList = (setLoader: Function, forward: number) => {
  return async (dispatch: Function) => {
    setLoader(true);
    const params: FilterState = store.getState().filters[EQUIPMENT_MODEL_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: OkPagedListResponse<EquipmentModel> = await getRequest(API.EQUIPMENT_MODEL.GET_EQUIPMENT_MODEL_LIST() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceEquipmentModelListByPage(data?.body?.content, forward));
      dispatch(replaceTotalElements(data?.body?.totalElements, data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.number));
    }
    setLoader(false);
  };
};

export const getEquipmentModelById = (id: string) => {
  return async (dispatch: Function) => {
    
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<EquipmentModel> = await getRequest(API.EQUIPMENT_MODEL.GET_EQUIPMENT_MODEL(id), getToken());
      dispatch(updateLoader(false));
      if (data?.httpStatus === OK) {
        dispatch(replaceEquipmentModel(data?.body));
      }
    } else {
      dispatch(replaceEquipmentModel(EQUIPMENT_MODEL_DEFAULT));
    }
  };
};

export const postEquipmentModel = (equipmentModel: EquipmentModel, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<EquipmentModel> = await postRequest(API.EQUIPMENT_MODEL.POST_EQUIPMENT_MODEL(), equipmentModel, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(replaceEquipmentModel(data.body));
      dispatch(getEquipmentModelList(() => {
      }, 3));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Model created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const putEquipmentModel = (equipmentModel: EquipmentModel, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<EquipmentModel> = await putRequest(API.EQUIPMENT_MODEL.PUT_EQUIPMENT_MODEL(), equipmentModel, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(replaceEquipmentModel(data?.body));
      dispatch(getEquipmentModelList(() => {
      }, 3));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Model Updated Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const getCustomFieldList = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(updateLoader(true));
      const data: any = await getRequest(API.EQUIPMENT_MODEL.GET_CUSTOM_FIELD_LIST(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceCustomFieldList(data?.body));
      }
      dispatch(updateLoader(false));
    } else {
      dispatch(replaceCustomFieldList([]));
    }
  };
};

export const postCustomField = (customField: CustomField, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    if (customField?.typeField === 'number' && !customField.defaultValue?.trim()) {
      customField.defaultValue = '0';
    }
    if (customField?.typeField === 'checkbox' && !customField.defaultValue) {
      customField.defaultValue = 'false';
    }
    const data: OKObjectResponse<CustomField> = await postRequest(API.EQUIPMENT_MODEL.POST_CUSTOM_FIELD(), customField, getToken());
    if (data?.httpStatus === CREATED) {
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Model Updated Successfully'
      });
      dispatch(getCustomFieldList(customField.equipmentModelId));
    } else {
      warningAndError(data, setResponse);
    }
  };
};
export const putCustomField = (customField: CustomField, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    if (customField?.typeField === 'number' && !customField.defaultValue?.trim()) {
      customField.defaultValue = '0';
    }
    if (customField?.typeField === 'checkbox' && !customField.defaultValue) {
      customField.defaultValue = 'false';
    }
    const data: OKObjectResponse<CustomField> = await putRequest(API.EQUIPMENT_MODEL.PUT_CUSTOM_FIELD(), customField, getToken());
    if (data?.httpStatus === OK) {
      dispatch(getCustomFieldList(customField.equipmentModelId));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Model Updated Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
    
  };
};

export const deleteCustomField = (id: string, equipmentModelId: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<CustomField> = await deleteRequest(API.EQUIPMENT_MODEL.DELETE_CUSTOM_FIELD(id), getToken());
    if (data?.httpStatus === OK) {
      SuccessMessage({description: 'Custom Field deleted Successfully'});
      dispatch(getCustomFieldList(equipmentModelId));
    }
  };
};

export const getEquipmentModelByEquipmentType = (equipmentTypeId: string) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    if (equipmentTypeId) {
      const data: OKListResponse<EquipmentModel> = await getRequest(API.EQUIPMENT_MODEL.GET_BY_EQUIPMENT_TYPE(equipmentTypeId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceEquipmentModelList(data?.body)); 
      }
    }
    dispatch(updateLoader(false));
  };
};

export const deleteEquipmentModel = (
  id: string,
  setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  closeDrawer: Function,
) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.EQUIPMENT_MODEL.GET_EQUIPMENT_MODEL(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(getEquipmentModelList(() => {
      }, 3));
      SuccessMessage({description: 'Equipment Model deleted successfully'});
      closeDrawer();
    } else {
      warningAndError(data, setResponse);
    }
  };
};

