export interface Log {
  type: string,
  value: string,
  date: string,
  status: string,
  line: string,
  message: string,
  fileName: string,
  isImported: boolean,
}

export interface ImportDataState {
  logs: Array<Log>,
  timeElapsed: number,
  memory: number,
  logHistory: Array<LogHistory>,
  historyValue: HistoryValue,
  logDetails: LogHistory,
  currentImportDetails: LogHistory,
  totalPages: number,
  number: number,
  numberOfElements: number,
  totalElements: number,
}

export interface LogHistory {
  id: string,
  date: string,
  fileName: string,
  ip: string,
  localStorage: string,
  message: string,
  percentage: number,
  size: number,
  time: number,
  value: string,
}

export interface HistoryValue {
  id: string,
  value: Array<Log>,
}

export const LOG_HISTORY_DEFAULT: LogHistory = {
  id: '',
  date: '',
  ip: '',
  fileName: '',
  localStorage: '',
  message: '',
  percentage: -1,
  size: 0,
  time: 0,
  value: ''
};

export const HISTORY_VALUE_DEFAULT: HistoryValue = {
  id: '',
  value: [],
};

export const IMPORT_DATA_DEFAULT: ImportDataState = {
  logs: [],
  timeElapsed: 0,
  memory: 0,
  logHistory: [],
  historyValue: HISTORY_VALUE_DEFAULT,
  logDetails: LOG_HISTORY_DEFAULT,
  currentImportDetails: LOG_HISTORY_DEFAULT,
  totalPages: 0,
  number: 0,
  numberOfElements: 0,
  totalElements: 0,
};

export enum IMPORT_DATA_ACTIONS {
  REPLACE_LOGS = 'REPLACE_LOGS',
  REPLACE_TIME_ELAPSED = 'REPLACE_TIME_ELAPSED',
  REPLACE_MEMORY_USED = 'REPLACE_MEMORY_USED',
  REPLACE_LOG_HISTORY = 'REPLACE_LOG_HISTORY',
  REPLACE_HISTORY_VALUE = 'REPLACE_HISTORY_VALUE',
  REPLACE_LOG_DETAILS = 'REPLACE_LOG_DETAILS',
  REPLACE_CURRENT_IMPORT_DETAILS = 'REPLACE_CURRENT_IMPORT_DETAILS',
  REPLACE_LOG_HISTORY_PAGES = 'REPLACE_LOG_HISTORY_PAGES'
}

export interface ReplaceLogs {
  type: IMPORT_DATA_ACTIONS.REPLACE_LOGS,
  logs: Array<Log>
}

export interface ReplaceTimeElapsed {
  type: IMPORT_DATA_ACTIONS.REPLACE_TIME_ELAPSED,
  timeElapsed: number
}

export interface ReplaceMemoryUsed {
  type: IMPORT_DATA_ACTIONS.REPLACE_MEMORY_USED,
  memory: number
}

export interface ReplaceLogHistory {
  type: IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY,
  logs: {
    logHistory: Array<LogHistory>
    forward: number
  }
}

export interface ReplaceHistoryValue {
  type: IMPORT_DATA_ACTIONS.REPLACE_HISTORY_VALUE,
  historyValue: HistoryValue
}

export interface ReplaceLogDetails {
  type: IMPORT_DATA_ACTIONS.REPLACE_LOG_DETAILS,
  logDetails: LogHistory
}

export interface ReplaceCurrentImportDetails {
  type: IMPORT_DATA_ACTIONS.REPLACE_CURRENT_IMPORT_DETAILS,
  currentImportDetails: LogHistory
}

export interface ReplaceLogHistoryPages {
  type: IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY_PAGES
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number,
  }
}

export type ImportDataActionTypes =
  ReplaceLogs |
  ReplaceTimeElapsed |
  ReplaceMemoryUsed |
  ReplaceLogHistory |
  ReplaceLogDetails |
  ReplaceCurrentImportDetails |
  ReplaceHistoryValue | ReplaceLogHistoryPages;

