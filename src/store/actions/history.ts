import { HISTORY_ACTION, HistoryState } from '../types/history';
import { OkPagedListResponse } from '../../settings/Backend/Responses';
import { API } from '../../settings/server.config';
import { getRequest, getToken } from '../../settings/httpClients';
import { OK } from '../../constants/constants';

export const replaceHistoryList = (histories: Array<HistoryState>, forward: number) => {
  return {
    type: HISTORY_ACTION.REPLACE_HISTORY_LIST,
    data: {
      histories,
      forward
    }
  };
};

export const replaceHistoryPages = (pages: number) => {
  return {
    type: HISTORY_ACTION.REPLACE_HISTORY_PAGES,
    pages
  };
};

export const replaceHistoryTotalPages = (totalPages: number) => {
  return {
    type: HISTORY_ACTION.REPLACE_HISTORY_TOTAL_PAGES,
    totalPages
  };
};

export const loadHistoryList = (setLoader: Function, forward: number, id?: string) => {
  return async (dispatch: Function) => {
    setLoader(true);
    if (id) {
      const data: OkPagedListResponse<HistoryState> = await getRequest(API.HISTORY.HISTORY_BY_ID(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceHistoryList(data?.body.content, forward));
        dispatch(replaceHistoryPages(data?.body?.pageable?.pageNumber));
        dispatch(replaceHistoryTotalPages(data?.body?.totalPages));
      } else {
        dispatch(replaceHistoryList([], forward));
        dispatch(replaceHistoryPages(0));
        dispatch(replaceHistoryTotalPages(0));
      }
    } else {
      dispatch(replaceHistoryList([], forward));
      dispatch(replaceHistoryPages(0));
      dispatch(replaceHistoryTotalPages(0));
    }
    setLoader(false);
  };
};
