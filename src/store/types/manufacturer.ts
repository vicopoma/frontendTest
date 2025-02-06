export interface Manufacturer {
  id: string,
  nameManufacturer: string,
  description: string,
  createdBy: string,
  createDate: string,
  modifiedBy: string,
  modifiedDate: string,
}

export const MANUFACTURER_DEFAULT: Manufacturer = {
  id: '',
  nameManufacturer: '',
  description: '',
  createdBy: '',
  createDate: '',
  modifiedBy: '',
  modifiedDate: '',
};

export interface Model {
  id: string,
  nameModel: string
}

export interface ManufacturerWithModel {
  id: string,
  nameManufacturer: string,
  models: Model[]
}

export interface ManufacturerWithModels {
  id: string,
  nameManufacturer: string,
  models: {
    nameModel: string,
    id: string,
  }[]
}

export interface TeamWithPlayers {
  teamId: string,
  fullName: string,
  players: {
    playerId: string,
    playerName: string,
  }[],
}


export interface ParamsManufacturer {
  page: number,
  size: number,
  column: string,
  sortType: string,
  
}

export const PARAMS_MANUFACTURER_DEFAULT: ParamsManufacturer = {
  page: 0,
  size: 20,
  column: 'nameManufacturer',
  sortType: 'asc'
};

export interface ManufacturerState {
  manufacturerList: Manufacturer[],
  manufacturer: Manufacturer,
  params: ParamsManufacturer,
  manufacturerWithModel: ManufacturerWithModel[],
  totalElements: 0,
  numberOfElements: 0,
  totalPages: 0,
  number: 0,
}

export const MANUFACTURER_STATE_DEFAULT: ManufacturerState = {
  manufacturerList: [],
  manufacturer: MANUFACTURER_DEFAULT,
  params: PARAMS_MANUFACTURER_DEFAULT,
  manufacturerWithModel: [],
  totalElements: 0,
  numberOfElements: 0,
  totalPages: 0,
  number: 0,
};

export enum MANUFACTURER_ACTIONS {
  REPLACE_MANUFACTURER_LIST = 'REPLACE_MANUFACTURER_LIST',
  REPLACE_MANUFACTURER = 'REPLACE_MANUFACTURER',
  REPLACE_PARAMS = 'REPLACE_PARAMS',
  REPLACE_TOTAL_ELEMENTS = 'REPLACE_TOTAL_ELEMENTS'
}

type ReplaceManufacurerList = {
  type: MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER_LIST,
  manufacturerList: Manufacturer[]
}
type ReplaceManufacturer = {
  type: MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER,
  manufacturer: Manufacturer
}
type ReplaceTotalElements = {
  type: MANUFACTURER_ACTIONS.REPLACE_TOTAL_ELEMENTS,
  totalElements: number
}
type ReplaceParams = {
  type: MANUFACTURER_ACTIONS.REPLACE_PARAMS,
  params: ParamsManufacturer
}
export type ManufacturerActionsTypes = ReplaceManufacturer |
  ReplaceManufacurerList | ReplaceTotalElements | ReplaceParams;
