import { API } from '../../settings/server.config';
import * as httpClient from '../../settings/httpClients';
import { CREATED, OK, SESSION_STORAGE, TOKEN } from '../../constants/constants';
import { ACCOUNT_ACTIONS, AccountInformation, LoginType, MobileInformation } from '../types/account';
import { ROUTES } from '../../settings/routes';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { OKObjectResponse } from '../../settings/Backend/Responses';
import { history, RootState } from '../reducers';
import { CLEAR_REDUX_DATA, DEFAULT_TEAM, TeamState } from '../types';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import React from 'react';
import { showLoader } from './loader';
import { getEquipmentTypeList } from './equipmentType';

export const replaceToken = (token: string) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_TOKEN,
    token
  };
};

export const replaceAccountInformation = (account: AccountInformation) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_ACCOUNT_INFORMATION,
    account
  };
};

export const replaceMobileInformation = (mobile: MobileInformation) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_MOBILE_INFORMATION,
    mobile
  };
};

export const replaceLoginType = (loginType: LoginType) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_LOGIN_TYPE,
    loginType
  };
};

export const replaceAccountSelectedTeam = (team: TeamState) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_SELECTED_TEAM,
    team
  };
};

export const replaceImportId = (importId: string) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_IMPORT_ID,
    importId
  };
};

export const replaceNotifications = (notifications: boolean) => {
  return {
    type: ACCOUNT_ACTIONS.REPLACE_NOTIFICATIONS,
    notifications
  };
};

export const getLoginType = () => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<LoginType> = await httpClient.getRequest(API.LOGIN_TYPE.LOGIN());
    if (data?.httpStatus === OK) {
      dispatch(replaceLoginType(data?.body));
    }
  };
};

export const sendLogin = (value: { username: string, password: string }) => {
  return async (dispatch: Function) => {
    const res: OKObjectResponse<any> = await httpClient.postRequest(API.USER.LOGIN(), value);
    if (res?.body?.token) {
      localStorage.setItem(TOKEN, res?.body?.token);
      dispatch(replaceToken(res?.body?.token));
      dispatch(updateAccountInformation());
    }
  };
};

export const sendOAuth2 = (value: { tokenId: string, tokenGoogle: string }) => {
  return async (dispatch: Function) => {
    const res = await httpClient.postRequest(API.USER.GOOGLE(), value);
    if (res?.body?.token) {
      localStorage.setItem(TOKEN, res?.body?.token);
      dispatch(replaceToken(res?.body?.token));
      dispatch(updateAccountInformation());
    }
  };
};

export const authorizationRequest = (value: { roleId: string, teamId: string }) => {
  return async (dispatch: Function) => {
    const res: OKObjectResponse<any> = await httpClient.postRequest(API.USER.AUTHORIZATION_REQUEST(), value, httpClient.getToken());
    if (res.httpStatus === CREATED || res.httpStatus === OK) {
      dispatch(updateAccountInformation());
    }
  };
};

export const deleteAuthorizationRequest = () => {
  return async (dispatch: Function) => {
    const res: OKObjectResponse<any> = await httpClient.deleteRequest(API.USER.AUTHORIZATION_REQUEST(), httpClient.getToken());
    if (res.httpStatus === OK) {
      SuccessMessage({description: 'Your last request has been removed'});
      dispatch(updateAccountInformation());
    }
  };
};

export const updateAccountInformation = () => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<AccountInformation> = await httpClient.getRequest(API.USER.ME(), httpClient.getToken());
    if (data?.httpStatus === OK) {
      
      const token = httpClient.getToken();
      const account = data?.body;
      
      await dispatch(replaceAccountInformation({
        ...account,
        teamId: account?.teamId ? account?.teamId : '',
      }));
      
      await dispatch(replaceToken(token));
      if(account.role) {
        dispatch(getEquipmentTypeList());
      }
      
      const team = sessionStorage.getItem(SESSION_STORAGE.TEAM_SELECTED);
      if (team === 'undefined' || !team) {
        const teamsSelected = account?.teamList.filter(team => team.players > 0);
        if (teamsSelected.length > 0) {
          replaceAccountSelectedTeam(teamsSelected[0]);
        } else {
          replaceAccountSelectedTeam(DEFAULT_TEAM);
        }
      } else {
        replaceAccountSelectedTeam(account?.teamList[0]);
      }
      
    } else {
      httpClient.logout();
      dispatch(resetAccountInformation());
    }
  };
};

export const resetAccountInformation = () => {
  return (dispatch: Function) => {
    httpClient.logout();
    dispatch({type: CLEAR_REDUX_DATA});
    history.push(ROUTES.LOGIN.PAGE());
  };
};

export const resetPassword = (
  currentPassword: string,
  newPassword: string,
  setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  resetForm: Function
) => {
  return async (dispatch: Function) => {
    
    dispatch(showLoader(true));
    const body = {
      currentPassword,
      newPassword
    };
    const data: OKObjectResponse<any> = await httpClient.postRequest(API.USER.CHANGE_PASSWORD(), body, httpClient.getToken());
    
    if (data.httpStatus === OK) {
      setResponse({
        type: 'success',
        description: 'Password changed successfully',
        title: 'Updated'
      });
      resetForm();
    } else {
      setResponse({
        type: 'warning',
        description: data?.message,
        title: 'Error'
      });
    }
    dispatch(showLoader(false));
  };
};

export const enableDSDevice = (status: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function, getState: Function) => {
    const data: OKObjectResponse<boolean> = await httpClient.getRequest(API.USER.ENABLE_DS_DEVICE(status), httpClient.getToken());
    const state: RootState = getState();
    
    const action = status === 'true' ? 'Enabled' : 'Disabled';
    if (data.httpStatus === OK) {
      dispatch(replaceAccountInformation({
        ...state.account.account,
        ds9908r: data?.body
      }));
      setResponse({
        type: 'success',
        description: `${action} successfully`,
        title: action
      });
    } else {
      setResponse({
        type: 'warning',
        description: data?.message,
        title: 'Error'
      });
    }
  };
  
};

export const getInformationApk = () => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await httpClient.getRequest(API.USER.GET_INFO_APK());
    if (data.httpStatus === OK) {
      dispatch(replaceMobileInformation(data?.body));
    }
  };
};

export const updateNotifications = (notifications: boolean) => {
  return (dispatch: Function) => {
    dispatch(replaceNotifications(notifications));
  };
};

export const oktaRedirectTo = () => {
  return async (dispatch: Function) => {
  };
};

