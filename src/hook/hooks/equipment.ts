import { DEVICE_TYPE } from '../../constants/constants';
import { createSelector, ParametricSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/reducers';
import {
  AssignedPlayer,
  EquipmentInformation,
  EquipmentModel,
  EquipmentModelDetail,
  EquipmentParam,
  Equipments,
  TagList
} from '../../store/types';
import {
  addCoachToPlayer,
  getAssignedPlayers,
  getEquipmentModelByEquipmentTypeId,
  getEquipmentModelByEquipmentTypeManufacturerType,
  getEquipmentModelDetail,
  getEquipments,
  getManufacturerWithModels,
  getPartTypeAndPartsByEquipmentModel,
  getTagsByEquipmentAsigned,
  getTeamWithPlayers,
  importEquipmentCsv,
  relateTagWithEquipment,
  replaceAssignedPlayer,
  replaceAssignedPlayerList,
  replaceEquipmentModelDetail,
  replaceEquipmentModelList,
  replaceEquipmentParam,
  synchronizedCleatParts,
  synchronizedCleatsModels,
  synchronizedHelmetModels,
  synchronizedHelmetParts,
  synchronizedShoulderPadModels,
  synchronizedShoulderPadsParts,
  synchronizeGames,
  synchronizePractices,
} from '../../store/actions/equipment';
import { useCallback, useState } from 'react';
import { useListFetch } from '../customHooks/fetchs';
import { API } from '../../settings/server.config';
import { useFetch } from '../customHooks/useFetch';

const selectEquipmentState: ParametricSelector<RootState, undefined, Equipments> =
  createSelector<RootState, Equipments, Equipments>
  (
    state => state.equipment,
    (equipment) => {
      return equipment;
    }
  );

export const useEquipmentState = () => {
  return useSelector((state: RootState) => selectEquipmentState(state, undefined));
};

export const useEquipmentDispatch = () => {
  const dispatch = useDispatch();
  return {
    getEquipments: useCallback((setTableLoader: Function, forward: number) => () => dispatch(getEquipments(setTableLoader, forward)), [dispatch]),
    importEquipmentCsv: (file: any, callback: Function) => dispatch(importEquipmentCsv(file, callback)),
    replaceEquipmentParam: useCallback((equipmentParam: EquipmentParam) => dispatch(replaceEquipmentParam(equipmentParam)), [dispatch]),
    getEquipmentModelByEquipmentTypeId: useCallback((id: string) => dispatch(getEquipmentModelByEquipmentTypeId(id)), [dispatch]),
    getAssignedPlayers: useCallback((name: string, playerId: string, teamId?: string) => dispatch(getAssignedPlayers(name, playerId, teamId)), [dispatch]),
    replaceAssignedPlayer: useCallback((assignedPlayer: AssignedPlayer) => dispatch(replaceAssignedPlayer(assignedPlayer)), [dispatch]),
    getEquipmentModelDetail: useCallback((setValue: Function, equipmentModelId: string, equipmentId: string) => dispatch(getEquipmentModelDetail(setValue, equipmentModelId, equipmentId)), [dispatch]),
    replaceEquipmentModelDetail: (equipmentModelDetail: EquipmentModelDetail) => dispatch(replaceEquipmentModelDetail(equipmentModelDetail)),
    replaceAssignedPlayerList: (assignedPlayerList: AssignedPlayer[]) => dispatch(replaceAssignedPlayerList(assignedPlayerList)),

    getEquipmentModelByEquipmentTypeIdManufacturerType: useCallback((equipmentTypeId: string, manufacturerId: string) => dispatch(getEquipmentModelByEquipmentTypeManufacturerType(equipmentTypeId, manufacturerId)), [dispatch]),
    relateTagWithEquipment: (tagList: TagList, setState: Function, equipmentId: string) => dispatch(relateTagWithEquipment(tagList, setState, equipmentId)),
    getTagsByEquipmentAsigned: useCallback((equipmentId: string) => dispatch(getTagsByEquipmentAsigned(equipmentId)), [dispatch]),
    replaceEquipmentModelList: (equipmentModelList: EquipmentModel[]) => dispatch(replaceEquipmentModelList(equipmentModelList)),
    getManufacturerWithModels: useCallback(async (equipmentTypeId: string) => await dispatch(getManufacturerWithModels(equipmentTypeId)), [dispatch]),
    getPartTypeAndPartsByEquipmentModel: (setFieldValue: Function, equipmentTypeId: string, equipmentModel: string, equipmentId: string) => dispatch(getPartTypeAndPartsByEquipmentModel(setFieldValue, equipmentTypeId, equipmentModel, equipmentId)),
    getTeamWithPlayers: useCallback((teamId?: string, equipmentTypeId?: string) => dispatch(getTeamWithPlayers(teamId, equipmentTypeId)), [dispatch]),

    //TO MOVE TO ANOTHER PLACE
    synchronizedHelmetModels: (setStatus: Function) => dispatch(synchronizedHelmetModels(setStatus)),
    synchronizedCleatsModels: async (setStatus: Function) => await dispatch(synchronizedCleatsModels(setStatus)),
    synchronizedHelmetParts: (setStatus: Function) => dispatch(synchronizedHelmetParts(setStatus)),
    synchronizedShoulderPadsParts: (setStatus: Function) => dispatch(synchronizedShoulderPadsParts(setStatus)),
    synchronizedCleatParts: (setStatus: Function) => dispatch(synchronizedCleatParts(setStatus)),
    synchronizedShoulderPadModels: (setStatus: Function) => dispatch(synchronizedShoulderPadModels(setStatus)),
    synchronizedGames: (setStatus: Function) => dispatch(synchronizeGames(setStatus)),
    synchronizedPractices: (setStatus: Function) => dispatch(synchronizePractices(setStatus)),
    addCoachToPlayer: (setStatus: Function) => dispatch(addCoachToPlayer(setStatus)),
  };
};

export const useEquipmentToBeAssigned = (playerId: string) => {

  const url = API.EQUIPMENT.BASE();
  const [equipmentsSelected, setEquipmentSelected] = useState<Set<EquipmentInformation>>(new Set<EquipmentInformation>());
  const [checksSelected, setCheckSelected] = useState<Set<string>>(new Set<string>());
  const {values: equipmentsToBeAssigned, loadList: loadEquipments} = useListFetch<EquipmentInformation>({url});

  const urlEquipment = API.EQUIPMENT.ASSIGN_EQUIPMENTS();
  const {post, setHandleFetch} = useFetch<any>({_url: urlEquipment});

  const addEquipment = (equipment: EquipmentInformation) => {
    if (!!equipment) {
      const equipmentArray = Array.from(equipmentsSelected).filter(equipmentSelected => equipmentSelected.id === equipment.id);
      if (!equipmentArray.length) {
        const equipmentSet = new Set(equipmentsSelected);
        equipmentSet.add(equipment);
        setEquipmentSelected(equipmentSet);
        setCheckSelected((checksSelected) => {
          const copy = new Set<string>(checksSelected);
          copy.add(equipment.id);
          return copy;
        });
      }
    }
  };

  const addEquipmentList = (equipments: EquipmentInformation[]) => {
    if (!!equipments && equipments.length) {
      const equipmentSet = new Set<EquipmentInformation>();
      equipments.forEach(equipment => {
        equipmentSet.add(equipment);
      });
      setEquipmentSelected(equipmentSet);
    }
  };


  const deleteEquipment = (equipmentId: string) => {
    if (!!equipmentId) {
      const equipmentArray = Array.from(equipmentsSelected).filter(equipmentSelected => equipmentSelected.id !== equipmentId);
      const copy = new Set<EquipmentInformation>();
      equipmentArray.forEach(data => {
        copy.add(data);
      });
      setEquipmentSelected(copy);
      const checkArray = Array.from(checksSelected).filter(equipmentSelected => equipmentSelected !== equipmentId);
      const checks = new Set<string>();
      checkArray.forEach(data => {
        checks.add(data);
      });
      setCheckSelected(checks);
    }
  };

  const allChecks = (check: boolean) => {
    const checks = new Set<string>();
    if (check) {
      const equipmentArray = Array.from(equipmentsSelected);
      equipmentArray.forEach(data => {
        if(data.tags.length > 0 && !data.archived) {
          checks.add(data.id);
        }
      });
    }
    setCheckSelected(checks);
  };

  const changeCheck = (equipmentId: string, check: boolean) => {
    if (check) {
      setCheckSelected((checksSelected) => {
        const checks = new Set<string>(checksSelected);
        checks.add(equipmentId);
        return checks;
      });
    } else {
      const equipmentArray = Array.from(checksSelected).filter(equipmentSelected => equipmentSelected !== equipmentId);
      const checks = new Set<string>();
      equipmentArray.forEach(data => {
        checks.add(data);
      });
      setCheckSelected(checks);
    }
  };

  const getEquipments = useCallback((code: string, playerId: string, archived: boolean) => {
    if (!!code) {
      loadEquipments(`/${API.EQUIPMENT.EQUIPMENT_BY_CODE(code, playerId, archived)}`);
    }
  }, [loadEquipments]);

  const postEquipment = useCallback(async (equipmentsSelected: EquipmentInformation[], playerId: string, checksSelected: Set<string>, reset: Function, sessionId?: string, onSucceed?: any,) => {
    const equipments = equipmentsSelected.filter(equipmentSelected => checksSelected.has(equipmentSelected.id));
    const body = {
      equipmentPlayerList: equipments.map(equipments => ({
        checkPlayer: true,
        equipmentId: equipments.id,
        playerId: playerId,
        deviceType: DEVICE_TYPE,
        sessionId: sessionId
      }))
    };

    setHandleFetch({
      onSucceed: () => {
        const equipments = equipmentsSelected.filter(equipmentSelected => !checksSelected.has(equipmentSelected.id));
        const equipmentSet = new Set<EquipmentInformation>();
        const checks = new Set<string>();
        equipments.forEach(equipment => {
          equipmentSet.add(equipment);
        });
        setEquipmentSelected(equipmentSet);
        setCheckSelected(checks);
        reset && reset();
        onSucceed && onSucceed();
      },
      onFailure: () => {

      }
    });

    await post('', body, true);
  }, [post, setHandleFetch]);

  return {
    equipmentsToBeAssigned,
    equipmentSelected: Array.from(equipmentsSelected),
    addEquipment,
    postEquipment,
    deleteEquipment,
    getEquipments,
    checksSelected,
    allChecks,
    changeCheck,
    addEquipmentList
  };
};
