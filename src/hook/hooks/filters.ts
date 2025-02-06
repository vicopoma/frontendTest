import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { FilterState } from '../../store/types';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters, updateStorageFilter } from '../../store/actions/filter';
import { useCallback } from 'react';


const selectFilterStates: ParametricSelector<RootState, string, FilterState> =
  createSelector<RootState, string, FilterState, FilterState>(
    (state, key) => state.filters[key],
    (filter) => {
      return (filter || {});
    }
  );

export const useFilterStates = (key: string) => {
  return useSelector((state: RootState) => selectFilterStates(state, key));
};

export const useFilterDispatch = () => {
  const dispatch = useDispatch();
  return {
    updateFilters: useCallback((component: string, filters: FilterState) => dispatch(updateFilters(component, filters)), [dispatch]),
    updateStorageFilters: useCallback((filters: { [component: string]: FilterState }) => dispatch(updateStorageFilter(filters)), [dispatch])
  };
};

