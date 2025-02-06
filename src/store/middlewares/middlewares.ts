import { ACCOUNT_ACTIONS, FILTER_ACTIONS } from '../types';
import { SESSION_STORAGE } from '../../constants/constants';
import { BODY_FILTER_ACTION } from '../types/bodyFilter';

export const logger = (store: { getState: Function, dispatch: Function }) => (next: Function) => (action: any) => {
  let result = next(action);
  return result;
};

export const storageFilterMiddleware = (store: { getState: Function, dispatch: Function }) => (next: Function) => (action: any) => {
  let result = next(action);
  if (action?.type === FILTER_ACTIONS.REPLACE_FILTER) {
    sessionStorage.setItem(SESSION_STORAGE.FILTERS, JSON.stringify(store.getState()?.filters));
  }
  
  if (action?.type === ACCOUNT_ACTIONS.REPLACE_SELECTED_TEAM) {
    sessionStorage.setItem(SESSION_STORAGE.TEAM_SELECTED, JSON.stringify(store.getState()?.account.teamSelected));
  }
  
  if (action?.type === BODY_FILTER_ACTION.REPLACE_BODY_FILTER) {
    sessionStorage.setItem(SESSION_STORAGE.FILTERS_BODY_PARAMS, JSON.stringify(store.getState()?.bodyFilter));
  }
  
  return result;
};
