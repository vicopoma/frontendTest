import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { getPartTypeByModelId, replaceObjectPartTypeByEquipmentModel, } from '../../store/actions/partType';
import { PartTypeRelatedEquipmentModel, PartTypesState } from '../../store/types/partType';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';

const selectPartTypeState: ParametricSelector<RootState, undefined, PartTypesState> =
  createSelector<RootState, PartTypesState, PartTypesState>
  (
    state => state.partType,
    (partTypes) => {
      return partTypes;
    }
  );

export const usePartTypeState = () => {
  return useSelector((state: RootState) => selectPartTypeState(state, undefined));
};

export const usePartTypeDispatch = () => {
  const dispatch = useDispatch();
  return {
    getPartTypeByEquipmentModel: useCallback((id: string) => dispatch(getPartTypeByModelId(id)), [dispatch]),
    replaceObjectPartTypeByEquipmentModel: (partTypes: { [key: string]: PartTypeRelatedEquipmentModel }) => dispatch(replaceObjectPartTypeByEquipmentModel(partTypes)),
  };
};

