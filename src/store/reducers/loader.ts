import { DEFAULT_LOADER, LOADER_ACTIONS, loaderActionTypes, LoaderState } from '../types/loader';

export const loader = (state: LoaderState = DEFAULT_LOADER, action: loaderActionTypes): LoaderState => {
  if (action.type === LOADER_ACTIONS.UPDATE_LOADER) {
    if (action.showLoader) {
      return {...state, showLoader: state.showLoader + 1};
    } else {
      return {...state, showLoader: state.showLoader - 1};
    }
  } else {
    return state;
  }
};
