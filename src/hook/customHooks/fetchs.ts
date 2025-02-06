import React, { useCallback, useEffect, useState } from 'react';
import { CREATED, HTTP_METHODS, NEW, OK } from '../../constants/constants';
import { FetchStatus, useFetch } from './useFetch';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { useBodyFilterParams, useFilterParams } from './customHooks';
import { FilterState } from '../../store/types';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

interface Pagination {
  totalPages: number,
  number: number,
  numberOfElements: number,
  totalElements: number,
}

export type ResponseObjectType<T> = (res: T, httpResponse: OKObjectResponse<T>) => void;
export type ResponseListType<T> = (res: Array<T>, httpResponse: OKListResponse<T>) => void;

export const useTableFetch = <T>({
                                   type,
                                   url,
                                   paged,
                                   filterName,
                                   bodyDefault,
                                   filtersDefault,
                                   setPage,
                                   trigger,
                                   setTrigger,
                                   enableFetch
                                 }: {
  type: 'GET' | 'POST',
  url: string,
  paged?: boolean,
  filterName: string,
  bodyDefault?: object,
  filtersDefault?: FilterState,
  setPage?: Function,
  trigger?: boolean,
  setTrigger?: React.Dispatch<React.SetStateAction<boolean>>,
  enableFetch?: boolean,
}) => {
  
  const {get, post, response, status, setStatus} = useFetch<T>({_url: url});
  const [tableList, setTableList] = useState<Array<T>>([]);
  const [filterChanges, setFilterChanges] = useState<number>(0);
  const [checkReset, setCheckReset] = useState<boolean>(true);
  const [reset, setReset] = useState<boolean>(true);
  
  const [pagination, setPagination] = useState<Pagination>({
    number: 0,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 1
  });
  
  const {params, addFilter} = useFilterParams(filterName, filtersDefault);
  const {bodyFilter} = useBodyFilterParams(filterName, bodyDefault);
  
  useEffect(() => {
    setFilterChanges(prevState => prevState + 1);
  }, [bodyFilter, params]);
  
  useEffect(() => {
    if (filterChanges > 0) {
      if (!trigger) {
        if (paged) {
          addFilter({
            page: {
              params: ['0']
            }
          });
          if (setPage) {
            setPage(0);
          }
        }
        if (setTrigger && enableFetch) {
          setTrigger(true);
        }
        setCheckReset(true);
      } else {
        setCheckReset(false);
      }
    }
  }, [addFilter, enableFetch, setPage, setTrigger, trigger, filterChanges, paged]);
  
  useEffect(() => {
    if (filterChanges > 0 && trigger && enableFetch) {
      if (type === HTTP_METHODS.GET) {
        get(params, true).then(() => {
          setTrigger?.(false);
        });
      } else if (type === HTTP_METHODS.POST) {
        if (Object.keys(bodyFilter).length > 0) {
          post(params, bodyFilter, true).then(() => {
            setTrigger?.(false);
          });
        }
      }
      setFilterChanges(0);
      setReset(checkReset);
    }
  }, [type, post, get, params, bodyFilter, trigger, setTrigger, filterChanges, checkReset, enableFetch]);
  
  useEffect(() => {
    if (response && (response?.httpStatus === OK || response?.status === 200)) {
      if (paged) {
        const data: OkPagedListResponse<T> = (response as OkPagedListResponse<T>);
        setTableList(data.body.content);
        setPagination({
          totalPages: data.body.totalPages,
          number: data.body.number,
          totalElements: data.body.totalElements,
          numberOfElements: data.body.numberOfElements
        });
      } else {
        const data: OKListResponse<T> = (response as OKListResponse<T>);
        setTableList(data.body);
        setPagination({
          numberOfElements: data.body.length,
          number: 0,
          totalElements: data.body.length,
          totalPages: 1
        });
      }
    }
  }, [paged, response, status]);
  
  return {
    tableList,
    pagination,
    status,
    setStatus,
    reset,
    params
  };
};


export const useObjectCrudFetch = <T>({url, defaultValue, id}: { url: string, defaultValue: T, id: string }) => {
  
  const [value, setValue] = useState<T>(defaultValue);
  const {get, post, put, deleteRest, response, setHandleFetch, status} = useFetch<T>({_url: url});
  const [trigger,] = useState<number>(0);
  
  const handleFetch = useCallback((
    title: string,
    description: string, type: 'error' | 'success' | 'warning' | 'info' | undefined,
    setResponse?: React.Dispatch<React.SetStateAction<FetchResponse>>,
    onSucceed?: ResponseObjectType<T>,
    onError?: ResponseObjectType<T>
  ): FetchStatus<T> => {
    return {
      onSucceed: (res) => {
        setResponse && setResponse({
          title: title,
          type: type,
          description: description
        });
        if (onSucceed) {
          onSucceed((res as OKObjectResponse<T>).body, res as OKObjectResponse<T>);
        }
      },
      onFailure: (res) => {
        if (onError) {
          onError((res as OKObjectResponse<T>).body, res as OKObjectResponse<T>);
        }
      }
    };
  }, []);
  
  const loadObject = useCallback((id: string) => {
    get('', true, `/${id}`);
  }, [get]);
  
  const createObject = useCallback((
    body: T,
    setResponse?: React.Dispatch<React.SetStateAction<FetchResponse>>,
    onSucceed?: ResponseObjectType<T>
  ) => {
    setHandleFetch(handleFetch('Created', 'Created Successfully', 'success', setResponse, onSucceed));
    post('', body, true);
  }, [handleFetch, post, setHandleFetch]);
  
  const updateObject = useCallback((body: T, setResponse?: React.Dispatch<React.SetStateAction<FetchResponse>>, onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    setHandleFetch(handleFetch('Updated', 'Updated Successfully', 'success', setResponse, onSucceed, onError));
    put('', body, true);
  }, [handleFetch, put, setHandleFetch]);
  
  const deleteObject = useCallback((
    id: string,
    setResponse?: React.Dispatch<React.SetStateAction<FetchResponse>>,
    onSucceed?: (res: T) => void,
    onError?: (res: T, value: OKObjectResponse<T>) => void
  ) => {
    setHandleFetch(handleFetch('Deleted', 'Deleted Successfully', 'success', setResponse, onSucceed, onError));
    deleteRest('', true, `/${id}`);
  }, [deleteRest, handleFetch, setHandleFetch]);
  
  useEffect(() => {
    if (!!id) {
      if (id === NEW) {
        setValue(defaultValue);
      } else {
        loadObject(id);
      }
    }
  }, [defaultValue, id, loadObject, trigger]);
  
  useEffect(() => {
    if (response?.httpStatus === OK || response?.httpStatus === CREATED) {
      const data: OKObjectResponse<T> = response as OKObjectResponse<T>;
      setValue(data?.body);
    }
    setHandleFetch(undefined);
  }, [defaultValue, response, setHandleFetch]);
  
  return {
    value,
    loadObject,
    createObject,
    updateObject,
    deleteObject,
    status
  };
};

export const useListFetch = <T>({url}: { url: string }) => {
  
  const {get, response, setHandleFetch, status} = useFetch<T>({_url: url});
  const [values, setValues] = useState<Array<T>>([]);
  
  const loadList = useCallback((extraUrl?: string, onSucceed?: ResponseListType<T>, onError?: ResponseListType<T>) => {
    setHandleFetch({
      onSucceed: (res) => {
        if (onSucceed) {
          onSucceed((res as OKListResponse<T>).body, res as OKListResponse<T>);
        }
      },
      onFailure: (res) => {
        if (onError) {
          onError((res as OKListResponse<T>).body, res as OKListResponse<T>);
        }
      }
    });
    get('', true, extraUrl);
  }, [get, setHandleFetch]);
  
  useEffect(() => {
    if (response?.httpStatus === OK || response?.httpStatus === CREATED) {
      const data: OKListResponse<T> = response as OKListResponse<T>;
      setValues(data?.body);
    } else {
      setValues([]);
    }
  }, [response]);
  
  return {
    values,
    loadList,
    setValues,
    status
  };
};

export const useObjectFetch = <T = any>({url, defaultValue}: {
  url: string
  defaultValue: T
}) => {
  
  const {get, post, put, response, setHandleFetch, deleteRest} = useFetch<T>({_url: url});
  const [values, setValues] = useState<T>(defaultValue);
  
  const updateFetchHandler = useCallback((onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    setHandleFetch({
      onSucceed: (res) => {
        if (onSucceed) {
          onSucceed((res as OKObjectResponse<T>).body, res as OKObjectResponse<T>);
        }
      },
      onFailure: (res) => {
        if (onError) {
          onError((res as OKObjectResponse<T>)?.body, res as OKObjectResponse<T>);
        }
      }
    });
  }, [setHandleFetch]);
  
  const loadObject = useCallback((extraUrl?: string, onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    updateFetchHandler(onSucceed, onError);
    get('', true, extraUrl);
  }, [get, updateFetchHandler]);
  
  const updateObject = useCallback((body: T, extraUrl?: string, onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    updateFetchHandler(onSucceed, onError);
    post('', body, true, extraUrl);
  }, [post, updateFetchHandler]);

  const updatePutObject = useCallback((body: T, extraUrl?: string, onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    updateFetchHandler(onSucceed, onError);
    put('', body, true, extraUrl);
  }, [put, updateFetchHandler]);
  
  const deleteObject = useCallback((body: T, extraUrl?: string, onSucceed?: ResponseObjectType<T>, onError?: ResponseObjectType<T>) => {
    updateFetchHandler(onSucceed, onError);
    deleteRest('', true, extraUrl);
  }, [deleteRest, updateFetchHandler]);
  
  
  useEffect(() => {
    if (response?.httpStatus === OK || response?.httpStatus === CREATED) {
      const data: OKObjectResponse<T> = response as OKObjectResponse<T>;
      setValues(data?.body);
    } else {
      setValues(defaultValue);
    }
  }, [defaultValue, response, setHandleFetch]);
  
  return {
    values,
    loadObject,
    updateObject,
    updatePutObject,
    setValues,
    deleteObject
  };
};