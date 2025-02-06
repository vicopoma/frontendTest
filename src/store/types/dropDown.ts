import { Manufacturer } from './manufacturer';
import { PartTypeRelatedEquipmentModel } from '../types/partType';
import { EquipmentModel } from './equipmentModel';
import { TeamState } from './team';

export interface DropDownState {
  manufacturerList: Array<Manufacturer>,
  equipmentModelList: Array<EquipmentModel>,
  partTypeList: Array<PartTypeRelatedEquipmentModel>,
  userTeamList: Array<TeamState>,
  allTeamList: Array<TeamState>
}

export const DEFAULT_PARTS: DropDownState = {
  manufacturerList: [],
  equipmentModelList: [],
  partTypeList: [],
  userTeamList: [],
  allTeamList: []
};

export enum DROP_DOWN_ACTIONS {
  REPLACE_MANUFACTURER_LIST_DROP_DOWN = 'REPLACE_MANUFACTURER_LIST_DROP_DOWN',
  REPLACE_EQUIPMENT_MODEL_LIST_DROP_DOWN = 'REPLACE_EQUIPMENT_MODEL_LIST_DROP_DOWN',
  REPLACE_PART_TYPES_LIST_DROP_DOWN = 'REPLACE_PART_TYPES_LIST_DROP_DOWN',
  REPLACE_USER_TEAM_LIST_DROP_DOWN = 'REPLACE_USER_TEAM_LIST_DROP_DOWN',
  REPLACE_ALL_TEAM_LIST_DROP_DOWN = 'REPLACE_ALL_TEAM_LIST_DROP_DOWN',
}

interface ReplaceManufacturer {
  type: DROP_DOWN_ACTIONS.REPLACE_MANUFACTURER_LIST_DROP_DOWN,
  manufacturerList: Array<Manufacturer>
}

interface ReplaceEquipmentModel {
  type: DROP_DOWN_ACTIONS.REPLACE_EQUIPMENT_MODEL_LIST_DROP_DOWN,
  equipmentModelList: Array<EquipmentModel>
}

interface ReplacePartTypes {
  type: DROP_DOWN_ACTIONS.REPLACE_PART_TYPES_LIST_DROP_DOWN,
  partTypeList: Array<PartTypeRelatedEquipmentModel>
}

interface ReplaceUserTeamList {
  type: DROP_DOWN_ACTIONS.REPLACE_USER_TEAM_LIST_DROP_DOWN
  teamList: Array<TeamState>
}

interface ReplaceAllTeamList {
  type: DROP_DOWN_ACTIONS.REPLACE_ALL_TEAM_LIST_DROP_DOWN,
  teamList: Array<TeamState>
}

export type dropDownActionTypes =
  ReplaceManufacturer |
  ReplaceEquipmentModel |
  ReplacePartTypes |
  ReplaceUserTeamList |
  ReplaceAllTeamList;

