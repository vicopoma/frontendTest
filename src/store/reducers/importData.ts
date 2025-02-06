import {
  IMPORT_DATA_ACTIONS,
  IMPORT_DATA_DEFAULT,
  ImportDataActionTypes,
  ImportDataState,
  LogHistory
} from '../types/importData';
import { mergeLists } from '../../helpers/Utils';

export const importView = (state: ImportDataState = IMPORT_DATA_DEFAULT, action: ImportDataActionTypes): ImportDataState => {
  switch (action.type) {
    case IMPORT_DATA_ACTIONS.REPLACE_LOGS:
      return {
        ...state,
        logs: action.logs
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_TIME_ELAPSED:
      return {
        ...state,
        timeElapsed: action.timeElapsed
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_MEMORY_USED:
      return {
        ...state,
        memory: action.memory
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY:
      const logsHistory: Array<LogHistory> = mergeLists(state.logHistory, action.logs.logHistory, action.logs.forward);
      return {
        ...state,
        logHistory: logsHistory
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_HISTORY_VALUE:
      return {
        ...state,
        historyValue: action.historyValue
      };
    case IMPORT_DATA_ACTIONS.REPLACE_LOG_DETAILS:
      return {
        ...state,
        logDetails: action.logDetails
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_CURRENT_IMPORT_DETAILS:
      return {
        ...state,
        currentImportDetails: action.currentImportDetails
      };
    
    case IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY_PAGES:
      return {
        ...state,
        totalElements: action.data.totalElements,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        number: action.data.number,
      };
    
    default:
      return state;
  }
};
