import React, { useCallback } from 'react';
import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import { ImportDataState, Log, LOG_HISTORY_DEFAULT, LogHistory } from '../../store/types/importData';
import {
  getImportProcessStatus,
  getLogs,
  importApparelCsv,
  importDataCsv,
  loadHistoryLogs,
  replaceCurrentImportDetails,
  replaceLogDetails
} from '../../store/actions/importData';
import { PROGRESS_STATUS } from '../../constants/constants';
import { useListFetch, useObjectFetch } from '../customHooks/fetchs';
import { API } from '../../settings/server.config';

const selectImportState: ParametricSelector<RootState, undefined, ImportDataState> =
  createSelector<RootState, ImportDataState, ImportDataState>
  (
    state => state.importView,
    (importData) => {
      return importData;
    }
  );

export const useImportDataState = () => {
  return useSelector((state: RootState) => selectImportState(state, undefined));
};

export const useImportDataDispatch = () => {
  const dispatch = useDispatch();
  return {
    importDataCsv: async (
      csvData: FormData,
      setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
      setCurrentProgress: React.Dispatch<React.SetStateAction<PROGRESS_STATUS>>,
      importType: string,
      forced: boolean,
      teamId: string,
      manufacturerId: string,
    ) =>
      await dispatch(importDataCsv(csvData, setFiles, setCurrentProgress, importType, forced, teamId, manufacturerId)),
    importApparelCsv: async (
      csvData: FormData,
      setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
      setCurrentProgress: React.Dispatch<React.SetStateAction<PROGRESS_STATUS>>,
      teamId: string,
    ) =>
      await dispatch(importApparelCsv(csvData, setFiles, setCurrentProgress, teamId)),
    loadHistoryLog: useCallback((setLoader: Function, forward: number) => dispatch(loadHistoryLogs(setLoader, forward)), [dispatch]),
    replaceLogDetails: useCallback((logDetails: LogHistory) => dispatch(replaceLogDetails(logDetails)), [dispatch]),
    getImportProcessStatus: useCallback((key: string) => dispatch(getImportProcessStatus(key)), [dispatch]),
    getLogs: useCallback((id: string, setLoader: Function) => dispatch(getLogs(id, setLoader)), [dispatch]),
    replaceLogCurrentDetails: useCallback((logDetails: LogHistory) => dispatch(replaceCurrentImportDetails(logDetails)), [dispatch])
  };
};

export const useImportDataList = () => {
  const {loadList: getLogsFetch, values: logs} = useListFetch<Log>({
    url: API.IMPORT.BASE()
  });
  
  const {loadList: getLatestRecordsLogs, values: logsStatus} = useListFetch<Log>({
    url: API.IMPORT.BASE()
  });
  
  const getLogs = useCallback((id: string) => {
    getLogsFetch(API.IMPORT.GET_LOGS(id));
  }, [getLogsFetch]);
  
  const getLatestRecords = useCallback((key: string) => {
    getLatestRecordsLogs(`/getlatestrecords?key=${key}`);
  }, [getLatestRecordsLogs]);
  
  return {
    logs: {
      logs,
      getLogs
    },
    logsStatus: {
      logs: logsStatus,
      getLatestRecords
    }
  };
};

export const useImportData = () => {
  const {values: logDetails, loadObject: loadImportResult} = useObjectFetch<LogHistory>({
    url: API.IMPORT.BASE(),
    defaultValue: LOG_HISTORY_DEFAULT,
  });
  
  const loadImportResultById = useCallback((id: string) => {
    loadImportResult(`/getdetails?key=${id}`);
  }, [loadImportResult]);
  
  return {
    importResultById: {
      logDetails,
      loadImportResultById
    }
  };
};