import {
  DEFAULT_PART_TYPES,
  PART_TYPE_ACTIONS,
  PartTypeRelatedEquipmentModel,
  partTypesActionTypes,
  PartTypesState,
  PartTypeState
} from '../types/partType';
import { mergeLists } from '../../helpers/Utils';

export const partType = (state: PartTypesState = DEFAULT_PART_TYPES, action: partTypesActionTypes): PartTypesState => {
  switch (action.type) {
    case PART_TYPE_ACTIONS.REPLACE_PART_TYPE:
      return {
        ...state,
        partType: action.partType
      };
    case PART_TYPE_ACTIONS.REPLACE_PART_TYPES:
      const partTypesList: Array<PartTypeState> = mergeLists(state.partTypes, action.status.partTypes, action.status.forward);
      return {
        ...state,
        partTypes: [...partTypesList]
      };
    
    case PART_TYPE_ACTIONS.REPLACE_PART_TYPES_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        totalElements: action.data.totalElements,
        number: action.data.number,
      };
    
    case PART_TYPE_ACTIONS.REPLACE_PART_TYPE_BY_EQUIPMENT_MODEL:
      const partTypes: { [key: string]: PartTypeRelatedEquipmentModel } = {};
      action.equipmentModelPartType.forEach(partType => {
        partTypes[partType.id] = partType;
      });
      return {
        ...state,
        equipmentModelPartType: partTypes
      };
    
    case PART_TYPE_ACTIONS.REPLACE_OBJECT_PART_TYPE_BY_EQUIPMENT_MODEL:
      return {
        ...state,
        equipmentModelPartType: action.equipmentModelPartTypes
      };
    
    default:
      return state;
  }
};
