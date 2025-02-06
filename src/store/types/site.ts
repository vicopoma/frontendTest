export interface SiteState {
  id: string,
  lat: number,
  lng: number,
  name: string,
  siteId: string,
  zoneName: Array<string>,
}

export interface SitesState {
  number: number,
  numberOfElements: number,
  site: SiteState,
  sites: Array<SiteState>,
  totalElements: number,
  totalPages: number,
  zones: Zone[],
  zonesAssigned: Zone[],
}

export const DEFAULT_SITE: SiteState = {
  id: '',
  lat: 0,
  lng: 0,
  name: '',
  siteId: '',
  zoneName: [],
};

export interface Zone {
  id: string,
  zoneId: string,
  name: string,
  siteId: string,
  description: string
}

export const DEFAULT_SITES: SitesState = {
  sites: [],
  zones: [],
  zonesAssigned: [],
  site: DEFAULT_SITE,
  totalPages: 0,
  totalElements: 0,
  numberOfElements: 0,
  number: 0
};

export enum SITE_ACTIONS {
  REPLACE_SITES = 'REPLACE_SITES',
  REPLACE_SITE = 'REPLACE_SITE',
  REPLACE_SITE_PAGES = 'REPLACE_SITE_PAGES',
  REPLACE_ZONES_LIST = 'REPLACE_ZONES_LIST_SITE',
  REPLACE_ZONES_ASSIGNED_LIST = 'REPLACE_ZONES_ASSIGNED_LIST_SITE',
}

interface ReplaceSites {
  type: SITE_ACTIONS.REPLACE_SITES,
  data: {
    sites: Array<SiteState>,
    forward: number
  }
}

interface ReplaceZonesList {
  type: SITE_ACTIONS.REPLACE_ZONES_LIST,
  zones: Zone[]
}

interface ReplaceZonesAssigned {
  type: SITE_ACTIONS.REPLACE_ZONES_ASSIGNED_LIST,
  zonesAssigned: Zone[]
}

interface ReplaceSitePages {
  type: SITE_ACTIONS.REPLACE_SITE_PAGES,
  data: {
    totalPages: number,
    numberOfElements: number,
    totalElements: number,
    number: number,
  }
}

interface ReplaceZonesList {
  type: SITE_ACTIONS.REPLACE_ZONES_LIST,
  zones: Zone[],
  
}

interface ReplaceSite {
  type: SITE_ACTIONS.REPLACE_SITE,
  site: SiteState
}

export type SiteActionTypes = ReplaceSitePages | ReplaceSites | ReplaceSite
  | ReplaceZonesList | ReplaceZonesAssigned;
