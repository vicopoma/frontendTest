import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  deletePart,
  getEquipmentModelByEquipmentTypeManufacturerType,
  getManufacturerByEquipmentType,
  getPartTypeByModelId,
  loadPartById,
  loadParts,
  replaceEquipmentModelList,
  replaceManufacturerList,
  replacePartTypeList,
  savePart
} from '../../store/actions/part';
import { DEFAULT_PART, PartsState, PartState } from '../../store/types/part';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { EquipmentModel, Manufacturer } from '../../store/types';
import { PartTypeRelatedEquipmentModel } from '../../store/types/partType';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { API } from '../../settings/server.config';
import { useObjectCrudFetch } from '../customHooks/fetchs';

const selectPartState: ParametricSelector<RootState, undefined, PartsState> =
  createSelector<RootState, PartsState, PartsState>
  (
    state => state.part,
    (parts) => {
      return parts;
    }
  );

export const usePartState = () => {
  return useSelector((state: RootState) => selectPartState(state, undefined));
};

export const usePartDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadParts: useCallback((loader: Function, forward: number) => dispatch(loadParts(loader, forward)), [dispatch]),
    loadPartById: (id: string) => dispatch(loadPartById(id)),
    savePart: (part: PartState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(savePart(part, setResponse)),
    deletePart: (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => dispatch(deletePart(id, setResponse, closeDrawer)),
    replaceManufacturerList: (manufacturerList: Manufacturer[]) => dispatch(replaceManufacturerList(manufacturerList)),
    replaceEquipmentModelList: (equipmentModelList: EquipmentModel[]) => dispatch(replaceEquipmentModelList(equipmentModelList)),
    replacePartTypeList: (partTypeList: PartTypeRelatedEquipmentModel[]) => dispatch(replacePartTypeList(partTypeList)),
    getManufacturerByEquipmentType: useCallback((equipmentTypeId: string) => dispatch(getManufacturerByEquipmentType(equipmentTypeId)), [dispatch]),
    getEquipmentModelByEquipmentTypeManufacturerType: useCallback((equipmentTypeId: string, manufacturerId: string) => dispatch(getEquipmentModelByEquipmentTypeManufacturerType(equipmentTypeId, manufacturerId)), [dispatch]),
    getPartTypeByModelId: useCallback((id: string) => dispatch(getPartTypeByModelId(id)), [dispatch]),
  };
};

export const usePart = (partId: string) => {
  const url = API.PART.PART();
  const {value, updateObject, createObject, deleteObject} = useObjectCrudFetch<PartState>({
    url: url,
    id: partId,
    defaultValue: DEFAULT_PART
  });
  
  return {
    part: value,
    post: createObject,
    put: updateObject,
    deletePart: deleteObject,
  };
  
};
