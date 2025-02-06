import { useCallback } from "react";
import { EMPTY_OBJECT } from "../../constants/constants";
import { API } from "../../settings/server.config";
import { ResponseObjectType, useObjectFetch } from "./fetchs";

const url = API.SITE.SITES();

export const useSiteList = () => {
  const {loadObject: getSites, values} = useObjectFetch<any>({url, defaultValue: EMPTY_OBJECT});
  return {
    siteList: {
      sites: values?.content ?? [],
      getSites: useCallback((onSucceed?: ResponseObjectType<any>) => {
        getSites('?sort=name%2Casc&size=100', onSucceed);
      }, [getSites]),
    }
  }
};