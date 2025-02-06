import { EquipmentSpecificPart } from "./equipment";

export interface PartTypeState {
  id: string,
  namePartType: string,
  description: string,
  equipmentModelId: string,
  equipmentTypeId: string,
  manufacturerId: string,
  nameManufacturer: string,
  nameEquipmentModel: string,
  nameEquipmentType: string,
  archived: boolean
}

export interface PartFromEquipment {
  id: string,
  namePart: string,
  statusDescription: string
}

export interface PartTypeRelatedEquipmentModel {
  equipmentModelId: string,
  equipmentRelatedId: string,
  id: string,
  namePartType: string,
  partIdSelected: string,
  parts: Array<PartFromEquipment>
}

export const DEFAULT_PART_TYPE_RELATED_EQUIPMENT_MODEL: PartTypeRelatedEquipmentModel = {
  id: '',
  partIdSelected: '',
  namePartType: '',
  equipmentModelId: '',
  equipmentRelatedId: '',
  parts: []
};

export interface PartTypeAndPartsByEquipmentModel {
  guiImage: string,
  guiNameList: Array<string>,
  partTypeWithPartDTOList: Array<PartTypeRelatedEquipmentModel>,
  specificPartsList: Array<EquipmentSpecificPart>
}

export interface PartTypesState {
  partTypes: Array<PartTypeState>,
  partType: PartTypeState,
  equipmentModelPartType: { [key: string]: PartTypeRelatedEquipmentModel }
  totalPages: number,
  number: number,
  numberOfElements: number,
  totalElements: number
}

export const DEFAULT_PART_TYPE: PartTypeState = {
  id: '',
  archived: false,
  description: '',
  namePartType: '',
  equipmentModelId: '',
  equipmentTypeId: '',
  nameEquipmentModel: '',
  nameEquipmentType: '',
  manufacturerId: '',
  nameManufacturer: '',
};

export const DEFAULT_PART_TYPES: PartTypesState = {
  partType: DEFAULT_PART_TYPE,
  partTypes: [],
  equipmentModelPartType: {},
  totalPages: 0,
  number: 0,
  numberOfElements: 0,
  totalElements: 0
};

export const DEFAULT_PART_TYPES_AND_PARTS_BY_EQUIPMENTMODEL: PartTypeAndPartsByEquipmentModel = {
  guiImage: '',
  guiNameList: [],
  partTypeWithPartDTOList: [],
  specificPartsList: [],
};

export enum PART_TYPE_ACTIONS {
  REPLACE_PART_TYPE = 'REPLACE_PART_TYPE',
  REPLACE_PART_TYPES = 'REPLACE_PART_TYPES',
  REPLACE_PART_TYPES_TOTAL_PAGES = 'REPLACE_PART_TYPES_TOTAL_PAGES',
  REPLACE_PART_TYPE_BY_EQUIPMENT_MODEL = 'REPLACE_PART_TYPE_BY_EQUIPMENT_MODEL',
  REPLACE_OBJECT_PART_TYPE_BY_EQUIPMENT_MODEL = 'REPLACE_OBJECT_PART_TYPE_BY_EQUIPMENT_MODEL'
}

interface ReplacePartType {
  type: PART_TYPE_ACTIONS.REPLACE_PART_TYPE,
  partType: PartTypeState
}

interface ReplacePartTypes {
  type: PART_TYPE_ACTIONS.REPLACE_PART_TYPES,
  status: {
    partTypes: Array<PartTypeState>,
    forward: number
  }
}

interface ReplacePartTypesTotalPages {
  type: PART_TYPE_ACTIONS.REPLACE_PART_TYPES_TOTAL_PAGES,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number
  }
}

interface ReplacePartTypeByEquipmentModel {
  type: PART_TYPE_ACTIONS.REPLACE_PART_TYPE_BY_EQUIPMENT_MODEL,
  equipmentModelPartType: Array<PartTypeRelatedEquipmentModel>
}

interface ReplaceObjectPartTypeByEquipmentModel {
  type: PART_TYPE_ACTIONS.REPLACE_OBJECT_PART_TYPE_BY_EQUIPMENT_MODEL,
  equipmentModelPartTypes: { [key: string]: PartTypeRelatedEquipmentModel }
}

export type partTypesActionTypes = ReplacePartType | ReplacePartTypes |
  ReplacePartTypesTotalPages | ReplacePartTypeByEquipmentModel | ReplaceObjectPartTypeByEquipmentModel;
