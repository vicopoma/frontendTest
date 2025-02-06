import {
  EQUIPMENT_TYPE_ACTIONS,
  EQUIPMENT_TYPE_STATE_DEFAULT,
  EquipmentTypeActionsTypes,
  EquipmentTypeState
} from '../types';

export const equipmentType = (state: EquipmentTypeState = EQUIPMENT_TYPE_STATE_DEFAULT, action: EquipmentTypeActionsTypes) => {
  switch (action.type) {
    case EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE_LIST: {
      return {
        ...state,
        equipmentTypeList: action.equipmentTypeList
      };
    }
    case EQUIPMENT_TYPE_ACTIONS.REPLACE_EQUIPMENT_TYPE: {
      return {
        ...state,
        equipmentType: action.equipmentType
      };
    }
    case EQUIPMENT_TYPE_ACTIONS.REPLACE_TOTAL_ELEMENTS: {
      return {
        ...state,
      };
    }
    case EQUIPMENT_TYPE_ACTIONS.REPLACE_PARAMS: {
      return {
        ...state,
        params: action.params
      };
    }
    default:
      return state;
  }
};
