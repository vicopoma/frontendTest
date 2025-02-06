import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { RoleState } from '../../store/types';
import { useListFetch } from '../customHooks/fetchs';
import { API } from '../../settings/server.config';


const selectRolesState: ParametricSelector<RootState, undefined, {
  roles: Array<RoleState>
  loginRoles: Array<RoleState>
}> =
  createSelector<RootState, Array<RoleState>, Array<RoleState>,
    {
      roles: Array<RoleState>,
      loginRoles: Array<RoleState>
    }>
  (
    state => state.roles.roles,
    state => state.roles.loginRoles,
    (roles, loginRoles) => ({
      roles, loginRoles
    })
  );

export const useRolesState = () => {
  return useSelector((state: RootState) => selectRolesState(state, undefined));
};

export const useRolesList = () => {
  const {values, loadList} = useListFetch<RoleState>({url: API.ROLES.ROLES()});
  useEffect(() => {
    loadList();
  }, [loadList]);
  return {
    roles: values
  };
};
