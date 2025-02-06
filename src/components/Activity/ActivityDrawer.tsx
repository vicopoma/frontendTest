import React, { useEffect, useState } from 'react';
import { Drawer, FetchResponse } from '../Shared/Drawer/Drawer';
import { Col, DatePicker, Form, Row, Select, TimePicker, Button } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import { ClockCircleOutlined } from '@ant-design/icons';

import { useActivitiesDispatch } from '../../hook/hooks/activity';
import { useLocation } from 'react-router';
import { ActivityTabs, ROUTES } from '../../settings/routes';
import { ACCOUNT_ROLES, DATE_FORMATS, ROLE_HIERARCHY, WEEK_IN_HOURS, datePickerFormat } from '../../constants/constants';
import { useAccountDispatch, useAccountState } from '../../hook/hooks/account';
import { ActivityForm, ActivityState, TeamsPractice, TeamState } from '../../store/types';

import { activityDrawerValidators } from '../../constants/validators';
import { ConfirmationModal } from '../Shared/Modals/Modals';
import { useScheduleFunctions } from '../../hook/customHooks/schedule';
import { useNotificationContext } from '../../context/notifications';

import { history } from '../../store/reducers';
import { isFuture, isInAllowedTimeStartOf, isRunning, roleCanModify } from '../../helpers/Utils';

export const ActivityDrawer = ({showDrawer, closeDrawer, isCalendar, teamsPractice, filterName}: {
  showDrawer: boolean,
  closeDrawer: Function,
  isCalendar: boolean,
  teamsPractice?: TeamsPractice,
  filterName?: string,
}) => {
  
  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1].toUpperCase();
  
  const isGame = path === ActivityTabs.GAME;
  
  const {account} = useAccountState();
  const {updateNotifications} = useAccountDispatch();
  const {rebuildSchedule} = useScheduleFunctions();
  
  const currentPractice = teamsPractice?.teams.filter(team => team.id === teamsPractice.sessionId)?.[0];
  
  const {saveActivity, updateActivityCalendar} = useActivitiesDispatch();
  const {values, handleSubmit, setFieldValue, validateForm, resetForm, errors} = useFormik({
    initialValues: {
      endGameDate: currentPractice?.endGameDate ?? '',
      homeTeamId: currentPractice?.homeTeamId ?? (account.teamList.length === 1 ? account.teamList[0].teamId : ''),
      startGameDate: currentPractice?.startGameDate ?? '',
      type: path,
      timeZone: moment.tz.guess(),
      duration: 2,
      title: '',
      roleName: '',
    },
    validationSchema: activityDrawerValidators,
    enableReinitialize: true,
    onSubmit(values: ActivityForm) {
      //intentionally empty
    }
  });
  
  
  const {updateProgressBar} = useNotificationContext();
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const [enableSaveButton, setEnableSetButton] = useState<boolean>(!currentPractice?.homeTeamId || (isInAllowedTimeStartOf(currentPractice?.startGameDate + '', 2 * WEEK_IN_HOURS, 'day') && roleCanModify(account.role.name, ACCOUNT_ROLES.TEAM_MAINTAINER)));
  
  const [rebuildResponse, setRebuildResponse] = useState<FetchResponse>();
  
  useEffect(() => {
    setFieldValue('roleName', account.role.name);
    return () => {
      resetForm();
    };
  }, [account.role.name, setFieldValue, showDrawer, resetForm]);
  
  const dataTeams: Array<TeamState> = [];
  for (const teamListItem of account.teamList) {
    dataTeams.push(teamListItem);
  }

  const isPresentComingPractice = isRunning(values as Partial<ActivityState>) || isFuture(values as Partial<ActivityState>);

  return (
    <Drawer
      title={teamsPractice?.sessionId ? `${currentPractice?.homeTeamName} PRACTICE` : 'NEW PRACTICE'}
      onClose={() => {
        resetForm();
        closeDrawer();
        setCheckSubmitValidator(false);
      }}
      canModify={!isGame}
      enableSaveButton={enableSaveButton}
      width="40%"
      visible={showDrawer}
      onChange={(setResponse) => {
        setCheckSubmitValidator(true);
        validateForm(values).then(result => {
          if (Object.keys(result).length === 0) {
            if (!currentPractice?.id) {
              ConfirmationModal('Create Practice',
                <div>
                  Are you sure to create a practice from
                  <b> {`${moment(values.startGameDate).format(DATE_FORMATS.hourMinA)} to ${moment(values.endGameDate).format(DATE_FORMATS.hourMinA)}`}</b>?
                </div>, () => {
                setCheckSubmitValidator(false);
                saveActivity(
                  values,
                  filterName || '',
                  setResponse,
                  isCalendar,
                  () => {
                    setEnableSetButton(() => false);
                    closeDrawer();
                  }
                );
              });
            } else {
              ConfirmationModal('Update Practice',
                <div>
                  Are you sure to update a practice from
                  <b> {`${moment(values.startGameDate).format(DATE_FORMATS.hourMinA)} to ${moment(values.endGameDate).format(DATE_FORMATS.hourMinA)}`}</b>?
                </div>, () => {
                setCheckSubmitValidator(false);
                updateActivityCalendar(
                  { ...values, id: currentPractice?.id, },
                  filterName || '',
                  setResponse,
                  isCalendar,
                  () => {
                    setEnableSetButton(() => false);
                    closeDrawer();
                  }
                );
              });
            }
          
          }
        });
      }}
      alertResponse={rebuildResponse}
      extraButton={
        teamsPractice?.sessionId && ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] >= ROLE_HIERARCHY[ACCOUNT_ROLES.ZEBRA_ADMIN] && (
            <Button className="btn-blue"
              icon={<ClockCircleOutlined/>}
              onClick={() => {
                ConfirmationModal('Practice generationLoaderButton',
                  <>
                    Are you sure you want to regenerate
                    <b> {`${currentPractice?.homeTeamName}
                        ${moment(currentPractice?.startGameDate).format(DATE_FORMATS.monthDayYear)}
                        ${moment(currentPractice?.startGameDate).format(DATE_FORMATS.hourMin)}-${moment(currentPractice?.endGameDate).format(DATE_FORMATS.hourMin)} `}
                    </b>
                    practice?
                  </>,
                  () => {
                    rebuildSchedule(
                      teamsPractice?.sessionId ?? '',
                      'true',
                      () => {
                        updateProgressBar();
                        updateNotifications(true);
                        setRebuildResponse({
                          title: 'Success',
                          type: 'success',
                          description: 'Practices is being regenerated successfully'
                        });
                      },
                      (res, httpResponse) => {
                        setRebuildResponse({
                          type: 'error',
                          title: 'Something has gone wrong',
                          description: httpResponse.message
                        });
                      }
                    );
                  });
              }}>
              Regenerate practice
            </Button>
        )
      }
      enableExtraButton={!isPresentComingPractice}
      openButton={  
        teamsPractice?.sessionId && (
            <Button className="btn-header"
              style={{
                width: '145px',
                padding: '3px 15px',
                margin: '2px 6px 0',
                height: '32px',
              }}
              icon={<img
                className="img-h anticon"
                src="/images/activity-type/PRACTICE.svg"
                alt=""
                width="18px"
                height="18px"
                style={{
                  paddingTop: '3px',
                }}
              />}
              onClick={() => {
                history.push(ROUTES.ACTIVITY.SELECTOR(path.toLowerCase(), teamsPractice.sessionId || ''));
              }}>
              Open Practice
            </Button>
        )
      }
      enableOpenButton={true}
    >
      <Form layout="vertical" className="modal-activity" onSubmitCapture={handleSubmit}>
        <div className="drawer_config">
          <h5>Information Practice</h5>
          <div className="">
            <div className="drawer_body_config">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Date">
                    <DatePicker
                      style={{width: '100%'}}
                      disabled
                      value={teamsPractice?.date ? moment(teamsPractice?.date, DATE_FORMATS.monthDayYear) : undefined}
                      showTime
                      format={datePickerFormat}
                      onChange={(value) => {
                        setFieldValue('startGameDate', value ? value.utc().toISOString() : '');
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item help={(!!errors.startGameDate || !!errors.endGameDate) && checkSubmitValidator && ''}
                             label={<span className="required-item">Time</span>}>
                    <TimePicker.RangePicker
	                    picker="time"
                      disabled={(!!currentPractice) && !enableSaveButton}
                      style={{width: '100%'}}
                      value={values.startGameDate ? [moment(values.startGameDate), moment(values.endGameDate)] : undefined}
                      showSecond={false}
                      size="middle"
                      minuteStep={5}
                      format={DATE_FORMATS.hourMinA}
                      use12Hours={true}
                      onChange={(value) => {
                        setFieldValue('startGameDate', moment(teamsPractice?.date ? teamsPractice?.date : '', DATE_FORMATS.monthDayYearHourMin).local().set({
                          hour: value?.[0]?.hour(),
                          minute: value?.[0]?.minute(),
                        }).toISOString());
                        setFieldValue('endGameDate', moment(teamsPractice?.date ? teamsPractice?.date : '', DATE_FORMATS.monthDayYearHourMin).local().set({
                          hour: value?.[1]?.hour(),
                          minute: value?.[1]?.minute(),
                        }).toISOString());
                      }}
                    />
                    {checkSubmitValidator && errors.startGameDate &&
                    <span className="form-feedback"> {errors.startGameDate} </span>}
                    {checkSubmitValidator && errors.endGameDate &&
                    <span className="form-feedback"> {errors.endGameDate} </span>}
                  </Form.Item>
                </Col>
                {account.teamList.length !== 1 &&
                <Col span={24}>
                    <Form.Item
                        help={!!errors.homeTeamId && checkSubmitValidator && ''}
                        label={<span className="required-item">Select Team</span>}>
                        <Select
                            disabled={!!currentPractice}
                            defaultValue={account.teamList.length > 1 ? undefined : account.teamList[0]?.abbr}
                            value={values.homeTeamId ? values.homeTeamId : undefined}
                            style={{marginRight: '8px'}}
                            className="type-text"
                            showSearch
                            placeholder="Select"
                            optionFilterProp="children"
                            id="homeTeamId"
                            onChange={(value: string) => {
                              setFieldValue('homeTeamId', value);
                            }}
                        >
                          {
                            dataTeams.map((team, index) => {
                              return (
                                <Select.Option key={index} value={team.teamId} className="nav-profile-team">
                                  {team.fullName}
                                </Select.Option>
                              );
                            })
                          }
                        </Select>
                      {checkSubmitValidator && errors.homeTeamId &&
                      <span className="form-feedback"> {errors.homeTeamId} </span>}
                    </Form.Item>
                </Col>
                }
              </Row>
            </div>
          </div>
        </div>
        {
          
        }
      </Form>
    </Drawer>
  );
};
