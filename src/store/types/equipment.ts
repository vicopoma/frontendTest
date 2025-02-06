import { ManufacturerWithModels, TeamWithPlayers } from './manufacturer';
import { PartTypeRelatedEquipmentModel } from './partType';
import { EquipmentTypesType, KneeBraceSideType } from '../../constants/constants';

export interface EquipmentParam {
  keyword: string,
  equipmentTypeId: string,
  manufacturerIds: string[],
  equipmentModelIds: string[],
  teamId: string,
  teamIds: string[],
  playerIds: string[],
  unAssigned: boolean,
  allPlayer: boolean,
}

export interface EquipmentPlayer {
  equipmentId: string,
  playerId: string,
  checkPlayer: boolean
}

export const DEFAULT_EQUIPMENT_PLAYER: EquipmentPlayer = {
  playerId: '',
  checkPlayer: false,
  equipmentId: ''
};

export interface TagList {
  equipmentTags: EquipmentTag[]
  flag: string
}

export const DEFAULT_EQUIPMENT_PARAM: EquipmentParam = {
  keyword: '',
  equipmentTypeId: '',
  manufacturerIds: [],
  equipmentModelIds: [],
  teamId: '',
  teamIds: [],
  playerIds: [],
  unAssigned: true,
  allPlayer: true,
};

export interface EquipmentState {
  createBy: string,
  createDate: string,
  displayName: string,
  equipmentCode: string,
  id: string,
  jerseyNumber: string,
  lastRecertificationDate: string,
  lastUpdateBy: string,
  lastUpdatedDate: string,
  manufacturer: string,
  manufacturerId: string,
  model: string,
  modelCode: string,
  modelYear: string,
  note: string,
  paddedShirt: string,
  playerId: string,
  playerStatus: string,
  tag: string,
  teamId: string,
  teamName: string,
  components: { [partName: string]: string },
  styleNumberId: string,
}

export const DEFAULT_EQUIPMENT_ELEMENT: EquipmentState = {
  id: '',
  createDate: '',
  equipmentCode: '',
  jerseyNumber: '',
  createBy: '',
  lastRecertificationDate: '',
  lastUpdateBy: '',
  lastUpdatedDate: '',
  model: '',
  manufacturer: '',
  displayName: '',
  tag: '',
  manufacturerId: '',
  modelCode: '',
  modelYear: '',
  note: '',
  paddedShirt: '',
  playerStatus: '',
  playerId: '',
  teamId: '',
  teamName: '',
  components: {},
  styleNumberId: ''
};

export interface EquipmentTag {
  x: number,
  y: number,
  tag: string,
  equipmentId: string
  id: string,
  season: number,
  startDate: string,
  endDate: string,
  createBy: string,
  createDate: string
}

export type TagState = {
  tags: string[],
  inputVisible: boolean,
  inputValue: string,
  editInputIndex: number,
  editInputValue: string,
}

export const DEFAULT_TAG_STATE: TagState = {
  tags: [],
  inputVisible: false,
  inputValue: '',
  editInputIndex: -1,
  editInputValue: '',
};

export const EQUIPMENT_TAG: EquipmentTag = {
  x: 0,
  y: 0,
  tag: '',
  equipmentId: '',
  id: '',
  season: 0,
  startDate: '',
  endDate: '',
  createBy: '',
  createDate: ''
};

export interface NewCode {
  newCode: string
}

export interface TagValidator {
  validation: string
}

export const DEFAULT_TAG_VALIDATOR: TagValidator = {
  validation: ''
};

export enum EQ_INFORMATION_VAR {
  ARCHIVED = 'archived',
  ARCHIVED_DATE = 'archivedDate',
  DESCRIPTION = 'description',
  LAST_CERTIFICATION = 'lastCertification',
  EQUIPMENT_CODE = 'equipmentCode',
  EQUIPMENT_MODEL_ID = 'equipmentModelId',
  EQUIPMENT_TYPE_ID = 'equipmentTypeId',
  PLAYER_ID = 'playerId',
  NAME_MODEL = 'nameModel',
  NOCSAE_TAG = 'nocsaeTag',
  NOTE = 'note',
  MODEL_YEAR = 'modelYear',
  MODEL_CODE = 'modelCode',
  NAME_MANUFACTURER = 'nameManufacturer',
  MANUFACTURER_ID = 'manufacturerId',
  RECERTIFICATION = 'recertification',
  CUSTOM_FIELD = 'customfield',
  NAME_EQUIPMENT_TYPE = 'nameEquipmentType',
  DISPLAY_NAME = 'displayName',
  ID = 'id',
  PART_TYPE_WITH_PART_DTO_LIST = 'partTypeWithPartDTOList',
  TAGS = 'tags',
  TAG = 'tag',
  TEAM_ID = 'teamId',
  TEAM_NAME = 'teamName',
  MODIFIED_DATE = 'modifiedDate',
  CREATE_DATE = 'createDate',
  IMPORTED = 'imported',
  GUI_IMAGE = 'guiImage',
  GUI_NAME_LIST = 'guiNameList',
  STYLE_NUMBER_ID = 'styleNumberId',
  KNEE_BRACE_SIDE = 'kneeBraceSide',
  LAST_SESSION_SCAN = 'lastSessionScan',
  DELETED = 'deleted',
  SUBMODEL = 'subModel',
  SPECIFIC_PARTS_LIST = 'specificPartsList',
  NECK_RESTRAINT_DESC = 'neckRestraintDesc',
  JERSEY_NUMBER = 'jerseyNumber',
  SEASON = 'season',
  ADIDAS_BARCODE = 'adidasBarcode',
  IS_CLEAT_TYPE = 'isCleatType',
  EXTRA_CLEAT = 'extraCleat',
  COPY_LAST_SCAN = 'copyLastScan',
}

export type EquipmentInformation = {
  [EQ_INFORMATION_VAR.ARCHIVED]: boolean,
  [EQ_INFORMATION_VAR.DELETED]: boolean,
  [EQ_INFORMATION_VAR.ARCHIVED_DATE]: string,
  [EQ_INFORMATION_VAR.NOTE]: string,
  [EQ_INFORMATION_VAR.DESCRIPTION]: string,
  [EQ_INFORMATION_VAR.LAST_CERTIFICATION]: string,
  [EQ_INFORMATION_VAR.EQUIPMENT_CODE]: string,
  [EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID]: string,
  [EQ_INFORMATION_VAR.EQUIPMENT_TYPE_ID]: string,
  [EQ_INFORMATION_VAR.PLAYER_ID]: string,
  [EQ_INFORMATION_VAR.NAME_MODEL]: string,
  [EQ_INFORMATION_VAR.MODEL_YEAR]: string,
  [EQ_INFORMATION_VAR.MODEL_CODE]: string,
  [EQ_INFORMATION_VAR.NAME_MANUFACTURER]: string,
  [EQ_INFORMATION_VAR.MANUFACTURER_ID]: string,
  [EQ_INFORMATION_VAR.NAME_EQUIPMENT_TYPE]: EquipmentTypesType,
  [EQ_INFORMATION_VAR.DISPLAY_NAME]: string,
  [EQ_INFORMATION_VAR.ID]: string,
  [EQ_INFORMATION_VAR.TEAM_ID]: string,
  [EQ_INFORMATION_VAR.TEAM_NAME]: string,
  [EQ_INFORMATION_VAR.MODIFIED_DATE]: string,
  [EQ_INFORMATION_VAR.CREATE_DATE]: string,
  [EQ_INFORMATION_VAR.GUI_IMAGE]: string,
  [EQ_INFORMATION_VAR.GUI_NAME_LIST]: Array<string>
  [EQ_INFORMATION_VAR.RECERTIFICATION]: boolean,
  [EQ_INFORMATION_VAR.CUSTOM_FIELD]: Array<EquipmentCustomField>,
  [EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST]: Array<PartTypeRelatedEquipmentModel>,
  [EQ_INFORMATION_VAR.TAGS]: Array<string>,
  [EQ_INFORMATION_VAR.TAG]: string,
  [EQ_INFORMATION_VAR.IMPORTED]: boolean,
  [EQ_INFORMATION_VAR.STYLE_NUMBER_ID]: string,
  [EQ_INFORMATION_VAR.KNEE_BRACE_SIDE]: KneeBraceSideType,
  [EQ_INFORMATION_VAR.LAST_SESSION_SCAN]: string,
  [EQ_INFORMATION_VAR.NOCSAE_TAG]: string,
  [EQ_INFORMATION_VAR.SUBMODEL]: string,
  [EQ_INFORMATION_VAR.SPECIFIC_PARTS_LIST]: Array<EquipmentSpecificPart>,
  [EQ_INFORMATION_VAR.NECK_RESTRAINT_DESC]: string,
  [EQ_INFORMATION_VAR.JERSEY_NUMBER]: number,
  [EQ_INFORMATION_VAR.SEASON]: string,
  [EQ_INFORMATION_VAR.ADIDAS_BARCODE]: string,
  [EQ_INFORMATION_VAR.EXTRA_CLEAT]: boolean,
  [EQ_INFORMATION_VAR.COPY_LAST_SCAN]: string,
}

export const DEFAULT_EQUIPMENT_CODE: NewCode = {
  newCode: ''
};
export const DEFAULT_EQUIPMENT_INFORMATION: EquipmentInformation = {
  archived: false,
  deleted: false,
  archivedDate: '',
  note: '',
  description: '',
  lastCertification: '',
  equipmentCode: '',
  equipmentModelId: '',
  equipmentTypeId: '',
  playerId: '',
  nameModel: '',
  modelYear: '',
  modelCode: '',
  nameManufacturer: '',
  manufacturerId: '',
  recertification: false,
  customfield: [],
  nameEquipmentType: undefined,
  displayName: '',
  id: '',
  partTypeWithPartDTOList: [],
  tags: [],
  tag: '',
  teamId: '',
  teamName: '',
  modifiedDate: '',
  createDate: '',
  imported: false,
  guiImage: '',
  guiNameList: [],
  styleNumberId: '',
  kneeBraceSide: undefined,
  lastSessionScan: '',
  nocsaeTag: '',
  subModel: '',
  specificPartsList: [],
  neckRestraintDesc: '',
  jerseyNumber: 0,
  season: '',
  adidasBarcode: '',
  extraCleat: false,
  copyLastScan: '',
};

export interface AssignedPlayer {
  currentTeamId: string,
  firstName: string,
  jerseyNumber: string,
  lastName: string,
  playerId: string,
  currentTeam: string,
  esbId: string,
  id: string,
  displayName: string
}

export const DEFAULT_ASSIGNED_PLAYER: AssignedPlayer = {
  currentTeamId: '',
  firstName: '',
  jerseyNumber: '',
  lastName: '',
  playerId: '',
  currentTeam: '',
  esbId: '',
  id: '',
  displayName: ''
};

export interface EquipmentModelVM {
  id: string,
  nameModel: string,
  description: string,
  equipmentTypeId: string,
  manufacturerId: string,
  modelYear: string,
  statusDescription: string
}

export interface EquipmentCustomField {
  nameField: string,
  typeField: string,
  value: any,
  customFieldId: string,
  equipmentCustomFieldId: string,
  required: boolean
}

export interface EquipmentSpecificPart {
  guiImage: string,
  guiNameList: Array<string>,
  modelConfig: string,
  partTypeWithPartDTOList: Array<PartTypeRelatedEquipmentModel>,
}

export interface EquipmentModelDetail {
  nameManufacturer: string,
  manufacturerId: string,
  customField: Array<EquipmentCustomField>
}

export const DEFAULT_EQUIPMENT_MODEL_DETAIL: EquipmentModelDetail = {
  nameManufacturer: '',
  manufacturerId: '',
  customField: []
};

export interface Equipments {
  equipments: Array<EquipmentState>,
  equipmentParam: EquipmentParam,
  equipmentInformation: EquipmentInformation,
  equipmentModelVMs: EquipmentModelVM[],
  assignedPlayerList: AssignedPlayer[],
  assignedPlayer: AssignedPlayer
  totalElements: number,
  totalPages: number,
  numberOfElements: number,
  number: number,
  equipmentModelDetail: EquipmentModelDetail,
  equipmentTags: EquipmentTag[],
  equipmentTagList: EquipmentTag[],
  manufacturerWithModels: ManufacturerWithModels[],
  teamWithPlayers: TeamWithPlayers[],
}

export const DEFAULT_EQUIPMENT: Equipments = {
  equipments: [],
  equipmentParam: DEFAULT_EQUIPMENT_PARAM,
  equipmentInformation: DEFAULT_EQUIPMENT_INFORMATION,
  equipmentModelVMs: [],
  assignedPlayerList: [],
  assignedPlayer: DEFAULT_ASSIGNED_PLAYER,
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
  number: 0,
  equipmentModelDetail: DEFAULT_EQUIPMENT_MODEL_DETAIL,
  equipmentTags: [],
  equipmentTagList: [],
  manufacturerWithModels: [],
  teamWithPlayers: [],
};

export enum EQUIPMET_ACTIONS {
  GET_EQUIPMENTS = 'GET_EQUIPMENTS',
  REPLACE_EQUIPMENT_PARAM = 'REPLACE_EQUIPMENT_PARAM',
  REPLACE_EQUIPMENT_INFORMATION = 'REPLACE_EQUIPMENT_INFORMATION',
  REPLACE_EQUIPMENT_VMS = 'REPLACE_EQUIPMENT_VMS',
  REPLACE_ASSIGNED_PLAYER_LIST = 'REPLACE_ASSIGNED_PLAYER_LIST',
  REPLACE_ASSIGNED_PLAYER = 'REPLACE_ASSIGNED_PLAYER',
  REPLACE_TOTAL_ELEMENTS = 'REPLACE_TOTAL_EQUIMENTS_ELEMENTS',
  REPLACE_EQUIPMENT_MODEL_DETAIL = 'REPLACE_EQUIPMENT_MODEL_DETAIL',
  REPLACE_EQUIPMENT_TYPE_PLAYER_CODE = 'REPLACE_EQUIPMENT_TYPE_PLAYER_CODE',
  REPLACE_EQUIPMENT_TAG = 'REPLACE_EQUIPMENT_TAG',
  REPLACE_EQUIPMENT_TAG_LIST = 'REPLACE_EQUIPMENT_TAG_LIST',
  REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS = 'REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS',
  REPLACE_EQUIPMENT_TEAM_WITH_PLAYERS = 'REPLACE_EQUIPMENT_TEAM_WITH_PLAYERS',
}

export enum MULTICHECK_EQUIPMENT_ACTIONS {
  ARCHIVE = 'ARCHIVED',
  DELETE = 'DELETED',
  RECONDITION = 'RECONDITION',
  UNASSIGNED = 'UNASSIGNED',
}

interface ReplaceEquipmentManufacturerWithModels {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS,
  manufacturerWithModels: ManufacturerWithModels[]
}

interface ReplaceTeamWithPlayers {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TEAM_WITH_PLAYERS,
  teamWithPlayers: ManufacturerWithModels[]
}

interface ReplaceEquipmentTag {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG,
  equipmentTags: EquipmentTag[]
}

interface ReplaceEquipmentTagList {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG_LIST,
  equipmentTagList: EquipmentTag[]
}

interface ReplaceEquipmentModelDetail {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MODEL_DETAIL,
  equipmentModelDetail: EquipmentModelDetail
}

interface GetEquipments {
  type: EQUIPMET_ACTIONS.GET_EQUIPMENTS,
  data: {
    equipments: Array<EquipmentState>,
    forward: number
  }
}

interface ReplaceEquipmentParam {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_PARAM,
  equipmentParam: EquipmentParam
}

interface ReplaceEquipmentInformation {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_INFORMATION,
  equipmentInformation: EquipmentInformation
}

interface ReplaceEquipmentVMS {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS,
  equipmentModelVMs: EquipmentModelVM[]
}

interface ReplaceAssignedPlayerList {
  type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER_LIST,
  assignedPlayerList: AssignedPlayer[]
}

interface ReplaceAssignedPlayer {
  type: EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER,
  assignedPlayer: AssignedPlayer
}

interface ReplaceTotalElements {
  type: EQUIPMET_ACTIONS.REPLACE_TOTAL_ELEMENTS,
  elements: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number,
  }
}

interface ReplaceEquipmentTypePlayerCode {
  type: EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TYPE_PLAYER_CODE,
  code: string,
}

export type EquipmentActionsTypes =
  GetEquipments
  | ReplaceEquipmentParam
  | ReplaceEquipmentInformation
  | ReplaceEquipmentVMS
  | ReplaceAssignedPlayerList
  | ReplaceAssignedPlayer
  | ReplaceTotalElements
  | ReplaceEquipmentTagList
  | ReplaceEquipmentTag
  | ReplaceEquipmentModelDetail
  | ReplaceEquipmentTypePlayerCode
  | ReplaceEquipmentManufacturerWithModels
  | ReplaceTeamWithPlayers
