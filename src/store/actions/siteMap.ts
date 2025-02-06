import { deleteRequest, postRequest, warningAndError } from './../../settings/httpClients';
import { OKObjectResponse } from './../../settings/Backend/Responses';
import { CREATED, OK } from '../../constants/constants';
import { OKListResponse } from '../../settings/Backend/Responses';
import { getRequest, getToken } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { SITE_MAP_ACTIONS, SiteState, ZoneState } from './../types/siteMap';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

export const replaceSiteMwe = (sitesMwe: Array<SiteState>) => {
  return {
    type: SITE_MAP_ACTIONS.REPLACE_SITES_MWE,
    sitesMwe
  };
};

export const replaceSites = (sites: Array<SiteState>) => {
  return {
    type: SITE_MAP_ACTIONS.REPLACE_SITES,
    sites
  };
};

export const replaceZones = (zones: Array<ZoneState>) => {
  return {
    type: SITE_MAP_ACTIONS.REPLACE_ZONES,
    zones
  };
};

export const replaceZonesList = (zoneList: Array<ZoneState>) => {
  return {
    type: SITE_MAP_ACTIONS.REPLACE_ZONE_LIST,
    zoneList
  };
};

export const loadSiteMwe = () => {
  return async (dispatch: Function) => {
    const data: OKListResponse<SiteState> = await getRequest(API.SITE_MAP.SITE_MWE_ALL(), getToken());
    if (data.httpStatus === OK) {
      dispatch(replaceSiteMwe(data.body));
    }
  };
};

export const relateSite = (site: SiteState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<SiteState> = await postRequest(API.SITE_MAP.RELATE_SITE(), site, getToken());
    if (data.httpStatus === CREATED) {
      dispatch(loadSiteByTeam(site.teamId));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const loadSiteByTeam = (teamId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<SiteState> = await getRequest(API.SITE_MAP.SITE_BY_TEAM(teamId), getToken());
    if (data.httpStatus === OK) {
      dispatch(replaceSites(data.body));
    }
  };
};

export const loadSiteByTeamRelated = (teamId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<SiteState> = await getRequest(API.SITE_MAP.SITES_RELATED_TEAM(teamId), getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceSites(data?.body));
    }
  };
};

export const loadSiteByTeamAndType = (teamId: string, type: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<SiteState> = await getRequest(API.SITE_MAP.SITE_BY_TEAM_AND_TYPE(teamId, type.toUpperCase()), getToken());
    if (data.httpStatus === OK) {
      dispatch(replaceSites(data.body));
    }
  };
};

export const unassignSite = (site: SiteState) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<SiteState> = await deleteRequest(API.SITE_MAP.DELETE_SITE(site.id), getToken());
    if (data.httpStatus === OK) {
      dispatch(loadSiteByTeam(site.teamId));
    }
  };
};

export const loadZonesBySiteId = (siteId: string) => {
  return async (dispatch: Function) => {
    if (!!siteId) {
      const data: OKObjectResponse<string> = await getRequest(API.SITE_MAP.ZONES_BY_SITE_ID(siteId), getToken());
      if (data?.httpStatus === OK) {
        const zones: Array<ZoneState> = JSON.parse(data?.body);
        dispatch(replaceZones(zones));
      }
    } else {
      dispatch(replaceZones([]));
    }
  };
};

export const saveTeamZone = (body: { teamId: string, zoneId: string, siteId: string, name: string }, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    
    const data: OKObjectResponse<any> = await postRequest(API.SITE_MAP.ZONE(), body, getToken());
    if (data?.httpStatus === CREATED || data?.httpStatus === OK) {
      dispatch(loadZonesByTeamId(body.teamId));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'User created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const deleteTeamZone = (id: string) => {
  return async (dispatch: Function, getState: Function) => {
    const teamId = getState().teams.team.teamId;
    const data: OKObjectResponse<any> = await deleteRequest(API.SITE_MAP.ZONE(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadZonesByTeamId(teamId));
    }
  };
};

export const loadZonesByTeamId = (teamId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<ZoneState> = await getRequest(API.SITE_MAP.ZONES_BY_TEAM_ID(teamId), getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceZonesList(data?.body));
    }
  };
};
