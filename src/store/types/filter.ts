export type FilterState = {
  [query: string]: {
    params: Array<any>
  }
}

export type FiltersState = {
  [component: string]: FilterState
}

export enum FILTER_ACTIONS {
  REPLACE_FILTER = 'REPLACE_FILTER',
  REPLACE_STORAGE = 'REPLACE_STORAGE'
}

interface ReplaceFilter {
  type: FILTER_ACTIONS.REPLACE_FILTER,
  filter: {
    component: string,
    filters: FilterState
  }
}

interface ReplaceStorageFilter {
  type: FILTER_ACTIONS.REPLACE_STORAGE,
  filters: { [component: string]: FilterState }
}

export type filterActionType = ReplaceFilter | ReplaceStorageFilter;

