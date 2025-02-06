export interface ZoneState {
  id: string,
  name: string,
  abbr: string,
  description: string,
  siteName: string,
  readActive: string,
}

export interface SiteState {
  id: string,
  name: string,
  siteId: string,
  teamId: string,
  activityType: string,
  lat: number,
  lng: number
}

export interface SiteMapsState {
  sitesMwe: Array<SiteState>,
  sites: Array<SiteState>,
  zones: Array<ZoneState>,
  zonesList: Array<ZoneState>
}

export const DEFAULT_SITE: SiteState = {
  id: '',
  name: '',
  siteId: '',
  teamId: '',
  activityType: '',
  lat: 0,
  lng: 0
};


export const DEFAULT_SITES_MAP: SiteMapsState = {
  sitesMwe: [],
  sites: [],
  zones: [],
  zonesList: []
};

export enum SITE_MAP_ACTIONS {
  REPLACE_MAP = 'REPLACE_MAP',
  REPLACE_SITES_MWE = 'REPLACE_SITES_MWE',
  REPLACE_SITES = 'REPLACE_SITES',
  REPLACE_ZONES = 'REPLACE_ZONES',
  REPLACE_ZONE_LIST = 'REPLACE_ZONE_LIST',
}

interface ReplaceSiteMwe {
  type: SITE_MAP_ACTIONS.REPLACE_SITES_MWE,
  sitesMwe: Array<SiteState>
}

interface ReplaceSites {
  type: SITE_MAP_ACTIONS.REPLACE_SITES,
  sites: Array<SiteState>
}

interface ReplaceZones {
  type: SITE_MAP_ACTIONS.REPLACE_ZONES,
  zones: Array<ZoneState>
}

interface ReplaceZoneList {
  type: SITE_MAP_ACTIONS.REPLACE_ZONE_LIST,
  zoneList: Array<ZoneState>
}

export type siteMapActionTypes = ReplaceSiteMwe | ReplaceSites | ReplaceZones | ReplaceZoneList;
