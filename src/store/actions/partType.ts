import { DEFAULT_PART_TYPE, PART_TYPE_ACTIONS, PartTypeRelatedEquipmentModel, PartTypeState } from '../types/partType';
import { OKListResponse, OKObjectResponse, OkPagedListResponse, } from '../../settings/Backend/Responses';
import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError,
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { CREATED, OK, PART_TYPE_FILTER } from '../../constants/constants';
import { FilterState } from '../types';
import { paramBuilder } from '../../helpers/Utils';
import { updateLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';

export const replacePartType = (partType: PartTypeState) => {
  return {
    type: PART_TYPE_ACTIONS.REPLACE_PART_TYPE,
    partType
  };
};

export const replacePartTypes = (partTypes: Array<PartTypeState>, forward: number) => {
  return {
    type: PART_TYPE_ACTIONS.REPLACE_PART_TYPES,
    status: {
      partTypes,
      forward
    }
  };
};

export const replacePartTypeTotal = (totalPages: number, numberOfElements: number, totalElements: number, number: number,
) => {
  return {
    type: PART_TYPE_ACTIONS.REPLACE_PART_TYPES_TOTAL_PAGES,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replacePartTypeByEquipmentModel = (equipmentModelPartType: Array<PartTypeRelatedEquipmentModel>) => {
  return {
    type: PART_TYPE_ACTIONS.REPLACE_PART_TYPE_BY_EQUIPMENT_MODEL,
    equipmentModelPartType
  };
};

export const replaceObjectPartTypeByEquipmentModel = (equipmentModelParTypes: { [key: string]: PartTypeRelatedEquipmentModel }) => {
  return {
    type: PART_TYPE_ACTIONS.REPLACE_OBJECT_PART_TYPE_BY_EQUIPMENT_MODEL,
    equipmentModelPartTypes: equipmentModelParTypes
  };
};

export const loadPartTypes = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    setLoader(true);
    const params: FilterState = getState().filters[PART_TYPE_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: OkPagedListResponse<PartTypeState> = await getRequest(API.PART_TYPE.PAGE() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replacePartTypes(data?.body?.content, forward));
      dispatch(replacePartTypeTotal(data?.body.totalPages, data?.body.numberOfElements, data?.body.totalElements, data?.body.number));
      
    }
    setLoader(false);
  };
};

export const loadPartTypeById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<PartTypeState> = await getRequest(API.PART_TYPE.PART_TYPE(id), getToken());
      dispatch(updateLoader(false));
      if (data?.httpStatus === OK) {
        dispatch(replacePartType(data.body));
      } else {
        dispatch(replacePartType(DEFAULT_PART_TYPE));
      }
    } else {
      dispatch(replacePartType(DEFAULT_PART_TYPE));
    }
  };
};

export const savePartType = (partType: PartTypeState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<PartTypeState> = await postRequest(API.PART_TYPE.PART_TYPE(), partType, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(replacePartType(data?.body));
      dispatch(loadPartTypes(() => {
      }, 3));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const updatePartType = (partType: PartTypeState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<PartTypeState> = await putRequest(API.PART_TYPE.PART_TYPE(), partType, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(loadPartTypes(() => {
      }, 3));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'Update Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const deletePartType = (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.PART_TYPE.PART_TYPE(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadPartTypes(() => {
      }, 3));
      SuccessMessage({description: 'Part type deleted successfully'});
      closeDrawer();
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const getPartTypeByModelId = (id: string) => {
  return async (dispatch: Function, getState: Function) => {
    if (!!id) {
      const data: OKListResponse<PartTypeRelatedEquipmentModel> = await getRequest(API.PART_TYPE.PART_TYPE_BY_MODEL_ID(id), getToken());
      if (data?.httpStatus === OK) {
        const partTypes: { [key: string]: PartTypeRelatedEquipmentModel } = {};
        data?.body.forEach(partType => {
          partTypes[partType.id] = partType;
        });
        const chosenPartTypes: Array<PartTypeRelatedEquipmentModel> = getState().equipment.equipmentInformation.partTypeWithPartDTOList;
        chosenPartTypes.forEach(partType => {
          partTypes[partType.id].partIdSelected = partType?.partIdSelected;
        });
        dispatch(replaceObjectPartTypeByEquipmentModel(partTypes));
      } else {
        dispatch(replaceObjectPartTypeByEquipmentModel({}));
      }
    } else {
      dispatch(replaceObjectPartTypeByEquipmentModel({}));
    }
  };
};