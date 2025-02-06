import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import {
  deleteManufacturer,
  getManufacturerByEquipmentType,
  getManufacturerById,
  getManufacturerList,
  postManufacturer,
  putManufacturer,
  replaceManufacturer,
  replaceManufacturerList
} from '../../store/actions/manufacturer';
import { RootState } from '../../store/reducers';
import {
  Manufacturer,
  MANUFACTURER_DEFAULT,
  ManufacturerState,
  ManufacturerWithModels,
  ParamsManufacturer
} from '../../store/types';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { API } from '../../settings/server.config';
import { ResponseObjectType, useListFetch, useObjectCrudFetch } from '../customHooks/fetchs';
import { PartTypeState } from '../../store/types/partType';


const selectManufacturerState: ParametricSelector<RootState, undefined, {
  manufacturerList: Manufacturer[],
  manufacturer: Manufacturer,
  allState: ManufacturerState,
  totalElements: number,
  params: ParamsManufacturer
}> =
  createSelector<RootState, Manufacturer[], Manufacturer, ManufacturerState, number, ParamsManufacturer,
    {
      manufacturerList: Manufacturer[],
      manufacturer: Manufacturer,
      allState: ManufacturerState,
      totalElements: number,
      params: ParamsManufacturer,
    }>
  (
    state => state.manufacturer.manufacturerList,
    state => state.manufacturer.manufacturer,
    state => state.manufacturer,
    state => state.manufacturer.totalElements,
    state => state.manufacturer.params,
    (manufacturerList, manufacturer, allState, totalElements, params) => ({
      manufacturerList,
      manufacturer,
      allState,
      totalElements,
      params,
    })
  );

export const useManufacturerState = () => {
  return useSelector((state: RootState) => selectManufacturerState(state, undefined));
};

export const useManufacturerDispatch = () => {
  const dispatch = useDispatch();
  return {
    getManufacturerList: useCallback(() => dispatch(getManufacturerList()), [dispatch]),
    getManufacturerById: useCallback((id: string) => dispatch(getManufacturerById(id)), [dispatch]),
    postManufacturer: async (manufacturer: Manufacturer, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(postManufacturer(manufacturer, setResponse)),
    putManufacturer: async (manufacturer: Manufacturer, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(putManufacturer(manufacturer, setResponse)),
    deleteManufacturer: (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => dispatch(deleteManufacturer(id, setResponse, closeDrawer)),
    replaceManufacturer: (manufacturer: Manufacturer) => dispatch(replaceManufacturer(manufacturer)),
    getManufacturerByEquipmentType: useCallback(async (equipmentTypeId: string) => await dispatch(getManufacturerByEquipmentType(equipmentTypeId)), [dispatch]),
    replaceManufacturerList: useCallback((manufacturerList: Manufacturer[]) => dispatch(replaceManufacturerList(manufacturerList)), [dispatch]),
  };
};


const url = API.MANUFACTURER.BASE();
export const useManufacturerList = () => {
  const {loadList: loadManufactureByType, values: manufacturerByType} = useListFetch<PartTypeState>({url});
  const {loadList: getManufacturerList, values: manufacturers} = useListFetch<PartTypeState>({url});
  const {
    loadList: loadManufacturersWithModels,
    values: manufacturersWithModels
  } = useListFetch<ManufacturerWithModels>({url});
  
  const getManufacturerByEquipmentType = useCallback((id: string) => {
    loadManufactureByType(API.MANUFACTURER.GET_BY_EQUIPMENT_TYPE(id));
  }, [loadManufactureByType]);
  
  const getManufacturerWithModels = useCallback((equipmentTypeId: string, callback?: ResponseObjectType<Array<ManufacturerWithModels>>) => {
    loadManufacturersWithModels(API.MANUFACTURER.GET_MANUFACTURER_WITH_MODELS(equipmentTypeId), (res, httpResponse) => {
      callback?.(res, httpResponse);
    });
  }, [loadManufacturersWithModels]);
  
  return {
    manufacturersArray: {
      manufacturerList: manufacturers,
      getManufacturerList
    },
    manufacturersByEquipmentType: {
      manufacturerList: manufacturerByType,
      getManufacturerByEquipmentType
    },
    manufacturersWithModels: {
      manufacturersWithModels,
      getManufacturerWithModels
    }
  };
};

export const useManufacturer = (manufacturerId: string) => {
  const url = API.MANUFACTURER.BASE();
  const {value, updateObject, createObject, deleteObject} = useObjectCrudFetch<Manufacturer>({
    url: url,
    id: manufacturerId,
    defaultValue: MANUFACTURER_DEFAULT
  });
  
  return {
    manufacturer: value,
    createManufacturer: createObject,
    updateManufacturer: updateObject,
    deleteManufacturer: deleteObject,
  };
};
