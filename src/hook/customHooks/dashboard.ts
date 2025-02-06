import { useCallback } from "react";
import { API } from "../../settings/server.config";
import { DashboardState, DEFAULT_DASHBOARD } from "../../store/types/dashboard";
import { useObjectFetch } from "./fetchs";




export const useDashboardFunction = () => {
  const url = API.EQUIPMENT.DASHBOARD_INFORMATION();
  const {
    values, 
    loadObject
  } = useObjectFetch<DashboardState>({
    url,
    defaultValue: DEFAULT_DASHBOARD
  });
  
  return {
    values,
    getDashboardInformation: useCallback((equipmentTypeId: string) => {
      loadObject("?equipmentTypeId=" + equipmentTypeId);
    }, [loadObject]),
  };
};