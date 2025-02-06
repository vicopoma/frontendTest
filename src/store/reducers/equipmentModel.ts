import {
  EQUIPMENT_MODEL_ACTIONS,
  EQUIPMENT_MODEL_STATE_DEFAULT,
  EquipmentModelActionsTypes,
  EquipmentModelState
} from '../types';
import { mergeLists } from '../../helpers/Utils';

export const equipmentModel = (state: EquipmentModelState = EQUIPMENT_MODEL_STATE_DEFAULT, action: EquipmentModelActionsTypes) => {
  switch (action.type) {
    
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_BY_PAGE: {
      const equipmentModelList: Array<EquipmentModelState> = mergeLists(state.equipmentModelList, action.status.equipmentModelList, action.status.forward);
      return {
        ...state,
        equipmentModelList: [...equipmentModelList]
      };
    }
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST: {
      return {
        ...state,
        equipmentModelList: action.equipmentModelList
      };
    }
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_EQUIPMENT_MODEL: {
      return {
        ...state,
        equipmentModel: action.equipmentModel
      };
    }
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_TOTAL_ELEMENTS: {
      return {
        ...state,
        totalElements: action.data.totalElements,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        number: action.data.number,
      };
    }
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD: {
      return {
        ...state,
        customField: action.customField
      };
    }
    case EQUIPMENT_MODEL_ACTIONS.REPLACE_CUSTOM_FIELD_LIST: {
      return {
        ...state,
        customFieldList: action.customFieldList
      };
    }
    default:
      return state;
  }
};
