import { FILTER_ACTIONS, FilterState } from '../types';

export const replaceFilter = (component: string, filters: FilterState) => {
  return {
    type: FILTER_ACTIONS.REPLACE_FILTER,
    filter: {
      component,
      filters
    }
  };
};

export const replaceAllFilter = (filters: { [component: string]: FilterState }) => {
  return {
    type: FILTER_ACTIONS.REPLACE_STORAGE,
    filters
  };
};

export const updateFilters = (component: string, filters: FilterState) => {
  return (dispatch: Function) => {
    dispatch(replaceFilter(component, filters));
  };
};

export const updateStorageFilter = (filters: { [component: string]: FilterState }) => {
  return (dispatch: Function) => {
    dispatch(replaceAllFilter(filters));
  };
};




