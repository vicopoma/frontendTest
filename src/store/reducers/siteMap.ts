import { DEFAULT_SITES_MAP, SITE_MAP_ACTIONS, siteMapActionTypes, SiteMapsState } from './../types/siteMap';

export const siteMaps = (state: SiteMapsState = DEFAULT_SITES_MAP, action: siteMapActionTypes) => {
  switch (action.type) {
    case SITE_MAP_ACTIONS.REPLACE_SITES_MWE:
      return {
        ...state,
        sitesMwe: action.sitesMwe
      };
    case SITE_MAP_ACTIONS.REPLACE_SITES:
      return {
        ...state,
        sites: action.sites
      };
    case SITE_MAP_ACTIONS.REPLACE_ZONES:
      return {
        ...state,
        zones: action.zones
      };
    
    case SITE_MAP_ACTIONS.REPLACE_ZONE_LIST:
      return {
        ...state,
        zonesList: action.zoneList
      };
    default:
      return state;
  }
};
