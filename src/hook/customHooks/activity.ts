import { useCallback } from "react";
import { EMPTY_ARRAY } from "../../constants/constants";
import { API } from "../../settings/server.config";
import { ResponseObjectType, useObjectFetch } from "./fetchs";

const url = API.SCHEDULE.BASE();

export const useActivityList = () => {
  const {updateObject: getActivityKeys, values: activityKeys} = useObjectFetch<Array<string>>({url, defaultValue: EMPTY_ARRAY});

  return {
    activityKeyList: {
      activityKeys,
      getActivityKeys: useCallback((body: any, onSucceed?: ResponseObjectType<Array<string>>) => {
        getActivityKeys(body, API.SCHEDULE.SEARCH_KEYS(), onSucceed)
      }, [getActivityKeys]),
    },
  };
};

