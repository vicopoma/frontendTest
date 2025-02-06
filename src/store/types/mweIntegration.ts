export interface MweIntegrationData {
  hostName: string,
  https: boolean,
  userName: string,
  password: string,
  active: boolean;
  typeIntegration: string,
}

export interface MweIntegrationState {
  mweData: MweIntegrationData
}

export const DEFAULT_MWE_INTEGRATION_DATA: MweIntegrationData = {
  active: false,
  hostName: '',
  https: false,
  password: '',
  userName: '',
  typeIntegration: 'MWE_LOGIN'
};

export const DEFAULT_MWE_INTEGRATION: MweIntegrationState = {
  mweData: DEFAULT_MWE_INTEGRATION_DATA
};

export enum MWE_INTEGRATION_ACTIONS {
  REPLACE_MWE_INTEGRATION = 'REPLACE_MWE_INTEGRATION'
}

interface ReplaceMweIntegration {
  type: MWE_INTEGRATION_ACTIONS.REPLACE_MWE_INTEGRATION,
  mweIntegration: MweIntegrationData
}

export type MweIntegrationActionType = ReplaceMweIntegration;

