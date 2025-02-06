import { mergeLists } from '../../helpers/Utils';
import { DEFAULT_SITES, SITE_ACTIONS, SiteActionTypes, SitesState, SiteState } from '../types/site';


export const site = (state: SitesState = DEFAULT_SITES, action: SiteActionTypes): SitesState => {
  switch (action.type) {
    case SITE_ACTIONS.REPLACE_SITES:
      const siteList: Array<SiteState> = mergeLists(state.sites, action.data.sites, action.data.forward);
      return {
        ...state,
        sites: [...siteList]
      };
    case SITE_ACTIONS.REPLACE_SITE_PAGES:
      return {
        ...state,
        totalElements: action.data.totalElements,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        number: action.data.number,
      };
    
    case SITE_ACTIONS.REPLACE_SITE:
      return {
        ...state,
        site: action.site
      };
    case SITE_ACTIONS.REPLACE_ZONES_LIST:
      return {
        ...state,
        zones: action.zones
      };
    case SITE_ACTIONS.REPLACE_ZONES_ASSIGNED_LIST:
      return {
        ...state,
        zonesAssigned: action.zonesAssigned
      };
    default:
      return state;
  }
};
