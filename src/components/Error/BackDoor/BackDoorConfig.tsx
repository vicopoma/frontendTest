import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { SideBar } from '../../Layout/Sidebar/Sidebar';
import { Switch, Route } from 'react-router-dom';
import { roleCanModify } from '../../../helpers/Utils';
import { useAccountState } from '../../../hook/hooks/account';
import { ACCOUNT_ROLES, BACKDOOR_SIDER } from '../../../constants/constants';
import { BackDoorConfigKeys, KEY, ROUTES } from '../../../settings/routes';
import { history } from '../../../store/reducers';
import { Partition } from './Partition';
import { Synchronize } from './Synchronized';
import { Download } from './Download';
import ReactShortcut from 'react-shortcut';
import { Season } from './Season';
import { SeasonDrawer } from './SeasonDrawer';
import { SyncRawBlink } from './SyncRawBlink';
import { HealthDevice } from './HealthDevice';
import { MessageAlertList } from './MessageAlert';
import { MessageAlertDrawer } from './MessageAlertDrawer';
import { EquipmentTemplateList } from './EquipmentTemplate/EquipmentTemplateList';
import { EquipmentTemplate } from './EquipmentTemplate/EquipmentTemplate';


export const BackDoorConfig = () => {
  const { account } = useAccountState();
  const RoleUpZebraAdmin: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  const [enableSyncTab, setEnableSynTab] = useState<boolean>(false);
  const [seasonId, setSeasonId] = useState<string>('');
  const [messageAlertId, setMessageAlertId] = useState<string>('');
  const [showDrawerNewSeason, setShowDrawerNewSeason] = useState(false);
  const [showDrawerNewMessageAlert, setShowDrawerNewMessageAlert] = useState(false);

  const sideBarData: Array<JSX.Element> = [
    (RoleUpZebraAdmin && enableSyncTab) ?
      <Menu.Item id="bSynchronize" icon={<img className="img-h anticon" src="/images/synch.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.SYNCHRONIZE}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.SYNCHRONIZE))}
        className="title">
        SYNCHRONIZE
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item
        id="bDownload" icon={<img className="img-h anticon" src="/images/download.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.DOWNLOAD}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.DOWNLOAD))}
        className="title"
      >
        DOWNLOAD
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bPartition"
        icon={<img className="img-h anticon" src="/images/archived.svg" alt="" width="20px" />}
        key={BackDoorConfigKeys.PARTITION}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.PARTITION))}
        className="title">
        PARTITION
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bHealthDevice"
        icon={<img className="img-h anticon" src="/images/health-device.svg" alt="" width="20px" />}
        key={BackDoorConfigKeys.HEALTH_DEVICE}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.HEALTH_DEVICE))}
        className="title">
        HEALTH DEVICE
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bSeason"
        icon={<img className="img-h anticon" src="/images/activity/calendar-week.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.SEASON}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.SEASON))}
        className="title">
        SEASON
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bSeason"
        icon={<img className="img-h anticon" src="/images/activity/calendar-week.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.RAW_BLINK_SYNCHRONIZATION}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.RAW_BLINK_SYNCHRONIZATION))}
        className="title">
        RAW BLINK SYNC
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bAlertNotification"
        icon={<img className="img-h anticon" src="/images/message-alert.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.MESSAGE_ALERT}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.MESSAGE_ALERT))}
        className="title">
        MESSAGE ALERT
      </Menu.Item> : <></>,
    RoleUpZebraAdmin ?
      <Menu.Item id="bHelmetTemplate"
        icon={<img className="img-h anticon" src="/images/equipmentType/helmet.svg" alt="" width="18px" />}
        key={BackDoorConfigKeys.EQUIPMENT_TEMPLATE}
        onClick={() => history.push(ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.EQUIPMENT_TEMPLATE))}
        className="title">
        EQUIPMENT TEMPLATE
      </Menu.Item> : <></>,
  ];
  return (
    <>
      {
        showDrawerNewSeason && <SeasonDrawer 
          closeDrawer={() => setShowDrawerNewSeason(false)}  
          seasonId={seasonId}
          setSeasonId={setSeasonId}
          showDrawer={showDrawerNewSeason}
        />
      }
      {
        showDrawerNewMessageAlert && <MessageAlertDrawer 
          closeDrawer={() => setShowDrawerNewMessageAlert(false)}  
          messageAlertId={messageAlertId}
          setSeasonId={setMessageAlertId}
          showDrawer={showDrawerNewMessageAlert}
        />
      }
      <SideBar
        items={sideBarData}
        component={BACKDOOR_SIDER}
      />
      <Layout>
        <Switch>
          {
            (RoleUpZebraAdmin) && (
              <Switch>
                <Route exact key="backdoor-synchronize" 
                path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.SYNCHRONIZE)}
                  component={Synchronize} />
                <Route exact key="backdoor-download" 
                path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.DOWNLOAD)}
                  component={Download} />
                <Route exact key="backdoor-partition"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.PARTITION)}
                  component={Partition} />
                <Route exact key="backdoor-health-device"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.HEALTH_DEVICE)}
                  component={HealthDevice} />
                <Route exact key="backdoor-raw-blink-sync"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.RAW_BLINK_SYNCHRONIZATION)}
                  component={SyncRawBlink} />
                <Route exact key="backdoor-season"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.SEASON)}
                >
                  <Season 
                    setShowDrawerNewSeason={setShowDrawerNewSeason} 
                    setSeasonId={setSeasonId}
                  />
                </Route>
                <Route exact key="backdoor-raw-blink-sync"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.MESSAGE_ALERT)}
                >
                  <MessageAlertList 
                    setMessageAlertId={setMessageAlertId}
                    setShowDrawerNewMessageAlert={setShowDrawerNewMessageAlert}
                  />
                </Route>
                <Route exact key="backdoor-eq-template-list"
                  path={ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.EQUIPMENT_TEMPLATE)}
                  component={EquipmentTemplateList} />
                <Route exact key="backdoor-eq-template"
                  path={ROUTES.BACKDOOR.DETAIL(BackDoorConfigKeys.EQUIPMENT_TEMPLATE, KEY)}
                  component={EquipmentTemplate} />
              </Switch>
            )
          }
        </Switch>
        <ReactShortcut
          keys="s y n c"
          onKeysPressed={() => {
            setEnableSynTab(() => true);
          }}
        />
      </Layout>
    </>
  );
}