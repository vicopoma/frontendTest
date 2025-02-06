import { DEFAULT_DEVICES, DEVICES_ACTION, devicesActionType, DevicesState } from '../types/devices';

export const device = (state: DevicesState = DEFAULT_DEVICES, action: devicesActionType): DevicesState => {
  const newState = {...state};
  switch (action.type) {
    case DEVICES_ACTION.REPLACE_FX9600LIST:
      return {
        ...state,
        fx9600: {
          ...state.fx9600,
          fx9600List: action.list
        }
      };
    case DEVICES_ACTION.REPLACE_FX9600_DEVICE:
      return {
        ...state,
        fx9600: {
          ...state.fx9600,
          fx9600Device: action.device
        }
      };
    
    case DEVICES_ACTION.REPLACE_FX9600_TOTAL_PAGES:
      return {
        ...state,
        fx9600: {
          ...state.fx9600,
          totalPages: action.totalPages
        }
      };
    
    case DEVICES_ACTION.REPLACE_FX9600_SITES:
      newState.fx9600.sites = {};
      action.sites.forEach(site => {
        newState.fx9600.sites[site._id] = site;
      });
      return newState;
    
    case DEVICES_ACTION.REPLACE_FX9600_MAPS:
      newState.fx9600.maps = {};
      action.maps.forEach(map => {
        newState.fx9600.maps[map._id] = map;
      });
      return newState;
    
    default:
      return state;
  }
};
