import { useCallback } from 'react';
import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import {
  authorizationRequestResponse,
  loadAllUsers,
  synchronizedUsers,
  updateRoleAndTeam,
} from '../../store/actions/users';
import { DEFAULT_USER, RoleAndTeam, UsersState, UserState } from '../../store/types/users';
import { API } from '../../settings/server.config';
import { useObjectCrudFetch } from '../customHooks/fetchs';

const selectUserState: ParametricSelector<RootState, undefined, {
  users: Array<UserState>,
  user: UserState,
  allState: UsersState,
  autoCompleteUsers: Array<UserState>,
  pages: number,
}> =
  createSelector<RootState, Array<UserState>, UserState, UsersState, Array<UserState>, number,
    {
      users: Array<UserState>,
      user: UserState,
      allState: UsersState,
      autoCompleteUsers: Array<UserState>,
      pages: number
    }>
  (
    state => state.users.users,
    state => state.users.user,
    state => state.users,
    state => state.users.autoCompleteUsers,
    state => state.users.pages,
    (users, user, allState, autoCompleteUsers, pages: number) => ({
      users,
      user,
      allState,
      autoCompleteUsers,
      pages
    })
  );

export const useUsersState = () => {
  return useSelector((state: RootState) => selectUserState(state, undefined));
};

export const useUserDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadUsers: useCallback((setLoader: Function, forward: number) => dispatch(loadAllUsers(setLoader, forward)), [dispatch]),
    authorizationRequestResponse: (authReq: { userId: string, authorizationStatus: string }) => dispatch(authorizationRequestResponse(authReq)),
    synchronizedUsers: (setLoader: Function) => dispatch(synchronizedUsers(setLoader)),
    updateRoleAndTeam: (roleAndTeam: RoleAndTeam) => dispatch(updateRoleAndTeam(roleAndTeam))
  };
};

export const useUser = (userId: string) => {
  
  const {value, loadObject, createObject, updateObject, deleteObject} = useObjectCrudFetch({
    url: API.USER.BASE(),
    defaultValue: DEFAULT_USER,
    id: userId
  });
  
  return {
    user: value,
    loadUserById: loadObject,
    updateUser: updateObject,
    deleteUser: deleteObject,
    createUser: createObject
  };
};
