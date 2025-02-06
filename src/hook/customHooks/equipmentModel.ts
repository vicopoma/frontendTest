import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_EQUIPMENT_MODEL_DETAIL,
  EQUIPMENT_MODEL_DEFAULT,
  EquipmentModel,
  EquipmentModelDetail
} from '../../store/types';
import { API } from '../../settings/server.config';
import { useFetch } from './useFetch';
import { OK } from '../../constants/constants';
import { OKListResponse } from '../../settings/Backend/Responses';
import { ResponseObjectType, useObjectCrudFetch, useObjectFetch } from './fetchs';

const url = API.EQUIPMENT_MODEL.BASE();

export const useEquipmentModelCrud = (equipmentModelId: string) => {
  const {createObject, updateObject, deleteObject, value} = useObjectCrudFetch<EquipmentModel>({
    url,
    defaultValue: EQUIPMENT_MODEL_DEFAULT,
    id: equipmentModelId
  });
  
  return {
    equipmentModel: value,
    post: createObject,
    put: updateObject,
    deleteEquipmentModel: deleteObject,
  };
};

export const useEquipmentModelFunctions = () => {
  const {
    loadObject: getEquipmentModelDetailByIdAndTypeId,
    values: equipmentModelDetailByIdAndTypeId
  } = useObjectFetch<EquipmentModelDetail>({url: API.CUSTOM_FIELD.BASE(), defaultValue: DEFAULT_EQUIPMENT_MODEL_DETAIL});
  return {
    equipmentModelDetailByIdAndTypeId: {
      equipmentModelDetailByIdAndTypeId,
      getEquipmentModelDetailByIdAndTypeId: (equipmentTypeId: string, equipmentModelId: string, onSucceed: ResponseObjectType<EquipmentModelDetail>, onError?: ResponseObjectType<EquipmentModelDetail>) => {
        getEquipmentModelDetailByIdAndTypeId(API.CUSTOM_FIELD.BY_EQUIPMENT_MODEL_AND_ID(equipmentModelId, equipmentTypeId), onSucceed, onError);
      }
    }
  };
};

export const useEquipmentModelList = () => {
  const [equipmentModelList, setEquipmentModelList] = useState<Array<EquipmentModel>>([]);
  const {get, response} = useFetch<EquipmentModel>({_url: url});
  
  const getEquipmentModelByEquipmentTypeIdManufacturerType = useCallback((equipmentId: string, manufacturerId: string) => {
    get('', true, `/list-by-manufacturer-and-equipment-type?equipmentTypeId=${equipmentId}&manufacturerId=${manufacturerId}`);
  }, [get]);
  
  useEffect(() => {
    if (response?.httpStatus === OK) {
      const data: OKListResponse<EquipmentModel> = response as OKListResponse<any>;
      setEquipmentModelList(data?.body);
    } else {
      setEquipmentModelList([]);
    }
  }, [response]);
  
  return {
    equipmentModelList,
    getEquipmentModelByEquipmentTypeIdManufacturerType
  };
};

export const useCustomModel = () => {
  const {updateObject: createCustomModel, values} = useObjectFetch<EquipmentModel>({
    url,
    defaultValue: EQUIPMENT_MODEL_DEFAULT,
  });
  
  return {
    equipmentModel: values,
    createCustomModel: useCallback((body: EquipmentModel, onSucceed?: any) => {
      createCustomModel(body, API.EQUIPMENT_MODEL.GET_EQUIPMENT_REQUEST(), onSucceed);
    }, [createCustomModel]),
  };
};