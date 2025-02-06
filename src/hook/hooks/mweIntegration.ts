import { useDispatch, useSelector } from 'react-redux';
import { MweIntegrationData, MweIntegrationState } from '../../store/types/mweIntegration';
import { loadMweData, saveMweData, testMweData } from '../../store/actions/mweIntegration';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { useCallback } from 'react';

const selectMweIntegrationState: ParametricSelector<RootState, undefined, MweIntegrationState> =
  createSelector<RootState, MweIntegrationState, MweIntegrationState>
  (
    state => state.mweIntegration,
    (mweIntegration) => {
      return mweIntegration;
    }
  );

export const useMweIntegrationState = () => {
  return useSelector((state: RootState) => selectMweIntegrationState(state, undefined));
};

export const useMweIntegrationDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadMweIntegrationData: useCallback(() => dispatch(loadMweData()), [dispatch]),
    saveMweIntegrationData: (mweIntegration: MweIntegrationData) => dispatch(saveMweData(mweIntegration)),
    testMweIntegrationData: (mweIntegration: MweIntegrationData) => dispatch(testMweData(mweIntegration))
  };
};