import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import {
  deleteCustomField,
  deleteEquipmentModel,
  getCustomFieldList,
  getEquipmentModelByEquipmentType,
  getEquipmentModelById,
  getEquipmentModelList,
  postCustomField,
  postEquipmentModel,
  putCustomField,
  putEquipmentModel,
  replaceCustomField,
  replaceEquipmentModel
} from '../../store/actions/equipmentModel';
import { RootState } from '../../store/reducers';
import { CustomField, EquipmentModel, EquipmentModelState } from '../../store/types';


const selectEquipmentModelState: ParametricSelector<RootState, undefined, {
  equipmentModelList: EquipmentModel[],
  equipmentModel: EquipmentModel,
  allState: EquipmentModelState,
  totalPages: number,
  customField: CustomField,
  customFieldList: CustomField[]
}> =
  createSelector<RootState, EquipmentModel[], EquipmentModel, EquipmentModelState, number, CustomField, CustomField[],
    {
      equipmentModelList: EquipmentModel[],
      equipmentModel: EquipmentModel,
      allState: EquipmentModelState,
      totalPages: number,
      customField: CustomField,
      customFieldList: CustomField[]
    }>
  (
    state => state.equipmentModel.equipmentModelList,
    state => state.equipmentModel.equipmentModel,
    state => state.equipmentModel,
    state => state.equipmentModel.totalPages,
    state => state.equipmentModel.customField,
    state => state.equipmentModel.customFieldList,
    (equipmentModelList, equipmentModel, allState, totalPages, customField, customFieldList) => ({
      equipmentModelList,
      equipmentModel,
      allState,
      totalPages,
      customField,
      customFieldList
    })
  );

export const useEquipmentModelState = () => {
  return useSelector((state: RootState) => selectEquipmentModelState(state, undefined));
};

export const useEquipmentModelDispatch = () => {
  const dispatch = useDispatch();
  return {
    getEquipmentModelList: useCallback((setLoader: Function, forward: number) => dispatch(getEquipmentModelList(setLoader, forward)), [dispatch]),
    getEquipmentModelById: useCallback(async (id: string) => dispatch(getEquipmentModelById(id)), [dispatch]),
    postEquipmentModel: (equipmentModel: EquipmentModel, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(postEquipmentModel(equipmentModel, setResponse)),
    putEquipmentModel: (equipmentModel: EquipmentModel, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(putEquipmentModel(equipmentModel, setResponse)),
    deleteEquipmentModel: (
      id: string,
      setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
      closeDrawer: Function
    ) => dispatch(deleteEquipmentModel(id, setResponse, closeDrawer)),
    replaceEquipmentModel: (equipmentModel: EquipmentModel) => dispatch(replaceEquipmentModel(equipmentModel)),
    replaceCustomField: (customField: CustomField) => dispatch(replaceCustomField(customField)),
    getCustomFieldList: useCallback((id: string) => dispatch(getCustomFieldList(id)), [dispatch]),
    postCustomField: (customField: CustomField, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(postCustomField(customField, setResponse)),
    putCustomField: (customField: CustomField, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(putCustomField(customField, setResponse)),
    deleteCustomField: (id: string, equipmentModelId: string) => dispatch(deleteCustomField(id, equipmentModelId)),
    getEquipmentModelByEquipmentType: useCallback(async (equipmentTypeById: string) => await dispatch(getEquipmentModelByEquipmentType(equipmentTypeById)), [dispatch]),
  };
};

