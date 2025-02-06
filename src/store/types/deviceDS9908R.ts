export interface InstallerState {
  name: string,
  version: string,
  installer: string
}

export interface DeviceDS9908RsState {
  installers: Array<InstallerState>
}

export const DEFAULT_DEVICE_DS9908R: DeviceDS9908RsState = {
  installers: []
};

export enum DEVICE_DS9908R_ACTIONS {
  REPLACE_DEVICE_INSTALLER = 'REPLACE_DEVICE_INSTALLER'
}

interface ReplaceDeviceInstaller {
  type: DEVICE_DS9908R_ACTIONS.REPLACE_DEVICE_INSTALLER
  installers: Array<InstallerState>
}

export type deviceDS9908RActionTypes = ReplaceDeviceInstaller;