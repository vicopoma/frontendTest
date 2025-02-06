import { Manufacturer } from './manufacturer';
import { PartTypeRelatedEquipmentModel } from '../types/partType';
import { EquipmentModel } from './equipmentModel';

export interface PartState {
  archive: boolean,
  description: string,
  id: string,
  namePart: string,
  namePartType: string,
  partTypeId: string,
  equipmentTypeId: string,
  nameEquipmentType: string,
  manufacturerId: string,
  nameManufacturer: string,
  equipmentModelId: string,
  nameModel: string,
  statusDescription: string
}

export interface PartsState {
  parts: Array<PartState>,
  part: PartState,
  dropdowns: {
    manufacturerList: Manufacturer[],
    equipmentModelList: EquipmentModel[],
    partTypeList: PartTypeRelatedEquipmentModel[]
  }
  totalPages: number,
  numberOfElements: number,
  totalElements: number,
  number: number
}

export const DEFAULT_PART: PartState = {
  archive: false,
  description: '',
  id: '',
  namePart: '',
  namePartType: '',
  partTypeId: '',
  equipmentTypeId: '',
  nameEquipmentType: '',
  manufacturerId: '',
  nameManufacturer: '',
  equipmentModelId: '',
  nameModel: '',
  statusDescription: 'ACTIVE'
};

export const DEFAULT_PARTS: PartsState = {
  part: DEFAULT_PART,
  parts: [],
  dropdowns: {
    manufacturerList: [],
    equipmentModelList: [],
    partTypeList: []
  },
  totalPages: 0,
  numberOfElements: 0,
  totalElements: 0,
  number: 0.
};

export enum PART_ACTIONS {
  REPLACE_PART = 'REPLACE_PART',
  REPLACE_PARTS = 'REPLACE_PARTS',
  REPLACE_PARTS_TOTAL_PAGES = 'REPLACE_PARTS_TOTAL_PAGES',
  REPLACE_MANUFACTURER = 'REPLACE_MANUFACTURER_LIST',
  REPLACE_EQUIPMENT_MODEL = 'REPLACE_EQUIPMENT_MODEL_LIST',
  REPLACE_PART_TYPES_LIST = 'REPLACE_PART_TYPES_LIST',
}

interface ReplacePart {
  type: PART_ACTIONS.REPLACE_PART,
  part: PartState
}

interface ReplaceParts {
  type: PART_ACTIONS.REPLACE_PARTS,
  data: {
    parts: Array<PartState>,
    forward: number
  }
}

interface ReplaceManufacturer {
  type: PART_ACTIONS.REPLACE_MANUFACTURER,
  manufacturerList: Manufacturer[]
}

interface ReplaceEquipmentModel {
  type: PART_ACTIONS.REPLACE_EQUIPMENT_MODEL,
  equipmentModelList: EquipmentModel[]
}

interface ReplacePartTypes {
  type: PART_ACTIONS.REPLACE_PART_TYPES_LIST,
  partTypeList: PartTypeRelatedEquipmentModel[]
}

interface ReplaceTotalPages {
  type: PART_ACTIONS.REPLACE_PARTS_TOTAL_PAGES,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number
  }
}

export type partActionTypes = ReplacePart | ReplaceParts | ReplaceTotalPages | ReplaceManufacturer |
  ReplaceEquipmentModel | ReplacePartTypes;
