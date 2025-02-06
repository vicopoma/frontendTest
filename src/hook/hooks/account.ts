import React, { useCallback } from 'react';
import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import {
  authorizationRequest,
  deleteAuthorizationRequest,
  enableDSDevice,
  getInformationApk,
  getLoginType,
  oktaRedirectTo,
  replaceAccountSelectedTeam,
  replaceToken,
  resetAccountInformation,
  resetPassword,
  sendLogin,
  sendOAuth2,
  updateAccountInformation,
  updateNotifications
} from '../../store/actions/account';
import { AccountInformation, LoginType, MobileInformation, TeamState } from '../../store/types';
import { RootState } from '../../store/reducers';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

const selectAccountStates: ParametricSelector<RootState, undefined, {
  tokenAuth: string,
  account: AccountInformation,
  loginType: LoginType,
  teamSelected: TeamState,
  mobile: MobileInformation,
  notifications: boolean
}> =
  createSelector<RootState, string, AccountInformation, LoginType, TeamState, MobileInformation, boolean,
    {
      tokenAuth: string,
      account: AccountInformation,
      loginType: LoginType,
      teamSelected: TeamState,
      mobile: MobileInformation,
      notifications: boolean,
    }>
  (
    state => state.account.token,
    state => state.account.account,
    state => state.account.loginType,
    state => state.account.teamSelected,
    state => state.account.mobile,
    state => state.account.notifications,
    (tokenAuth, account, loginType, teamSelected, mobile, notifications) => ({
      tokenAuth, account, loginType, teamSelected, mobile, notifications
    })
  );

export const useAccountState = () => {
  return useSelector((state: RootState) => selectAccountStates(state, undefined));
};

export const useAccountDispatch = () => {
  const dispatch = useDispatch();
  return {
    getLoginType: useCallback(() => dispatch(getLoginType()), [dispatch]),
    sendLogin(value: { username: string, password: string }) {
      dispatch(sendLogin(value));
    },
    sendOAuth2(value: { tokenId: string, tokenGoogle: string }) {
      dispatch(sendOAuth2(value));
    },
    resetUserInformation() {
      dispatch(resetAccountInformation());
    },
    authorizationRequest: (values: { roleId: string, teamId: string }) => dispatch(authorizationRequest(values)),
    deleteAuthorizationRequest: () => dispatch(deleteAuthorizationRequest()),
    replaceUserInformation: useCallback(() => dispatch(updateAccountInformation()), [dispatch]),
    changePassword:
      (currentPassword: string,
       newPassword: string,
       setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
       resetForm: Function) =>
        dispatch(resetPassword(currentPassword, newPassword, setResponse, resetForm)),
    enableDSDevice: async (status: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) =>
      await dispatch(enableDSDevice(status, setResponse)),
    replaceAccountSelectedTeam: useCallback((team: TeamState) => dispatch(replaceAccountSelectedTeam(team)), [dispatch]),
    getInformationApk: useCallback(() => dispatch(getInformationApk()), [dispatch]),
    oktaRedirect: () => dispatch(oktaRedirectTo()),
    replaceToken: useCallback(async (token: string) => await dispatch(replaceToken(token)), [dispatch]),
    updateNotifications: useCallback((notifications: boolean) => dispatch(updateNotifications(notifications)), [dispatch])
  };
};
