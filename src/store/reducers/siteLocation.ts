import {
  DEFAULT_SITE_LOCATIONS,
  SITE_LOCATION_ACTIONS,
  siteLocationActionTypes,
  SiteLocationsState
} from '../types/siteLocation';

export const siteLocation = (state: SiteLocationsState = DEFAULT_SITE_LOCATIONS, action: siteLocationActionTypes): SiteLocationsState => {
  switch (action.type) {
    case SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_BY_SITE:
      return {
        ...state,
        SiteLocationBySite: action.sites
      };
    
    case SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_LIST:
      return {
        ...state,
        SiteLocations: action.sites
      };
    
    case SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION:
      return {
        ...state,
        siteLocation: action.siteLocation
      };
    
    default:
      return state;
  }
  
};
