import { DEFAULT_PLAYERS, playerActionTypes, PLAYERS_ACTIONS, PlayersState, PlayerState } from '../types/players';
import { mergeLists } from '../../helpers/Utils';

export const players = (state: PlayersState = DEFAULT_PLAYERS, action: playerActionTypes): PlayersState => {
  switch (action.type) {
    case PLAYERS_ACTIONS.REPLACE_PLAYERS:
      const players: Array<PlayerState> = mergeLists(state.players, action.players.players, action.players.forward);
      return {
        ...state,
        players: [...players]
      };
    
    case PLAYERS_ACTIONS.REPLACE_PLAYER:
      return {...state, player: action.player};
    
    case PLAYERS_ACTIONS.REPLACE_NUMBER_OF_ELEMENTS:
      return {...state, number: action.number};
    
    case PLAYERS_ACTIONS.REPLACE_TOTAL_ELEMENTS:
      return {...state, totalElements: action.total};
    
    case PLAYERS_ACTIONS.REPLACE_EQUIPMENT_ASSIGNED_PLAYER:
      return {
        ...state,
        equipmentAssigned: action.equipmentAssigned
      };
    case PLAYERS_ACTIONS.REPLACE_EQUIPMENTS_PLAYER:
      return {
        ...state,
        equipmentList: action.equipmentList
      };
    case PLAYERS_ACTIONS.REPLACE_EQUIPMENT_SELECTED_PLAYER:
      return {
        ...state,
        equipmentSelected: action.equipmentSelected
      };
    
    case PLAYERS_ACTIONS.ADD_EQUIPMENT_TO_EQUIPMENT_LIST:
      const findEquipment = state.equipmentSelected
      .filter(equipment => equipment.id === action.equipment.id);
      return {
        ...state,
        equipmentSelected: findEquipment.length === 0 ? [...state.equipmentSelected, action.equipment] : [...state.equipmentSelected]
      };
    case PLAYERS_ACTIONS.DELETE_EQUIPMENT_TO_EQUIPMENT_LIST:
      const equipments = state.equipmentSelected
      .filter(equipment => equipment.id !== action.equipment.id);
      return {
        ...state,
        equipmentSelected: [...equipments]
      };
    
    case PLAYERS_ACTIONS.REPLACE_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        totalElements: action.data.totalElements,
        number: action.data.number
        
      };
    
    case PLAYERS_ACTIONS.REPLACE_PAGEABLE:
      return {...state, pageable: action.pageable};
    
    default:
      return state;
  }
};
