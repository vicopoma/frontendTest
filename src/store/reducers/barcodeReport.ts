import {
  BARCODE_REPORTS_ACTIONS,
  barcodeReportActionTypes,
  BarcodeReportState,
  DEFAULT_BARCODE
} from '../types/barcodeReport';


export const barcodeReport = (state: BarcodeReportState = DEFAULT_BARCODE, action: barcodeReportActionTypes) => {
  switch (action.type) {
    case BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_REPORT:
      return {...state, ...action.reports};
    case BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_PDF:
      return {...state, pdf: action.pdf};
    default:
      return state;
  }
};
