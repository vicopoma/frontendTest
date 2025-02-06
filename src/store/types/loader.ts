export interface LoaderState {
  showLoader: number
}

export const DEFAULT_LOADER: LoaderState = {
  showLoader: 0
};

export enum LOADER_ACTIONS {
  UPDATE_LOADER = 'UPDATE_LOADER',
}

interface UpdateLoader {
  type: LOADER_ACTIONS.UPDATE_LOADER,
  showLoader: boolean
}

export type loaderActionTypes = UpdateLoader;
