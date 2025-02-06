import { ROLE_ACTIONS, RoleState } from '../types';
import { OKListResponse } from '../../settings/Backend/Responses';
import { API } from '../../settings/server.config';
import { getRequest, getToken } from '../../settings/httpClients';
import { OK } from '../../constants/constants';


export const replaceRoles = (roles: Array<RoleState>) => {
  return {
    type: ROLE_ACTIONS.REPLACE_ROLES,
    roles
  };
};

export const replaceRolesLogin = (loginRoles: Array<RoleState>) => {
  return {
    type: ROLE_ACTIONS.REPLACE_ROLES_LOGIN,
    loginRoles
  };
};

export const loadRoles = () => {
  return async (dispatch: Function) => {
    const data: OKListResponse<RoleState> = await getRequest(API.ROLES.ROLES(), getToken());
    
    if (data?.httpStatus === OK) {
      dispatch(replaceRoles(data?.body));
    }
  };
};

export const loadRolesLogin = () => {
  return async (dispatch: Function) => {
    const data: OKListResponse<RoleState> = await getRequest(API.ROLES.ROLES_LOGIN(), getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceRolesLogin(data?.body));
    }
  };
};
