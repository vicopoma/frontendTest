import React from 'react';
import { Layout, Menu } from 'antd';
import { Route, Switch } from 'react-router-dom';

import { SideBar } from '../Layout/Sidebar/Sidebar';
import { ConfigurationKeys, ConfigurationTabs, KEY, ROUTES } from '../../settings/routes';
import { Users } from './User/Users';
import { ConfigInventoryType } from './EquipmentType/EquipmentTypeMDView';
import { EquipmentModelList } from './EquipmentModel/EquipmentModelMDView';
import { ConfigTeams } from './Team/ConfigTeams';
import { ConfigScanner } from './Devices/ConfigScan';
import { ConfigManufacturerView } from './Manufacturer/ConfigManufacturerView';
import { ACCOUNT_ROLES, CONFIGURATION_SIDER, SCAN_DEVICE } from '../../constants/constants';
import { FX9600 } from './Devices/FX9600/ScanViewFX9600';
import { Site } from './Site/Site/SiteView';
import { SiteLocation } from './Site/SiteLocation/SiteLocationView';
import { PartType } from './PartType/PartTypeView';
import { Part } from './Part/PartView';
import { MWEIntegration } from './MWE/MWEIntegrationView';
import { useAccountState } from '../../hook/hooks/account';
import { DS9908R } from './Devices/DS9908R/ScanDS9908View';
import { roleCanModify } from '../../helpers/Utils';
import { MC33View } from './Devices/MC33/MC33View';
import { history } from '../../store/reducers';
import { DataImport } from './DataImport/DataImportView';
import { PartTypeDetail } from './PartType/PartTypeDetail';
import { ManufacturerDetail } from './Manufacturer/ManufacturerDetail';
import { EquipmentModelDetail } from './EquipmentModel/EquipmentModelDetail';
import { UserDetail } from './User/UserDetail';
import { PartDetail } from './Part/PartDetail';
import { TeamDetail } from './Team/TeamDetail';
import { ImportResultDetails } from './DataImport/ImportResultDetails';
import { SiteDrawer } from './Site/Site/SiteDetails';
import { EquipmentTypeDetails } from './EquipmentType/EquipmentTypeDetails';
import { TagsConfiguration } from './Tag/TagView';
import { TagDetailConfiguration } from './Tag/TagDetailView';
import { TagHistoryConfiguration } from './Tag/TagHistoryView';
import { TagBlinkHistoryConfiguration } from './Tag/BlinkHistoryView';

export const ConfigurationView = () => {
  
  const {account} = useAccountState();
  const RoleUpToAdmin: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ADMIN_USER);
  const RoleUpZebraAdmin: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  const RoleOEMAdmin: boolean = account.role.name === ACCOUNT_ROLES.OEM_ADMIN;
  const RoleOEMUser: boolean = account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  const { equipmentTypeDTOList } = account;
  const hasShoulderPad = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '2');
  const hasHelmet = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '1');
  
  const {SubMenu} = Menu;
  
  const sideBarData: Array<JSX.Element> = [
    RoleUpZebraAdmin ?
      <SubMenu
        key={ConfigurationTabs.MASTER_DATA}
        icon={<img className="img-h anticon" src="/images/inventory-icon.svg" alt="" width="18px"/>}
        title="MASTER DATA"
      >
        <Menu.Item 
          key={ConfigurationKeys.EQUIPMENT_TYPE}
          id="cEquipmentType"
          onClick={() => {
            history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_TYPE));
          }}
        >
          Equipment Type
        </Menu.Item>
        <Menu.Item 
          key={ConfigurationKeys.EQUIPMENT_MODEL}
          id="cEquipmentModel"
          onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_MODEL))}
        >
          Equipment Model
        </Menu.Item>
        <Menu.Item key={ConfigurationKeys.MANUFACTURER}
          id="cManufacturer"
          onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANUFACTURER))}
        >
          Manufacturer
        </Menu.Item>
        <Menu.Item 
          key={ConfigurationKeys.PART_TYPE}
          id="cPartType"
          onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART_TYPE))}
        >
          Part Type
        </Menu.Item>
        <Menu.Item 
          key={ConfigurationKeys.PART}
          id="cParts"
          onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART))}
        >
          Parts
        </Menu.Item>
      </SubMenu> : <></>,
    (RoleUpZebraAdmin || ((RoleOEMAdmin || RoleOEMUser) && (hasShoulderPad || hasHelmet)))  ?
      <SubMenu
        key={ConfigurationTabs.MANAGEMENT}
        icon={<img className="img-h anticon" src="/images/management-icon.svg" alt="" width="18px"/>}
        title="MANAGEMENT"
      >
        {
          account.su && <Menu.Item key={ConfigurationKeys.MANAGEMENT_MWE_INTEGRATION}
                                   onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANAGEMENT_MWE_INTEGRATION))}>
              Integration MWE
          </Menu.Item>
        }
        <Menu.Item key={ConfigurationKeys.MANAGEMENT_DATA_IMPORT}
                   onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANAGEMENT_DATA_IMPORT))}>
          Import/Export Data
        </Menu.Item>
      </SubMenu> : <></>,
      RoleUpZebraAdmin ?
      <SubMenu
        key={ConfigurationTabs.TAGS}
        icon={<img className="img-h anticon" src="/images/tag-icon.svg" alt="" width="18px"/>}
        title="TAGS"
      >
        <Menu.Item key={ConfigurationKeys.TAGS}
                    onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAGS))}>
          Tag Status
        </Menu.Item>
        <Menu.Item key={ConfigurationKeys.TAG_SCANS_HISTORY}
                    onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAG_SCANS_HISTORY))}>
          Tag Scans History
        </Menu.Item>
        <Menu.Item key={ConfigurationKeys.TAG_BLINKS_HISTORY}
                    onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAG_BLINKS_HISTORY))}>
          Raw Blinks History
        </Menu.Item>
      </SubMenu> : <></>,
    (RoleUpToAdmin || RoleOEMAdmin) ?
      <Menu.Item id="cUsers" icon={<img className="img-h anticon" src="/images/user-icon.svg" alt="" width="18px"/>}
                 key={ConfigurationKeys.USERS}
                 onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.USERS))}
                 className="title">
        USERS
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item
        id="cTeams" icon={<img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>}
        key={ConfigurationKeys.TEAMS} onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TEAMS))}
        className="title"
      >
        TEAMS
      </Menu.Item> : <></>,
      <SubMenu
        icon={<img className="img-h anticon" src="/images/devices-icon.svg" alt="" width="18px"/>}
        key={ConfigurationTabs.DEVICE}
        title="DEVICES"
      >
        <Menu.Item key={`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`}
                   onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`))}
                   className="title">
          {SCAN_DEVICE.DS9908R.devType}
        </Menu.Item>
        <Menu.Item key={`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.MC33.id}`}
                   onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.MC33.id}`))}
                   className="title">
          {SCAN_DEVICE.MC33.devType}
        </Menu.Item>
        {RoleUpZebraAdmin ?
          <Menu.Item key={`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.FX9600.id}`}
                     onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.FX9600.id}`))}
                     className="title">
            {SCAN_DEVICE.FX9600.devType}
          </Menu.Item> : <></>}
      </SubMenu>,
    RoleUpZebraAdmin ?
      <Menu.Item id="cUsers"
                 icon={<img className="img-h anticon" src="/images/team-site-icon.svg" alt="" width="20px"/>}
                 key={ConfigurationKeys.SITE}
                 onClick={() => history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.SITE))}
                 className="title">
        SITES
      </Menu.Item> : <></>
  ];
  
  return (
    <>
      <SideBar
        items={sideBarData}
        component={CONFIGURATION_SIDER}
      />
      <Layout>
        <Switch>
          <Route exact key="config-equipment-device-mc"
                 path={ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.MC33.id}`)}
                 component={MC33View}/>
          <Route exact key="config-equipment-device-ds"
                 path={ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`)}
                 component={DS9908R}/>
          {
            (RoleUpToAdmin || RoleOEMAdmin || RoleOEMUser) && (
              <Switch>
                <Route exact key="config-equipment-device-fx"
                       path={ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.FX9600.id}`)}
                       component={FX9600}/>
                <Route exact key="config-equipment-user" path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.USERS)}
                       component={Users}/>
                <Route exact key="config-equipment-user-detail"
                       path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.USERS, KEY)}
                       component={UserDetail}/>
                <Switch>
                  <Route exact key="config-equipment-type"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_TYPE)}
                         component={ConfigInventoryType}/>
                  <Route exact key="config-equipment-type-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_TYPE, KEY)}
                         component={EquipmentTypeDetails}/>
                  <Route exact key="config-equipment-model"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_MODEL)}
                         component={EquipmentModelList}/>
                  <Route exact key="config-equipment-model-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_MODEL, KEY)}
                         component={EquipmentModelDetail}/>
                  <Route exact key="config-manufacturer"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANUFACTURER)}
                         component={ConfigManufacturerView}/>
                  <Route exact key="config-manufacturer-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANUFACTURER, KEY)}
                         component={ManufacturerDetail}/>
                  <Route exact key="config-part-type"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART_TYPE)} component={PartType}/>
                  <Route exact key="config-part-type-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART_TYPE, KEY)}
                         component={PartTypeDetail}/>
                  <Route exact key="config-part" path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART)}
                         component={Part}/>
                  <Route exact key="config-part-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART, KEY)}
                         component={PartDetail}/>
                  <Route exact key="config-mwe-integration"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANAGEMENT_MWE_INTEGRATION)}
                         component={MWEIntegration}/>
                  <Route exact key="config-data-import"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANAGEMENT_DATA_IMPORT)}
                         component={DataImport}/>
                  <Route exact key="config-data-tag"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAGS)}
                         component={TagsConfiguration}/>
                  <Route exact key="config-data-tag-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.TAGS, KEY)}
                         component={TagDetailConfiguration}/>
                  <Route exact key="config-data-tag-scans-history"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAG_SCANS_HISTORY)}
                         component={TagHistoryConfiguration}/>
                  <Route exact key="config-data-tag-blinks-history"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TAG_BLINKS_HISTORY)}
                         component={TagBlinkHistoryConfiguration}/>
                  <Route exact key="config-data-import-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANAGEMENT_DATA_IMPORT, KEY)}
                         component={ImportResultDetails}/>
                  <Route exact key="config-teams" path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TEAMS)}
                         component={ConfigTeams}/>
                  <Route exact key="config-teams-details"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.TEAMS, KEY)}
                         component={TeamDetail}/>
                  <Route exact key="config-scanner" path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.SCANNER)}
                         component={ConfigScanner}/>
                  <Route exact key="config-site" path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.SITE)}
                         component={Site}/>
                  <Route exact key="config-site-detail"
                         path={ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.SITE, KEY)}
                         component={SiteDrawer}/>
                  <Route exact key="config-team-location"
                         path={ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TEAM_SITE_LOCATION)}
                         component={SiteLocation}/>
                </Switch>
              </Switch>
            )
          }
        </Switch>
      </Layout>
    </>
  );
};
