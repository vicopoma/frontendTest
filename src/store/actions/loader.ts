import { LOADER_ACTIONS } from '../types/loader';

export const updateLoader = (showLoader: boolean) => {
  return {
    type: LOADER_ACTIONS.UPDATE_LOADER,
    showLoader
  };
};

export const showLoader = (show: boolean) => {
  return (dispatch: Function) => {
    dispatch(updateLoader(show));
  };
};

