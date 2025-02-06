import { useDispatch, useSelector } from 'react-redux';
import { loadBarcodeReport, resetBarcodeReport } from '../../store/actions/barcodeReport';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { BarcodeReportState } from '../../store/types/barcodeReport';

const selectBarcodeReportState: ParametricSelector<RootState, undefined, {
  barcodeReport: BarcodeReportState
}> =
  createSelector<RootState, BarcodeReportState,
    {
      barcodeReport: BarcodeReportState
    }>
  (
    state => state.barcodeReport,
    (barcodeReport) => ({
      barcodeReport
    })
  );

export const useBarcodeReportState = () => {
  return useSelector((state: RootState) => selectBarcodeReportState(state, undefined));
};

export const useBarcodeReportDispatch = () => {
  const dispatch = useDispatch();
  return {
    loadBarcodeReport: () => dispatch(loadBarcodeReport()),
    resetBarcodeReport: () => dispatch(resetBarcodeReport())
  };
};
