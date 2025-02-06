import { EquipmentType } from './equipmentType';
import { ROLES_STATUS } from '../../constants/constants';
import { RoleState } from './roles';
import { DEFAULT_TEAM, TeamState } from './team';
import { SiteLocationInformation } from './siteLocation';

export interface AccountState {
  token: string,
  notifications: boolean,
  account: AccountInformation,
  loginType: LoginType,
  totalElements: 0,
  numberOfElements: 0,
  totalPages: 0,
  number: 0,
  teamSelected: TeamState,
  mobile: MobileInformation
}

export interface LoginType {
  typeLogin: string,
  version: string,
  mwePath: string,
  season: string,
}

export interface TeamList {
  teamId: string,
  stadiumName: string,
  fullName: string
}

export interface Week {
  id: string,
  title: string,
}

export interface Season {
  id: string,
  title: string,
  weekList: Array<Week>,
  active?: boolean
}

export interface ManufacturerInformation {
  archived: boolean, 
  createBy: string, 
  createDate: string,
  description: string, 
  id: string, 
  modifiedBy: string, 
  modifiedDate: string, 
  nameManufacturer: string,
  nflId: string,
}

export interface AccountInformation {
  active: boolean,
  ds9908r: boolean,
  email: string,
  equipmentTypeDTOList: Array<EquipmentType>,
  id: string,
  importId: string,
  isGoogle: boolean,
  login: string,
  nameManufacturer: string,
  manufacturerId: string,
  manufacturerList: Array<ManufacturerInformation>,
  name: string,
  password: string,
  role: RoleState,
  seasonList: Array<Season>,
  siteList: Array<string>,
  siteLocationList: Array<SiteLocationInformation>,
  source: string,
  statusRoles: string,
  su: boolean,
  teamId: string,
  teamList: Array<TeamState>
}

export const DEFAULT_ACCOUNT: AccountInformation = {
  active: false,
  ds9908r: false,
  email: '',
  equipmentTypeDTOList: [],
  id: '',
  importId: '',
  isGoogle: false,
  login: '',
  nameManufacturer: '',
  manufacturerId: '',
  manufacturerList: [],
  name: '',
  password: '',
  role: {
    id: '',
    description: '',
    name: '',
  },
  seasonList: [],
  siteList: [],
  siteLocationList: [],
  source: '',
  statusRoles: ROLES_STATUS.ACTIVE,
  su: false,
  teamId: '',
  teamList: []
};

export interface MobileInformation {
  displayName: string,
  apkFileName: string,
  versionName: string,
  versionCode: number,
  buildDate: number
}

export const DEFAULT_MOBILE_INFORMATION: MobileInformation = {
  displayName: '',
  apkFileName: '',
  versionName: '',
  versionCode: 0,
  buildDate: 0
};

export const DEFAULT_LOGIN_TYPE: LoginType = {
  typeLogin: 'mwe',
  version: '',
  mwePath: '',
  season: '',
};

export const DEFAULT_ACCOUNTS: AccountState = {
  token: '',
  notifications: false,
  account: DEFAULT_ACCOUNT,
  loginType: DEFAULT_LOGIN_TYPE,
  totalElements: 0,
  numberOfElements: 0,
  totalPages: 0,
  number: 0,
  teamSelected: DEFAULT_TEAM,
  mobile: DEFAULT_MOBILE_INFORMATION
};

export enum ACCOUNT_ACTIONS {
  REPLACE_TOKEN = 'REPLACE_TOKEN',
  REPLACE_ACCOUNT_INFORMATION = 'REPLACE_ACCOUNT_INFORMATION',
  REPLACE_MOBILE_INFORMATION = 'REPLACE_MOBILE_INFORMATION',
  REPLACE_LOGIN_TYPE = 'REPLACE_LOGIN_TYPE',
  RESET_USER_INFORMATION = 'RESET_USER_INFORMATION',
  REPLACE_SELECTED_TEAM = 'REPLACE_SELECTED_TEAM',
  REPLACE_IMPORT_ID = 'REPLACE_IMPORT_ID',
  REPLACE_NOTIFICATIONS = 'REPLACE_NOTIFICATIONS'
}

interface ReplaceToken {
  type: ACCOUNT_ACTIONS.REPLACE_TOKEN,
  token: string
}

interface ReplaceAccountInformation {
  type: ACCOUNT_ACTIONS.REPLACE_ACCOUNT_INFORMATION,
  account: AccountInformation
}

interface ReplaceMobileInformation {
  type: ACCOUNT_ACTIONS.REPLACE_MOBILE_INFORMATION,
  mobile: MobileInformation
}

interface ReplaceLoginType {
  type: ACCOUNT_ACTIONS.REPLACE_LOGIN_TYPE,
  loginType: LoginType
}

interface ResetAccountInformation {
  type: ACCOUNT_ACTIONS.RESET_USER_INFORMATION
}

interface ReplaceSelectedTeam {
  type: ACCOUNT_ACTIONS.REPLACE_SELECTED_TEAM,
  team: TeamState
}

interface ReplaceImportId {
  type: ACCOUNT_ACTIONS.REPLACE_IMPORT_ID,
  importId: string
}

interface ReplaceNotifications {
  type: ACCOUNT_ACTIONS.REPLACE_NOTIFICATIONS,
  notifications: boolean
}

export type UserActionTypes =
  ReplaceToken
  | ReplaceAccountInformation
  | ResetAccountInformation
  | ReplaceLoginType
  | ReplaceSelectedTeam
  | ReplaceImportId
  | ReplaceMobileInformation
  | ReplaceNotifications;

