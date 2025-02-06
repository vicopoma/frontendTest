import {
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError,
  warningAndErrorMessages
} from '../../settings/httpClients';
import { ACTIVITY_ACTIONS, ActivityForm, ActivityState, DEFAULT_ACTIVITY, FilterState } from '../types';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { API } from '../../settings/server.config';
import { ACTIVITY_BODY_FILTER, ACTIVITY_CALENDAR, ACTIVITY_FILTER, CREATED, OK, } from '../../constants/constants';
import { paramBuilder } from '../../helpers/Utils';
import { showLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { BodyFilterState } from '../types/bodyFilter';
import { RootState } from '../reducers';
import React from 'react';
import { replaceActivityScan } from './scan';

export const replaceActivities = (activities: Array<ActivityState>, forward: number) => {
  return {
    type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES,
    activities: {
      activities,
      forward
    }
  };
};

export const replaceActivitiesAsCalendar = (activities: Array<ActivityState>) => {
  return {
    type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_AS_CALENDAR,
    activities
  };
};

export const replacePages = (totalElements: number, totalPages: number, numberOfElements: number, number: number) => {
  return {
    type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replaceActivity = (activity: ActivityState) => {
  return {
    type: ACTIVITY_ACTIONS.REPLACE_ACTIVITY,
    activity: {...activity, scheduleStatus: ''}
  };
};

export const replaceActivityStatus = (id: string, action: string) => {
  return {
    type: ACTIVITY_ACTIONS.REPLACE_ACTIVITY_ACTION_STATUS,
    status: {
      id,
      action
    }
  };
};

export const loadActivities = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    setLoader(true);
    const params: FilterState = getState().filters[ACTIVITY_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    let bodyParams: BodyFilterState = (getState() as RootState).bodyFilter[ACTIVITY_BODY_FILTER];
    if (bodyParams === undefined || Object.keys(bodyParams).length === 0) bodyParams = {keyword: ''};
    if (bodyParams?.typeTeam?.length > 0) {
      const data: OkPagedListResponse<ActivityState> = await postRequest(API.SCHEDULE.SCHEDULE_SEARCH() + query, bodyParams, getToken());
      if (data.httpStatus === OK) {
        dispatch(replaceActivities(data?.body.content, forward));
        dispatch(replacePages(data?.body?.totalElements, data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.number));
      } else {
        dispatch(replaceActivities([], 3));
        warningAndErrorMessages(data);
      }
    } else {
      dispatch(replaceActivities([], 3));
    }
    setLoader(false);
  };
};

export const loadActivitiesAsCalendar = (filterName?: string, bodyFilter?: object) => {
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[ACTIVITY_CALENDAR];
    
    let query = '';
    if (params) query = paramBuilder(params);
    if(query.length === 0) {
      dispatch(replaceActivitiesAsCalendar([]));
      return;
    }
    let bodyParams: BodyFilterState = (getState() as RootState).bodyFilter[filterName ?? ACTIVITY_BODY_FILTER];

    if (bodyParams === undefined || Object.keys(bodyParams).length === 0) {
      if(bodyFilter) bodyParams = bodyFilter; 
      else {
        bodyParams = {keyword: ''};
      } 
    }
    
    if (bodyParams?.typeTeam?.length > 0) {
      const data: OKListResponse<ActivityState> = await postRequest(API.SCHEDULE.SCHEDULE_BY_CALENDAR() + query, bodyParams, getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceActivitiesAsCalendar(data?.body));
      }
    } else {
      dispatch(replaceActivitiesAsCalendar([]));
    }
  };
};

export const saveActivity = (activity: ActivityForm, filterName: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean, onSucceed?: () => void, onError?: () => void) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<ActivityForm> = await postRequest(API.SCHEDULE.SCHEDULE({}), activity, getToken());
    if (data?.httpStatus === CREATED) {
      if (!isCalendar) {
        dispatch(loadActivities(showLoader, 3));
      } else {
        dispatch(loadActivitiesAsCalendar(filterName));
      }
      onSucceed?.();
    } else {
      setResponse({
        title: 'Warning',
        type: 'warning',
        description: data.message
      });
      onError?.();
    }
    dispatch(showLoader(false));
  };
};

export const updateActivity = (activity: ActivityState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<ActivityState> = await putRequest(API.SCHEDULE.SCHEDULE({ isNote: true }), activity, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceActivity(data?.body));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Updated Successfully'
      });
      if (isCalendar) {
        dispatch(loadActivities(showLoader, 3));
      } else {
        dispatch(loadActivitiesAsCalendar());
      }
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const updateActivityCalendar = (activity: ActivityForm, filterName: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean, onSucceed?: () => void, onError?: () => void) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<ActivityForm> = await putRequest(API.SCHEDULE.SCHEDULE({}), activity, getToken());
    if (data?.httpStatus === CREATED || data?.httpStatus === OK) {
      if (!isCalendar) {
        dispatch(loadActivities(showLoader, 3));
      } else {
        dispatch(loadActivitiesAsCalendar(filterName));
      }
      onSucceed?.();
    } else {
      setResponse({
        title: 'Warning',
        type: 'warning',
        description: data.message
      });
      onError?.();
    }
    dispatch(showLoader(false));
  };
};

export const loadActivityById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      const data: OKObjectResponse<ActivityState> = await getRequest(API.SCHEDULE.SCHEDULE({id}), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceActivityScan(data?.body));
        dispatch(replaceActivity(data?.body));
      } else {
        dispatch(replaceActivity(DEFAULT_ACTIVITY));
      }
    } else {
      dispatch(replaceActivity(DEFAULT_ACTIVITY));
    }
    
  };
};

export const updateActivityStatus = (id: string, action: string) => {
  return (dispatch: Function) => {
    dispatch(replaceActivityStatus(id, action));
  };
};
