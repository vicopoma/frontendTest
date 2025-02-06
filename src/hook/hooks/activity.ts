import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import { ActivitiesState, ActivityForm, ActivityState } from '../../store/types';
import {
  loadActivities,
  loadActivitiesAsCalendar,
  loadActivityById,
  saveActivity,
  updateActivity,
  updateActivityCalendar,
  updateActivityStatus
} from '../../store/actions/activity';
import { useCallback } from 'react';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';


const selectActivitiesState: ParametricSelector<RootState, undefined, ActivitiesState> =
  createSelector<RootState, ActivitiesState, ActivitiesState>
  (
    state => state.activity,
    (activities) => {
      return activities;
    }
  );

export const useActivitiesState = () => {
  return useSelector((state: RootState) => selectActivitiesState(state, undefined));
};

export const useActivitiesDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadActivities: useCallback((setLoader: Function, forward: number) => dispatch(loadActivities(setLoader, forward)), [dispatch]),
    saveActivity: (activity: ActivityForm, filterName: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean, onSucceed?: () => void, onError?: () => void) => dispatch(saveActivity(activity, filterName, setResponse, isCalendar, onSucceed, onError)),
    updateActivity: (activity: ActivityState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean) => dispatch(updateActivity(activity, setResponse, isCalendar)),
    updateActivityCalendar: (activity: ActivityForm, filterName: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isCalendar: boolean, onSucceed?: () => void, onError?: () => void) => dispatch(updateActivityCalendar(activity, filterName, setResponse, isCalendar, onSucceed, onError)),
    loadActivity: useCallback(async (id: string) => await dispatch(loadActivityById(id)), [dispatch]),
    updateActivityStatus: (id: string, action: string) => dispatch(updateActivityStatus(id, action)),
    loadActivitiesAsCalendar: useCallback(async (filterName: string, bodyFilter: object) => await dispatch(loadActivitiesAsCalendar(filterName, bodyFilter)), [dispatch]),
  };
};
