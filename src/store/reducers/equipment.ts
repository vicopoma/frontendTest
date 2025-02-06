import { DEFAULT_EQUIPMENT, EquipmentActionsTypes, Equipments, EQUIPMET_ACTIONS } from '../types/equipment';
import { mergeLists } from '../../helpers/Utils';

export const equipment = (state: Equipments = DEFAULT_EQUIPMENT, action: EquipmentActionsTypes) => {
  switch (action.type) {
    case EQUIPMET_ACTIONS.GET_EQUIPMENTS: {
      const equipments = mergeLists(state.equipments, action.data.equipments, action.data.forward);
      return {
        ...state,
        equipments: equipments
      };
    }
    
    case EQUIPMET_ACTIONS.REPLACE_TOTAL_ELEMENTS: {
      return {
        ...state,
        totalElements: action.elements.totalElements,
        totalPages: action.elements.totalPages,
        numberOfElements: action.elements.numberOfElements,
        number: action.elements.number,
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_PARAM: {
      return {
        ...state,
        equipmentParam: action.equipmentParam
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_INFORMATION: {
      return {
        ...state,
        equipmentInformation: {
          ...state.equipmentInformation,
          ...action.equipmentInformation,
          tags: action.equipmentInformation.tags
        }
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_VMS: {
      return {
        ...state,
        equipmentModelVMs: action.equipmentModelVMs
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER_LIST: {
      return {
        ...state,
        assignedPlayerList: action.assignedPlayerList
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_ASSIGNED_PLAYER: {
      return {
        ...state,
        assignedPlayer: action.assignedPlayer
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MODEL_DETAIL: {
      return {
        ...state,
        equipmentModelDetail: action.equipmentModelDetail
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG: {
      return {
        ...state,
        equipmentTags: action.equipmentTags
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TAG_LIST: {
      return {
        ...state,
        equipmentTagList: action.equipmentTagList
      };
    }
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TYPE_PLAYER_CODE:
      return {
        ...state,
        equipmentInformation: {
          ...state.equipmentInformation,
          equipmentCode: action.code
        }
      };
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_MANUFACTURER_WITH_MODELS:
      return {
        ...state,
        manufacturerWithModels: action.manufacturerWithModels
      };
    case EQUIPMET_ACTIONS.REPLACE_EQUIPMENT_TEAM_WITH_PLAYERS:
      return {
        ...state,
        teamWithPlayers: action.teamWithPlayers
      };
    default:
      return state;
  }
};
