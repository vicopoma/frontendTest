export interface Antennas {
  autoZone: boolean,
  comment: string,
  description: string,
  disabled: boolean,
  id: string,
  images: Array<string>,
  position: string,
  status: string,
  title: string,
}

export interface Status {
  title: string,
}

export interface FX9600State {
  id: string,
  rfidType: string,
  siteId: string,
  configuration_state: string,
  deviceType: string,
  disabled: boolean,
  ipAddress: string,
  images: Array<any>
  rfidAntennas: Array<Antennas>,
  name: string,
  description: string,
  status: Status,
  location: {
    mapID: string
  }
}

export interface FX9600Sites {
  _id: string,
  name: string,
  location: string,
}

export interface FX9600Maps {
  description: string,
  siteId: string,
  _id: string
}

export interface DevicesState {
  fx9600: {
    fx9600List: Array<FX9600State>,
    fx9600Device: FX9600State,
    sites: { [key: string]: FX9600Sites },
    maps: { [key: string]: FX9600Maps }
    totalPages: number,
  }
}

export const DEFAULT_FX9600: FX9600State = {
  id: '',
  configuration_state: '',
  deviceType: '',
  disabled: false,
  ipAddress: '',
  images: [],
  rfidType: '',
  siteId: '',
  rfidAntennas: [],
  name: '',
  description: '',
  status: {
    title: ''
  },
  location: {
    mapID: ''
  }
};

export const DEFAULT_DEVICES: DevicesState = {
  fx9600: {
    fx9600List: [],
    fx9600Device: DEFAULT_FX9600,
    sites: {},
    maps: {},
    totalPages: 0,
  }
};

export enum DEVICES_ACTION {
  REPLACE_FX9600LIST = 'REPLACE_FX9600LIST',
  REPLACE_FX9600_DEVICE = 'REPLACE_FX9600_DEVICE',
  REPLACE_FX9600_TOTAL_PAGES = 'REPLACE_FX9600_TOTAL_PAGES',
  REPLACE_FX9600_SITES = 'REPLACE_FX9600_SITES',
  REPLACE_FX9600_MAPS = 'REPLACE_FX9600_MAPS'
}

interface ReplaceFx9600List {
  type: DEVICES_ACTION.REPLACE_FX9600LIST,
  list: Array<FX9600State>
}

interface ReplaceFx9600Device {
  type: DEVICES_ACTION.REPLACE_FX9600_DEVICE,
  device: FX9600State
}

interface ReplaceFx9600TotalPages {
  type: DEVICES_ACTION.REPLACE_FX9600_TOTAL_PAGES,
  totalPages: number
}

interface ReplaceFX9600Sites {
  type: DEVICES_ACTION.REPLACE_FX9600_SITES
  sites: Array<FX9600Sites>,
}

interface ReplaceFX9600Maps {
  type: DEVICES_ACTION.REPLACE_FX9600_MAPS,
  maps: Array<FX9600Maps>
}

export type devicesActionType =
  ReplaceFx9600List |
  ReplaceFx9600Device |
  ReplaceFx9600TotalPages |
  ReplaceFX9600Sites |
  ReplaceFX9600Maps;

