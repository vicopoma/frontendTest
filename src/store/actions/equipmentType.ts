import { CREATED, EQUIPMENT, EQUIPMENT_TYPE_FILTER, OK } from '../../constants/constants';
import { OKListResponse, OKObjectResponse } from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';

import {
  EQUIPMENT_TYPE_ACTIONS,
  EQUIPMENT_TYPE_DEFAULT,
  EquipmentType,
  FilterState,
  ParamsEquipmentType
} from '../types';
import { paramBuilder } from '../../helpers/Utils';
import { updateLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { RootState } from '../reducers';
import { replaceBodyFilter } from './bodyFilter';

export const replaceEquipmentTypeList = (equipmentTypeList: Array<EquipmentType>) => {
  return {
    type: EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE_LIST,
    equipmentTypeList
  };
};

export const replaceEquipmentType = (equipmentType: EquipmentType) => {
  return {
    type: EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE,
    equipmentType
  };
};

export const replaceTotalElements = (totalElements: number, totalPages: number, numberOfElements: number, number: number) => {
  return {
    type: EQUIPMENT_TYPE_ACTIONS.REPLACE_TOTAL_ELEMENTS,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replaceParams = (params: ParamsEquipmentType) => {
  return {
    type: EQUIPMENT_TYPE_ACTIONS.REPLACE_PARAMS,
    params
  };
};

export const getEquipmentTypeList = () => {
  return async (dispatch: Function, getState: Function) => {
    const store: RootState = getState();
    updateLoader(true);
    const params: FilterState = store.filters[EQUIPMENT_TYPE_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: OKListResponse<EquipmentType> = await getRequest(API.EQUIPMENT_TYPE.GET_EQUIPMENT_TYPE_LIST() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceEquipmentTypeList(data?.body));
      const bodyFilter = getState().bodyFilter[EQUIPMENT];
      if (!bodyFilter?.equipmentTypeId) {
        dispatch(replaceBodyFilter(EQUIPMENT, {
          ...bodyFilter,
          equipmentTypeId: data.body.filter(equipmentType => equipmentType.nflId === '1')?.[0].id
        }));
      }
    }
    updateLoader(false);
  };
};

export const getEquipmentTypeById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<EquipmentType> = await getRequest(API.EQUIPMENT_TYPE.GET_EQUIPMENT_TYPE(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceEquipmentType(data?.body));
      }
      dispatch(updateLoader(false));
    } else {
      dispatch(replaceEquipmentType(EQUIPMENT_TYPE_DEFAULT));
    }
  };
};

export const postEquipmentType = (equipmentType: EquipmentType, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, callback?: (res: EquipmentType) => void) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<EquipmentType> = await postRequest(API.EQUIPMENT_TYPE.POST_EQUIPMENT_TYPE(), equipmentType, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(replaceEquipmentType(data?.body));
      dispatch(getEquipmentTypeList());
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Created Successfully'
      });
      if (callback) {
        callback(data?.body);
      }
    } else {
      warningAndError(data, setResponse);
    }
  };
};


export const putEquipmentType = (equipmentType: EquipmentType, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<EquipmentType> = await putRequest(API.EQUIPMENT_TYPE.PUT_EQUIPMENT_TYPE(), equipmentType, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(replaceEquipmentType(data?.body));
      dispatch(getEquipmentTypeList());
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Updated Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const deleteEquipmentType = (
  id: string,
  setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  callback: Function
) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.EQUIPMENT_TYPE.GET_EQUIPMENT_TYPE(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(getEquipmentTypeList());
      SuccessMessage({description: 'Equipment Type delete successfully'});
      callback();
    } else {
      warningAndError(data, setResponse);
    }
  };
};
