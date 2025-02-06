import { DEFAULT_ROLES, ROLE_ACTIONS, roleActionTypes, RolesState } from '../types';

export const roles = (state: RolesState = DEFAULT_ROLES, action: roleActionTypes) => {
  switch (action.type) {
    case ROLE_ACTIONS.REPLACE_ROLES:
      return {...state, roles: action.roles};
    case ROLE_ACTIONS.REPLACE_ROLES_LOGIN:
      return {...state, loginRoles: action.loginRoles};
    default:
      return state;
  }
};
