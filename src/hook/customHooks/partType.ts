import { ResponseObjectType, useListFetch, useObjectCrudFetch, useObjectFetch } from './fetchs';
import { API } from '../../settings/server.config';
import {
  DEFAULT_PART_TYPE,
  DEFAULT_PART_TYPES_AND_PARTS_BY_EQUIPMENTMODEL,
  PartTypeAndPartsByEquipmentModel,
  PartTypeRelatedEquipmentModel
} from '../../store/types/partType';
import { useCallback } from 'react';

const url = API.PART_TYPE.BASE();

export const usePartTypeCrud = (partTypeId: string) => {
  
  const {value, createObject, deleteObject, updateObject} = useObjectCrudFetch({
    url,
    id: partTypeId,
    defaultValue: DEFAULT_PART_TYPE
  });
  
  return {
    partType: value,
    deletePartType: deleteObject,
    savePartType: createObject,
    updatePartType: updateObject
  };
};

export const usePartTypeFunctions = () => {
  const {
    updateObject: udpatePartTypeAndPartByEquipment,
    loadObject: getPartTypeAndPartByEquipment,
    values: partAndPartTypesByEquipment
  } = useObjectFetch<PartTypeAndPartsByEquipmentModel>({
    url,
    defaultValue: DEFAULT_PART_TYPES_AND_PARTS_BY_EQUIPMENTMODEL
  });
  return {
    partTypeAndPartsByEquipment: {
      partAndPartTypesByEquipment,
      getPartTypeAndPartByEquipment: useCallback((equipmentTypeId, equipmentModelId, equipmentId: string, onSucceed?: ResponseObjectType<PartTypeAndPartsByEquipmentModel>, onError?: ResponseObjectType<PartTypeAndPartsByEquipmentModel>) => {
        getPartTypeAndPartByEquipment(API.PART_TYPE.PART_TYPES_AND_PARTS_BY_EQUIPMENT(equipmentTypeId, equipmentModelId, equipmentId), onSucceed, onError);
      }, [getPartTypeAndPartByEquipment]),
      updatePartTypeAndPartByEquipment: useCallback((body, equipmentTypeId, equipmentModelId, equipmentId: string, onSucceed?: ResponseObjectType<PartTypeAndPartsByEquipmentModel>, onError?: ResponseObjectType<PartTypeAndPartsByEquipmentModel>) => {
        udpatePartTypeAndPartByEquipment(body, API.PART_TYPE.PART_TYPES_AND_PARTS_BY_EQUIPMENT(equipmentTypeId, equipmentModelId, equipmentId), onSucceed, onError);
      }, [udpatePartTypeAndPartByEquipment]),
    }
  };
};

export const usePartTypeList = () => {
  
  const {
    loadList: getPartTypeByEquipmentTypeAndModel,
    values: partTypeList,
    setValues: setPartTypeList
  } = useListFetch<PartTypeRelatedEquipmentModel>({url});
  
  return {
    partTypeByEquipmentTypeAndModel: {
      partTypeList,
      getPartTypeByEquipmentTypeAndEquipmentModel: useCallback((equipmentTypeId: string, equipmentModelId?: string) => {
        if (!!equipmentTypeId) {
          getPartTypeByEquipmentTypeAndModel(`/equipment-type-and-model?equipmentTypeId=${equipmentTypeId}&equipmentModelId=${equipmentModelId ? equipmentModelId : ''}`);
        } else {
          setPartTypeList([]);
        }
      }, [getPartTypeByEquipmentTypeAndModel, setPartTypeList])
    },
  };
};