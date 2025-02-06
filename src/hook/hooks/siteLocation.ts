import { useDispatch, useSelector } from 'react-redux';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { SiteLocationsState, SiteLocationState } from '../../store/types/siteLocation';
import {
  deleteSiteLocationById,
  loadSiteLocationById,
  loadSiteLocationBySite,
  loadSiteLocationList,
  saveSiteLocation,
  updateSiteLocation
} from '../../store/actions/siteLocation';
import { useCallback } from 'react';


const selectSiteLocation: ParametricSelector<RootState, undefined, {
  siteLocationList: Array<SiteLocationState>,
  siteLocation: SiteLocationState
  allSiteLocationState: SiteLocationsState
}> =
  createSelector<RootState, Array<SiteLocationState>, SiteLocationState, SiteLocationsState,
    {
      siteLocationList: Array<SiteLocationState>,
      siteLocation: SiteLocationState,
      allSiteLocationState: SiteLocationsState
    }>
  (
    state => state.siteLocation.SiteLocations,
    state => state.siteLocation.siteLocation,
    state => state.siteLocation,
    (siteLocationList, siteLocation, allSiteLocationState) => ({
      siteLocationList, siteLocation, allSiteLocationState
    })
  );

export const useSiteLocationState = () => {
  return useSelector((state: RootState) => selectSiteLocation(state, undefined));
};

export const useSiteLocationDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadSiteLocationList: useCallback((setLoader: Function, forward: number) => dispatch(loadSiteLocationList(setLoader, forward)), [dispatch]),
    loadSiteLocationBySiteId: useCallback((siteId: string) => dispatch(loadSiteLocationBySite(siteId)), [dispatch]),
    saveSiteLocation: (siteLocation: SiteLocationState) => dispatch(saveSiteLocation(siteLocation)),
    updateSiteLocation: (siteLocation: SiteLocationState) => dispatch(updateSiteLocation(siteLocation)),
    loadSiteLocationById: async (siteLocationId: string) => await dispatch(loadSiteLocationById(siteLocationId)),
    deleteSiteLocationById: (siteLocationId: string) => dispatch(deleteSiteLocationById(siteLocationId)),
    
  };
};
