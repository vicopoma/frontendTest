import {
  ActivityState,
  EquipmentInformation,
  EquipmentModelVM,
  FilterState,
  ManufacturerWithModels
} from '../store/types';
import { OKObjectResponse, OkPagedListResponse } from '../settings/Backend/Responses';
import { API } from '../settings/server.config';
import { findErrorType, getRequest, getToken } from '../settings/httpClients';
import { ErrorMessage } from '../components/Shared/Messages/Messages';
import {
  ACCOUNT_ROLES,
  EQUIPMENT_TYPE_SETTER,
  EquipmentTypesType,
  HTTP_METHODS,
  pageSize,
  ROLE_HIERARCHY, SESSION_STORAGE,
  VALID_TAG_PREFIXES,
  IMPORT_STATUS,
} from '../constants/constants';
import { asciiToHex } from './ConvertUtils';
import moment, { unitOfTime } from 'moment';

const pako = require('pako');
export const coincidenceBetween = (firstElements: string[], secondElements: string[]) => {
  const checker = firstElements.filter(element => {
    const verify = secondElements.filter(value => value === element);
    return verify.length !== 0;
  });
  return checker.length !== 0;
};

export const paramBuilder = (params: FilterState) => {
  if (!params) {
    return '';
  }
  const param = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key]?.params?.length > 0 && !!params[key]?.params[0]) {
      param.set(key, params[key].params?.toString());
    }
  });
  let res = param.toString();
  if (!!res) res = '?' + res;
  return res;
};

export const unZipBase64String = (base64: string) => {
  const binary_string = atob(base64);
  const len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  const binData = new Uint8Array(bytes);
  const data = pako.inflate(binData);
  const strData = _arrayBufferToBase64(data);
  return btoa(strData);
};

const _arrayBufferToBase64 = (buffer: any) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return atob(btoa(binary));
};

export const enumList = (data: OkPagedListResponse<any>) => {
  return data.body?.content.map((obj, index) => {
    return {
      ...obj,
      index: data?.body?.number * +pageSize + index + 1
    };
  });
};

export const mergeLists = (list: Array<any>, currentList: Array<any>, type: number, page?: number) => {
  let newList: Array<any> = [];
  if (type === 1) {
    if (list.length >= +pageSize) {
      for (let i = list.length - 1; i >= Math.max(0, list.length - +pageSize); --i) {
        newList.push(list[i]);
      }
      newList.reverse();
    } else {
      newList = [...list];
    }
    newList = page === 0 ? currentList : [...newList, ...currentList];
  } else if (type === 0) {
    if (list.length >= +pageSize) {
      for (let i = 0; i < Math.min(list.length, +pageSize); i++) {
        newList.push(list[i]);
      }
    } else {
      newList = [...list];
    }
    newList = page === 0 ? currentList : [...currentList, ...newList];
  } else {
    newList = [...currentList];
  }
  return newList;
};

export const fileDownloader = (data: any, filename: string, type: any) => {
  const file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    const a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
};

export const getPlayersEquipmentData = async (params: string) => {
  const data: OKObjectResponse<string> = await getRequest(API.PLAYER.PLAYER_EQUIPMENT_EXPORT() + (params ? params : ''), getToken());
  if (data?.httpStatus) {
    return data?.body;
  } else {
    ErrorMessage({description: 'It cannot be downloaded'});
  }
  return '';
};

export const toPrint = (sentence: string) => {
  const words = sentence.split(' ');
  const newWord = words.map(word => {
    return word.toLowerCase().charAt(0).toUpperCase() + word.slice(1);
  });
  return newWord.join(' ');
};

export const roleCanModify = (accountRole: string, minNeededRole: string) => {
  return ROLE_HIERARCHY[accountRole as ACCOUNT_ROLES] >= ROLE_HIERARCHY[minNeededRole as ACCOUNT_ROLES];
};

export const isOemRole = (accountRole: string) => {
  return accountRole === ACCOUNT_ROLES.OEM_ADMIN || accountRole === ACCOUNT_ROLES.OEM_TEAM_USER;
};

export const verifyScannerInput = (message: string) => {
  const data = message.split('|-|');
  if (data[1]?.trim() === 'EPC') {
    const msg = data[0];
    let zero = msg.length - 1;
    let countZeros = 0;
    while (zero >= 0 && msg.charAt(zero) === '0') {
      zero--;
      countZeros++;
    }
    zero++;
    zero += countZeros & 1;
    return msg.substring(0, zero);
  } else {
    return asciiToHex(data[0]).toUpperCase();
  }
};

export const utcToLocal = (dateString: string, format: string) => {
  return moment(dateString, format).local();
};

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const downloadCsv = async (fileName: string, url: string, method: 'POST' | 'GET', body?: object, contentType?: string, callback?: Function) => {
  const headers = () => {
    let headers = new Headers();
    headers.append('Content-Type', contentType ? contentType : 'application/octet-stream');
    headers.append('Authorization', 'Bearer ' + getToken());
    return headers;
  };
  let file = '';
  let status = 0;
  fetch(url, {
    method: method,
    headers: headers(),
    body: method === HTTP_METHODS.POST ? JSON.stringify(body) : undefined
  }).then((res: any) => {
    status = res.status;
    file = res.headers.get('content-disposition') || '';
    return res.status >= 400 ? res.json() : res.blob();
  }).then(test => {
    if(status < 400) {
      const url = URL.createObjectURL(test);
      const a = document.createElement('a');
      a.href = url;
      a.download = !!fileName ? fileName : file;
      document.body.append(a);
      a.click();
      a.remove();
    } else {
      findErrorType(test);
    }
  }).then(() => {
	  if (callback) {
		  callback();
	  }
  }).catch((e) => {
    console.error(e);
  });
};

export const generateModelWithModelYear = (models: EquipmentModelVM[]) => {
  const modelMap = new Map<string, EquipmentModelVM[]>();
  models.forEach(element => {
    if (!modelMap.get(element.nameModel.toLowerCase())) {
      modelMap.set(element.nameModel.toLowerCase(), [] as EquipmentModelVM[]);
    }
    const modelList = modelMap.get(element.nameModel.toLowerCase());
    if (!!modelList) {
      modelList.push(element);
      modelMap.set(element.nameModel.toLowerCase(), modelList);
    }
  });
  let newList: {
    [key: string]: {
      id: string,
      value: string,
      models: EquipmentModelVM[]
    }
  } = {};
  modelMap.forEach((value, key) => {
    const newValue: {
      id: string,
      value: string,
      models: EquipmentModelVM[]
    } = {
      id: key,
      value: key,
      models: value
    };
    newList = {...newList, [key.toLowerCase()]: newValue};
  });
  
  return newList;
};

export const typeOfMobile = (userAgent: string, type: string) => {
  return userAgent.includes(type);
};

export const buildManufacturersAndModelsByDefault = (manufacturersWithModels: Array<ManufacturerWithModels>) => {
  const manufacturerIds: Array<string> = [];
  const modelIds: Array<string> = [];
  for (let manufacturer of manufacturersWithModels) {
    manufacturerIds.push(manufacturer.id);
    for (let model of manufacturer.models) {
      modelIds.push(model.id);
    }
  }
  return {manufacturerIds, modelIds};
};

export const clearStorageByKey = (sessionKeys?: Array<string>) => {
  if (sessionKeys && sessionKeys?.length > 0) {
    for (let keys of Object.keys(sessionStorage)) {
      if (sessionKeys?.includes(keys, 0)) {
        sessionStorage.removeItem(keys);
      }
    }
  } else {
    sessionStorage.clear();
  }
};

export const clearLocalStorageByKey = (localKeys?: Array<string>) => {
  if (localKeys && localKeys?.length > 0) {
    for (let keys of Object.keys(localStorage)) {
      if (localKeys?.includes(keys, 0)) {
        localStorage.removeItem(keys);
      }
    }
  } else {
    localStorage.clear();
  }
};

export const paramsToObject = (entries: any) => {
  const result: any = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

export const isRunning = (b: Partial<ActivityState>) => {
  const starDate: moment.Moment = moment.utc(b.startGameDate);
  const endDate: moment.Moment = moment.utc(b.endGameDate);
  const today = moment();
  return moment(starDate).local().toDate() <= moment(today).local().toDate() && moment(endDate).local().toDate() >= moment(today).local().toDate();
  
};

export const isFuture = (b: Partial<ActivityState>) => {
  const starDate: moment.Moment = moment.utc(b.startGameDate);
  const today = moment();
  return moment(starDate).local().toDate() > moment(today).local().toDate();
};

export const isInAllowedTime = (initialDate: string, timeConditionInHours: number) => {
  const then = moment(initialDate).local();
  const now = moment().local();
  const dif: number = now.diff(then, 'hours')
  return dif <= timeConditionInHours;
};

export const isInAllowedTimeStartOf = (initialDate: string, timeConditionInHours: number, startOf: string) => {
  const then = moment(initialDate).local().startOf(startOf as any);
  const now = moment().local();
  const dif: number = now.diff(then, 'hours')
  return dif <= timeConditionInHours;
};

export const sortObject = <T, Key extends keyof T>(items: Array<T>, columnName: Key) => {
  items.sort((itemA, itemB) => {
    if (itemA[columnName] > itemB[columnName]) {
      return 1;
    }
    if (itemA[columnName] < itemB[columnName]) {
      return -1;
    }
    return 0;
  });
  return items;
};

export const tagValidator = (tag: string, validTag?: boolean) => {
  if (validTag) return validTag;
  for (const prefix of VALID_TAG_PREFIXES) {
    if (tag.startsWith(prefix)) {
      return true;
    }
  }
  return false;
};

export const cleanEquipmentAssigned = (equipmentListA: EquipmentInformation[], equipmentListB: EquipmentInformation[], teamId: string) => {
  const equipmentList: EquipmentInformation[] = [];
  if (!equipmentListB || !equipmentListB.length) {
    equipmentListA.forEach(equipment => {
      if (teamId === equipment.teamId) {
        equipmentList.push(equipment);
      }
    });
  } else {
    equipmentListA.forEach(equipment => {
      const existEquipment = equipmentListB.filter(equipmentB => equipmentB.id === equipment.id);
      if (!existEquipment.length && teamId === equipment.teamId) {
        equipmentList.push(equipment);
      }
    });
  }
  return equipmentList;
};

export const generateEquipmentTypeName = (name: EquipmentTypesType) => {
  if(name) {
    const equipmentTypeName = EQUIPMENT_TYPE_SETTER?.[name]?.display;
    if (equipmentTypeName !== undefined) {
      return equipmentTypeName;
    }
  }
  return name;
};

export const lower_bound = (lowerBound: number , higherBound: number, func: (middle: number) => boolean) => {
  let low: any = lowerBound;
  let high: any = higherBound;
  while(high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if(func(mid)) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return {low, high}
}

export const progressBarSessionStorageHandler = (code: string, key?: string) => {
  const values: Array<string> = JSON.parse(localStorage.getItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD) || '[]');
  if(!values.includes(code)) {
    const valuesUpdated = [...values, { code: code, key: key }];
    const valuesToString = JSON.stringify(valuesUpdated);
    localStorage.setItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD, valuesToString);
  }
}

export const bytesToString = (bytes: number) => {
  if(!bytes) return '';
  else if(bytes === 0) return '0 B';
  const byteUnits = [' B', ' KiB', ' MiB', ' GiB', ' TiB', ' PiB', ' EiB', ' ZiB', ' YiB'];
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, e)).toFixed(2)} ${byteUnits[e]}`;
};

export const formatHeight = (height: string) => {
  const data = (height + '').split('\'');
  const feet = data[0].length > 0 ? data[0] : 0;
  const inch = data[1] ? data[1].split('"')[0] : 0;
  return `${feet} Feet, ${inch} Inch`;
}

export const isDiffTimeOk = (initialDate: string, endDate: string, timeConditionInHours: number) => {
  const initD = moment(initialDate);
  const endD = moment(endDate);
  const dif: number = endD.diff(initD, 'hours');
  return dif <= timeConditionInHours;
};

export const isBoolean = (value: any) => {
  return typeof(value) === 'boolean';
}

export const debounce = (callback: Function, delay: number) => {
  let timeoutID: NodeJS.Timeout;
  return function debouncedFn(...args: any) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      callback(...args);
    }, delay);
  }
}

export const statusImportColor = (message: string) => {
  if (message === IMPORT_STATUS.SUCCESS) {
    return 'green';
  } else if (message === IMPORT_STATUS.ERROR) {
    return 'red';
  } 
  return 'orange';
}

export const imageToBase64 = (file: any) => {
  return new Promise(resolve => {
    let baseURL = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result as string;
      resolve(baseURL);
    };
  });
}

export const dateToString = (date: string, dateFormat: string) => {
  if (!!date) {
    return moment(date).local().format(dateFormat);
  } else {
    return '';
  }
}