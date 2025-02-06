import { ResponseObjectType, useObjectCrudFetch, useObjectFetch } from './fetchs';
import {
  DEFAULT_EQUIPMENT_CODE,
  DEFAULT_EQUIPMENT_INFORMATION,
  DEFAULT_EQUIPMENT_PLAYER,
  DEFAULT_TAG_VALIDATOR,
  EquipmentInformation,
  EquipmentPlayer,
  NewCode,
  TagValidator
} from '../../store/types';
import { API } from '../../settings/server.config';
import { useBodyFilterState } from '../hooks/bodyFilter';
import { ACCOUNT_ROLES, EMPTY_ARRAY, EMPTY_OBJECT, EQUIPMENT, TAG_VALIDATOR_TYPES } from '../../constants/constants';
import { useCallback, useEffect, useState } from 'react';
import { useAccountState } from '../hooks/account';
import { buildManufacturersAndModelsByDefault, isOemRole } from '../../helpers/Utils';
import { useLocation } from 'react-router-dom';
import { useBodyFilterParams } from './customHooks';
import { useManufacturerList } from '../hooks/manufacturer';
import { TagStatus } from '../../Types/Types';

const url = API.EQUIPMENT.BASE();

export const useEquipmentCrud = (id: string) => {
  const {
    value: equipmentInformation,
    createObject: saveEquipment,
    updateObject: updateEquipment,
    deleteObject: deleteEquipment,
    loadObject: getEquipmentById
  } = useObjectCrudFetch<EquipmentInformation>({
    url,
    id: id,
    defaultValue: DEFAULT_EQUIPMENT_INFORMATION
  });
  
  return {
    equipment: {
      equipmentInformation,
      saveEquipment,
      updateEquipment,
      deleteEquipment,
      getEquipmentById,
    }
  };
};

export const useEquipmentFunctions = () => {
  
  const {loadObject: getEquipmentTypePlayerCodeFetch, values: equipmentCode} = useObjectFetch<NewCode>({
    url,
    defaultValue: DEFAULT_EQUIPMENT_CODE
  });
  const {loadObject: deleteRelatedEquipment} = useObjectFetch<any>({url, defaultValue: undefined});

  const {values: assignedEquipment, updateObject: assignEquipmentToPlayer} = useObjectFetch<EquipmentPlayer>({
    url,
    defaultValue: DEFAULT_EQUIPMENT_PLAYER
  });
  
  const { loadObject: validateTag} = useObjectFetch<TagValidator>({url, defaultValue: DEFAULT_TAG_VALIDATOR});
  const { loadObject: searchNocsaeTag } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT });
  const { loadObject: searchManualTag } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT });
  const { loadObject: archiveEquipment, updateObject: archiveEquipmentList } = useObjectFetch<any>({url, defaultValue: EMPTY_OBJECT});
  const { updateObject: deleteEquipmentList } = useObjectFetch<any>({url, defaultValue: EMPTY_OBJECT});
  const { updateObject: unassignPlayerEqList } = useObjectFetch<any>({url, defaultValue: EMPTY_OBJECT});
  const { updateObject: reconditionStatusList } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT});
  const { updateObject: getEquipmentKeys, values: equipmentKeys } = useObjectFetch<Array<string>>({url, defaultValue: EMPTY_ARRAY});
  const { updateObject: multiCheckList } = useObjectFetch<any>({url, defaultValue: EMPTY_OBJECT});
  const { loadObject: getReclaimableEquipment} = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT });

  const cleanEquipmentAssigned = useCallback((equipmentListA: EquipmentInformation[], equipmentListB: EquipmentInformation[], teamId: string) => {
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

    return {
      equipmentList: equipmentList.filter(equipment => !equipment?.archived),
      archivedEquipment: equipmentList.filter(equipment => equipment?.archived)
    }
  }, []);
  
  return {
    equipmentCode: {
      equipmentCode,
      getEquipmentTypePlayerCode: useCallback((equipmentTypeId: string, onSucceed?: ResponseObjectType<NewCode>) => {
        getEquipmentTypePlayerCodeFetch(API.EQUIPMENT.EQUIPMENT_CODE_GENERATOR(equipmentTypeId), onSucceed);
      }, [getEquipmentTypePlayerCodeFetch])
    },
    assignedEquipmentPlayer: {
      assignedEquipment,
      assignEquipmentToPlayer: useCallback((playerId: string, equipmentId: string, onSucceed?: ResponseObjectType<EquipmentPlayer>) => {
        const assign: EquipmentPlayer = {
          playerId, equipmentId, checkPlayer: true
        };
        assignEquipmentToPlayer(assign, API.EQUIPMENT.ASSIGNED_EQUIPMENT_TO_PLAYER(), onSucceed);
      }, [assignEquipmentToPlayer]),
      deleteRelatedEquipment: useCallback(async (playerId: string, equipmentId: string, sessionId?: string, onSucceed?: ResponseObjectType<any>) => {
        await deleteRelatedEquipment(API.EQUIPMENT.DELETE_RELATED_EQUIPMENT(playerId, equipmentId, sessionId), onSucceed);
      }, [deleteRelatedEquipment])
    },
    tagValidator: {
      validateTag: useCallback((tag: string, teamId: string, equipmentTypeId: string, equipmentId?: string, isReclaim?: boolean, onSucceed?: ResponseObjectType<TagValidator>, onError?: ResponseObjectType<TagValidator>) => {
        validateTag(API.EQUIPMENT.TAG_VALIDATOR(tag, teamId, equipmentTypeId, equipmentId, isReclaim), onSucceed, onError);
      }, [validateTag])
    },
    equipmentKeyList: {
      equipmentKeys,
      getEquipmentKeys: useCallback((body: any, onSucceed?: ResponseObjectType<Array<string>>) => {
        getEquipmentKeys(body, API.EQUIPMENT.SEARCH_KEYS(), onSucceed)
      }, [getEquipmentKeys])
    },
    archiveEquipment: useCallback((equipmentId: string, archive: boolean, onSucceed?: ResponseObjectType<TagValidator>, onError?: ResponseObjectType<TagValidator>) => {
      archiveEquipment(API.EQUIPMENT.ARCHIVE_EQUIPMENT(equipmentId, archive), onSucceed, onError)
    }, [archiveEquipment]),
    archiveEquipmentList: useCallback((archived: boolean, equipmentList: string[], onSucceed?: ResponseObjectType<any>) => {
      const body = { archived, ids: equipmentList };
      archiveEquipmentList(body, API.EQUIPMENT.ARCHIVE_EQUIPMENT_LIST(), onSucceed);
    }, [archiveEquipmentList]),
    deleteEquipmentList: useCallback((equipmentList: string[], onSucceed?: ResponseObjectType<any>) => {
      const body = { ids: equipmentList };
      deleteEquipmentList(body, API.EQUIPMENT.DELETE_EQUIPMENT_LIST(), onSucceed);
    }, [deleteEquipmentList]),
    reconditionStatusList: useCallback((equipmentList: string[], onSucceed?: ResponseObjectType<any>) => {
      const body = { ids: equipmentList };
      reconditionStatusList(body, API.EQUIPMENT.RECONDITION_STATUS_LIST(), onSucceed);
    }, [reconditionStatusList]),
    unassignPlayerEqList: useCallback((body: any, onSucceed?: ResponseObjectType<any>) => {
      unassignPlayerEqList(body, API.EQUIPMENT.UNASSIGN_PLAYER_EQ_LIST(), onSucceed)
    }, [unassignPlayerEqList]),
    cleanEquipmentAssigned,
    searchNocsaeTag: useCallback((tag: string, onSucceed?: ResponseObjectType<TagValidator>, onError?: ResponseObjectType<TagValidator>) => {
      searchNocsaeTag(API.EQUIPMENT.SEARCH_NOCSAE_TAG(tag), onSucceed, onError);
    }, [searchNocsaeTag]),
    searchManualTag: useCallback((tag: string, onSucceed?: ResponseObjectType<TagValidator>, onError?: ResponseObjectType<TagValidator>) => {
      searchManualTag(API.EQUIPMENT.SEARCH_TAG(tag), onSucceed, onError);
    }, [searchManualTag]),
    multiCheckList: useCallback((body: any, onSucceed?: ResponseObjectType<any>, onError?: ResponseObjectType<any>) => {
      multiCheckList(body, API.EQUIPMENT.MULTICHECK_OPTION(), onSucceed, onError);
    }, [multiCheckList]),
    getReclaimableEquipment: useCallback((tag: string, onSucceed?: ResponseObjectType<any>, onError?: ResponseObjectType<any>) => {
      getReclaimableEquipment(API.EQUIPMENT.RECLAIM_EQUIPMENT(tag), onSucceed, onError);
    }, [getReclaimableEquipment]),
  };
};

export const useEquipmentConstructor = () => {
  
  const path = useLocation().pathname.split('/');
  const equipmentTypeId = path[path.length - 1];
  
  const [eqType, setEqType] = useState<string>(equipmentTypeId);
  const equipmentParams = useBodyFilterState(EQUIPMENT + eqType);
  const {addBodyFilter} = useBodyFilterParams(EQUIPMENT + eqType, {});
  
  const {manufacturersWithModels: {manufacturersWithModels, getManufacturerWithModels}} = useManufacturerList();
  
  const [enableFetch, setEnableFetch] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);
  const { account, teamSelected} = useAccountState();
  const { manufacturerId, teamList } = account;
  const restart = () => setReload(reload => reload + 1);

  const isOem = account.role.name === ACCOUNT_ROLES.OEM_ADMIN || account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  
  useEffect(() => {
    setEqType(equipmentTypeId);
  }, [eqType, equipmentTypeId]);
  
  useEffect(() => {
    if (eqType) {
      setTrigger(false);
      getManufacturerWithModels(eqType, () => {
        setEnableFetch(false);
      });
    }
  }, [eqType, getManufacturerWithModels, reload, teamSelected?.teamId]);
  
  useEffect(() => {
    setTrigger(true);
  }, [manufacturersWithModels]);
  
  useEffect(() => {
    if (trigger && !enableFetch && manufacturersWithModels.length > 0) {
      const {modelIds, manufacturerIds} = buildManufacturersAndModelsByDefault(manufacturersWithModels);
      addBodyFilter({
        teamId: isOem ? '0' : teamSelected?.teamId,
        equipmentTypeId: eqType,
      });
      if(!isOem) {
        addBodyFilter({
          teamIds: [teamSelected?.teamId],
        });
      }      
      if (!equipmentParams?.manufacturerIds) {
        addBodyFilter({
          manufacturerIds: isOem ? [manufacturerId] : manufacturerIds,
          equipmentModelIds: modelIds,
          keys: [],
          selected: 'all',
          playerIds: [],
          unAssigned: false,
          allPlayer: true,
          tag: '',
          archived: false,
          teamIds: isOem ? teamList.map(team => team.teamId) : [teamSelected?.teamId],
        });
      }
  
      setEnableFetch(true);
      setTrigger(false);
    }
  }, [addBodyFilter, equipmentParams, enableFetch, eqType, manufacturersWithModels, manufacturerId, teamList, teamSelected?.teamId, trigger, isOem]);
  
  return {enableFetch, setEnableFetch, manufacturersWithModels, restart, equipmentParams};
};

export const useTagValidator = (tags: Array<string>, equipmentTypeId: string, equipmentId?: string, teamId?: string, isNew?: boolean) => {
  
  const [errors, setErrors] = useState<Array<TagStatus>>([]);
  const [codes, setCodes] = useState<Array<string>>([]);
  const {tagValidator: {validateTag}} = useEquipmentFunctions();
  const [copyTag, setCopyTag] = useState<Array<string>>([]);
  const [index, setIndex] = useState<number>(0);
  const [foundErrors, setFoundErrors] = useState<Array<TagStatus>>([]);
  const [finish, setFinish] = useState<boolean>(false);
  const { account, teamSelected} = useAccountState();
  const isReclaim = !isOemRole(account?.role?.name) && isNew;
  
  useEffect(() => {
    setIndex(0);
    setFoundErrors([]);
    setCodes([]);
    setCopyTag(tags);
  }, [tags, equipmentTypeId]);

  useEffect(() => {
    if(index > copyTag.length) {
      setIndex(0);
      setFoundErrors([]);
      setCodes([]);
    }
  }, [index, copyTag.length]);
  
  useEffect(() => {
    if (index < copyTag.length) {
      validateTag(copyTag[index], teamId ? teamId : teamSelected?.teamId, equipmentTypeId, equipmentId, isReclaim, (res, httpResponse) => {
        if (res.validation !== TAG_VALIDATOR_TYPES.OK) {
          setFoundErrors(prevState => [...prevState, {
            message: httpResponse.message,
            status: res.validation
          }]);
        }
        setCodes(prevState => [...prevState, res.validation]);
        setIndex(index => index + 1);
      });
    } else if (index === copyTag.length) {
      setFinish(true);
    }
  }, [index, copyTag, validateTag, teamId, teamSelected?.teamId, equipmentId, equipmentTypeId]);
  
  useEffect(() => {
    if (finish) {
      if (index === copyTag.length) {
        setErrors(foundErrors);
      }
      setFinish(false);
    }
  }, [copyTag.length, foundErrors, finish, index]);
  
  return {errors, codes};
};
