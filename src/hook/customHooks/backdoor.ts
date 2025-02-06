import { useCallback } from "react";
import { EMPTY_ARRAY, EMPTY_OBJECT } from "../../constants/constants"
import { API } from "../../settings/server.config";
import { useListFetch, useObjectCrudFetch, useObjectFetch } from "./fetchs";
import moment from "moment";

const url = API.PARTITION.BASE();

export const usePartitionFunctions = () => {
  const { updateObject: partitionOperation } = useObjectFetch({ url, defaultValue: EMPTY_OBJECT});
  return {
    forceArchive: useCallback((week: string, year: string, onSucceed?: any, onError?: any) => {
      const body = { week, year };
      partitionOperation(body, API.PARTITION.FORCE_ARCHIVE(), onSucceed, onError);
    }, [partitionOperation]),
    forceRestore: useCallback((week: string, year: string, onSucceed?: any, onError?: any) => {
      const body = { week, year };
      partitionOperation(body, API.PARTITION.FORCE_RESTORE(), onSucceed, onError);
    }, [partitionOperation]),
  }
}

const urlSeason = API.SEASON.BASE();

export interface SeasonBackTool {
  active: boolean,
  createBy: string, 
  endDate: string, 
  id: string, 
  season: number,
  startDate: string,
}

const DEFAULT_SEASON_BACKTOOL: SeasonBackTool = {
  active: true,
  createBy: '', 
  endDate: '', 
  id: '', 
  season: moment().year(),
  startDate: '',
}

export const useSeasonFunctions = (id: string) => {
  const { 
    value: season,
    createObject: createSeason, 
    loadObject: loadSeason, 
    updateObject: updateSeason 
  } = useObjectCrudFetch<SeasonBackTool>({ url: urlSeason, defaultValue: DEFAULT_SEASON_BACKTOOL, id });
  return {
    season,
    createSeason: useCallback((values, onSucceed) => {
      const body = values;
      createSeason(body, undefined, onSucceed);
    }, [createSeason]),
    loadSeason: useCallback(() => {
      loadSeason(id);
    }, [loadSeason, id]),
    updateSeason: useCallback((values, onSucceed) => {
      const body = values;
      updateSeason(body, undefined, onSucceed);
    }, [updateSeason]),
  }
}

const urlRawBlink = API.RAW_BLINK.BASE();

export const useRawBlinkSyncFunctions = () => {
  const {
    loadObject: synchronize,
  } = useObjectFetch({ url: urlRawBlink, defaultValue: EMPTY_OBJECT});

  return {
    synchronize: useCallback((startDate: string, endDate: string, onSucceed: any) => {
      synchronize(API.RAW_BLINK.SYNCHRONIZE(startDate, endDate), onSucceed);
    }, [synchronize]),
  }
}

export interface HealthDevice {
  antennas: number, 
  errors: number,
  rebootings: number,
  siteName: string,
  stoppeds: number,
  warnings: number,
}

const urlHealthDevice = API.SCANNER.SCANNER_DEVICE_SEARCH();

export const useHealthDeviceFunctions = () => {
  const {
    values: healthDeviceList,
    loadObject: loadHealthDeviceList,
  } = useObjectFetch<Array<HealthDevice> >({ url: urlHealthDevice, defaultValue: EMPTY_ARRAY });
  const {
    values: healthDeviceStatus,
    loadObject: loadHealthDeviceStatus,
  } = useObjectFetch<any>({ url: urlHealthDevice, defaultValue: EMPTY_ARRAY });
  return {
    healthDeviceList,
    loadHealthDeviceList: useCallback((startDate: string, endDate: string, onSucceed?: any, onError?: any) => {
      loadHealthDeviceList(API.SCANNER.DEVICE_REPORT(startDate, endDate), onSucceed, onError);
    }, [loadHealthDeviceList]),
    healthDeviceStatus,
    loadHealthDeviceStatus: useCallback((startDate: string, endDate: string, siteName: string, interval: number, onSucceed?: any, onError?: any) => {
      loadHealthDeviceStatus(API.SCANNER.DEVICE_REPORT_BY_SITE(startDate, endDate, siteName, interval), onSucceed, onError);
    }, [loadHealthDeviceStatus]),
  }
}

const urlMessageAlert = API.MESSAGE_ALERT.BASE();

export interface MessageAlertBackTool {
  description: string,
  endDate: string,
  id: string,
  roleList: { roleId: string }[],
  startDate: string,
  title: string,
}

const DEFAULT_MESSAGE_ALERT_BACKTOOL: MessageAlertBackTool = {
  description: '',
  endDate: '',
  id: '',
  roleList: [],
  startDate: '',
  title: '',
}

export const useMessageAlertFunctions = (id: string) => {
  const { 
    value: messageAlert,
    createObject: createMessageAlert, 
    loadObject: loadMessageAlert, 
    updateObject: updateMessageAlert, 
  } = useObjectCrudFetch<MessageAlertBackTool>({ url: urlMessageAlert, defaultValue: DEFAULT_MESSAGE_ALERT_BACKTOOL, id });
  return {
    messageAlert,
    createMessageAlert: useCallback((values, onSucceed) => {
      const body = values;
      createMessageAlert(body, undefined, onSucceed);
    }, [createMessageAlert]),
    loadMessageAlert: useCallback(() => {
      loadMessageAlert(id);
    }, [loadMessageAlert, id]),
    updateMessageAlert: useCallback((values, onSucceed) => {
      const body = values;
      updateMessageAlert(body, undefined, onSucceed);
    }, [updateMessageAlert]),
  }
}

export const useMessageAlertList = () => {
  const { 
    values: messageAlertList,
    loadObject: loadMessageAlertList, 
  } = useObjectFetch<MessageAlertBackTool[]>({ url: urlMessageAlert, defaultValue: EMPTY_ARRAY });
  const { 
    loadObject: dismissMessageAlert, 
  } = useObjectFetch<MessageAlertBackTool[]>({ url: urlMessageAlert, defaultValue: EMPTY_ARRAY });
  return {
    messageAlertList,
    loadMessageAlertList: useCallback((userId: string) => {
      loadMessageAlertList(API.MESSAGE_ALERT.USER(userId));
    }, [loadMessageAlertList]),
    dismissMessageAlert: useCallback((userId: string, notificationId: string, onSucceed?: any) => {
      dismissMessageAlert(API.MESSAGE_ALERT.DISMISS(userId, notificationId), onSucceed);
    }, [dismissMessageAlert]),
  }
}

const urlEquipmentTemplate = API.EQUIPMENT_TEMPLATE.BASE();

export interface EqTemplateModel {
  equipmentModelCode: string,
  equipmentModelName: string,
  manufacturerName: string
}

export interface EquipmentTemplate {
  components: { [key: string]: string },
  equipmentModelRelatedList: Array<EqTemplateModel>,
  id: string, 
  img: any,
  name: string
}

const DEFAULT_EQUIPMENT_TEMPLATE_BACKTOOL: EquipmentTemplate = {
  components: {},
  equipmentModelRelatedList: [],
  id: '',
  img: undefined,
  name: '',
}

export const useEquipmentTemplateList = () => {
  const { 
    values: equipmentTemplateList,
    loadList: loadEquipmentTemplateList, 
  } = useListFetch<EquipmentTemplate>({ url: urlEquipmentTemplate });
  return {
    equipmentTemplateList,
    loadEquipmentTemplateList: useCallback((onSucceed?: any) => {
      loadEquipmentTemplateList('', onSucceed);
    }, [loadEquipmentTemplateList]),
  }
}

export const useEquipmentTemplate = (id: string) => {
  const { 
    values: equipmentTemplate,
    updateObject: createEquipmentTemplate, 
    loadObject: loadEquipmentTemplate, 
    updatePutObject: updateEquipmentTemplate, 
    deleteObject: deleteEquipmentTemplate,
  } = useObjectFetch<EquipmentTemplate>({  url: urlEquipmentTemplate, defaultValue: DEFAULT_EQUIPMENT_TEMPLATE_BACKTOOL });
  return {
    equipmentTemplate,
    createEquipmentTemplate: useCallback((values, onSucceed) => {
      const body = values;
      createEquipmentTemplate(body, undefined, onSucceed);
    }, [createEquipmentTemplate]),
    loadEquipmentTemplate: useCallback((onSucceed?: any) => {
      loadEquipmentTemplate(API.EQUIPMENT_TEMPLATE.EQUIPMENT_TEMPLATE(id), onSucceed);
    }, [loadEquipmentTemplate, id]),
    updateEquipmentTemplate: useCallback((values, onSucceed) => {
      const body = values;
      updateEquipmentTemplate(body, '', onSucceed);
    }, [updateEquipmentTemplate]),
    deleteEquipmentTemplate: useCallback((values, onSucceed?) => {
      deleteEquipmentTemplate(
        values, 
        API.EQUIPMENT_TEMPLATE.EQUIPMENT_TEMPLATE(values.id), 
        onSucceed
      );
    }, [deleteEquipmentTemplate]),
  }
}

const urlEquipmentParts = API.EQUIPMENT_PARTS.BASE();

export const useEquipmentParts = () => {
  const {
    values: equipmentParts,
    loadObject: loadEquipmentParts,
  } = useObjectFetch({ url: urlEquipmentParts, defaultValue: EMPTY_ARRAY });
  return {
    equipmentParts,
    loadEquipmentParts: useCallback((equipmentType) => {
      loadEquipmentParts(API.EQUIPMENT_PARTS.LIST(equipmentType));
    }, [loadEquipmentParts])
  }
}