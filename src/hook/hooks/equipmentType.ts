import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import {
  deleteEquipmentType,
  getEquipmentTypeById,
  getEquipmentTypeList,
  postEquipmentType,
  putEquipmentType,
  replaceEquipmentType
} from '../../store/actions/equipmentType';
import { RootState } from '../../store/reducers';
import { EquipmentType, ParamsEquipmentType } from '../../store/types';


const selectEquipmentTypeState: ParametricSelector<RootState, undefined, {
  equipmentTypeList: EquipmentType[],
  equipmentType: EquipmentType,
  totalElements: number,
  params: ParamsEquipmentType
}> =
  createSelector<RootState, EquipmentType[], EquipmentType, number, ParamsEquipmentType,
    {
      equipmentTypeList: EquipmentType[],
      equipmentType: EquipmentType,
      totalElements: number,
      params: ParamsEquipmentType
    }>
  (
    state => state.equipmentType.equipmentTypeList,
    state => state.equipmentType.equipmentType,
    state => state.equipmentType.totalElements,
    state => state.equipmentType.params,
    (equipmentTypeList, equipmentType, totalElements, params) => ({
      equipmentTypeList,
      equipmentType,
      totalElements,
      params
    })
  );

export const useEquipmentTypeState = () => {
  return useSelector((state: RootState) => selectEquipmentTypeState(state, undefined));
};

export const useEquipmentTypeDispatch = () => {
  const dispatch = useDispatch();
  return {
    getEquipmentTypeList: useCallback(async () => await dispatch(getEquipmentTypeList()), [dispatch]),
    getEquipmentTypeById: useCallback((id: string) => dispatch(getEquipmentTypeById(id)), [dispatch]),
    postEquipmentType: (equipmentType: EquipmentType, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, callback?: (res: EquipmentType) => void) => dispatch(postEquipmentType(equipmentType, setResponse, callback)),
    putEquipmentType: (equipmentType: EquipmentType, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(putEquipmentType(equipmentType, setResponse)),
    deleteEquipmentType: (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, callback: Function) => dispatch(deleteEquipmentType(id, setResponse, callback)),
    replaceEquipmentType: (equipmentType: EquipmentType) => dispatch(replaceEquipmentType(equipmentType))
  };
};
