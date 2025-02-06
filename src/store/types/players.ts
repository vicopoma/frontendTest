import { EquipmentInformation } from './equipment';

export enum ScanType {
  FX9600 = 'FX9600',
  MANUAL = 'MANUAL',
  MC33 = 'MC33'
}
export type ScanTypes =  ScanType.FX9600 | ScanType.MC33 | ScanType.MANUAL;

export interface EquipmentAssign {
  amount: number,
  nameEquipmentType: string,
  frequencyCount: {
    count: number,
    device: ScanTypes;
  }[]
}

export interface PlayerState {
  index?: number,
  birthDate: string,
  collegeConference: string,
  collegeName: string,
  currentTeamId: string,
  currentTeam: string, 
  displayName: string,
  draftClub: string,
  draftNumber: string,
  entryYear: number,
  esbId: string,
  firstName: string,
  footballName: string,
  gsisId: string,
  gsisItId: string,
  headshot: string,
  height: string,
  id: string
  jerseyNumber: string,
  lastName: string,
  playerId: string,
  position: string,
  positionGroup: string,
  rookieYear: number,
  shortName: string,
  smartId: string,
  status: string,
  statusDescriptionAbbr: string,
  statusShortDescription: string,
  teamAbbr: string,
  weight: number,
  fullNameTeam: string,
  equipmentVMList: Array<EquipmentInformation>,
  imported: boolean,
  equipmentAssigned: Array<EquipmentAssign>,
}

export interface EquipmentVM {
  id: string,
  longitude: number,
  latitude: number,
  lastCertification: string,
  tag: string,
  equipmentCode: string,
  nameModel: string,
  nameManufacturer: string,
  displayName: string,
  nameEquipmentType: string
}

export interface PlayersState {
  players: Array<PlayerState>,
  player: PlayerState,
  pageable: {
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    }
  },
  equipmentAssigned: EquipmentInformation[],
  equipmentList: EquipmentInformation[],
  equipmentSelected: EquipmentInformation[],
  numberOfElements: number
  totalElements: number,
  totalPages: number,
  number: number,
}

export const DEFAULT_PLAYER: PlayerState = {
  birthDate: '',
  collegeConference: '',
  collegeName: '',
  currentTeamId: '',
  currentTeam: '',
  displayName: '',
  draftClub: '',
  draftNumber: '',
  entryYear: 0,
  esbId: '',
  firstName: '',
  footballName: '',
  gsisId: '',
  gsisItId: '',
  headshot: '',
  height: '',
  id: '',
  jerseyNumber: '',
  lastName: '',
  playerId: '',
  position: '',
  positionGroup: '',
  rookieYear: 0,
  shortName: '',
  smartId: '',
  status: '',
  statusDescriptionAbbr: '',
  statusShortDescription: '',
  teamAbbr: '',
  weight: 0,
  fullNameTeam: '',
  equipmentVMList: [],
  imported: false,
  equipmentAssigned: [],
};

export const DEFAULT_PLAYERS: PlayersState = {
  player: DEFAULT_PLAYER,
  equipmentAssigned: [],
  equipmentList: [],
  equipmentSelected: [],
  players: [],
  number: 0,
  totalElements: 0,
  totalPages: 0,
  pageable: {
    offset: 0,
    paged: false,
    pageNumber: 0,
    pageSize: 20,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false
    }
  },
  numberOfElements: 0,
};

interface ApparelComponentDTO {
  apparelComponentName: string, 
  apparelId: string, 
  apparelName: string,
  archived: boolean,
  createBy: string, 
  createDate: string,
  id: string,
  modifiedBy: string,
  modifiedDate: string,
}

export interface ApparelElement {
  apparelComponentDTOList: Array<ApparelComponentDTO>,
  apparelComponentDescription: string,
  apparelComponentRelatedId: string,
  apparelComponentSelect: string,
  apparelName: string,
  archived: string, 
  createBy: string, 
  createDate: string, 
  id: string, 
  modifiedBy: string,
  modifiedDate: string, 
  typeField: string,
}

export interface Apparel {
  apparelDTOList: Array<ApparelElement>,
  cleatSize: string,
  helmetSize: string,
  playerId: string,
  shoulderPadSize: string,
}

export const DEFAULT_APPAREL: Apparel = {
  apparelDTOList: [],
  cleatSize: '',
  helmetSize: '',
  playerId: '',
  shoulderPadSize: '',
}

export enum PLAYERS_ACTIONS {
  REPLACE_PLAYERS = 'REPLACE_PLAYERS',
  REPLACE_PLAYER = 'REPLACE_PLAYER',
  REPLACE_NUMBER_OF_ELEMENTS = 'REPLACE_NUMBER_OF_ELEMENTS',
  REPLACE_TOTAL_ELEMENTS = 'REPLACE_TOTAL_ELEMENTS',
  REPLACE_TOTAL_PAGES = 'REPLACE_TOTAL_PAGES',
  REPLACE_PAGEABLE = 'REPLACE_PAGEABLE',
  REPLACE_EQUIPMENTS_PLAYER = 'REPLACE_EQUIPMENTS_PLAYER',
  REPLACE_EQUIPMENT_ASSIGNED_PLAYER = 'REPLACE_EQUIPMENT_ASSIGNED_PLAYER',
  REPLACE_EQUIPMENT_SELECTED_PLAYER = 'REPLACE_EQUIPMENT_SELECTED_PLAYER',
  ADD_EQUIPMENT_TO_EQUIPMENT_LIST = 'ADD_EQUIPMENT_TO_EQUIPMENT_LIST',
  DELETE_EQUIPMENT_TO_EQUIPMENT_LIST = 'DELETE_EQUIPMENT_TO_EQUIPMENT_LIST',
}

interface ReplaceEquipmentsPlayer {
  type: PLAYERS_ACTIONS.REPLACE_EQUIPMENTS_PLAYER,
  equipmentList: EquipmentInformation[]
}

interface AddEquipmentsPlayer {
  type: PLAYERS_ACTIONS.ADD_EQUIPMENT_TO_EQUIPMENT_LIST,
  equipment: EquipmentInformation
}

interface DeleteEquipmentsPlayer {
  type: PLAYERS_ACTIONS.DELETE_EQUIPMENT_TO_EQUIPMENT_LIST,
  equipment: EquipmentInformation
}

interface ReplaceEquipmentAssignedPlayer {
  type: PLAYERS_ACTIONS.REPLACE_EQUIPMENT_ASSIGNED_PLAYER,
  equipmentAssigned: EquipmentInformation[]
}

interface ReplaceEquipmentSelectedPlayer {
  type: PLAYERS_ACTIONS.REPLACE_EQUIPMENT_SELECTED_PLAYER,
  equipmentSelected: EquipmentInformation[]
}

interface ReplacePlayers {
  type: PLAYERS_ACTIONS.REPLACE_PLAYERS
  players: {
    players: Array<PlayerState>,
    forward: number
  }
}

interface ReplacePlayer {
  type: PLAYERS_ACTIONS.REPLACE_PLAYER,
  player: PlayerState
}

interface ReplacePlayersNumberOfElements {
  type: PLAYERS_ACTIONS.REPLACE_NUMBER_OF_ELEMENTS,
  number: number
}

interface ReplacePlayersTotalElements {
  type: PLAYERS_ACTIONS.REPLACE_TOTAL_ELEMENTS,
  total: number
}

interface ReplacePlayersTotalPages {
  type: PLAYERS_ACTIONS.REPLACE_TOTAL_PAGES
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number
  }
}

interface ReplacePageable {
  type: PLAYERS_ACTIONS.REPLACE_PAGEABLE,
  pageable: {
    offset: number,
    paged: false,
    pageNumber: number,
    pageSize: number,
    sort: {
      empty: false,
      sorted: false,
      unsorted: false
    }
  }
}

export type playerActionTypes = ReplacePlayer
  | ReplacePlayers
  | ReplacePlayersNumberOfElements
  | ReplacePlayersTotalElements
  | ReplacePlayersTotalPages
  | ReplacePageable
  | ReplaceEquipmentAssignedPlayer
  | ReplaceEquipmentsPlayer
  | ReplaceEquipmentSelectedPlayer
  | AddEquipmentsPlayer
  | DeleteEquipmentsPlayer;

