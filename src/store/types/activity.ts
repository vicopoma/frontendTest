import { EquipmentAssign } from './players';

export interface TeamsPractice {
  date: string,
  teams: Array<ActivityState>,
  sessionId?: string,
  reProcessed?: boolean,
  isEdit?: boolean,
}

export const DEFAULT_TEAMS_PRACTICE: TeamsPractice = {
  date: '',
  teams: []
};

export interface ActivityState {
  id: string,
  gameKey: string,
  seasonType: string,
  gameNumber: string,
  week: string,
  gameDate: string,
  gameDay: string,
  gameSite: string,
  gameIndoorOutdoor: string,
  startTime: string,
  endTime: string,
  gameTurf: string,
  scheduleStatus: string,
  visitTeamId: string,
  visitTeamName: string,
  homeTeamId: string,
  homeTeamName: string,
  gameDateFull: string,
  startGameDate: string,
  endGameDate: string,
  season: string,
  timeZone: string,
  action: string,
  type: string,
  siteId: string,
  title: string,
  updatedDate: string,
  isReProcessed: boolean,
  lastRegenerateDate: string,
  sessionStatus: string,
  equipmentAssigned: Array<EquipmentAssign>,
  note?: string,
  isEdit?: boolean, 
}

export interface ActivityHistory extends ActivityState {
  playerName: string,
  playerId: string,
  visitorTeamName: string,
  teamNameAssigned: string
}

export interface ActivityForm {
  id?: string,
  homeTeamId: string,
  startGameDate: string,
  endGameDate: string,
  timeZone: string,
  type: string,
  duration: number,
  title: string,
  roleName: string,
}

export const ACTIVITY_FORM: ActivityForm = {
  endGameDate: '',
  homeTeamId: '',
  startGameDate: '',
  type: '',
  timeZone: '',
  duration: 2,
  title: '',
  roleName: '',
};

export interface ActivitiesState {
  activities: Array<ActivityState>,
  activity: ActivityState,
  totalPages: number,
  number: number,
  numberOfElements: number,
  totalElements: number,
  
}

export interface CheckboxObject {
  key: string,
  value: string
}

export const DEFAULT_ACTIVITY: ActivityState = {
  endTime: '',
  gameDate: '',
  gameDateFull: '',
  gameDay: '',
  gameIndoorOutdoor: '',
  gameKey: '',
  gameNumber: '',
  gameSite: '',
  gameTurf: '',
  homeTeamId: '',
  id: '',
  scheduleStatus: '',
  season: '',
  seasonType: '',
  startTime: '',
  visitTeamId: '',
  week: '',
  endGameDate: '',
  homeTeamName: '',
  startGameDate: '',
  visitTeamName: '',
  timeZone: '',
  type: '',
  action: 'RUN',
  siteId: '',
  title: '',
  updatedDate: '',
  isReProcessed: false,
  lastRegenerateDate: '',
  sessionStatus: '',
  equipmentAssigned: [],
  note: '',
  isEdit: false,
};

export const DEFAULT_ACTIVITY_HISTORY: ActivityHistory = {
  ...DEFAULT_ACTIVITY,
  playerId: '',
  playerName: '',
  visitorTeamName: '',
  teamNameAssigned: ''
}
export const DEFAULT_ACTIVITIES: ActivitiesState = {
  activities: [],
  activity: DEFAULT_ACTIVITY,
  totalPages: 0,
  number: 0,
  numberOfElements: 0,
  totalElements: 0,
};

export enum ACTIVITY_ACTIONS {
  REPLACE_ACTIVITIES = 'REPLACE_ACTIVITIES',
  REPLACE_ACTIVITY = 'REPLACE_ACTIVITY',
  REPLACE_ACTIVITIES_PAGES = 'REPLACE_ACTIVITIES_PAGES',
  REPLACE_ACTIVITY_ACTION_STATUS = 'REPLACE_ACTIVITY_ACTION_STATUS',
  REPLACE_ACTIVITIES_AS_CALENDAR = 'REPLACE_ACTIVITIES_AS_CALENDAR',
}

interface GetActivities {
  type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES
  activities: {
    activities: Array<ActivityState>
    forward: number
  }
}

interface ReplaceActivitiesAsCalendar {
  type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_AS_CALENDAR,
  activities: Array<ActivityState>
}

interface ReplaceActivity {
  type: ACTIVITY_ACTIONS.REPLACE_ACTIVITY,
  activity: ActivityState
}

interface ReplacePages {
  type: ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_PAGES
  totalPages: number
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number,
  }
}

interface ReplacerActivityStatus {
  type: ACTIVITY_ACTIONS.REPLACE_ACTIVITY_ACTION_STATUS,
  status: {
    action: string,
    id: string
  }
}


export type ActivityActionTypes = GetActivities
  | ReplacePages
  | ReplaceActivity
  | ReplacerActivityStatus
  | ReplaceActivitiesAsCalendar;
