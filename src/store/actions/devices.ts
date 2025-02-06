import { DEFAULT_FX9600, DEVICES_ACTION, FX9600Maps, FX9600Sites, FX9600State } from '../types/devices';
import { OKObjectResponse } from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndErrorMessages
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK, SCANNER_DEVICE_FX9600_FILTER } from '../../constants/constants';
import { FilterState } from '../types';
import { paramBuilder } from '../../helpers/Utils';
import { showLoader } from './loader';

export const replaceFX9600List = (list: Array<FX9600State>) => {
  return {
    type: DEVICES_ACTION.REPLACE_FX9600LIST,
    list
  };
};

export const replaceFX9600Device = (device: FX9600State) => {
  return {
    type: DEVICES_ACTION.REPLACE_FX9600_DEVICE,
    device
  };
};

export const replaceFX9600Sites = (sites: Array<FX9600Sites>) => {
  return {
    type: DEVICES_ACTION.REPLACE_FX9600_SITES,
    sites
  };
};

export const replaceFX9600Maps = (maps: Array<FX9600Maps>) => {
  return {
    type: DEVICES_ACTION.REPLACE_FX9600_MAPS,
    maps
  };
};

export const replaceFX9600totalPages = (totalPages: number) => {
  return {
    type: DEVICES_ACTION.REPLACE_FX9600_TOTAL_PAGES,
    totalPages
  };
};

export const loadFx9600List = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[SCANNER_DEVICE_FX9600_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    setLoader(true);
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.FX9600.FX9600_LIST_MWE() + query, getToken());
    setLoader(false);
    if (data?.httpStatus === OK) {
      const devices: Array<FX9600State> = JSON.parse(data?.body?.data);
      const sites: Array<FX9600Sites> = JSON.parse(data?.body?.sites);
      const maps: Array<FX9600Maps> = JSON.parse(data?.body?.maps);
      dispatch(replaceFX9600List(devices));
      dispatch(replaceFX9600Sites(sites));
      dispatch(replaceFX9600Maps(maps));
    }
  };
};

export const loadFx9600ById = (id: string) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    if (!!id) {
      const data: OKObjectResponse<FX9600State> = await getRequest(API.DEVICES.FX9600.FX9600_BY_ID(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceFX9600Device(data?.body));
      } else {
        dispatch(replaceFX9600Device(DEFAULT_FX9600));
      }
    } else {
      dispatch(replaceFX9600Device(DEFAULT_FX9600));
    }
    dispatch(showLoader(false));
  };
};

export const saveFx9600Device = (device: FX9600State) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await postRequest(API.DEVICES.FX9600.FX9600(), device, getToken());
    if (data?.httpStatus === CREATED) {
      dispatch(loadFx9600List(() => {
      }, 3));
    }
  };
};

export const updateFx9600Device = (device: FX9600State) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await putRequest(API.DEVICES.FX9600.FX9600(), device, getToken());
    if (data.httpStatus === OK) {
      dispatch(loadFx9600List(() => {
      }, 3));
    }
  };
};

export const deleteFx9600Device = (deviceId: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.DEVICES.FX9600.FX9600(deviceId), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadFx9600List(() => {
      }, 3));
    }
    warningAndErrorMessages(data);
  };
};

