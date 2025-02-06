import { DEFAULT_HISTORY, HistoriesState, HISTORY_ACTION, historyActionTypes, HistoryState } from '../types/history';
import { mergeLists } from '../../helpers/Utils';

export const histories = (state: HistoriesState = DEFAULT_HISTORY, action: historyActionTypes) => {
  switch (action.type) {
    case HISTORY_ACTION.REPLACE_HISTORY_LIST:
      const histories: Array<HistoryState> = mergeLists(state.history, action.data.histories, action.data.forward);
      return {
        ...state,
        history: [...histories]
      };
    
    case HISTORY_ACTION.REPLACE_HISTORY_PAGES:
      return {
        ...state,
        pages: action.pages
      };
    
    case HISTORY_ACTION.REPLACE_HISTORY_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages
      };
    
    default:
      return state;
  }
};
