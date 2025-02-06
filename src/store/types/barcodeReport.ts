export interface EquipmentTypeReport {
  equipmentCode: string,
  equipmentType: string,
}

export interface PlayerReport {
  equipment: Array<EquipmentTypeReport>,
  fullName: string,
  position: string,
}

export interface TeamReport {
  fullName: string,
  players: Array<PlayerReport>
}

export interface BarcodeReportState {
  phase: string,
  reportName: string,
  teams: Array<TeamReport>
  year: string,
  pdf: any
}

export const DEFAULT_BARCODE: BarcodeReportState = {
  phase: '',
  reportName: '',
  teams: [],
  year: '',
  pdf: ''
};

export enum BARCODE_REPORTS_ACTIONS {
  REPLACE_BARCODES_REPORT = 'REPLACE_BARCODES_REPORT',
  REPLACE_BARCODES_PDF = 'REPLACE_BARCODES_PDF'
}

interface ReplaceBarcodeReport {
  type: BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_REPORT,
  reports: BarcodeReportState
}

interface ReplaceBarcodePdf {
  type: BARCODE_REPORTS_ACTIONS.REPLACE_BARCODES_PDF,
  pdf: any
}

export type barcodeReportActionTypes = ReplaceBarcodeReport | ReplaceBarcodePdf;
