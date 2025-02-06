import { ActivityScan, SCANS_ACTIONS, ScanState } from '../types/scan';
import { OKListResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { API } from '../../settings/server.config';
import { getToken, postRequest } from '../../settings/httpClients';
import { OK, SCAN_BODY_FILTER, SCAN_DETAIL_FILTER, SCAN_FILTER } from '../../constants/constants';
import { updateLoader } from './loader';
import { ActivityState, FilterState } from '../types';
import { paramBuilder } from '../../helpers/Utils';
import { replaceActivities, replacePages } from './activity';
import { BodyFilterState } from '../types/bodyFilter';
import { RootState } from '../reducers';

export const replaceScansByActivity = (scans: Array<ScanState>) => {
  return {
    type: SCANS_ACTIONS.GET_SCANS,
    scans
  };
};

export const replaceActivityScan = (activity: ActivityScan) => {
  return {
    type: SCANS_ACTIONS.REPLACE_ACTIVITY_SCANS,
    activity
  };
};

export const replaceTotalPages = (totalPages: number, numberOfElements: number, totalElements: number, number: number) => {
  return {
    type: SCANS_ACTIONS.REPLACE_ACTIVITY_SCANS_TOTAL_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number
    }
  };
};
export const getActivityScans = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    dispatch(updateLoader(true));
    setLoader(true);
    const params: FilterState = getState().filters[SCAN_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    
    let bodyParams: BodyFilterState = (getState() as RootState).bodyFilter[SCAN_BODY_FILTER];
    if (bodyParams === undefined || Object.keys(bodyParams).length === 0) bodyParams = {keyword: ''};
    
    const data: OkPagedListResponse<ActivityState> = await postRequest(API.SCHEDULE.SCHEDULE_SEARCH() + query, bodyParams, getToken());
    if (data.httpStatus === OK) {
      dispatch(replaceActivities(data?.body.content, forward));
      dispatch(replacePages(data?.body?.totalElements, data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.number));
    }
    setLoader(false);
    dispatch(updateLoader(false));
  };
};

export const loadScansByActivityId = (setLoader: Function, forward: number, id: string) => {
  return async (dispatch: Function, getState: Function) => {
    
    let bodyParams: BodyFilterState = (getState() as RootState).bodyFilter[SCAN_DETAIL_FILTER];
    if (bodyParams === undefined || Object.keys(bodyParams).length === 0) {
      bodyParams = {keyword: ''};
    }
    const data: OKListResponse<ScanState> = await postRequest(API.SCANNER.SCANS_BY_ACTIVITY(''), {
      ...bodyParams,
      sessionId: id
    }, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceScansByActivity(data?.body));
    }
  };
};
