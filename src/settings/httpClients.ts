import { DELETE, GET, POST, PUT, TOKEN } from '../constants/constants';
import { OKListResponse, OKObjectResponse, OkPagedListResponse, RESPONSE_CODES } from './Backend/Responses';
import { ROUTES } from './routes';
import { ErrorMessage, SuccessMessage, WarningMessage } from '../components/Shared/Messages/Messages';
import { FetchResponse } from '../components/Shared/Drawer/Drawer';
import { history } from '../store/reducers';
import moment from 'moment';

export const JSONOptions = (isFormData: boolean, token?: string) => {
  let headers = new Headers();
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }
  headers.append('Time-zone-Offset', (moment().utcOffset() / 60).toString());
  return headers;
};

export const getToken = () => {
  const localStorageToken = (localStorage?.getItem(TOKEN) ? ('' + localStorage?.getItem(TOKEN)) : '');
  return sessionStorage?.getItem(TOKEN) ? ('' + sessionStorage?.getItem(TOKEN)) : localStorageToken;
};

const method = (url: string, method: string, body: any, isFormData: boolean, token?: string) => {
  const options: { method: string, headers: Headers, body?: string } = {
    method,
    headers: JSONOptions(isFormData, token)
  };
  if (!isFormData) {
    if (Object.keys(body).length) {
      options.body = JSON.stringify(body);
    }
  } else {
    options.body = body;
  }
  return fetch(url, options)
  .then(response => {
    return response.json();
  })
  .then(dataResponse => {
    findErrorType({status: dataResponse.status, message: dataResponse.message, httpStatus: '', body: {}});
    return dataResponse;
  })
  .catch(err => {
    return {
      status: 500,
      message: RESPONSE_CODES.W104
    };
  });
};


// add 20x
export const warningAndErrorMessages = (data: any) => {
  if (data?.status === 200) {
    SuccessMessage({description: 'Removed Successful'});
  }
  if (data?.status === 201) {
    SuccessMessage({description: 'Removed successful'});
  }
  if (data?.status === 400) {
    WarningMessage({description: data.message.length > 40 ? 'Error 400' : data.message.length});
  }
  if (data?.status === 401) {
    WarningMessage({description: 'The register cannot delete, it is unauthorized !'});
  }
  if (data?.status === 403) {
    WarningMessage({description: 'The register cannot delete, it is forbidden !'});
  }
  if (data?.status === 409) {
    WarningMessage({description: data.message});
  }
  if (data?.status === 500) {
    ErrorMessage({description: 'An error has occurred'});
  }
};
export const warningAndError = (data: any, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  if (data?.status === 403) {
    setResponse({
      title: 'Warning',
      type: 'warning',
      description: 'The register cannot save, it is forbidden !'
    });
  } else {
    if (data?.status === 400) {
      setResponse({
        title: 'Warning',
        type: 'warning',
        description: 'The register cannot save, it has problems !'
      });
    } else {
      if (data?.status === 409) {
        setResponse({
          title: 'Warning',
          type: 'warning',
          description: data.message
        });
      } else {
        setResponse({
          title: 'Error',
          type: 'error',
          description: 'An error has occurred'
        });
      }
    }
  }
};

export const findErrorType = (res: OKObjectResponse<any> | OKListResponse<any> | OkPagedListResponse<any>) => {
  if(400 <= res?.status && res?.status < 500) {
    WarningMessage({ description: res?.message || ' '});
    if(res?.status === 401) {
      history.push(ROUTES.LOGIN.PAGE());
      logout();
    }
  } else if(res?.status >= 500) {
    if(res?.message === 'Invalid input type') {
      WarningMessage({ description: res?.message || ' '});
    } else {
      ErrorMessage({ description: res?.message || ' '});
    }
    
  }
};

export const getRequest = (url: string, token?: string) => method(url, GET, {}, false, token);
export const postRequest = (url: string, body: any, token?: string) => method(url, POST, body, false, token);
export const putRequest = (url: string, body: any, token?: string) => method(url, PUT, body, false, token);
export const deleteRequest = (url: string, token?: string) => method(url, DELETE, {}, false, token);
export const postFormData = (url: string, body: any, token?: string) => method(url, POST, body, true, token);

export const logout = () => {
  localStorage.removeItem(TOKEN);
  sessionStorage.removeItem(TOKEN);
  sessionStorage.clear();
};
