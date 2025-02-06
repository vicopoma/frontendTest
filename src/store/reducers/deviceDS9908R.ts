import {
  DEFAULT_DEVICE_DS9908R,
  DEVICE_DS9908R_ACTIONS,
  deviceDS9908RActionTypes,
  DeviceDS9908RsState
} from '../types/deviceDS9908R';

export const deviceDS9908R = (state: DeviceDS9908RsState = DEFAULT_DEVICE_DS9908R, action: deviceDS9908RActionTypes): DeviceDS9908RsState => {
  if (action.type === DEVICE_DS9908R_ACTIONS.REPLACE_DEVICE_INSTALLER) {
    return {
      installers: action.installers
    };
  } else {
    return state;
  }
};