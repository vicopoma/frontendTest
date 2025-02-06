export interface UserTeamRelation {
  id: string,
  userId: string,
  teamId: string,
  teamName: string,
}

export interface RoleAndTeam {
  id: string,
  roleId: string,
  teamId: string
}

export interface AuthRequest {
  roleName: string,
  teamName: string,
  statusRoles: string
}

export interface UserState {
  active: boolean,
  archived: boolean,
  email: string,
  id: string,
  login: string,
  name: string,
  password: string,
  roleId: string,
  roleName: string,
  isNew: boolean,
  teamsList: {
    relatedTeam: Array<UserTeamRelation>,
    unRelatedTeam: Array<UserTeamRelation>
  }
  teams: number,
  su: boolean,
  source: string,
  teamId: string,
  manufacturerId: string,
}

export interface UsersState {
  autoCompleteUsers: Array<UserState>,
  number: number
  numberOfElements: number,
  pages: number,
  user: UserState,
  users: Array<UserState>,
  totalPages: number,
  totalElements: number,
}

export const DEFAULT_USER: UserState = {
  active: true,
  archived: false,
  email: '',
  id: '',
  login: '',
  name: '',
  password: '',
  roleId: '',
  isNew: true,
  teamsList: {
    relatedTeam: [],
    unRelatedTeam: []
  },
  su: false,
  source: '',
  teams: 0,
  roleName: '',
  teamId: '',
  manufacturerId: '',
};

export const DEFAULT_USERS: UsersState = {
  number: 0,
  numberOfElements: 0,
  pages: 0,
  totalPages: 0,
  totalElements: 0,
  users: [{...DEFAULT_USER}],
  user: DEFAULT_USER,
  autoCompleteUsers: []
};

export enum USER_ACTIONS {
  ADD_USER_TO_LIST = 'ADD_USER_TO_LIST',
  REPLACE_USERS = 'REPLACE_USERS',
  REPLACE_USERS_NUMBER_OF_ELEMENTS = 'REPLACE_USERS_NUMBER_OF_ELEMENTS',
  REPLACE_USER = 'REPLACE_USER',
  REPLACE_AUTOCOMPLETE_USERS = 'REPLACE_AUTOCOMPLETE_USERS',
  REPLACE_USERS_PAGES = 'REPLACE_USERS_PAGES',
  REPLACE_USER_RELATED_TEAMS = 'REPLACE_USER_RELATED_TEAMS'
}

interface ReplaceUserActions {
  type: USER_ACTIONS.REPLACE_USERS,
  users: {
    userList: Array<UserState>,
    forward: number,
  },
}

interface ReplaceUsersNumberOfElemnts {
  type: USER_ACTIONS.REPLACE_USERS_NUMBER_OF_ELEMENTS,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number
  }
}

interface AddUserToList {
  type: USER_ACTIONS.ADD_USER_TO_LIST,
  user: UserState
}

interface ReplaceUser {
  type: USER_ACTIONS.REPLACE_USER,
  user: UserState
}

interface ReplacePages {
  type: USER_ACTIONS.REPLACE_USERS_PAGES,
  pages: number
}

interface ReplaceAutocompleteUsers {
  type: USER_ACTIONS.REPLACE_AUTOCOMPLETE_USERS,
  autoCompleteUsers: Array<UserState>
}

interface ReplaceUserRelatedTeams {
  type: USER_ACTIONS.REPLACE_USER_RELATED_TEAMS,
  teamsList: {
    relatedTeam: Array<UserTeamRelation>,
    unRelatedTeam: Array<UserTeamRelation>
  }
}

export type userTypeActions =
  ReplaceUserActions
  | ReplaceUsersNumberOfElemnts
  | AddUserToList
  | ReplaceUser
  | ReplaceAutocompleteUsers
  | ReplacePages
  | ReplaceUserRelatedTeams;


