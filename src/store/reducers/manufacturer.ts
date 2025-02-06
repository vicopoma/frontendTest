import {
  MANUFACTURER_ACTIONS,
  MANUFACTURER_STATE_DEFAULT,
  ManufacturerActionsTypes,
  ManufacturerState
} from '../types';

export const manufacturer = (state: ManufacturerState = MANUFACTURER_STATE_DEFAULT, action: ManufacturerActionsTypes) => {
  switch (action.type) {
    case MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER_LIST: {
      return {
        ...state,
        manufacturerList: action.manufacturerList
      };
    }
    case MANUFACTURER_ACTIONS.REPLACE_MANUFACTURER: {
      return {
        ...state,
        manufacturer: action.manufacturer
      };
    }
    case MANUFACTURER_ACTIONS.REPLACE_TOTAL_ELEMENTS: {
      return {
        ...state,
        totalElements: action.totalElements
      };
    }
    case MANUFACTURER_ACTIONS.REPLACE_PARAMS: {
      return {
        ...state,
        params: action.params
      };
    }
    default:
      return state;
  }
};
