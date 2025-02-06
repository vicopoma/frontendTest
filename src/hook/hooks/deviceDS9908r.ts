import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  beepDevice,
  changeLightColor,
  changeStatus,
  changeVolume,
  loadInstallers,
  reboot,
  statusDevice
} from '../../store/actions/devicesDS9908r';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { DeviceDS9908RsState } from '../../store/types/deviceDS9908R';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

const selectDeviceDS9908RState: ParametricSelector<RootState, undefined, DeviceDS9908RsState> =
  createSelector<RootState, DeviceDS9908RsState, DeviceDS9908RsState>
  (
    state => state.deviceDS9908R,
    (devices) => {
      return devices;
    }
  );

export const useDeviceDS9908rState = () => {
  return useSelector((state: RootState) => selectDeviceDS9908RState(state, undefined));
};

export const useDeviceDS9908rDispatch = () => {
  const dispatch = useDispatch();
  return {
    beepDevice: (beeps: string, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(beepDevice(beeps, fetchResponse)),
    loadInstallers: useCallback(() => dispatch(loadInstallers()), [dispatch]),
    changeStatus:
      useCallback((status: string, setStatusSwitch: React.Dispatch<React.SetStateAction<boolean>>, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) =>
        dispatch(changeStatus(status, setStatusSwitch, fetchResponse)), [dispatch]),
    statusDevice:
      useCallback(async (setStatusSwitch: React.Dispatch<React.SetStateAction<boolean>>, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) =>
        await dispatch(statusDevice(setStatusSwitch, fetchResponse)), [dispatch]),
    changeLightColor:
      useCallback((color: string, status: string, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) =>
        dispatch(changeLightColor(color, status, fetchResponse)), [dispatch]),
    reboot: (fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => dispatch(reboot(fetchResponse)),
    changeVolume:
      useCallback((volumeAmount: number, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) =>
        dispatch(changeVolume(volumeAmount, fetchResponse)), [dispatch])
  };
};
