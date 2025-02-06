import { BODY_FILTER_ACTION, BodyFilterState } from '../types/bodyFilter';


export const replaceBodyFilter = (component: string, content: BodyFilterState) => {
  return {
    type: BODY_FILTER_ACTION.REPLACE_BODY_FILTER,
    filter: {
      component,
      content
    }
  };
};

export const replaceStorageBodyFilter = (storageBodyFilter: BodyFilterState) => {
  return {
    type: BODY_FILTER_ACTION.REPLACE_STORAGE_BODY_FILTER,
    bodyFilters: storageBodyFilter
  };
};

export const updateBodyFilters = (component: string, content: BodyFilterState) => {
  return (dispatch: Function) => {
    dispatch(replaceBodyFilter(component, content));
  };
};

export const updateStorageBodyFilter = (bodyFilter: BodyFilterState) => {
  return (dispatch: Function) => {
    dispatch(replaceStorageBodyFilter(bodyFilter));
  };
};
