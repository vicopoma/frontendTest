// TO DELETE
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import {
  getAllTeamList,
  getEquipmentModelByEquipmentTypeManufacturerType,
  getManufacturerByEquipmentType,
  getPartTypeByEquipmentTypeAndEquipmentModelId,
  getPartTypeByModelId,
  getUserTeamList,
  replaceEquipmentModelList,
  replaceManufacturerList,
  replacePartTypeList
} from '../../store/actions/dropDown';
import { RootState } from '../../store/reducers';
import { EquipmentModel, Manufacturer } from '../../store/types';
import { DropDownState } from '../../store/types/dropDown';
import { PartTypeRelatedEquipmentModel } from '../../store/types/partType';


const selectDropDownState: ParametricSelector<RootState, undefined, DropDownState> =
  createSelector<RootState, DropDownState, DropDownState>
  (
    state => state.dropDown,
    (dropDown) => {
      return dropDown;
    }
  );

export const useDropDownState = () => {
  return useSelector((state: RootState) => selectDropDownState(state, undefined));
};

export const useDropDownDispatch = () => {
  const dispatch = useDispatch();
  return {
    replaceManufacturerList: (manufacturerList: Manufacturer[]) => dispatch(replaceManufacturerList(manufacturerList)),
    replaceEquipmentModelList: (equipmentModelList: EquipmentModel[]) => dispatch(replaceEquipmentModelList(equipmentModelList)),
    replacePartTypeList: (partTypeList: PartTypeRelatedEquipmentModel[]) => dispatch(replacePartTypeList(partTypeList)),
    getManufacturerByEquipmentType: useCallback((equipmentTypeId: string) => dispatch(getManufacturerByEquipmentType(equipmentTypeId)), [dispatch]),
    getPartTypeByEquipmentTypeAndEquipmentModel: useCallback((equipmentTypeId: string, equipmentModelId?: string) => dispatch(getPartTypeByEquipmentTypeAndEquipmentModelId(equipmentTypeId, equipmentModelId)), [dispatch]),
    getEquipmentModelByEquipmentTypeManufacturerType: useCallback((equipmentTypeId: string, manufacturerId: string) => dispatch(getEquipmentModelByEquipmentTypeManufacturerType(equipmentTypeId, manufacturerId)), [dispatch]),
    getPartTypeByModelId: useCallback((id: string) => dispatch(getPartTypeByModelId(id)), [dispatch]),
    getUserTeamList: useCallback(() => dispatch(getUserTeamList()), [dispatch]),
    getTeamList: useCallback(() => dispatch(getAllTeamList()), [dispatch])
  };
};


