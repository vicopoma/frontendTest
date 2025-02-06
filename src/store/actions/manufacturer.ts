import { CREATED, MANUFACTURER_FILTER, OK } from '../../constants/constants';
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

import { FilterState, Manufacturer, MANUFACTURER_ACTIONS, MANUFACTURER_DEFAULT, ParamsManufacturer } from '../types';
import { paramBuilder } from '../../helpers/Utils';
import { updateLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import React from 'react';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';


export const replaceManufacturerList = (manufacturerList: Manufacturer[]) => {
  return {
    type: MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER_LIST,
    manufacturerList
  };
};

export const replaceManufacturer = (manufacturer: Manufacturer) => {
  return {
    type: MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER,
    manufacturer
  };
};

export const replaceTotalElements = (totalElements: number) => {
  return {
    type: MANUFACTURER_ACTIONS.REPLACE_TOTAL_ELEMENTS,
    totalElements
  };
};

export const replaceParams = (params: ParamsManufacturer) => {
  return {
    type: MANUFACTURER_ACTIONS.REPLACE_PARAMS,
    params
  };
};

export const getManufacturerList = () => {
  return async (dispatch: Function, getState: Function) => {
    
    const params: FilterState = getState().filters[MANUFACTURER_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: any = await getRequest(API.MANUFACTURER.GET_MANUFACTURER_LIST() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceManufacturerList(data?.body));
    }
  };
};

export const getManufacturerById = (id: string) => {
  return async (dispatch: Function) => {
    
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<Manufacturer> = await getRequest(API.MANUFACTURER.GET_MANUFACTURER(id), getToken());
      dispatch(updateLoader(false));
      if (data?.httpStatus === OK) {
        dispatch(replaceManufacturer(data?.body));
      }
    } else {
      dispatch(replaceManufacturer(MANUFACTURER_DEFAULT));
    }
  };
};

export const postManufacturer = (manufacturer: Manufacturer, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<Manufacturer> = await postRequest(API.MANUFACTURER.POST_MANUFACTURER(), manufacturer, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(replaceManufacturer(data.body));
      dispatch(getManufacturerList());
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const putManufacturer = (manufacturer: Manufacturer, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<Manufacturer> = await putRequest(API.MANUFACTURER.PUT_MANUFACTURER(), manufacturer, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(replaceManufacturer(data?.body));
      dispatch(getManufacturerList());
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

export const deleteManufacturer = (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<any> = await deleteRequest(API.MANUFACTURER.GET_MANUFACTURER(id), getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(getManufacturerList());
      SuccessMessage({description: 'Manufacturer delete successfully'});
      closeDrawer();
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const getManufacturerByEquipmentType = (equipmentTypeId: string) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    if (!!equipmentTypeId) {
      const data: OKListResponse<Manufacturer> = await getRequest(API.MANUFACTURER.GET_MANUFACTURER_LIST() + API.MANUFACTURER.GET_BY_EQUIPMENT_TYPE(equipmentTypeId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceManufacturerList(data?.body));
      }
    } else {
      dispatch(replaceManufacturerList([]));
    }
    dispatch(updateLoader(false));
  };
};
