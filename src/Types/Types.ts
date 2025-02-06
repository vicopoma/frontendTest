import { ACTIVITY_TYPE } from "../constants/constants"

export interface FilterQuery {
  query: string,
  display: JSX.Element,
  width?: string
}

export interface TableFetchFunction {
  fetchFunction: (setLoader: Function, forward: number) => void
}

export enum playerColumns {
  displayName = 'display_name',
  displayLastName = 'last_name',
  displayFootballName = 'football_name',
  jerseyNumber = 'jersey',
  playerId = 'player_id',
  teamAbbr = 'current_team_id',
  startDate = 'start_date'
}

export interface ReleaseNotes {
  version: string,
  description: string,
  features: Array<string>
}

export interface ProgressBar {
  activityEndDate: string,
  activityStartdate: string,
  activitydate: string,
  endProgressBar: string,
  extra: {
    activityEndDate?: string,
    activityStartdate?: string,
    fileName: string,
    fileNameDownload: string,
    process: string,
    teamAbbr: string,
    title?: string,  
  },
  fileName: string,
  fileNameDownload: string,
  linesProcessed: number,
  messageError: string,
  messageObservation: string,
  percentage: number,
  percentageError: string,
  status: string,
  teamAbbr: string,
  title: string,
  totalLines: number, 
}

export interface TagStatus {
  status: string,
  message: string
}

export type DownloadType = {
  date: string,
  keys: string[],
  operator: string,
  type: string,
  typeTeam: string,
  teams: string[],
}

export type OnChangeType = (dataPerLevel: Array<Set<string>>, dataPerNode: { [key: string]: Set<string> }) => void;

export const DEFAULT_DOWNLOAD: DownloadType = {
  date: '',
  keys: [],
  operator: '',
  type: '',
  typeTeam: '',
  teams: [],
};

export type DownloadSeasonWeekType = {
  keys: string[],
  operator: string,
  season: {
    season: string,
    weekList: Array<string>
  },
  type: string,
  typeTeam: string,
  teams: string[],
}

export const DEFAULT_DOWNLOAD_SEASON_WEEK: DownloadSeasonWeekType = {
  keys: [],
  operator: '',
  season: {
    season: '',
    weekList: []
  },
  type: '',
  typeTeam: '',
  teams: [],
};

export type DownloadBodyType = {
  date: string, 
  activityType: ACTIVITY_TYPE,
  typeTeam: string,
  teams: string[], 
  keys: string[], 
  operator: string,
}

export type DownloadBodySeasonWeekType = {
  season: { season: string, weekList: Array<string>},
  activityType: ACTIVITY_TYPE,
  typeTeam: string,
  teams: string[], 
  keys: string[], 
  operator: string,
}
