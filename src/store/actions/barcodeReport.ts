import { BARCODE_REPORTS_ACTIONS, BarcodeReportState } from '../types/barcodeReport';
import { getRequest, getToken } from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { OKObjectResponse } from '../../settings/Backend/Responses';
import { OK, PLAYERS_FILTER } from '../../constants/constants';
import { FilterState } from '../types';
import store from '../index';
import { paramBuilder } from '../../helpers/Utils';

export const replaceBarcodeReports = (reports: BarcodeReportState) => {
  return {
    type: BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_REPORT,
    reports
  };
};

export const loadBarcodeReport = () => {
  return async (dispatch: Function) => {
    const params: FilterState = store.getState().filters[PLAYERS_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: OKObjectResponse<BarcodeReportState> = await getRequest(API.PLAYER.PLAYER_BARCODE() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceBarcodeReports(data?.body));
    }
  };
};
export const resetBarcodeReport = () => {
  return (dispatch: Function) => {
    dispatch({
      type: BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_PDF,
      pdf: ''
    });
  };
};