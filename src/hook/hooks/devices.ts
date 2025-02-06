// TO DELETE 
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { FX9600Maps, FX9600Sites, FX9600State } from '../../store/types/devices';
import {
  deleteFx9600Device,
  loadFx9600ById,
  loadFx9600List,
  saveFx9600Device,
  updateFx9600Device
} from '../../store/actions/devices';
import { useCallback } from 'react';


const selectDevicesState: ParametricSelector<RootState, undefined, {
  fx9600List: Array<FX9600State>
  fx9600Device: FX9600State,
  sites: { [key: string]: FX9600Sites }
  maps: { [key: string]: FX9600Maps }
}> =
  createSelector<RootState, Array<FX9600State>, FX9600State, { [key: string]: FX9600Sites }, { [key: string]: FX9600Maps },
    {
      fx9600List: Array<FX9600State>
      fx9600Device: FX9600State
      sites: { [key: string]: FX9600Sites }
      maps: { [key: string]: FX9600Maps }
    }>
  (
    state => state.device.fx9600.fx9600List,
    state => state.device.fx9600.fx9600Device,
    state => state.device.fx9600.sites,
    state => state.device.fx9600.maps,
    (fx9600List, fx9600Device, sites, maps) => ({
      fx9600List, fx9600Device, sites, maps
    })
  );

export const useDeviceState = () => {
  return useSelector((state: RootState) => selectDevicesState(state, undefined));
};

export const useDeviceDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadFx9600List: useCallback((setLoader: Function, forward: number) => dispatch(loadFx9600List(setLoader, forward)), [dispatch]),
    loadFx9600Device: (id: string) => dispatch(loadFx9600ById(id)),
    saveFx9600Device: (device: FX9600State) => dispatch(saveFx9600Device(device)),
    updateFx9600Device: (device: FX9600State) => dispatch(updateFx9600Device(device)),
    deleteFX9600Device: (deviceId: string) => dispatch(deleteFx9600Device(deviceId))
  };
};
