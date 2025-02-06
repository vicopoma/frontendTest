import { WarningMessage } from './../../components/Shared/Messages/Messages';
import { MWE_INTEGRATION_ACTIONS, MweIntegrationData } from '../types/mweIntegration';
import { OKListResponse, OKObjectResponse } from '../../settings/Backend/Responses';
import { getRequest, getToken, postRequest } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK } from '../../constants/constants';
import { showLoader } from './loader';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';

export const replaceMweIntegrationData = (mweIntegration: MweIntegrationData) => {
  return {
    type: MWE_INTEGRATION_ACTIONS.REPLACE_MWE_INTEGRATION,
    mweIntegration
  };
};

export const loadMweData = () => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKListResponse<MweIntegrationData> = await getRequest(API.MANAGEMENT.MWE_INTEGRATION(), getToken());
    
    if (data?.httpStatus === OK) {
      dispatch(replaceMweIntegrationData(data?.body[0]));
    }
    dispatch(showLoader(false));
  };
};

export const saveMweData = (mweIntegrationData: MweIntegrationData) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<any> = await postRequest(API.MANAGEMENT.MWE_INTEGRATION(), mweIntegrationData, getToken());
    if (data?.httpStatus === CREATED) {
      SuccessMessage({description: 'Integration has been done successfully'});
    } else {
      WarningMessage({description: 'Failed connection'});
    }
    dispatch(showLoader(false));
  };
};

export const testMweData = (mweIntegrationData: MweIntegrationData) => {
  return async (dispatch: Function) => {
    dispatch(showLoader(true));
    const data: OKObjectResponse<any> = await postRequest(API.MANAGEMENT.MWE_INTEGRATION_TEST(), mweIntegrationData, getToken());
    if (data?.httpStatus === OK) {
      SuccessMessage({description: 'Test has been done Successfully'});
    } else {
      WarningMessage({description: 'Failed connection'});
    }
    dispatch(showLoader(false));
  };
};
