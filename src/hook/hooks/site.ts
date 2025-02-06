import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import {
  deleteZone,
  getZoneAssigned,
  getZoneBySiteId,
  importSitesCsv,
  loadSiteById,
  loadSites,
  saveZone,
  syncronized
} from '../../store/actions/site';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { DEFAULT_SITE, SitesState, SiteState, Zone } from '../../store/types';
import { useListFetch, useObjectCrudFetch } from '../customHooks/fetchs';
import { API } from '../../settings/server.config';
import { useFetch } from '../customHooks/useFetch';

const selectSiteState: ParametricSelector<RootState, undefined, SitesState> =
  createSelector<RootState, SitesState, SitesState>
  (
    state => state.site,
    (sites) => {
      return sites;
    }
  );

export const useSiteState = () => {
  return useSelector((state: RootState) => selectSiteState(state, undefined));
};

export const useSiteDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadSites: useCallback((setLoader: Function, forward: number) => dispatch(loadSites(setLoader, forward)), [dispatch]),
    loadSiteById: (site: SiteState) => dispatch(loadSiteById(site)),
    getZoneBySiteId: (siteId: string) => dispatch(getZoneBySiteId(siteId)),
    deleteZone: (zone: Zone) => dispatch(deleteZone(zone)),
    saveZone: (zone: Zone) => dispatch(saveZone(zone)),
    getZoneAssigned: (siteId: string) => dispatch(getZoneAssigned(siteId)),
    syncronized: () => dispatch(syncronized()),
    importSiteCsv: (csvData: FormData, setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>) => dispatch(importSitesCsv(csvData, setFiles))
  };
};

export const useSite = (siteId: string) => {
  const url = API.SITE.BASE();
  const {value} = useObjectCrudFetch<SiteState>({
    url: url,
    id: siteId,
    defaultValue: DEFAULT_SITE
  });
  return {
    site: value
  };
};

export const useZoneList = (siteId: string) => {
  const {loadList: loadZones, values: zones} = useListFetch<Zone>({url: API.SITE.ZONE_WITH_ID(siteId)});
  const {
    loadList: loadZonesAssigned,
    values: zonesAssigned
  } = useListFetch<Zone>({url: API.SITE.ZONE_LIST_BY_SITE_ID(siteId)});
  const url = API.SITE.ZONE();
  const {post, deleteRest, setHandleFetch} = useFetch<Zone>({_url: url});
  const [trigger, setTrigger] = useState<number>(0);
  const postZone = useCallback(async (body: Zone, resetForm: Function) => {
    setHandleFetch({
      onSucceed: () => {
        setTrigger((trigger) => trigger + 1);
        resetForm();
      },
      onFailure: () => {
        
      }
    });
    await post('', body, true);
  }, [post, setHandleFetch]);
  
  const deleteZone = useCallback(async (zoneId: string) => {
    setHandleFetch({
      onSucceed: () => {
        setTrigger((trigger) => trigger + 1);
      },
      onFailure: () => {
      }
    });
    await deleteRest('', true, `/${zoneId}`);
  }, [deleteRest, setHandleFetch]);
  
  const getZones = useCallback(() => {
    loadZones();
  }, [loadZones]);
  
  const getZonesAssigned = useCallback(() => {
    loadZonesAssigned();
  }, [loadZonesAssigned]);
  
  const getZonesList = useCallback(async () => {
    if (!!siteId) {
      getZones();
      getZonesAssigned();
    }
  }, [getZones, getZonesAssigned, siteId]);
  useEffect(() => {
    if (!!siteId) {
      getZonesList();
    }
  }, [getZonesList, trigger, siteId]);
  
  return {
    zones,
    zonesAssigned,
    deleteZone,
    postZone
  };
};
