export interface ScanExtraInfo {
  type: string,
  typeName: string,
  value: string
}

export interface ScanState {
  id: string,
  tag: string,
  siteId: string,
  siteName: string,
  zoneName: string,
  x: number,
  y: number,
  eventDate: string,
  equipmentId: string,
  playerName: string,
  scanInfoExtraList: Array<ScanExtraInfo>,
  initialSeason: string,
  lastCertification: string,
  note: string,
  manufacturerIdNfl: string,
  modelIdNfl: string,
  gameId: string,
  equipmentCode: string,
  playerIdNfl: string,
}

export interface ActivityScan {
  id: string,
  homeTeamId: string,
  homeTeamName: string,
  visitTeamId: string,
  visitTeamName: string,
  startGameDate: string,
}

export const DEFAULT_ACTIVITY_SCANS: ActivityScan = {
  homeTeamId: '',
  homeTeamName: '',
  id: '',
  startGameDate: '',
  visitTeamId: '',
  visitTeamName: ''
};

export const DEFAULT_SCAN_ELEMENTS: ScanState = {
  equipmentId: '',
  eventDate: '',
  id: '',
  siteId: '',
  siteName: '',
  tag: '',
  x: 0,
  y: 0,
  zoneName: '',
  playerName: '',
  initialSeason: '',
  lastCertification: '',
  note: '',
  scanInfoExtraList: [],
  manufacturerIdNfl: '',
  modelIdNfl: '',
  gameId: '',
  equipmentCode: '',
  playerIdNfl: '',
};

export interface ScannerDeviceState {
  devType: string,
  id: string,
  largeName: string,
  shortName: string
}

export interface ScansState {
  scans: Array<ScanState>,
  activityScan: ActivityScan,
  config: {
    scanDevices: Array<ScannerDeviceState>
  }
}

export const DEFAULT_SCANS: ScansState = {
  scans: [],
  activityScan: DEFAULT_ACTIVITY_SCANS,
  config: {
    scanDevices: []
  }
};

export enum SCANS_ACTIONS {
  GET_SCANS = 'GET_SCANS',
  REPLACE_ACTIVITY_SCANS = 'REPLACE_ACTIVITY_SCANS',
  REPLACE_CONFIG_SCANNER_DEVICES = 'REPLACE_CONFIG_SCANNER_DEVICES',
  REPLACE_ACTIVITY_SCANS_TOTAL_PAGES = 'REPLACE_ACTIVITY_SCANS_TOTAL_PAGES',
}

interface GetScans {
  type: SCANS_ACTIONS.GET_SCANS,
  scans: Array<ScanState>
}

interface ReplaceConfigScannerDevices {
  type: SCANS_ACTIONS.REPLACE_CONFIG_SCANNER_DEVICES,
  scannerDevices: Array<ScannerDeviceState>
}

interface ReplaceActivityScans {
  type: SCANS_ACTIONS.REPLACE_ACTIVITY_SCANS,
  activity: ActivityScan
}

export type ScanActionsTypes = GetScans | ReplaceConfigScannerDevices | ReplaceActivityScans;
