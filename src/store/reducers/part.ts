import { DEFAULT_PARTS, PART_ACTIONS, partActionTypes, PartsState, PartState } from '../types/part';
import { mergeLists } from '../../helpers/Utils';


export const part = (state: PartsState = DEFAULT_PARTS, action: partActionTypes) => {
  switch (action.type) {
    case PART_ACTIONS.REPLACE_PART:
      return {
        ...state,
        part: action.part
      };
    case PART_ACTIONS.REPLACE_PARTS:
      const Parts: Array<PartState> = mergeLists(state.parts, action.data.parts, action.data.forward);
      return {
        ...state,
        parts: [...Parts]
      };
    
    case PART_ACTIONS.REPLACE_PARTS_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        totalElements: action.data.totalElements,
        number: action.data.number,
      };
    case PART_ACTIONS.REPLACE_MANUFACTURER:
      return {
        ...state,
        dropdowns: {
          ...state.dropdowns,
          manufacturerList: action.manufacturerList
        }
      };
    case PART_ACTIONS.REPLACE_EQUIPMENT_MODEL:
      return {
        ...state,
        dropdowns: {
          ...state.dropdowns,
          equipmentModelList: action.equipmentModelList,
        }
      };
    case PART_ACTIONS.REPLACE_PART_TYPES_LIST:
      return {
        ...state,
        dropdowns: {
          ...state.dropdowns,
          partTypeList: action.partTypeList
        }
      };
    default:
      return state;
  }
};
