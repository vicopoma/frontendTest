
export interface EquipmentElement {
    key: string,
    title: string,
    total: number,
}


export interface DashboardState {
    totalEquipment: number,
    totalEquipmentUnassigned: number,
    equipmentModelList: EquipmentElement[],
    equipmentTeamList: EquipmentElement[],
    equipmentModelYearList: EquipmentElement[],
    equipmentTypeName: string
}

export const DEFAULT_DASHBOARD: DashboardState = {
    totalEquipment: 0,
    totalEquipmentUnassigned: 0,
    equipmentModelList: [],
    equipmentTeamList: [],
    equipmentModelYearList: [],
    equipmentTypeName: ''
} 