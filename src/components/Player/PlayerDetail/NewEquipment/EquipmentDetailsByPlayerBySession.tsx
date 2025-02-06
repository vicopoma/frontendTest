import React, { useEffect, useState } from 'react';
import { Tabs, Dropdown, Button, Row, Col, DatePicker, Menu } from 'antd';
import { FetchResponse } from '../../../Shared/Drawer/Drawer';
import { useFormik } from 'formik';
import { equipmentValidators } from '../../../../constants/validators';
import { EQ_INFORMATION_VAR, EquipmentInformation } from '../../../../store/types';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';
import { ActivityTabs, ROUTES } from '../../../../settings/routes';
import { useLocation } from 'react-router-dom';
import { history } from '../../../../store/reducers';
import { DetailLayout } from '../../../Shared/DetailLayout/DetailLayout';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { EquipmentGeneral } from '../../../Equipment/EquipmentDetail/General/EquipmentGeneralView';
import { EquipmentHistory } from '../../../Equipment/EquipmentDetail/History/EquipmentHistoryView';
import { TagHistory } from '../../../Equipment/EquipmentDetail/Tag/TagHistory';
import { EquipmentProvider } from '../../../../context/equipment';
import { useEquipmentCrud, useEquipmentFunctions } from '../../../../hook/customHooks/equipment';
import { usePlayerCrud } from '../../../../hook/customHooks/players';
import { Activity } from '../../../Equipment/EquipmentDetail/ActivityHistory/ActivityHistory';
import Icon from '../../../Shared/CommomIcons/Icons';
import { useScanState } from '../../../../hook/hooks/scan';
import { ACTIVITY, BODY_FILTER, dateFormat, dateFormatTable, datePickerFormat, DATE_FORMATS, EQUIPMENT_TYPES, FILTER, midDayUtc } from '../../../../constants/constants';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { useActivitiesDispatch } from '../../../../hook/hooks/activity';
import { useLoaderDispatch } from '../../../../hook/hooks/loader';
import { useBodyFilterParams, useFilterParams } from '../../../../hook/customHooks/customHooks';
import { useEquipmentTypeState } from '../../../../hook/hooks/equipmentType';

const {TabPane} = Tabs;

export const EquipmentDetailsByPlayerBySession = ({closeDrawer}: {
  closeDrawer: Function
}) => {
  
  const paths = useLocation().pathname.split('/');
  const equipmentTypeId = paths[paths.length - 2];
  const [save, setSave] = useState<boolean>(true);
  
  const playerId = paths[paths.length - 3];
  const equipmentId = paths[paths.length - 1];
  const type = paths[paths.length - 5];
  const sessionId = paths[paths.length - 4];

  const filterName = ACTIVITY + FILTER;
  const bodyFilterName = ACTIVITY + BODY_FILTER;
  const {addBodyFilter} = useBodyFilterParams(bodyFilterName);
  const { addFilter } = useFilterParams(filterName);
  const {loadActivity} = useActivitiesDispatch();

  const { equipmentTypeList } = useEquipmentTypeState();
  const isShoulderPadType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.SHOULDER_PAD && data.id === equipmentTypeId).length > 0;
  const isHelmetType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET && data.id === equipmentTypeId).length > 0;

  const {activityScan} = useScanState();
  const {showLoader} = useLoaderDispatch();
  
  useEffect(() => {
    loadActivity(sessionId);
  }, [loadActivity, sessionId]);

  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '', description: '', type: undefined
  });
  
  const {
    equipment: {
      saveEquipment,
      updateEquipment,
      equipmentInformation,
      deleteEquipment,
      getEquipmentById
    }
  } = useEquipmentCrud(equipmentId);

  const {assignedEquipmentPlayer: {assignEquipmentToPlayer}, archiveEquipment, equipmentCode: {getEquipmentTypePlayerCode}} = useEquipmentFunctions();
  
  const {player} = usePlayerCrud(playerId);
  
  const {handleSubmit, values, handleChange, errors, setFieldValue, handleBlur, validateForm, touched} =
    useFormik({
      initialValues: equipmentInformation,
      enableReinitialize: true,
      validationSchema: equipmentValidators,
      onSubmit() {
      }
    });

  const [trigger, setTrigger] = useState<number>(0);
  
  useEffect(() => {
    if(trigger > 0 && !!equipmentId) {
      getEquipmentById(equipmentId);
    }
  }, [equipmentId, getEquipmentById, trigger]);
  
  return (
    <DetailLayout
      canModify={save}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              const newEquipment: EquipmentInformation = {
                ...values,
                teamId: player?.currentTeamId,
                teamName: player?.currentTeam,
                playerId,
              };
              if (values?.id) {
                showLoader(true);
                updateEquipment(newEquipment, setResponse, () => {
                  showLoader(false);
                  setTrigger(prevState => prevState + 1);
                });
              } else {
                showLoader(true);
                saveEquipment(newEquipment, setConnectionResponse, (newEquipment: EquipmentInformation) => {
                  assignEquipmentToPlayer(playerId, newEquipment.id, () => {
                    showLoader(false);
                    history.replace(ROUTES.ACTIVITY.PLAYER_EDIT_EQUIPMENT(type, sessionId, playerId, values?.equipmentTypeId, newEquipment.id));
                  });
                });
              }
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values?.id ? (() => {
        ConfirmationModal('Delete', `Are you sure to delete this Equipment: ${values?.nameEquipmentType}?`, () => {
          deleteEquipment(values?.id, setConnectionResponse, () => {
            history.goBack();
          });
        });
      }) : undefined}
      onCreateAnotherButton={(values?.id)? () => {
        ConfirmationModal('Create Another', `Are you sure to create another Equipment: ${values?.nameEquipmentType}?`, () => {
          setFieldValue(EQ_INFORMATION_VAR.TAGS, []);
          getEquipmentTypePlayerCode(equipmentTypeId, (codeEquipmentPlayer) => {
            setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_CODE, codeEquipmentPlayer?.newCode);
          });
          setFieldValue(EQ_INFORMATION_VAR.ID, '');
          setFieldValue(EQ_INFORMATION_VAR.PLAYER_ID, '');
          setFieldValue(EQ_INFORMATION_VAR.DISPLAY_NAME, '');
          setFieldValue(EQ_INFORMATION_VAR.CREATE_DATE, '');
          setFieldValue(EQ_INFORMATION_VAR.MODIFIED_DATE, '');
          setFieldValue(EQ_INFORMATION_VAR.LAST_CERTIFICATION, '');
          setFieldValue(EQ_INFORMATION_VAR.IMPORTED, false);
        })
      } : undefined}
      leftFooter={
        values?.id ? [
        <Button
          className="btn-yellow"
          icon={<Icon.ArchiveOutLined style={{marginRight: '8px'}} archive={!values?.archived} width="20px" />}
          onClick={() => {
            const text = values?.archived ? 'Unarchive' : 'Archive';
            ConfirmationModal(text, `Are you sure to ${text} this Equipment: ${values?.nameEquipmentType}?`, () => {
              archiveEquipment(values?.id, !values?.archived, () => {
                getEquipmentById(equipmentId);
                setConnectionResponse({
                  title: 'Success',
                  type: 'success',
                  description: `Equipment has been ${text.toLowerCase()}d successfully`
                })
              });
            });
          }}>
          {values?.archived ? 'Unarchive' : 'Archive'}
        </Button>
      ] : undefined}
      alertResponse={connectionResponse}
    >
      <div className="card-container-equipment">
        <div className="drawer-header-equipment">
          <NavigationBar
            navTitle={
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    onClick={e => {
                      const key = e.key;
                      const changeTab = async (tab: string) => {
                        addFilter({
                          page: {
                            params: ['0']
                          },
                          type: {
                            params: [tab.toUpperCase()]
                          }
                        });
                        
                        addBodyFilter({
                          type: tab.toUpperCase()
                        });
                      };
                      changeTab(key).then(() => {
                        history.push(ROUTES.ACTIVITY.PAGE(key));
                      });
                    }}
                  >
                    <Menu.Item key={ActivityTabs.GAME}> <span className="type-text"><img className="navigation-icon"
                                                                                        src="/images/icon-03.svg" alt=""
                                                                                        width="18px"/> Game</span>
                    </Menu.Item>
                    <Menu.Item key={ActivityTabs.PRACTICE}> <span className="type-text"><img className="navigation-icon"
                                                                                            src="/images/practice-icon.svg"
                                                                                            alt=""
                                                                                            width="18px"/> Practice </span>
                    </Menu.Item>
                    <Menu.Item key={ActivityTabs.CUSTOM}> <span className="type-text"><img className="navigation-icon"
                                                                                          src="/images/custom-icon.svg" alt=""
                                                                                          width="18px"/> Custom </span>
                    </Menu.Item>
                  </Menu>
                }>
                <Button
                  icon={<>
                    {ActivityTabs.GAME === paths[2] &&
                    <img src="/images/icon-03.svg" className="navigation-icon" alt="" width="24px"/>}
                    {ActivityTabs.PRACTICE === paths[2] &&
                    <img src="/images/practice-icon.svg" className="navigation-icon" alt="" width="24px"/>}
                    {ActivityTabs.CUSTOM === paths[2] &&
                    <img src="/images/custom-icon.svg" className="navigation-icon" alt="" width="24px"/>}
                  </>}
                  className="navigation-button">
                  <div className="navigation-text">
                    <h4>{paths[2]}</h4>
                    {<DownOutlined/>}
                  </div>
                </Button>
              </Dropdown>
            }
            navigationRoute={[
              {
                path: ROUTES.ACTIVITY.PAGE(type),
                breadcrumbName: type + ' list'
              },
              {
                path: ROUTES.ACTIVITY.SELECTOR(type, sessionId),
                breadcrumbName:
                  `${activityScan.homeTeamName !== activityScan.visitTeamName ?
                    (activityScan.visitTeamName + ' @ ' + activityScan.homeTeamName) : (activityScan.homeTeamName)}
                          - Date: ${moment(activityScan.startGameDate).local().format(DATE_FORMATS.monthDayYearHourMin)}`
              },
              {
                path: ROUTES.ACTIVITY.PLAYER_DETAIL(type, sessionId, playerId),
                breadcrumbName: `${player.displayName} #${player.jerseyNumber}`
              },
              {
                path: '',
                breadcrumbName: values?.id ? 'Edit Equipment' : 'New Equipment'
              }
            ]}
          />
        </div>
        <div className="drawer-body-equipment">
          <EquipmentProvider
            values={values}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
            setSave={setSave}
          >
            <Tabs
              className="tag-history"
              defaultActiveKey="information"
              type="card"
              onChange={tab => {
                setSave(tab === 'information');
              }}
              destroyInactiveTabPane
            >
              <TabPane tab="Information" key="information" className="car-size">
                <EquipmentGeneral 
                  fetchResponse={setConnectionResponse}
                  teamId={player?.currentTeamId}
                  reclaimRedirectionRoute={(equipmentId) => ROUTES.ACTIVITY.PLAYER_EDIT_EQUIPMENT(type, sessionId, playerId, values?.equipmentTypeId, equipmentId)}
                />
              </TabPane>
              {!!values?.id && <TabPane tab="Equipment History" key="history" className="car-size-none">
                  <EquipmentHistory
                      equipmentId={values?.id} />
              </TabPane>
              }
              {!!values?.id &&
              <TabPane tab="Tag History" key="tagHistory" className="car-size-none">
                  <TagHistory />
              </TabPane>
              }
              {!!values?.id &&
              <TabPane tab="Activity History" key="activityHistory" className="car-size-none">
                  <Activity/>
              </TabPane>
              }
            </Tabs>
            <Row>
              <Col offset={12}>
                {
                  values?.createDate && (
                    <b>
                      <label>
                        <span style={{ color: '#013369' }}>{`Create Date: `}</span>
                        {!!values.createDate ? moment(new Date(values.createDate), dateFormatTable).local().format(DATE_FORMATS.monthDayYearHourMin) + ' ' : ' -- '}
                        <span style={{ color: '#013369' }}>{`Modified Date: `}</span>
                        {!!values.modifiedDate ? moment(new Date(values.modifiedDate), dateFormatTable).local().format(DATE_FORMATS.monthDayYearHourMin) + ' ' : ' -- '}
                        {(isHelmetType || isShoulderPadType) && <>
                          <span style={{ color: '#013369' }}>{`${isShoulderPadType ? 'Recondition' : 'Recertification'} Date: `}</span>
                          <DatePicker 
                            className="recertification-date"
                            disabledDate={(date) => {
                              return date.isAfter(moment());
                            }}
                            onChange={(value) => {
                              if ( !value ) return setFieldValue('lastCertification', null);
                              const formatDate = value?.format(dateFormat) + midDayUtc;
                              setFieldValue('lastCertification', formatDate);
                            }}
                            format={datePickerFormat}
                            placeholder={`${isShoulderPadType ? 'Recondition' : 'Recertification'} Date: `}
                            size="small"
                            value={!!values.lastCertification ? moment(new Date(values.lastCertification), dateFormat).local() : undefined}
                          />
                          {/*!!values.lastCertification ? moment(new Date(values.lastCertification), dateFormat).local().format(DATE_FORMATS.monthDayYearHourMin) + ' ' : ' -- '*/}
                        </>}
                      </label>
                    </b>
                  )
                }
              </Col>
            </Row>
          </EquipmentProvider>
        </div>
      </div>
    </DetailLayout>
  );
};
