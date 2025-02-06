import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import { BodyFilterState } from '../../store/types/bodyFilter';
import { updateBodyFilters, updateStorageBodyFilter } from '../../store/actions/bodyFilter';
import { useCallback } from 'react';


const selectBodyFilterState: ParametricSelector<RootState, string, BodyFilterState> =
  createSelector<RootState, string, BodyFilterState, BodyFilterState>(
    (state, key) => state.bodyFilter[key],
    (filter) => {
      return (filter || {});
    }
  );

export const useBodyFilterState = (key: string) => {
  return useSelector((state: RootState) => {
    return selectBodyFilterState(state, key);
  });
};

export const useBodyFilterDispatch = () => {
  const dispatch = useDispatch();
  return {
    updateBodyFilter: useCallback((component: string, content: BodyFilterState) => dispatch(updateBodyFilters(component, content)), [dispatch]),
    updateStorageBodyFilter: useCallback((bodyFilters: BodyFilterState) => dispatch(updateStorageBodyFilter(bodyFilters)), [dispatch])
  };
};