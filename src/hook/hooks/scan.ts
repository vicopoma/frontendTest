import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import { ActivityScan, ScansState, ScanState } from '../../store/types';
import {
  getActivityScans,
  loadScansByActivityId,
  replaceActivityScan,
  replaceScansByActivity
} from '../../store/actions/scan';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EquipmentTypesType, SCAN_DETAIL_FILTER } from '../../constants/constants';
import { useEquipmentTypeState } from './equipmentType';
import { useEquipmentDispatch, useEquipmentState } from './equipment';
import { useBodyFilterState } from './bodyFilter';
import { buildManufacturersAndModelsByDefault } from '../../helpers/Utils';
import { useBodyFilterParams } from '../customHooks/customHooks';


const selectScanState: ParametricSelector<RootState, undefined, ScansState> =
  createSelector<RootState, ScansState, ScansState>
  (
    state => state.scan,
    (partTypes) => {
      return partTypes;
    }
  );

export const useScanState = () => {
  return useSelector((state: RootState) => selectScanState(state, undefined));
};

export const useScanDispatch = () => {
  const dispatch = useDispatch();
  return {
    getActivityScans: useCallback((setLoader: Function, forward: number) => dispatch(getActivityScans(setLoader, forward)), [dispatch]),
    loadScansByActivityId: useCallback((setLoader: Function, forward: number, id: string) => dispatch(loadScansByActivityId(setLoader, forward, id)), [dispatch]),
    replaceActivityScans: async (activity: ActivityScan) => await dispatch(replaceActivityScan(activity)),
    replaceScansByActivity: (scans: ScanState[]) => dispatch(replaceScansByActivity(scans)),
  };
};

export const useScanReportFilterBuilder = (sessionId: string) => {
  
  const [eqType, setEqType] = useState<EquipmentTypesType>(undefined);
  const component = SCAN_DETAIL_FILTER + eqType;
  const {equipmentTypeList} = useEquipmentTypeState();
  const {manufacturerWithModels} = useEquipmentState();
  const {getManufacturerWithModels} = useEquipmentDispatch();
  
  const scanDetailFilter = useBodyFilterState(component);
  const {addBodyFilter} = useBodyFilterParams(component, {});
  const [eqTypeId, setEqTypeId] = useState<string>(scanDetailFilter?.equipmentTypeId?.[0]);
  
  const [enableFetch, setEnableFetch] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<number>(0);
  const [trigger2, setTrigger2] = useState<number>(0);
  const [reinitialized, setReinitialized] = useState<number>(0);
  const restart = useCallback(() => setReinitialized(prevState => prevState + 1), []);
  
  useEffect(() => {
    setEqTypeId((prevEquipTypeId) => {
      const currentType = prevEquipTypeId ?
        equipmentTypeList.filter(type => type.id === prevEquipTypeId) : [];
      setEqType(currentType[0]?.nameEquipmentType);
      if (!prevEquipTypeId && equipmentTypeList.length > 0) {
        return equipmentTypeList[0]?.id;
      }
      return prevEquipTypeId;
    });
  }, [equipmentTypeList, eqTypeId]);
  
  useEffect(() => {
    setTrigger(trigger => trigger + 1);
    setEnableFetch(false);
    setTrigger2(0);
  }, [eqTypeId, reinitialized]);
  
  useEffect(() => {
    if (eqTypeId) {
      getManufacturerWithModels(eqTypeId).then(() => {
        setTrigger2(trigger2 => trigger2 + 1);
      });
    }
  }, [eqTypeId, getManufacturerWithModels, trigger]);
  
  const initBodyFilter = useMemo(() => {
    if (trigger2) {
      if (Object.keys(scanDetailFilter).length === 0 || sessionId !== scanDetailFilter?.sessionId) {
        const {modelIds, manufacturerIds} = buildManufacturersAndModelsByDefault(manufacturerWithModels);
        setEnableFetch(true);
        setTrigger(0);
        const currentFilters = {
          equipmentModelId: modelIds,
          manufacturerId: manufacturerIds,
          equipmentTypeId: [eqTypeId],
          keys: []
        };
        addBodyFilter({
          sessionId: sessionId,
          keyword: '',
          tag: '',
          operator: 'AND',
        });
        if (!scanDetailFilter?.manufacturerId) {
          addBodyFilter(currentFilters);
        }
        return currentFilters;
      } else {
        setEnableFetch(true);
        return scanDetailFilter;
      }
    }
    return scanDetailFilter;
  }, [trigger2, scanDetailFilter, sessionId, manufacturerWithModels, addBodyFilter, eqTypeId]);
  
  return {enableFetch, eqType, setEnableFetch, setEqType, setEqTypeId, initBodyFilter, restart};
};

