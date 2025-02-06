import { DEFAULT_PARTS, DROP_DOWN_ACTIONS, dropDownActionTypes, DropDownState } from '../types/dropDown';


export const dropDown = (state: DropDownState = DEFAULT_PARTS, action: dropDownActionTypes) => {
  switch (action.type) {
    
    case DROP_DOWN_ACTIONS.REPLACE_MANUFACTURER_LIST_DROP_DOWN:
      return {
        ...state,
        manufacturerList: action.manufacturerList
      };
    case DROP_DOWN_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST_DROP_DOWN:
      return {
        ...state,
        equipmentModelList: action.equipmentModelList
      };
    case DROP_DOWN_ACTIONS.REPLACE_PART_TYPES_LIST_DROP_DOWN:
      return {
        ...state,
        partTypeList: action.partTypeList
      };
    case DROP_DOWN_ACTIONS.REPLACE_USER_TEAM_LIST_DROP_DOWN:
      return {
        ...state,
        userTeamList: action.teamList,
      };
    case DROP_DOWN_ACTIONS.REPLACE_ALL_TEAM_LIST_DROP_DOWN:
      return {
        ...state,
        allTeamList: action.teamList
      };
    default:
      return state;
  }
};
