export interface HistoryState {
  operation: string,
  note: string,
  attribute: string,
  oldValue: string,
  newValue: string,
  changeByUser: string,
  changeDate: string,
}

export interface HistoriesState {
  history: Array<HistoryState>,
  number: number,
  numberOfElements: number,
  pages: number,
  totalElements: number,
  totalPages: number
}

export const DEFAULT_HISTORY: HistoriesState = {
  history: [],
  number: 0,
  numberOfElements: 0,
  pages: 0,
  totalElements: 0,
  totalPages: 0
};

export enum HISTORY_ACTION {
  REPLACE_HISTORY_LIST = 'REPLACE_HISTORY_LIST',
  REPLACE_HISTORY_PAGES = 'REPLACE_HISTORY_PAGES',
  REPLACE_HISTORY_TOTAL_PAGES = 'REPLACE_HISTORY_TOTAL_PAGES'
}

interface ReplaceHistoryList {
  type: HISTORY_ACTION.REPLACE_HISTORY_LIST,
  data: {
    histories: Array<HistoryState>,
    forward: number
  }
}

interface ReplaceHistoryPages {
  type: HISTORY_ACTION.REPLACE_HISTORY_PAGES,
  pages: number
}

interface ReplaceHistoryTotalPages {
  type: HISTORY_ACTION.REPLACE_HISTORY_TOTAL_PAGES,
  totalPages: number
}

export type historyActionTypes = ReplaceHistoryList | ReplaceHistoryPages | ReplaceHistoryTotalPages;
