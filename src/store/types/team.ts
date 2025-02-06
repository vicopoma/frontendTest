export interface TeamState {
  fullName: string,
  players: number,
  teamId: string,
  users: string,
  abbr: string,
  city: string,
  statium: string,
  stadiumName: string,
  season: string,
  timeZone: number
}

export interface RelatedUser {
  teamId: string,
  userId: string,
  userTeamid: string,
  userName: string,
}

export interface TeamsState {
  teams: Array<TeamState>,
  team: TeamState
  teamRelatedUsers: Array<RelatedUser>,
  userTeams: Array<TeamState>,
  initialTeamId: string,
}

export const DEFAULT_TEAM: TeamState = {
  fullName: '',
  players: 0,
  teamId: 'none',
  users: '',
  abbr: '',
  city: '',
  statium: '',
  timeZone: 0,
  stadiumName: '',
  season: '',
};

export const DEFAULT_TEAMS: TeamsState = {
  teams: [],
  team: DEFAULT_TEAM,
  teamRelatedUsers: [],
  userTeams: [],
  initialTeamId: ''
};

export enum TEAM_ACTIONS {
  REPLACE_TEAMS = 'REPLACE_TEAMS',
  REPLACE_TEAM = 'REPLACE_TEAM',
  REPLACE_RELATED_USERS = 'REPLACE_RELATED_USERS',
  REPLACE_USER_TEAMS = 'REPLACE_USER_TEAMS',
  REPLACE_INITIAL_TEAM_ID = 'REPLACE_INITIAL_TEAM_ID',
}

interface ReplaceTeams {
  type: TEAM_ACTIONS.REPLACE_TEAMS,
  teams: Array<TeamState>
}

interface ReplaceTeam {
  type: TEAM_ACTIONS.REPLACE_TEAM,
  team: TeamState
}

interface ReplaceRelatedUsers {
  type: TEAM_ACTIONS.REPLACE_RELATED_USERS,
  users: Array<RelatedUser>
}

interface ReplaceUserTeams {
  type: TEAM_ACTIONS.REPLACE_USER_TEAMS,
  userTeams: Array<TeamState>
}

interface ReplaceInitialTeamId {
  type: TEAM_ACTIONS.REPLACE_INITIAL_TEAM_ID,
  teamId: string
}

export type teamActionTypes =
  ReplaceTeams
  | ReplaceTeam
  | ReplaceRelatedUsers
  | ReplaceUserTeams
  | ReplaceInitialTeamId;
