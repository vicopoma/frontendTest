export interface RoleState {
  description: string,
  id: string,
  name: string
}

export interface RolesState {
  roles: Array<RoleState>,
  loginRoles: Array<RoleState>
}

export const DEFAULT_ROLES: RolesState = {
  roles: [],
  loginRoles: []
};

export enum ROLE_ACTIONS {
  REPLACE_ROLES = 'REPLACE_ROLES',
  REPLACE_ROLES_LOGIN = 'REPLACE_ROLES_LOGIN'
}

interface ReplaceRolesAction {
  type: ROLE_ACTIONS.REPLACE_ROLES,
  roles: Array<RoleState>
}

interface ReplaceRolesLoginAction {
  type: ROLE_ACTIONS.REPLACE_ROLES_LOGIN,
  loginRoles: Array<RoleState>
}

export type roleActionTypes = ReplaceRolesAction | ReplaceRolesLoginAction;
