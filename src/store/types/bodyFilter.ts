export interface BodyFilterState {
  [key: string]: any
}

export interface BodyFiltersState {
  [component: string]: BodyFiltersState
}

export enum BODY_FILTER_ACTION {
  REPLACE_BODY_FILTER = 'REPLACE_BODY_FILTER',
  REPLACE_STORAGE_BODY_FILTER = 'REPLACE_STORAGE_BODY_FILTER'
}

interface ReplaceBodyFilter {
  type: BODY_FILTER_ACTION.REPLACE_BODY_FILTER,
  filter: {
    component: string,
    content: BodyFilterState
  }
}

interface ReplaceStorageBodyFilter {
  type: BODY_FILTER_ACTION.REPLACE_STORAGE_BODY_FILTER,
  bodyFilters: BodyFilterState
}

export type bodyFilterActionTypes = ReplaceBodyFilter | ReplaceStorageBodyFilter;
