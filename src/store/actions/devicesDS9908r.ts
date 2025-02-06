import { OKListResponse, OKObjectResponse } from '../../settings/Backend/Responses';
import { API } from '../../settings/server.config';
import { getRequest, getToken } from '../../settings/httpClients';
import { ERROR_DS9908R_STATUS, ERROR_DS9908R_STATUS_RESPONSE, OK } from '../../constants/constants';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { DEVICE_DS9908R_ACTIONS, InstallerState } from '../types/deviceDS9908R';
import React from 'react';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

export const replaceDeviceInstaller = (installers: Array<InstallerState>) => {
  return {
    type: DEVICE_DS9908R_ACTIONS.REPLACE_DEVICE_INSTALLER,
    installers
  };
};

export const beepDevice = (beeps: string, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.DS9908R.BEEP(beeps));
    if (data?.httpStatus === OK) {
      if (data?.body?.statusDevice === 0) {
        fetchResponse({
          title: 'Success',
          description: 'Status has been changed successfully',
          type: 'success'
        });
      } else {
        if (data && data?.body && data?.body?.statusDevice) {
          fetchResponse({
            title: 'Warning',
            description: ERROR_DS9908R_STATUS_RESPONSE[data?.body?.statusDevice as ERROR_DS9908R_STATUS],
            type: 'warning'
          });
        } else {
          fetchResponse({
            title: 'Error',
            description: 'Internal server error',
            type: 'error'
          });
        }
      }
    }
  };
};

export const loadInstallers = () => {
  return async (dispatch: Function) => {
    const data: OKListResponse<InstallerState> = await getRequest(API.DEVICES.DS9908R.INSTALLERS(), getToken());
    
    if (data?.httpStatus === OK) {
      dispatch(replaceDeviceInstaller(data?.body));
    }
  };
};

export const changeStatus = (status: string, setStatusSwitch: React.Dispatch<React.SetStateAction<boolean>>, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async () => {
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.DS9908R.CHANGE_STATUS(status));
    if (data?.body?.statusDevice === 0) {
      setStatusSwitch(status === 'on' ? true : false);
      SuccessMessage({description: 'Operation accomplished'});
      fetchResponse({
        title: 'Success',
        description: 'Status has been changed successfully',
        type: 'success'
      });
    } else {
      if (data && data?.body && data?.body?.statusDevice) {
        fetchResponse({
          title: 'Warning',
          description: ERROR_DS9908R_STATUS_RESPONSE[data?.body?.statusDevice as ERROR_DS9908R_STATUS],
          type: 'warning'
        });
      } else {
        fetchResponse({
          title: 'Error',
          description: 'Internal server error',
          type: 'error'
        });
      }
    }
  };
};


export const statusDevice = (setStatusSwitch: React.Dispatch<React.SetStateAction<boolean>>, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async () => {
    const data: any = await getRequest(API.DEVICES.DS9908R.STATUS_DEVICE());
    if (data?.body) {
      setStatusSwitch(true);
    } else {
      setStatusSwitch(false);
    }
  };
};

export const changeLightColor = (color: string, status: string, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async () => {
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.DS9908R.CHANGE_LIGHT_COLOR(color, status));
    if (data?.httpStatus === OK) {
      if (data?.body?.statusDevice === 0) {
        fetchResponse({
          title: 'Success',
          description: 'Color changed successfully',
          type: 'success'
        });
      } else {
        if (data && data?.body && data?.body?.statusDevice) {
          fetchResponse({
            title: 'Warning',
            description: ERROR_DS9908R_STATUS_RESPONSE[data?.body?.statusDevice as ERROR_DS9908R_STATUS],
            type: 'warning'
          });
        } else {
          fetchResponse({
            title: 'Error',
            description: 'Internal server error',
            type: 'error'
          });
        }
      }
    }
  };
};

export const reboot = (fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async () => {
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.DS9908R.REBOOT());
    if (data?.httpStatus === OK) {
      if (data?.body?.statusDevice === 0) {
        fetchResponse({
          title: 'Success',
          description: 'Operation accomplished',
          type: 'success'
        });
      } else {
        if (data && data?.body && data?.body?.statusDevice) {
          fetchResponse({
            title: 'Warning',
            description: ERROR_DS9908R_STATUS_RESPONSE[data?.body?.statusDevice as ERROR_DS9908R_STATUS],
            type: 'warning'
          });
        } else {
          fetchResponse({
            title: 'Error',
            description: 'Internal server error',
            type: 'error'
          });
        }
      }
    }
  };
};


export const changeVolume = (volume: number, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async () => {
    const data: OKObjectResponse<any> = await getRequest(API.DEVICES.DS9908R.VOLUME(volume));
    if (data?.httpStatus === OK) {
      if (data?.body?.statusDevice === 0) {
        fetchResponse({
          title: 'Success',
          description: 'Volume changed successfully',
          type: 'success'
        });
      } else {
        if (data && data?.body && data?.body?.statusDevice) {
          fetchResponse({
            title: 'Warning',
            description: ERROR_DS9908R_STATUS_RESPONSE[data?.body?.statusDevice as ERROR_DS9908R_STATUS],
            type: 'warning'
          });
        } else {
          fetchResponse({
            title: 'Error',
            description: 'Internal server error',
            type: 'error'
          });
        }
      }
    }
  };
};
