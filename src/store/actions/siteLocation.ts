import { DEFAULT_SITE_LOCATION, SITE_LOCATION_ACTIONS, SiteLocationState } from '../types/siteLocation';
import { OKListResponse, OKObjectResponse } from '../../settings/Backend/Responses';
import { deleteRequest, getRequest, getToken, postRequest, putRequest } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK, SITE_LOCATION_FILTER } from '../../constants/constants';
import { showLoader } from './loader';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { FilterState } from '../types';
import store from '../index';
import { paramBuilder } from '../../helpers/Utils';

export const replaceSiteLocationBySite = (sites: Array<SiteLocationState>) => {
  return {
    type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_BY_SITE,
    sites
  };
};

export const replaceSiteLocationList = (sites: Array<SiteLocationState>) => {
  return {
    type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION_LIST,
    sites
  };
};

export const replaceSiteLocation = (siteLocation: SiteLocationState) => {
  return {
    type: SITE_LOCATION_ACTIONS.REPLACE_SITE_LOCATION,
    siteLocation
  };
};

export const loadSiteLocationBySite = (siteId: string) => {
  return async (dispatch: Function) => {
    if (!!siteId) {
      const data: OKListResponse<SiteLocationState> = await getRequest(API.SITE_LOCATION.SITE_LOCATION_BY_SITE(siteId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceSiteLocationBySite(data?.body));
      } else {
        dispatch(replaceSiteLocationBySite([]));
      }
    } else {
      dispatch(replaceSiteLocationBySite([]));
    }
  };
};

export const loadSiteLocationList = (setLoader: Function, forward: number) => {
  return async (dispatch: Function) => {
    const params: FilterState = store.getState().filters[SITE_LOCATION_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    setLoader(true);
    const data: OKListResponse<SiteLocationState> = await getRequest(API.SITE_LOCATION.SITE_LOCATION() + query, getToken());
    setLoader(false);
    if (data?.httpStatus === OK) {
      dispatch(replaceSiteLocationList(data?.body));
    }
  };
};

export const saveSiteLocation = (siteLocation: SiteLocationState) => {
  return async (dispatch: Function) => {
    
    const data: OKObjectResponse<SiteLocationState> = await postRequest(API.SITE_LOCATION.SITE_LOCATION(), siteLocation, getToken());
    
    if (data?.httpStatus === CREATED) {
      dispatch(loadSiteLocationList(showLoader, 3));
    }
  };
};

export const updateSiteLocation = (siteLocation: SiteLocationState) => {
  return async (dispatch: Function) => {
    
    const data: OKObjectResponse<SiteLocationState> = await putRequest(API.SITE_LOCATION.SITE_LOCATION(), siteLocation, getToken());
    
    if (data?.httpStatus === OK) {
      dispatch(loadSiteLocationList(showLoader, 3));
    }
  };
};

export const loadSiteLocationById = (siteLocationId: string) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    if (!!siteLocationId) {
      const data: OKObjectResponse<SiteLocationState> = await getRequest(API.SITE_LOCATION.SITE_LOCATION_BY_ID(siteLocationId), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceSiteLocation(data?.body));
      } else {
        dispatch(replaceSiteLocation(DEFAULT_SITE_LOCATION));
      }
    } else {
      dispatch(replaceSiteLocation(DEFAULT_SITE_LOCATION));
    }
    dispatch(showLoader(false));
  };
};

export const deleteSiteLocationById = (siteLocationId: string) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.SITE_LOCATION.SITE_LOCATION_BY_ID(siteLocationId), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadSiteLocationList(showLoader, 3));
      SuccessMessage({description: 'Site Location deleted successfully'});
    }
  };
};

