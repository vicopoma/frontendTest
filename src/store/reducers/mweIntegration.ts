import {
  DEFAULT_MWE_INTEGRATION,
  MWE_INTEGRATION_ACTIONS,
  MweIntegrationActionType,
  MweIntegrationState
} from '../types/mweIntegration';


export const mweIntegration = (state: MweIntegrationState = DEFAULT_MWE_INTEGRATION, action: MweIntegrationActionType): MweIntegrationState => {
  if (action.type === MWE_INTEGRATION_ACTIONS.REPLACE_MWE_INTEGRATION) {
    return {
      ...state,
      mweData: action.mweIntegration
    };
  } else {
    return state;
  }
};