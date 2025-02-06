import {
  deleteTeamZone,
  loadSiteByTeam,
  loadSiteByTeamAndType,
  loadSiteByTeamRelated,
  loadSiteMwe,
  loadZonesBySiteId,
  loadZonesByTeamId,
  relateSite,
  replaceSites,
  saveTeamZone,
  unassignSite
} from '../../store/actions/siteMap';
import { SiteMapsState, SiteState } from '../../store/types/siteMap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { createSelector, ParametricSelector } from 'reselect';
import { useCallback } from 'react';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

const selectSitesMapState: ParametricSelector<RootState, undefined, SiteMapsState> =
  createSelector<RootState, SiteMapsState, SiteMapsState>
  (
    state => state.siteMaps,
    (siteMaps) => {
      return siteMaps;
    }
  );

export const useSitesMapState = () => {
  return useSelector((state: RootState) => selectSitesMapState(state, undefined));
};

export const useSitesMapDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadSiteMwe: () => dispatch(loadSiteMwe()),
    replaceSites: (sites: Array<SiteState>) => dispatch(replaceSites(sites)),
    relateSite: (site: SiteState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(relateSite(site, setResponse)),
    loadSiteByTeam: (teamId: string) => dispatch(loadSiteByTeam(teamId)),
    loadSiteByTeamAndType: (teamId: string, type: string) => dispatch(loadSiteByTeamAndType(teamId, type)),
    unassignSite: (site: SiteState) => dispatch(unassignSite(site)),
    loadSiteByTeamRelated: useCallback((teamId: string) => dispatch(loadSiteByTeamRelated(teamId)), [dispatch]),
    loadZonesBySiteId: (siteId: string) => dispatch(loadZonesBySiteId(siteId)),
    saveTeamZone: (teamZone: { teamId: string, zoneId: string, siteId: string, name: string }, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(saveTeamZone(teamZone, setResponse)),
    deleteTeamZone: (id: string) => dispatch(deleteTeamZone(id)),
    loadZonesByTeamId: useCallback((teamId: string) => dispatch(loadZonesByTeamId(teamId)), [dispatch])
  };
};
