import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Dropdown, Menu, Row, Tabs } from 'antd';
import { useFormik } from 'formik';
import { DownOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import { EQ_INFORMATION_VAR, EquipmentInformation } from '../../../store/types';
import { equipmentValidators } from '../../../constants/validators';
import { EquipmentHistory } from './History/EquipmentHistoryView';
import { EquipmentGeneral } from './General/EquipmentGeneralView';
import { TagHistory } from './Tag/TagHistory';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { AssignedPlayerSection } from './General/AssignedPlayer/AssignedPlayers';
import { useAccountDispatch, useAccountState } from '../../../hook/hooks/account';
import './EquipmentDetail.scss';

import { history } from '../../../store/reducers';
import { ROUTES } from '../../../settings/routes';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { 
  DATE_FORMATS, 
  dateFormat, 
  dateFormatTable, 
  EQUIPMENT, 
  EQUIPMENT_TYPES, 
  datePickerFormat, 
  midDayUtc, 
  RECLAIM,
  NEW} from '../../../constants/constants';
import { EquipmentProvider } from '../../../context/equipment';
import { useEquipmentCrud, useEquipmentFunctions } from '../../../hook/customHooks/equipment';
import {
  DEFAULT_PART_TYPE_RELATED_EQUIPMENT_MODEL,
  PartTypeRelatedEquipmentModel
} from '../../../store/types/partType';
import { generateEquipmentTypeName, isOemRole } from '../../../helpers/Utils';
import Icon from '../../Shared/CommomIcons/Icons';
import { PlayerHistory } from './PlayerHistory/PlayerHistory';
import { Activity } from './ActivityHistory/ActivityHistory';
import { useLoaderDispatch } from '../../../hook/hooks/loader';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';

const { TabPane } = Tabs;

export const EquipmentDetail = () => {

  const { account, teamSelected } = useAccountState();
  const { teamList } = account;
  const { equipmentTypeList } = useEquipmentTypeState();
  const { bodyFilter: equipmentParam,addBodyFilter } = useBodyFilterParams(EQUIPMENT);
  const { equipmentTypeDTOList } = account;
  const isOem = isOemRole(account.role.name);

  const paths = useLocation().pathname.split('/');
  const equipmentTypeId = isOem ? paths[paths.length - 3] : paths[paths.length - 2];
  const equipmentId = paths[paths.length - 1];
  const teamId = isOem ? paths[paths.length - 2] : undefined;
  const [trigger, setTrigger] = useState<number>(0);

  const {showLoader} = useLoaderDispatch();

  const showStyleNumberSelector = equipmentTypeList.filter(data => data.id === equipmentTypeId).length > 0;
  const isShoulderPadType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.SHOULDER_PAD && data.id === equipmentTypeId).length > 0;
  const isHelmetType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET && data.id === equipmentTypeId).length > 0;

  const currentEquipmentTypeSelected = equipmentTypeList.filter(type => type.id === equipmentTypeId)[0]?.nameEquipmentType;

  const {
    equipment: {
      equipmentInformation,
      deleteEquipment,
      getEquipmentById,
      updateEquipment,
      saveEquipment
    }
  } = useEquipmentCrud(equipmentId);
  const {equipmentCode: {getEquipmentTypePlayerCode}} = useEquipmentFunctions();
  const { archiveEquipment } = useEquipmentFunctions();

  const [save, setSave] = useState<boolean>(true);

  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '', description: '', type: undefined
  });

  const {
    handleSubmit,
    values,
    handleChange,
    errors,
    setFieldValue,
    validateForm,
    handleBlur,
    touched
  } = useFormik<EquipmentInformation>({
    initialValues: {
      ...equipmentInformation,
      equipmentTypeId
    },
    enableReinitialize: true,
    validationSchema: equipmentValidators,
    onSubmit() {
    }
  });

  const [styleNumberPartType, setStyleNumberPartType] = useState<PartTypeRelatedEquipmentModel>({
    ...DEFAULT_PART_TYPE_RELATED_EQUIPMENT_MODEL,
    partIdSelected: values?.[EQ_INFORMATION_VAR.STYLE_NUMBER_ID]
  });

  const { replaceAccountSelectedTeam } = useAccountDispatch();

  const { bodyFilter: reclaimBodyFilter } = useBodyFilterParams(RECLAIM);

  useEffect(() => {
    setFieldValue(EQ_INFORMATION_VAR.TEAM_ID, teamId ?? teamSelected?.teamId);
  }, [getEquipmentById, setFieldValue, teamSelected?.teamId, teamId]);

  useEffect(() => {
    if(trigger > 0 && !!equipmentId && equipmentId !== NEW) {
      getEquipmentById(equipmentId);
    }
  }, [equipmentId, getEquipmentById, trigger]);

  
  useEffect(() => {
    const team = teamList.filter(team => team.teamId === equipmentInformation?.teamId)[0];
    if (!!team && !isOem && !reclaimBodyFilter.reclaimEquipment) {
      replaceAccountSelectedTeam(team);
    }
  }, [equipmentInformation?.teamId, isOem, teamList]);
    
  return (
    <DetailLayout
      canModify={save}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                showLoader(true);
                updateEquipment({
                  ...values,
                  [EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST]:
                    showStyleNumberSelector && !!styleNumberPartType.id ? [...values[EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST], styleNumberPartType]
                      : values?.[EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST]

                }, setResponse, async () => {
                  setTrigger(prevState => prevState + 1);
                  showLoader(false);
                });
              } else {
                showLoader(true);
                saveEquipment({
                  ...values,
                  imported: false,
                  [EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST]:
                    showStyleNumberSelector && !!styleNumberPartType.id ? [...values[EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST], styleNumberPartType]
                      : values?.[EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST]
                }, setConnectionResponse, (newEquipment: EquipmentInformation) => {
                  showLoader(false);
                  if(isOem) {
                    history.replace(ROUTES.EQUIPMENT.DETAIL_OEM(equipmentTypeId, teamId + '', newEquipment.id));
                  } else {
                    history.replace(ROUTES.EQUIPMENT.DETAIL(equipmentTypeId, newEquipment.id));
                  }
                });
              }
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? (() => {
        ConfirmationModal('Delete', `Are you sure to delete this Equipment: ${values.nameEquipmentType}?`, () => {
          deleteEquipment(values.id, setConnectionResponse, () => {
            if (!!history.location.key) {
              history.goBack();
            } else {
              history.push(ROUTES.LOGIN.PAGE());
            }
          });
        });
      }) : undefined}
      onCreateAnotherButton={(values.id && showStyleNumberSelector)? (() => {
        ConfirmationModal('Create Another', `Are you sure to create another Equipment: ${values.nameEquipmentType}?`, () => {
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
        });
      }) : undefined}
      leftFooter={
        values?.id ? [
          <Button
            className="btn-yellow"
            icon={<Icon.ArchiveOutLined style={{ marginRight: '8px' }} archive={!values.archived} width="20px" />}
            onClick={() => {
              const text = values?.archived ? 'Unarchive' : 'Archive';
              ConfirmationModal(text, `Are you sure to ${text} this Equipment: ${values.nameEquipmentType}?`, () => {
                archiveEquipment(values.id, !values.archived, () => {
                  getEquipmentById(equipmentId);
                  setConnectionResponse({
                    type: 'success',
                    description: `Equipment has been ${text.toLowerCase()}d successfully`,
                    title: 'Success',
                  })
                });
              });
            }}>
            {values?.archived ? 'Unarchive' : 'Archive'}
          </Button>
        ] : undefined}
      alertResponse={connectionResponse}
    >
      <EquipmentProvider
        values={values}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        touched={touched}
        handleChange={handleChange}
        errors={errors}
        setStyleNumberPartType={setStyleNumberPartType}
        setSave={setSave}
      >
        <div className="card-container-equipment">
          <div className="drawer-header-equipment">
            <NavigationBar
              rightBar={[<AssignedPlayerSection
                currentTeam={teamId ?? teamSelected?.teamId}
              />]}
              navTitle={
                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu
                      onClick={e => {
                        if (e.key !== equipmentParam?.equipmentTypeId) {
                          addBodyFilter({
                            equipmentTypeId: e.key,
                          });
                          history.push(ROUTES.EQUIPMENT.PAGE(e.key));
                        }
                      }}
                    >
                      {
                        isOem ? equipmentTypeDTOList.map(equipmentType => (
                          <Menu.Item key={equipmentType.id}> <span className="type-text">
                            <Icon.Equipment className="navigation-icon" type={equipmentType.nameEquipmentType as EQUIPMENT_TYPES} width="20px"/>
                              <label>
                                {
                                  generateEquipmentTypeName(equipmentType.nameEquipmentType)
                                }
                              </label>
                          </span> </Menu.Item>
                        )) : equipmentTypeList.map(equipmentType => (
                          <Menu.Item key={equipmentType.id}> <span className="type-text">
                            <Icon.Equipment className="navigation-icon" type={equipmentType.nameEquipmentType as EQUIPMENT_TYPES} width="20px"/>
                              <label>
                                {
                                  generateEquipmentTypeName(equipmentType.nameEquipmentType)
                                }
                              </label>
                          </span> </Menu.Item>
                        ))
                      }
                    </Menu>}>
                  <Button
                    icon={
                      <Icon.Equipment className="navigation-icon" type={currentEquipmentTypeSelected} width="25px" />
                    }
                    className="navigation-button-eq">
                    <div className="navigation-text">
                      <h4>{generateEquipmentTypeName(currentEquipmentTypeSelected)} </h4>
                      <DownOutlined />
                    </div>
                  </Button>
                </Dropdown>
              }
              navigationRoute={[
                {
                  path: ROUTES.EQUIPMENT.PAGE(paths[2]),
                  breadcrumbName: `${currentEquipmentTypeSelected} list`
                },
                {
                  path: paths[3],
                  breadcrumbName: values.id ? `Edit (${values[EQ_INFORMATION_VAR.EQUIPMENT_CODE]})` : 'New Equipment'
                }
              ]}
            />
          </div>
          <div className="drawer-body-equipment">

            <Tabs
              className="tag-history"
              defaultActiveKey="information"
              type="card"
              onChange={tab => {
                setSave(tab === 'information');
              }}
              destroyInactiveTabPane
            >
              <TabPane tab="Information" key="information" className="car-size" >
                <EquipmentGeneral 
                  fetchResponse={setConnectionResponse} 
                  teamId={teamId}
                  reclaimRedirectionRoute={(equipmentId) => ROUTES.EQUIPMENT.DETAIL(equipmentTypeId, equipmentId)}
                />
              </TabPane>
              {!!values.id && <TabPane tab="Equipment History" key="history" className="car-size-none">
                <EquipmentHistory equipmentId={values.id} />
              </TabPane>
              }
              {!!values.id &&
                <TabPane tab="Tag History" key="tagHistory" className="car-size-none">
                  <TagHistory />
                </TabPane>
              }
              {!!values.id &&
                <TabPane tab="Activity History" key="activityHistory" className="car-size-none">
                  <Activity />
                </TabPane>
              }
              {
                !!values.id &&
                <TabPane tab="Player History" key="playerHistory" className="car-size-none">
                  <PlayerHistory />
                </TabPane>
              }
            </Tabs>
            <Row>
              <Col offset={12}>
                {
                  values.createDate && (
                    <div className="eq-footer">
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
                          {/*!!values.lastCertification ? moment(new Date(values.lastCertification), dateFormat).local().format(DATE_FORMATS.monthDayYear) + ' ' : ' -- '*/}
                        </>}
                      </label>
                    </b>
                    </div>
                  )
                }
              </Col>
            </Row>
          </div>
        </div>
      </EquipmentProvider>
    </DetailLayout>
  );
};
