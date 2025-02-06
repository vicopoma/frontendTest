import { HistoryValue, IMPORT_DATA_ACTIONS, Log, LogHistory } from '../types/importData';
import React from 'react';
import moment from 'moment';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { getRequest, getToken, postFormData } from '../../settings/httpClients';
import { dateFormatSec, FILTERS, OK, PROGRESS_STATUS } from '../../constants/constants';
import { API } from '../../settings/server.config';
import { RootState } from '../reducers';
import { paramBuilder } from '../../helpers/Utils';
import { replaceAccountInformation, replaceImportId } from './account';

export const replaceImportData = (logs: Array<Log>) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_LOGS,
    logs
  };
};

export const replaceImportDataInterval = (timeElapsed: number) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_TIME_ELAPSED,
    timeElapsed
  };
};

export const replaceImportDataMemory = (memory: number) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_MEMORY_USED,
    memory
  };
};

export const replaceLogHistory = (logHistory: Array<LogHistory>, forward: number) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY,
    logs: {
      logHistory,
      forward
    }
  };
};

export const replaceGetLogs = (historyValue: Array<HistoryValue>) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_HISTORY_VALUE,
    historyValue
  };
};

export const replaceLogDetails = (logDetails: LogHistory) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_LOG_DETAILS,
    logDetails
  };
};

export const replaceCurrentImportDetails = (currentImportDetails: LogHistory) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_CURRENT_IMPORT_DETAILS,
    currentImportDetails
  };
};

export const replaceLogHistoryPages = (totalElements: number, totalPages: number, numberOfElements: number, number: number) => {
  return {
    type: IMPORT_DATA_ACTIONS.REPLACE_LOG_HISTORY_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const importDataCsv = (
  form: FormData,
  setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  setCurrentProgress: React.Dispatch<React.SetStateAction<PROGRESS_STATUS>>,
  importType: string,
  forced: boolean,
  teamId: string,
  manufacturerId: string,
) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<string> = await postFormData(API.IMPORT.UPLOAD(importType.toUpperCase(), forced, teamId, manufacturerId), form, getToken());
    if (data?.httpStatus === OK || data?.status === 200) {
      dispatch(replaceImportId(data?.body));
      setFiles({});
    } else {
      dispatch(replaceImportData([{
        value: '',
        date: moment(new Date(), dateFormatSec).utc().toISOString(),
        fileName: '',
        status: 'ERROR',
        type: '',
        line: '',
        message: data?.message,
        isImported: false,
      }]));
      setCurrentProgress(PROGRESS_STATUS.EXCEPTION);
    }
  };
};

export const importApparelCsv = (
  form: FormData,
  setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  setCurrentProgress: React.Dispatch<React.SetStateAction<PROGRESS_STATUS>>,
  teamId: string,
) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<string> = await postFormData(API.APPAREL.IMPORT_CSV(teamId), form, getToken());
    if (data?.httpStatus === OK || data?.status === 200) {
      dispatch(replaceImportId(data?.body));
      setFiles({});
    } else {
      dispatch(replaceImportData([{
        value: '',
        date: moment(new Date(), dateFormatSec).utc().toISOString(),
        fileName: '',
        status: 'ERROR',
        type: '',
        line: '',
        message: data?.message,
        isImported: false,
      }]));
      setCurrentProgress(PROGRESS_STATUS.EXCEPTION);
    }
  };
};

export const loadHistoryLogs = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    setLoader(true);
    const store: RootState = getState();
    const params = store.filters[FILTERS.IMPORT_RESULT];
    const query = paramBuilder(params);
    const data: OkPagedListResponse<LogHistory> = await getRequest(API.IMPORT.LOGS() + query, getToken());
    if (data.httpStatus === OK || data.status === 200) {
      dispatch(replaceLogHistory(data?.body.content, forward));
      dispatch(replaceLogHistoryPages(data?.body.totalElements, data?.body.totalPages, data?.body.numberOfElements, data?.body.number));
    }
    setLoader(false);
  };
};

export const getLogs = (id: string, setLoader: Function) => {
  return async (dispatch: Function, getState: Function) => {
    setLoader(true);
    const data: OKObjectResponse<HistoryValue> = await getRequest(API.IMPORT.GET_LOGS(id), getToken());
    if (data.httpStatus === OK || data.status === 200) {
      const dataBody: any = {
        id: id,
        value: data?.body,
      };
      dispatch(replaceGetLogs(dataBody));
    }
    setLoader(false);
  };
};

export const getImportProcessStatus = (key: string) => {
  return async (dispatch: Function, getState: Function) => {
    const store: RootState = getState();
    const data: OKObjectResponse<LogHistory> = await getRequest(API.IMPORT.GET_STATUS(key), getToken());
    const dataLogs: OKListResponse<Log> = await getRequest(API.IMPORT.GET_STATUS_LOGS(key), getToken());
    if (data.status === 200 || data.httpStatus === OK) {
      dispatch(replaceCurrentImportDetails({
        ...data?.body,
        value: JSON.stringify(dataLogs?.body)
      }));
      if (data?.body.percentage === 100) {
        const logs: OKObjectResponse<LogHistory> = await getRequest(API.IMPORT.GET_STATUS(key), getToken());
        dispatch(replaceAccountInformation({
          ...store.account.account,
          importId: ''
        }));
        if (logs.status === 200) {
          dispatch(confirmUpload(key));
        }
      }
    }
  };
};

export const confirmUpload = (key: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await getRequest(API.IMPORT.CONFIRM_UPLOAD(key), getToken());
    if (data?.httpStatus === OK || data.status === 200) {
      dispatch(loadHistoryLogs(() => {
      }, 3));
    }
  };
};

