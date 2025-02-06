export interface SiteLocationState {
  id: string,
  largeName: string,
  latitude: number,
  longitude: number,
  shortName: string,
  siteId: string,
  siteLocationType: string,
  siteLocationCode: string,
}

export interface SiteLocationInformation {
  id: string,
  lat: number,
  lng: number, 
  name: string,
  siteId: string, 
  zoneName: Array<string>,
}

export interface SiteLocationsState {
  SiteLocations: Array<SiteLocationState>
  SiteLocationBySite: Array<SiteLocationState>
  siteLocation: SiteLocationState
}

export const DEFAULT_SITE_LOCATION: SiteLocationState = {
  id: '',
  largeName: '',
  latitude: 0,
  longitude: 0,
  shortName: '',
  siteId: '',
  siteLocationType: '',
  siteLocationCode: ''
};

export const DEFAULT_SITE_LOCATIONS: SiteLocationsState = {
  SiteLocationBySite: [],
  SiteLocations: [],
  siteLocation: DEFAULT_SITE_LOCATION
};

export enum SITE_LOCATION_ACTIONS {
  REPLACE_SITE_LOCATION_BY_SITE = 'REPLACE_SITE_LOCATION_BY_SITE',
  REPLACE_SITE_LOCATION_LIST = 'REPLACE_SITE_LOCATION_LIST',
  REPLACE_SITE_LOCATION = 'REPLACE_SITE_LOCATION',
}

interface ReplaceSiteLocationBySite {
  type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_BY_SITE,
  sites: Array<SiteLocationState>
}

interface ReplaceSiteLocationList {
  type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_LIST,
  sites: Array<SiteLocationState>
}

interface ReplaceSiteLocation {
  type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION,
  siteLocation: SiteLocationState
}

export type siteLocationActionTypes = ReplaceSiteLocationBySite | ReplaceSiteLocationList | ReplaceSiteLocation;

