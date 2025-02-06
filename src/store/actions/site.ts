import { FilterState, SITE_ACTIONS, SiteState, Zone } from '../types';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postFormData,
  postRequest,
  warningAndErrorMessages
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK, SITE_FILTER } from '../../constants/constants';
import { paramBuilder } from '../../helpers/Utils';
import React from 'react';
import { replaceImportData, replaceImportDataInterval, replaceImportDataMemory } from './importData';
import { Log } from '../types/importData';
import moment from 'moment';
import { showLoader } from './loader';

export const replaceSites = (sites: Array<SiteState>, forward: number) => {
  return {
    type: SITE_ACTIONS.REPLACE_SITES,
    data: {
      sites,
      forward
    }
  };
  
};

export const replaceSitePages = (totalElements: number, totalPages: number, numberOfElements: number, number: number) => {
  return {
    type: SITE_ACTIONS.REPLACE_SITE_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replaceSite = (site: SiteState) => {
  return {
    type: SITE_ACTIONS.REPLACE_SITE,
    site
  };
};

export const loadSites = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[SITE_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    setLoader(true);
    const data: OkPagedListResponse<SiteState> = await getRequest(API.SITE.SITES() + query, getToken());
    setLoader(false);
    if (data?.httpStatus === OK) {
      dispatch(replaceSites(data?.body.content, forward));
      dispatch(replaceSitePages(data?.body?.totalElements, data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.number));
    }
  };
};

export const syncronized = () => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<SiteState> = await getRequest(API.SITE.SYNCHRONIZED(), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadSites(() => {
      }, 3));
    }
    dispatch(showLoader(false));
  };
};

export const deleteZone = (zone: Zone) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.SITE.ZONE_WITH_ID(zone.id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(getZoneAssigned(zone.siteId));
    }
  };
};

export const loadSiteById = (site: SiteState) => {
  return (dispatch: Function) => {
    dispatch(replaceSite(site));
  };
};

export const saveZone = (zone: Zone) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await postRequest(API.SITE.ZONE(), zone, getToken());
    if (data?.httpStatus === CREATED) {
      dispatch(getZoneAssigned(zone.siteId));
    } else {
      warningAndErrorMessages(data);
    }
    
    
  };
};

export const getZoneAssigned = (siteId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<Zone> = await getRequest(API.SITE.ZONE_LIST_BY_SITE_ID(siteId), getToken());
    if (data?.httpStatus === OK) {
      dispatch({
        type: SITE_ACTIONS.REPLACE_ZONES_ASSIGNED_LIST,
        zonesAssigned: data.body
      });
    }
  };
};

export const getZoneBySiteId = (siteId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<any> = await getRequest(API.SITE.ZONE_BY_SITE_ID(siteId), getToken());
    if (data?.httpStatus === OK) {
      const zoneList: Array<Zone> = data?.body.map(zone => {
        return {
          id: '',
          description: zone.description,
          name: zone.name,
          zoneId: zone.id,
          siteId
        };
      });
      dispatch({
        type: SITE_ACTIONS.REPLACE_ZONES_LIST,
        zones: zoneList
      });
    }
  };
};

export const importSitesCsv = (form: FormData, setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>) => {
  return async (dispatch: Function) => {
    
    const then = moment(new Date(), 'DD/MM/YYYY HH:mm:ss');
    const data: OKListResponse<Log> = await postFormData(API.SITE.IMPORT_SITES(), form, getToken());
    const now = moment(new Date(), 'DD/MM/YYYY HH:mm:ss');
    const ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(then, 'DD/MM/YYYY HH:mm:ss'));
    
    if (data?.httpStatus === OK) {
      setFiles({});
    }
    
    const fileName: File = (form.get('file') as File);
    const zip: File = (form.get('zip') as File);
    
    const logs = data?.body.map(log => {
      return {
        ...log,
        fileName: fileName.name
      };
    });
    
    dispatch(replaceImportData(logs));
    dispatch(replaceImportDataInterval(ms / 1000));
    dispatch(replaceImportDataMemory((fileName.size + zip.size) / 1000));
  };
};
