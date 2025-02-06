import { useCallback } from "react";
import { EMPTY_ARRAY, EMPTY_OBJECT } from "../../constants/constants";
import { API } from "../../settings/server.config";
import { useLoaderDispatch } from "../hooks/loader";
import { ResponseObjectType, useObjectFetch } from "./fetchs"

const url = API.SEARCH.BASE();

export const useSearchFunctions = ({view, id}: {view: string, id?:string}) => {
  const { showLoader } = useLoaderDispatch();
  const { values: savedFilterList, loadObject: loadSavedFilterList } = useObjectFetch<any[]>({ url, defaultValue: EMPTY_ARRAY });
  const { values: filter, updateObject: saveFilter, updatePutObject: updateFilter, deleteObject: deleteFilter } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT})
  return {
    savedFilterList: {
      savedFilterList,
      loadSavedFilterList: useCallback((nameView?: string, onSucceed?: ResponseObjectType<Array<string>>) => {
        loadSavedFilterList(API.SEARCH.SAVED_LIST(nameView ? nameView : view), onSucceed)
      }, [loadSavedFilterList, view]),
    },
    filterItem: {
      filter,
      saveFilter: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
        showLoader(true);
        saveFilter(body, '', (res, httpResponse) => {
          onSucceed?.(res, httpResponse)
          showLoader(false);
        }, () => {
          showLoader(false);
        })
      }, [saveFilter, showLoader]),
      updateFilter: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
        showLoader(true);
        updateFilter(body, '', (res, httpResponse) => {
          onSucceed?.(res, httpResponse)
          showLoader(false);
        }, () => {
          showLoader(false);
        })
      }, [updateFilter, showLoader]),
      deleteFilter: useCallback((id: string, onSucceed?: any) => {
        showLoader(true);
        deleteFilter({}, `/${id}`, (res, httpResponse) => {
          onSucceed?.(res, httpResponse)
          showLoader(false);
        }, () => {
          showLoader(false);
        });
      }, [deleteFilter, showLoader]),
    }
  }
}