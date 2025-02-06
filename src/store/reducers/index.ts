import { SiteMapsState } from '../types/siteMap';
import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import { sample } from './sample';
import { account } from './account';
import { scan } from './scan';
import { activity } from './activity';
import { equipment } from './equipment';
import { manufacturer } from './manufacturer';
import { equipmentType } from './EquipmentType';
import { equipmentModel } from './equipmentModel';
import { site } from './site';
import { users } from './users';
import { roles } from './roles';
import { filters } from './filter';
import { teams } from './team';
import { players } from './players';
import { barcodeReport } from './barcodeReport';
import { loader } from './loader';
import { histories } from './history';
import { siteMaps } from './siteMap';
import { siteLocation } from './siteLocation';
import { device } from './devices';
import { partType } from './partType';
import { part } from './part';
import { mweIntegration } from './mweIntegration';
import { deviceDS9908R } from './deviceDS9908R';
import { dropDown } from './dropDown';
import { bodyFilter } from './bodyFilter';
import { importView } from './importData';
import {
  AccountState,
  ActivitiesState,
  CLEAR_REDUX_DATA,
  EquipmentModelState,
  Equipments,
  EquipmentTypeState,
  FiltersState,
  ManufacturerState,
  RolesState,
  Sample,
  ScansState,
  SitesState,
  TeamsState
} from '../types';
import { UsersState } from '../types/users';
import { PlayersState } from '../types/players';
import { BarcodeReportState } from '../types/barcodeReport';
import { LoaderState } from '../types/loader';
import { HistoriesState } from '../types/history';
import { SiteLocationsState } from '../types/siteLocation';
import { DevicesState } from '../types/devices';
import { PartTypesState } from '../types/partType';
import { PartsState } from '../types/part';
import { MweIntegrationState } from '../types/mweIntegration';
import { DeviceDS9908RsState } from '../types/deviceDS9908R';
import { DropDownState } from '../types/dropDown';
import { BodyFiltersState } from '../types/bodyFilter';
import { ImportDataState } from '../types/importData';

export const history = createBrowserHistory();

export const appReducer = combineReducers({
  router: connectRouter(history),
  sample,
  account,
  scan,
  activity,
  equipment,
  users,
  roles,
  manufacturer,
  filters,
  teams,
  equipmentType,
  equipmentModel,
  players,
  barcodeReport,
  loader,
  histories,
  siteMaps,
  siteLocation,
  device,
  partType,
  part,
  dropDown,
  mweIntegration,
  deviceDS9908R,
  bodyFilter,
  site,
  importView
});

export const createRootReducer = (state: any, action: any) => {
  if (action?.type === CLEAR_REDUX_DATA) {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = {
  sample: Sample,
  account: AccountState,
  router: RouterState,
  scan: ScansState,
  activity: ActivitiesState,
  equipment: Equipments,
  users: UsersState,
  roles: RolesState,
  teams: TeamsState,
  manufacturer: ManufacturerState,
  filters: FiltersState,
  equipmentType: EquipmentTypeState,
  equipmentModel: EquipmentModelState,
  players: PlayersState,
  barcodeReport: BarcodeReportState,
  loader: LoaderState,
  histories: HistoriesState,
  siteMaps: SiteMapsState,
  siteLocation: SiteLocationsState,
  device: DevicesState,
  partType: PartTypesState,
  part: PartsState,
  dropDown: DropDownState,
  mweIntegration: MweIntegrationState,
  deviceDS9908R: DeviceDS9908RsState,
  bodyFilter: BodyFiltersState,
  site: SitesState,
  importView: ImportDataState
}
