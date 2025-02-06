import { useCallback, useEffect, useState } from 'react';
import { API } from "../../settings/server.config";
import { ResponseObjectType, useObjectFetch } from './fetchs';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../constants/constants';
import { EquipmentAssign } from '../../store/types/players';
import { useBodyFilterParams } from './customHooks';
import { useBodyFilterState } from '../hooks/bodyFilter';
import { buildManufacturersAndModelsByDefault } from '../../helpers/Utils';
import { useManufacturerWithModelContext } from '../../context/manufacturerAndModelContext';


const url = API.SCANNER.SCAN_BASE();

interface TagTimeBlink {
  tagAscii: string,
  time: string,
  date: string
}

export interface ScanTagTimeList {
  startGameDate: string,
  endGameDate: string,
  homeTeam: string,
  visitTeam: string,
  tagTimeRawBlinkList: Array<TagTimeBlink>
}

export const DEFAULT_SCAN_TAG_TIME_LIST: ScanTagTimeList = {
  endGameDate: '',
  homeTeam: '',
  startGameDate: '',
  tagTimeRawBlinkList: [],
  visitTeam: ''
}

export interface ScanDistributionList {
  equipmentAssignedList: Array<EquipmentAssign>,
	fx9600: number,
	manual: number,
	mc33: number,
	sessionId: string,
	startGameDate: string,
	teamId: string,
	title: string,
	players: number,
  teamGame?: string
}

export interface ScanTeamsList {
	equipmentAssignedList: Array<EquipmentAssign>
	fx9600: number,
	manual: number,
	mc33: number,
	scanDistributionList: Array<ScanDistributionList>,
	siteName: string,
	teamId: string,
	teamName: string,
	total: number,
	type: string
}
export interface ScanVenuesList {
	equipmentAssignedList: Array<EquipmentAssign>
	fx9600: number,
	manual: number,
	mc33: number,
	scanDistributionList: Array<ScanDistributionList>,
	siteName: string,
	teamId: string,
	teamName: string,
	total: number,
	type: string
}

export interface ScanBySessionList {
  deviceType: string, 
  displayName: string, 
  equipmentCode: string, 
  id: string, 
  nameEquipmentType: string, 
  nameManufacturer: string, 
  nameModel: string, 
  tag: string,
}

export const SCAN_VENUES_LIST: ScanVenuesList = {
	equipmentAssignedList: [],
	fx9600: 0,
	manual: 0,
	mc33: 0,
	scanDistributionList: [],
	siteName: '',
	teamId: '',
	teamName: '',
	total: 0,
	type: '',
}

export const useScanFunctions = () => {

  const { values: tagTimeList, loadObject: loadTagTimeList } = useObjectFetch<ScanTagTimeList>({url, defaultValue: DEFAULT_SCAN_TAG_TIME_LIST});
  const { values: scanDistributions, updateObject: loadScanDistribution } = useObjectFetch<Array<ScanTeamsList>>({url, defaultValue: EMPTY_ARRAY})
  const { values: scanBySessions, updateObject: loadScanBySession } = useObjectFetch<Array<ScanBySessionList>>({ url, defaultValue: EMPTY_ARRAY });
  const { values: scanByVenues, updateObject: loadScanByVenue } = useObjectFetch<Array<ScanVenuesList>>({ url, defaultValue: EMPTY_ARRAY})
  const { values: scanByKeyword, updateObject: searchScanByKeyword} = useObjectFetch<Array<string>>({url, defaultValue: EMPTY_ARRAY});
  return {
    scanTagList: { 
      tagTimeList,
      loadTagTimeList: useCallback((sessionId: string, isNoisy?: string, tagId?: string, onSucceed?: ResponseObjectType<ScanTagTimeList>, onError?: ResponseObjectType<ScanTagTimeList>) => {
        loadTagTimeList(API.SCANNER.SCANS_LIST_TAG_TIME(sessionId, isNoisy, tagId), onSucceed, onError);
      },[loadTagTimeList])
    },
    scanDistribution: {
      scanDistributions,
      loadScanDistribution: useCallback((body: any, onSucceed?: ResponseObjectType<any>, onError?: ResponseObjectType<any>) => {
        loadScanDistribution(body, API.SCANNER.SCAN_DISTRIBUTION(), onSucceed, onError)
      }, [loadScanDistribution])
    },
    scanBySession: {
      scanBySessions,
      loadScanBySession: useCallback((body: any) => {
        loadScanBySession(body, API.SCANNER.SCAN_BY_SESSION())
      }, [loadScanBySession])
    },
    scanByVenue: {
      scanByVenues,
      loadScanByVenue: useCallback((body: any, onSucceed?: ResponseObjectType<any>, onError?: ResponseObjectType<any>) => {
        loadScanByVenue(body, API.SCANNER.SCAN_BY_VENUE(), onSucceed, onError)
      }, [loadScanByVenue])
    },
    scanSearchKeyword: {
      scanByKeyword,
      searchScanByKeyword: useCallback((body: any, onSucceed?: ResponseObjectType<Array<string>>) => {
        searchScanByKeyword(body, API.SCANNER.SCAN_SEARCH_KEY(), onSucceed)
      }, [searchScanByKeyword])
    }
  }
}

export const useScanTableConstructor = (equipmentTypeId: string, teamId: string, sessionId: string, status: string, filterName: string) => {
 
	const { manufacturersWithModels, getManufacturerWithModels } = useManufacturerWithModelContext();
  const {addBodyFilter} = useBodyFilterParams(filterName, {});
  const scanBodyFilter = useBodyFilterState(filterName);
  const [trigger, setTrigger] = useState<boolean>(true);
  const [enableFetch, setEnableFetch] = useState<boolean> (false);
  const [equipmentTypeChange, setEquipmentTypeChange] = useState(0);
  const [reset, setReset] = useState(false);
  const [trigger2, setTrigger2] = useState(0);
  useEffect(() => {
    if(equipmentTypeId) {
      getManufacturerWithModels?.(equipmentTypeId, () => {
        setEnableFetch(false);
        setTrigger2(prev => prev + 1);
      });
    }
  }, [equipmentTypeId, getManufacturerWithModels, equipmentTypeChange]);
  
  useEffect(() => {
    setTrigger(true);
  }, [manufacturersWithModels, trigger2]);
  
  useEffect(() => {
    if (trigger && !enableFetch && manufacturersWithModels && manufacturersWithModels?.length > 0) {
      const {modelIds, manufacturerIds} = buildManufacturersAndModelsByDefault(manufacturersWithModels);
      addBodyFilter({
        teamId: teamId,
        sessionId: sessionId,
        equipmentTypeId: [equipmentTypeId],
        deviceType: null,
        status: status,
      });
  
      if (!scanBodyFilter.manufacturerId || reset) {
        addBodyFilter({
          manufacturerId: manufacturerIds,
          equipmentModelId: modelIds,
          keyword: undefined,
          tag: undefined,
          deviceType: undefined
        })
      }
      setEnableFetch(true);
      setTrigger(false);
    }
  },[reset, addBodyFilter, enableFetch, equipmentTypeId, manufacturersWithModels, manufacturersWithModels?.length, scanBodyFilter.manufacturerId, sessionId, teamId, trigger, status]);
  
  return {
    manufacturersWithModels,
    scanBodyFilter,
    addBodyFilter,
    enableFetch,
    setEnableFetch,
    setEquipmentTypeChange,
    setReset
  }
}

export const useExtraCleatFunctions = () => {
  const { updateObject: updateExtraCleat } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT });
  return {
    updateExtraCleats: useCallback((sessionId: string, body: any, onSucceed?: any) => {
      updateExtraCleat(body, API.SCANNER.EXTRA_CLEAT(sessionId), onSucceed);
    }, [updateExtraCleat]),
  }
}