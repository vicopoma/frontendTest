import { useDispatch, useSelector } from 'react-redux';
import { showLoader } from '../../store/actions/loader';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { useCallback } from 'react';

const selectLoaderStates: ParametricSelector<RootState, undefined, {
  showLoader: number
}> =
  createSelector<RootState, number,
    {
      showLoader: number,
    }>
  (
    state => state.loader.showLoader,
    (showLoader) => ({
      showLoader
    })
  );

export const useLoaderState = () => {
  return useSelector((state: RootState) => selectLoaderStates(state, undefined));
};

export const useLoaderDispatch = () => {
  const dispatch = useDispatch();
  return {
    showLoader: useCallback((show: boolean) => dispatch(showLoader(show)), [dispatch])
  };
};
