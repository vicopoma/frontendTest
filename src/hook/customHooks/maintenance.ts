import { useObjectFetch } from './fetchs';
import { API } from '../../settings/server.config';
import { EMPTY_ARRAY } from '../../constants/constants';
import { useCallback } from 'react';

const url = API.MAINTENANCE.BASE();
export const useMaintenanceHooks = () => {
  const { values: maintenanceLogList , loadObject: getMaintenanceLogList} = useObjectFetch<Array<string>>({url, defaultValue: EMPTY_ARRAY})
  
  return {
    maintenanceLogList: {
      getMaintenanceLogList: useCallback(() => {
        getMaintenanceLogList(API.MAINTENANCE.LIST_LOG_FILES())
      }, [getMaintenanceLogList]),
      maintenanceLogList
    }
  }
}