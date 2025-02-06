import { EquipmentTypesType } from '../../constants/constants';

export interface EquipmentType {
  id: string,
  nameEquipmentType: EquipmentTypesType,
  description: string,
  createdBy: string,
  createDate: string,
  modifiedBy: string,
  modifiedDate: string,
  extraInformation: Array<string>,
  nflId: string
}

export const EQUIPMENT_TYPE_DEFAULT: EquipmentType = {
  id: '',
  nameEquipmentType: undefined,
  description: '',
  createdBy: '',
  createDate: '',
  modifiedBy: '',
  modifiedDate: '',
  extraInformation: [],
  nflId: ''
};

export interface ParamsEquipmentType {
  page: number,
  size: number,
  column: string,
  sortType: string
}

export const PARAMS_EQUIPMENT_TYPE_DEFAULT: ParamsEquipmentType = {
  page: 0,
  size: 20,
  column: 'nameEquipmentType',
  sortType: 'asc'
};

export interface EquipmentTypeState {
  equipmentTypeList: EquipmentType[],
  equipmentType: EquipmentType,
  totalElements: 0,
  params: ParamsEquipmentType
}

export const EQUIPMENT_TYPE_STATE_DEFAULT: EquipmentTypeState = {
  equipmentTypeList: [],
  equipmentType: EQUIPMENT_TYPE_DEFAULT,
  totalElements: 0,
  params: PARAMS_EQUIPMENT_TYPE_DEFAULT
};

export enum EQUIPMENT_TYPE_ACTIONS {
  REPLACE_EQUIPMENT_TYPE_LIST = 'REPLACE_EQUIPMENT_TYPE_LIST',
  REPLACE_EQUIPMENT_TYPE = 'REPLACE_EQUIPMENT_TYPE',
  REPLACE_PARAMS = 'REPLACE_PARAMS',
  REPLACE_TOTAL_ELEMENTS = 'REPLACE_TOTAL_ELEMENTS'
}

type ReplaceEquipmentTypeList = {
  type: EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE_LIST,
  equipmentTypeList: EquipmentType[]
}
type ReplaceEquipmentType = {
  type: EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE,
  equipmentType: EquipmentType
}
type ReplaceParams = {
  type: EQUIPMENT_TYPE_ACTIONS.REPLACE_PARAMS,
  params: ParamsEquipmentType
}
type ReplaceTotalElements = {
  type: EQUIPMENT_TYPE_ACTIONS.REPLACE_TOTAL_ELEMENTS,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number
  }
}

export type EquipmentTypeActionsTypes = ReplaceEquipmentTypeList | ReplaceEquipmentType |
  ReplaceParams | ReplaceTotalElements
