import { useCallback, useEffect, useState } from 'react';
import { FETCH_STATUS, HTTP_METHODS } from '../../constants/constants';
import { OKListResponse, OKObjectResponse, OkPagedListResponse } from '../../settings/Backend/Responses';
import { findErrorType, getToken, JSONOptions } from '../../settings/httpClients';

export type ResponseType<T> = OKListResponse<T> | OkPagedListResponse<T> | OKObjectResponse<T>;

export type FetchStatus<T> = {
  onSucceed: (res?: ResponseType<T>) => void,
  onFailure: (res?: ResponseType<T>) => void,
}

export const useFetch = <T>({_url}: {
  _url: string,
}) => {
  
  const [response, setResponse] = useState<ResponseType<T>>();
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NONE);
  const [requestInit, setRequestInit] = useState<RequestInit>();
  const [trigger, setTrigger] = useState<number>(0);
  const [url, setUrl] = useState<string>(_url);
  const [params, setParams] = useState<string>('');
  const [extraUrls, setExtraUrls] = useState<string>('');
  const [handleFetch, setHandleFetch] = useState<FetchStatus<T>>();
  
  useEffect(() => {
    setUrl(_url);
  }, [_url]);
  
  useEffect(() => {
    if (!trigger) {
      return;
    }
    setStatus(FETCH_STATUS.LOADING);
    const completeUrl = url + extraUrls + params;
    fetch(completeUrl, requestInit)
    .then(async (res) => {
      const data: ResponseType<T> = await res.json();
      if (data.status >= 400) {
        findErrorType({status: data.status, message: data.message, httpStatus: '', body: {}})
        if (handleFetch?.onFailure) {
          handleFetch.onFailure(data);
        }
        setStatus(FETCH_STATUS.FAILED);
      } else {
        if (handleFetch?.onSucceed) {
          handleFetch.onSucceed(data);
        }
        setStatus(FETCH_STATUS.FINISHED);
      }
      setResponse(data);
      setTrigger(0);
    })
    .catch((err) => {
      setStatus(FETCH_STATUS.FAILED);
      setTrigger(0);
    });
  }, [url, requestInit, trigger, params, extraUrls, handleFetch]);
  
  const callTrigger = useCallback((params: string, body?: T, method?: string, auth?: boolean, extraUrl?: string) => {
    const options: RequestInit = {
      headers: JSONOptions(false, auth ? getToken() : undefined),
      method: method,
    };
    if (!!body) {
      options.body = JSON.stringify(body);
    }
    setParams(params);
    setRequestInit(options);
    setExtraUrls(!!extraUrl ? extraUrl : '');
    setTrigger(prevState => prevState + 1);
  }, []);
  
  const get = useCallback(async (params: string, auth?: boolean, extraUrl?: string) => {
    await callTrigger(params, undefined, HTTP_METHODS.GET, auth, extraUrl);
  }, [callTrigger]);
  
  const post = useCallback(async (params: string, body: T, auth?: boolean, extraUrl?: string) => {
    await callTrigger(params, body, HTTP_METHODS.POST, auth, extraUrl);
  }, [callTrigger]);
  
  const put = useCallback(async (params: string, body: T, auth?: boolean, extraUrl?: string) => {
    await callTrigger(params, body, HTTP_METHODS.PUT, auth, extraUrl);
  }, [callTrigger]);
  
  const deleteRest = useCallback(async (params: string, auth?: boolean, extraUrl?: string) => {
    await callTrigger(params, undefined, HTTP_METHODS.DELETE, auth, extraUrl);
  }, [callTrigger]);
  
  return {get, post, put, deleteRest, response, status, setStatus, setHandleFetch};
};