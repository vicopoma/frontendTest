import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { useFormik } from 'formik';
import { LockOutlined } from '@ant-design/icons';

import { Drawer, FetchResponse } from '../Shared/Drawer/Drawer';
import { ProfileInformation } from './Information';
import { ChangePassword } from './ChangePasswordView';
import { useAccountDispatch, useAccountState } from '../../hook/hooks/account';
import { ChangePasswordValidator } from '../../constants/validators';
import { ConfirmationModal } from '../Shared/Modals/Modals';
import { clearLocalStorageByKey, clearStorageByKey } from '../../helpers/Utils';
import { SESSION_STORAGE } from '../../constants/constants';

export const Profile = ({closeDrawer}: {
  closeDrawer: Function
}) => {
  
  const {account} = useAccountState();
  const {changePassword} = useAccountDispatch();
  
  const {values, handleSubmit, handleChange, errors, touched, resetForm} = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    },
    validationSchema: ChangePasswordValidator,
    onSubmit(values) {
      changePassword(values.currentPassword, values.newPassword, setAlertResponse, resetForm);
    }
  });
  
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [alertResponse, setAlertResponse] = useState<FetchResponse>({
    title: '', description: '', type: undefined
  });
  
  const onConfirm = () => {
    clearStorageByKey([
      SESSION_STORAGE.FILTERS,
      SESSION_STORAGE.FILTERS_BODY_PARAMS
    ]);
    clearLocalStorageByKey([account.id]);
    window.location.reload();
  };
  
  return (
    <Drawer
      title="My Profile"
      onClose={() => {
        if (showChangePassword) {
          setShowChangePassword(false);
        } else {
          closeDrawer();
        }
      }}
      closable={true}
      visible={true}
      canModify={showChangePassword}
      onChange={() => handleSubmit()}
      width="auto"
      alertResponse={alertResponse}
    >
      
      <Form layout="vertical">
        <div className="info_body_back">
          {!showChangePassword ?
            <>
              <ProfileInformation/>
              {/*<h5> Special options </h5>
              
              <div className="drawer_body">
                <div
                  style={{
                    //position: 'relative',
                    //left: '50%',
                    padding: '10px'
                  }}>
                  <Row>
                    <Col span={24}>
                      <Form.Item>
                        <Switch
                          size="small"
                          checked={account.ds9908r}
                          onChange={(e) => {
                            setSwitchLoader(true);
                            enableDSDevice(e + '', setAlertResponse)
                            .then(() => {
                              setSwitchLoader(false);
                            });
                          }}
                          loading={switchLoader}
                        /> <label> <b> Use DS9908R </b></label>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                    
                    </Col>
                  </Row>
                </div>
              </div>*/}
            </> :
            <ChangePassword handleChange={handleChange} values={values} errors={errors} touched={touched}/>
          }
          {
            !showChangePassword && !account.isGoogle &&
            <>
                <h5> Security </h5>
                <div className="drawer_body">
                    <div
                        style={{
                          //position: 'relative',
                          //left: '50%',
                          padding: '10px'
                        }}>
                        <LockOutlined/>
                        <label
                            style={{textAlign: 'left', cursor: 'pointer'}}
                            onClick={() => setShowChangePassword(true)}
                        > Change My Password</label>
                    </div>
                </div>
            </>
          }
          
          <h5> Default Configuration </h5>
          <div className="drawer_body">
            <Button
              size="small"
              style={{
                margin: '10px',
              }}
              onClick={() => {
                ConfirmationModal(
                  'Default configuration',
                  'Are you sure about getting back default configuration?.\n' +
                  'Columns and filters will be set to default value', onConfirm);
              }}
              className="btn-green">
              Clear Cache
            </Button>
          </div>
        </div>
      </Form>
    
    </Drawer>
  );
};
