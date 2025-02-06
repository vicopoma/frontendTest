import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { EquipmentAssignedView } from './EquipmentAssigned/EquipmentAssignedView';
import { NavigationBar, NavigationBarState } from '../../Shared/NavigationBar/NavigationBar';
import './PlayerSelector.scss';
import { ROUTES } from '../../../settings/routes';
import { useLocation } from 'react-router-dom';
import { history } from '../../../store/reducers';
import { PlayerProvider } from '../../../context/player';
import { DATE_FORMATS, NEW, dateFormatTableSec } from '../../../constants/constants';
import { usePlayerApparel, usePlayerCrud } from '../../../hook/customHooks/players';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useEquipmentFunctions } from '../../../hook/customHooks/equipment';
import Image from '../../Shared/Image/Image';
import moment from 'moment';
import { downloadCsv, formatHeight } from '../../../helpers/Utils';
import { ApparelView } from './PlayerApparel/PlayerApparel';
import { useFormik } from 'formik';
import { Apparel } from '../../../store/types/players';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { useAccountState } from '../../../hook/hooks/account';
import { API } from '../../../settings/server.config';

export const PlayerDetail = ({openDrawer, onClose, navigationBar, sessionId}: {
  openDrawer: boolean,
  onClose: Function,
  navigationBar?: NavigationBarState,
  sessionId?: string,
}) => {
  const { teamSelected } = useAccountState();

  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  const {player, loadPlayer} = usePlayerCrud(path, sessionId);
  const {assignedEquipmentPlayer: {deleteRelatedEquipment}} = useEquipmentFunctions();
  
  const [showAddEquipment, setShowAddEquipment] = useState<boolean>(false);
  const [tab, setTab] = useState<string>('equipment');
  
  const defaultNavigationRoute = [
    {
      path: ROUTES.PLAYER.PAGE(),
      breadcrumbName: `Players`
    },
    {
      path: ROUTES.PLAYER.DETAIL(path),
      breadcrumbName: `${player.displayName} #${player.jerseyNumber}`
    }
  ];

  const { playerApparel, getPlayerApparel, updatePlayerApparel } = usePlayerApparel();

  const { values, setValues, setFieldValue } = useFormik<Apparel>({
    initialValues: playerApparel,
    onSubmit() {},
  });

  useEffect(() => {
    getPlayerApparel(path, (res) => {
      setValues(res);
    });
  }, [getPlayerApparel, setValues, path]);
  
  return (
    <DetailLayout 
      canModify={tab === 'apparel'} 
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          updatePlayerApparel({ playerId: path, apparelDTOList: values.apparelDTOList }, path, () => {
            setResponse({
              title: 'Updated',
              type: 'success',
              description: 'Updated Successfully',
            })
            getPlayerApparel(path);
          });
        })
      }}
    >
      {
        navigationBar ? <NavigationBar {...navigationBar} />
          :
          <NavigationBar
            navTitle={
              <div className="navigationbar-header">
                <img src="/images/player-icon.svg" alt="" width="20px"/>
                <span className="navigation-bar">players</span>
              </div>
            }
            navigationRoute={defaultNavigationRoute}
            rightBar={[
              !showAddEquipment && <div style={{marginRight: '13px'}}>
                  <Button
                      icon={<img className="img-h anticon" src="/images/plus-icon.svg" alt="" width="14px"/>}
                      className="btn-green"
                      onClick={() => {
                        setShowAddEquipment(true);
                        history.push(ROUTES.PLAYER.EDIT_EQUIPMENT(path, NEW, NEW));
                      }}
                  > NEW EQUIPMENT </Button>
              </div>
            ]}
          />
      }
      <NavigationBar 
        navTitle={
          <div>
            <Row>
              <Col>
                <div className="card-player-eq">
                  <img alt="" />
                </div>
              </Col>
              <Col className="data-item">
                <Image
                  className="bg-team-icon"
                  src={`/images/teams/logos/${player.teamAbbr}.svg`}
                  srcDefault="/images/team-icon.svg"
                  height="50px"
                  alt="logo-team"
                />
              </Col>
              <Col className="data-item">
                <div className="first-name">{player.firstName}</div>
                <div className="last-name">{player.lastName}</div>
                <div className="extra-info">{player.position ? `${player.position} -` : ''} # {player.jerseyNumber}</div>
              </Col>
              <Col className="data-item">
                <div className="item-title">
                  <img src="/images/player/weight-icon.svg" alt="" width="15px" style={{ margin: '-1px 5px 0px 0px' }}/>
                  Weight
                </div> 
                <div>{player.weight} Pounds</div>
              </Col>
              <Col className="data-item">
                <div className="item-title">
                  <img src="/images/player/height-icon.svg" alt="" width="15px" style={{ margin: '-1px 5px 0px 0px' }}/>
                  Height
                </div>
                <div>{formatHeight(player.height)}</div>
              </Col>
              <Col className="data-item">
                <div className="item-title">
                  <img src="/images/player/birthday-date-icon.svg" alt="" width="15px" style={{ margin: '-1px 5px 0px 0px' }}/>
                  Birthdate
                </div>
                <div>{player.birthDate ? moment(player.birthDate).format(DATE_FORMATS.monthDayYear) : '-'}</div>
              </Col>
              <Col className="data-item">
                <div className="item-title">
                  <img src="/images/player/college-icon.svg" alt="" width="15px" style={{ margin: '-1px 5px 0px 0px' }}/>
                  College
                </div>
                <div>{player.collegeName ?? '-'}</div>
              </Col>
            </Row>
          </div>
        } 
        style={{
          height: '80px',
        }}
        rightBar={[
          (
          <Button className="btn-blue" onClick={() => {
            downloadCsv(
              `apparel-export-${teamSelected.abbr}-${player.displayName}-${moment().local().format(dateFormatTableSec)}.csv`,
              API.APPAREL.EXPORT_PLAYER_CSV(teamSelected.teamId, path),
              'POST',
              {}, 'application/json', () => {/*disableLoader()*/});
          }}>
            <DownloadOutlined style={{ color: '#ffffff', marginRight: "8px" }} />
            Download Apparel CSV
          </Button>),
          (
            <Button className="btn-blue btn-apparel" onClick={() => {
              downloadCsv(
                `all-equipment-${teamSelected.abbr}-${player.displayName}-${moment().local().format(dateFormatTableSec)}.csv`,
                API.APPAREL.EXPORT_PLAYER_ALL_EQUIPMENT_CSV(path),
                'POST',
                {}, 'application/json', () => {});
            }}>
              <DownloadOutlined style={{ color: '#ffffff', marginRight: "8px" }} />
              Download All Equipment
            </Button>)
        ]}
      />
      <div className="player-assigned-eq">
        <Tabs
          type="card"
          destroyInactiveTabPane={true}
          defaultActiveKey="equipment"
          onChange={(activeKey) => setTab(activeKey)}
        >
          <Tabs.TabPane tab="Equipment" key="equipment" className="blue-scroll">
            {
              !showAddEquipment && (
                <PlayerProvider values={player} deleteRelatedEquipment={deleteRelatedEquipment} loadPlayer={loadPlayer}>
                  <EquipmentAssignedView
                    playerId={player.id}
                    setConnectionResponse={() => {
                    }}
                    sessionId={sessionId}
                  />
                </PlayerProvider>
              )
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="Apparel" key="apparel">
            <ApparelView values={values} setFieldValue={setFieldValue} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </DetailLayout>
  );
};
