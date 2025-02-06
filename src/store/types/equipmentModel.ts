export interface CustomField {
  id: string,
  nameField: string,
  typeField: string,
  defaultValue: string,
  required: boolean,
  equipmentModelId: string
}

export const CUSTOM_FIELD_DEFAULT: CustomField = {
  id: '',
  nameField: '',
  typeField: '',
  defaultValue: '',
  required: false,
  equipmentModelId: ''
};

export interface EquipmentModel {
  id: string,
  nameModel: string,
  description: string,
  equipmentTypeId: string,
  equipmentTypeName: string,
  manufacturerId: string,
  manufacturerName: string,
  cEMInputNameModel: string,
  modelYear: string,
  statusDescription: string
}

export const EQUIPMENT_MODEL_DEFAULT: EquipmentModel = {
  id: '',
  nameModel: '',
  description: '',
  equipmentTypeId: '',
  equipmentTypeName: '',
  manufacturerId: '',
  manufacturerName: '',
  cEMInputNameModel: '',
  modelYear: '',
  statusDescription: 'ACTIVE'
};

export interface EquipmentModelState {
  equipmentModelList: EquipmentModel[],
  equipmentModel: EquipmentModel,
  customField: CustomField,
  totalPages: number,
  totalElements: number,
  numberOfElements: number,
  number: number,
  customFieldList: CustomField[]
}

export const EQUIPMENT_MODEL_STATE_DEFAULT: EquipmentModelState = {
  equipmentModelList: [],
  equipmentModel: EQUIPMENT_MODEL_DEFAULT,
  customField: CUSTOM_FIELD_DEFAULT,
  totalPages: 0,
  totalElements: 0,
  numberOfElements: 0,
  number: 0,
  customFieldList: []
};

export enum EQUIPMENT_MODEL_ACTIONS {
  REPLACE_EQUIPMENT_MODEL = 'REPLACE_EQUIPMENT_MODEL',
  REPLACE_EQUIPMENT_MODEL_LIST = 'REPLACE_EQUIPMENT_MODEL_LIST',
  REPLACE_TOTAL_ELEMENTS = 'REPLACE_TOTAL_ELEMENTS',
  REPLACE_CUSTOM_FIELD = 'REPLACE_CUSTOM_FIELD',
  REPLACE_CUSTOM_FIELD_LIST = 'REPLACE_CUSTOM_FIELD_LIST',
  REPLACE_EQUIPMENT_MODEL_BY_PAGE = 'REPLACE_EQUIPMENT_MODEL_BY_PAGE'
}

interface ReplaceEquipmentModel {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL,
  equipmentModel: EquipmentModel
}

interface ReplaceEquipmentModelList {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST
  equipmentModelList: EquipmentModel[]
}

interface ReplaceTotalPages {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_TOTAL_ELEMENTS,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number,
  }
  
}

interface ReplaceCustomField {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD,
  customField: CustomField
}

interface ReplaceCustomFieldList {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD_LIST,
  customFieldList: CustomField[]
}

interface ReplaceEquipmentModelByPage {
  type: EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_BY_PAGE
  status: {
    equipmentModelList: Array<EquipmentModel>,
    forward: number
  }
}

export type EquipmentModelActionsTypes = ReplaceEquipmentModel | ReplaceEquipmentModelList | ReplaceTotalPages
  | ReplaceCustomField | ReplaceCustomFieldList | ReplaceEquipmentModelByPage;
