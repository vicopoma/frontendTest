import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment-timezone';

import { Drawer } from '../../Shared/Drawer/Drawer';
import { DATE_FORMATS, MESSAGE_ALERT, } from '../../../constants/constants';
import { MessageAlertBackTool, useMessageAlertFunctions } from '../../../hook/customHooks/backdoor';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { messageAlertDrawerValidators } from '../../../constants/validators';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { useRolesList } from '../../../hook/hooks/roles';
import { RoleSelector } from '../../Shared/TreeSelectors/RoleSelector';

export const MessageAlertDrawer = ({showDrawer, messageAlertId, setSeasonId, closeDrawer, filterName}: {
  showDrawer: boolean,
  closeDrawer: Function,
  filterName?: string,
  messageAlertId: string,
  setSeasonId: any,
}) => {

  const { 
    messageAlert, 
    createMessageAlert, 
    loadMessageAlert, 
    updateMessageAlert 
  } = useMessageAlertFunctions(messageAlertId);

  const { TextArea } = Input;
  const { roles } = useRolesList();

  useEffect(() => {
    if(messageAlertId) {
      loadMessageAlert();
    }
  }, [messageAlertId, loadMessageAlert]);
  
  const {values, handleChange, setFieldValue, validateForm, resetForm, errors} = useFormik({
    initialValues: {
      description: messageAlert.description ?? '',
      endDate: messageAlert.endDate ? moment(messageAlert.endDate).utc().toISOString(): '',
      id: messageAlert.id ?? '', 
      roleList: messageAlert.roleList.length > 0 ? messageAlert.roleList : [...roles.map(role => ({ roleId: role.id }))],
      startDate: messageAlert.startDate ? moment(messageAlert.startDate).utc().toISOString(): '',
      title: messageAlert.title ?? '',
    },
    validationSchema: messageAlertDrawerValidators,
    enableReinitialize: true,
    onSubmit(values: MessageAlertBackTool) {
      //intentionally empty
    }
  });
  
  const { bodyFilter: messageAlertBodyFilter, addBodyFilter } = useBodyFilterParams(MESSAGE_ALERT);
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const [, setTrigger] = useState<number>(messageAlertBodyFilter?.trigger ?? 0);
  const hasPassedDeadline = messageAlertId !== '' && moment().isAfter(values.endDate); 
  
  return (
    <Drawer
      title={`${messageAlertId ? 'EDIT' : 'NEW'} MESSAGE ALERT`}
      onClose={() => {
        resetForm();
        closeDrawer();
        setCheckSubmitValidator(false);
        setSeasonId('');
      }}
      canModify={!hasPassedDeadline}
      // enableSaveButton={(seasonId && !season.active) || !seasonId}
      width="30%"
      visible={showDrawer}
      onChange={() => {
        setCheckSubmitValidator(true);
        validateForm(values).then((result) => {
          if(Object.keys(result).length === 0) {
            if(messageAlertId) {
              ConfirmationModal('Update Message Alert', 
                <div>
                  Are you sure to update the message alert <b>{`${values.title}`}</b>?
                </div>
              , () => {
                setCheckSubmitValidator(false);
                updateMessageAlert(values, () => {
                  setTrigger(prevState => {
                    addBodyFilter({
                      trigger: prevState + 1,
                    })
                    return prevState + 1;
                  })
                  closeDrawer();
                });
              });
            } else {
              ConfirmationModal('Create Message Alert', 
                <div>
                  Are you sure to create a new message alert <b>{`${values.title}`}</b>?
                </div>
              , () => {
                setCheckSubmitValidator(false);
                createMessageAlert(values, () => {
                  setTrigger(prevState => {
                    addBodyFilter({
                      trigger: prevState + 1,
                    });
                    return prevState + 1;
                  });
                  closeDrawer();
                });
              })
            }
          }
        });
      }}
      // alertResponse={rebuildResponse}
      extraButton={
        <></>
      }
      enableExtraButton={false}
    >
      <Form layout="vertical" className="modal-activity" onSubmitCapture={() => {}/*handleSubmit*/}>
        <div className="drawer_config">
          <h5>Information</h5>
          <div className="">
            <div className="drawer_body_config">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Name Message">
                    <Input 
                      disabled={hasPassedDeadline}
                      name="title"
                      onChange={handleChange}
                      placeholder="Insert message title"
                      value={values.title}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.title && <span className="form-feedback">{errors.title}</span>}
                </Col>
                <Col span={24}>
                  <Form.Item label="Message Description">
                    <TextArea 
                      name="description"
                      placeholder="Enter the message"
                      onChange={(e) => {
                        if (!hasPassedDeadline) handleChange(e);
                      }}
                      autoSize={{ minRows: 5, maxRows: 5}}
                      value={values.description}
                      maxLength={300}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.description && <span className="form-feedback">{errors.description}</span>}
                </Col>
                <Col span={12}>
                  <Form.Item label="Start Date">
                    <DatePicker
                      name="startDate"
                      disabled={messageAlertId !== ''}
                      format={DATE_FORMATS.monthDayYearHourMin}
                      onChange={(value) => {
                        setFieldValue('startDate', value ? value.utc().toISOString() : '');
                      }}
                      picker='date'
                      showTime
                      style={{width: '100%'}}
                      value={values.startDate ? moment(values.startDate) : undefined}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.startDate && <span className="form-feedback">{errors.startDate}</span>}
                </Col>
                <Col span={12}>
                  <Form.Item label="End Date">
                    <DatePicker
                      disabled={messageAlertId !== ''}
                      format={DATE_FORMATS.monthDayYearHourMin}
                      onChange={(value) => {
                        setFieldValue('endDate', value ? value.utc().toISOString() : '');
                      }}
                      picker='date'
                      showTime
                      style={{width: '100%'}}
                      value={values.endDate ? moment(values.endDate): undefined}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.endDate && <span className="form-feedback">{errors.endDate}</span>}
                </Col>
                <Col span={12}>
                  <Form.Item label="Users to Send" className="role-selector">
                    <RoleSelector 
                      disabled={hasPassedDeadline}
                      onChange={(values) => {
                        setFieldValue('roleList', values.map(role => ({ roleId: role })))
                      }}
                      name={`roleSelector${messageAlertId ? values.id : moment().utc().toISOString()}`}
                      selectedValues={values.roleList}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.roleList && <span className="form-feedback">{errors.roleList}</span>}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};
