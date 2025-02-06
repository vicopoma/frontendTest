import { useDispatch, useSelector } from 'react-redux';
import { loadHistoryList } from '../../store/actions/history';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { HistoryState } from '../../store/types/history';
import { useCallback } from 'react';

const selectHistoryStates: ParametricSelector<RootState, undefined, {
  history: Array<HistoryState>
  page: number,
  totalPages: number
}> =
  createSelector<RootState, Array<HistoryState>, number, number,
    {
      history: Array<HistoryState>,
      page: number,
      totalPages: number
    }>
  (
    state => state.histories.history,
    state => state.histories.pages,
    state => state.histories.totalPages,
    (history, page, totalPages) => ({
      history, page, totalPages
    })
  );

export const useHistoryState = () => {
  return useSelector((state: RootState) => selectHistoryStates(state, undefined));
};


export const useHistoryDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadHistoryById: useCallback((setLoader: Function, forward: number, id?: string) => dispatch(loadHistoryList(setLoader, forward, id)), [dispatch])
  };
};
