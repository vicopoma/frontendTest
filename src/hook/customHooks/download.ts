import { ResponseObjectType, useObjectFetch } from './fetchs';
import { API } from '../../settings/server.config';
import { DEFAULT_DOWNLOAD, DEFAULT_DOWNLOAD_SEASON_WEEK, DownloadType, DownloadSeasonWeekType, DownloadBodyType, DownloadBodySeasonWeekType } from '../../Types/Types';
import { useCallback } from 'react';
import { EMPTY_OBJECT } from '../../constants/constants';


const url = API.DOWNLOAD.BASE();

export const useDownloadFunctions = () => {
  const {updateObject: downloadAllScans} = useObjectFetch<DownloadType>({url, defaultValue: DEFAULT_DOWNLOAD});
  const {updateObject: downloadAllScansBySeasonWeek} = useObjectFetch<DownloadSeasonWeekType>({url, defaultValue: DEFAULT_DOWNLOAD_SEASON_WEEK});
  const {updateObject: downloadAllScansByVenue} = useObjectFetch({url, defaultValue: EMPTY_OBJECT});
  const {updateObject: downloadAllScansByTeam} = useObjectFetch({url, defaultValue: EMPTY_OBJECT});
  const {updateObject: downloadDetailedScanDistribution} = useObjectFetch({url, defaultValue: EMPTY_OBJECT});
  const {updateObject: downloadTagHistory} = useObjectFetch({url, defaultValue: EMPTY_OBJECT});
  const {updateObject: downloadUserList} = useObjectFetch({url, defaultValue: EMPTY_OBJECT});
  
  return {
    downloadAllScans: useCallback(({ date, activityType, typeTeam, teams, keys, operator }: DownloadBodyType, onSucceed?: ResponseObjectType<DownloadType>, onError?: ResponseObjectType<DownloadType>) => {
      const body = {type: activityType, date: date, typeTeam: typeTeam, teams: teams, keys: keys || [], operator};
      downloadAllScans(body, API.DOWNLOAD.ALL_SCANS(), onSucceed, onError);
    }, [downloadAllScans]),
    downloadAllScansBySeasonWeek: useCallback(({ season, activityType, typeTeam, teams, keys, operator }: DownloadBodySeasonWeekType, onSucceed?: ResponseObjectType<DownloadSeasonWeekType>, onError?: ResponseObjectType<DownloadSeasonWeekType>) => {
      const body = {type: activityType, season: season, typeTeam: typeTeam, teams: teams, keys: keys || [], operator};
      downloadAllScansBySeasonWeek(body, API.DOWNLOAD.ALL_SCANS(), onSucceed, onError);
    }, [downloadAllScansBySeasonWeek]),
    downloadAllScansByVenue: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
      downloadAllScansByVenue(body, API.DOWNLOAD.SCANS_BY_VENUE(), onSucceed);
    },[downloadAllScansByVenue]),
    downloadAllScansByTeam: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
      downloadAllScansByTeam(body, API.DOWNLOAD.SCANS_BY_TEAM(), onSucceed);
    },[downloadAllScansByTeam]),
    downloadDetailedScanDistribution: useCallback((_body: any, type: string, onSucceed?: ResponseObjectType<any>) => {
      const body = {
        ..._body,
        sectionType: type,
      }
      downloadDetailedScanDistribution(body, API.DOWNLOAD.DETAILED_SCAN_DISTRIBUTION(), onSucceed);
    },[downloadDetailedScanDistribution]),
    downloadTagHistory: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
      downloadTagHistory(body, API.DOWNLOAD.TAG_HISTORY_REPORT(), onSucceed);
    },[downloadTagHistory]),
    downloadUserList: useCallback((body: any, params: string, onSucceed?: ResponseObjectType<any>) => {
      downloadUserList(body, API.DOWNLOAD.USER_LIST(params), onSucceed);
    },[downloadUserList]),
  };
};