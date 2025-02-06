import { DEFAULT_SCANS, ScanActionsTypes, SCANS_ACTIONS, ScansState } from '../types/scan';

export const scan = (state: ScansState = DEFAULT_SCANS, action: ScanActionsTypes) => {
  switch (action.type) {
    case SCANS_ACTIONS.GET_SCANS:
      return {
        ...state,
        scans: action.scans
      };
    
    case SCANS_ACTIONS.REPLACE_CONFIG_SCANNER_DEVICES:
      return {
        ...state,
        config: {
          scanDevices: action.scannerDevices
        }
      };
    
    case SCANS_ACTIONS.REPLACE_ACTIVITY_SCANS:
      return {
        ...state,
        activityScan: action.activity
      };
    
    default:
      return state;
  }
};
