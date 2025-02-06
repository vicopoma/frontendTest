import React, { useCallback, useEffect, useState } from 'react';
import { Col, Form, Row, Select, Switch } from 'antd';

import { useFormik } from 'formik';
import { UserState } from '../../../store/types/users';
import { useRolesList } from '../../../hook/hooks/roles';
import { useUser } from '../../../hook/hooks/users';
import { userValidators } from '../../../constants/validators';
import { useAccountState } from '../../../hook/hooks/account';
import { roleCanModify } from '../../../helpers/Utils';
import { ACCOUNT_ROLES, NEW } from '../../../constants/constants';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { Input } from '../../Shared/CustomInput/CustomInput';
import { ConfirmationModal, WarningModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router-dom';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { stringOrUndefined } from '../../../helpers/ConvertUtils';

export const UserDetail = ({openDrawer, closeDrawer}: { openDrawer: boolean, closeDrawer: Function }) => {
  
  const path = useLocation().pathname.split('/');
  const userId = path[path.length - 1];
  
  const {Option} = Select;
  
  const {account} = useAccountState();
  const { manufacturerList } = account;
  
  const {user, createUser, updateUser, deleteUser} = useUser(userId);
  const {roles} = useRolesList();
  
  const isAdminOrMantainerTeam = account.role.name === ACCOUNT_ROLES.ADMIN_USER || account.role.name === ACCOUNT_ROLES.TEAM_MAINTAINER;
  const isOemAdmin = account.role.name === ACCOUNT_ROLES.OEM_ADMIN;
  
  const [canSelectTeam, setCanSelectTeam] = useState<boolean>(false);
  const [canSelectManufacturer, setCanSelectManufacturer] = useState<boolean>(false);
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '',
    description: '',
    type: undefined
  });
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN) || roleCanModify(account.role.name, ACCOUNT_ROLES.ADMIN_USER) || account.role.name === ACCOUNT_ROLES.OEM_ADMIN;
  
  const {values, handleChange, handleSubmit, setFieldValue, errors, validateForm, resetForm} = useFormik<UserState>({
    initialValues: user,
    validationSchema: userValidators,
    enableReinitialize: true,
    onSubmit() {
      //nothing to do
    }
  });

  const getRoleName = useCallback((id: string) => {
    const filterRole = roles.filter(role => role.id === id);
    return filterRole.length > 0 ? filterRole[0].name : '';
  }, [roles]);
  
  useEffect(() => {
    const role = getRoleName(user.roleId);
    setCanSelectTeam(ACCOUNT_ROLES.USER_TEAM === role || ACCOUNT_ROLES.ADMIN_USER === role || ACCOUNT_ROLES.TEAM_MAINTAINER === role);
    setCanSelectManufacturer(ACCOUNT_ROLES.OEM_ADMIN === role || ACCOUNT_ROLES.OEM_TEAM_USER === role);
  }, [getRoleName, roles, user.roleId, user.roleName]);
  
  useEffect(() => {
    if (isAdminOrMantainerTeam) {
      setFieldValue('teamId', account.teamList[0]?.teamId);
    }
  }, [account.teamList, canSelectTeam, isAdminOrMantainerTeam, setFieldValue, values.teamId]);

  useEffect(() => {
    if(isOemAdmin) {
      setFieldValue('manufacturerId', account.manufacturerId);
    }
  }, [account.manufacturerId, account.manufacturerList, canSelectManufacturer, isOemAdmin, setFieldValue, values.manufacturerId]);
  
  return (
    <DetailLayout
      onClose={() => {
        closeDrawer();
        resetForm();
      }}
      canModify={canModify}
      width="40%"
      closable={openDrawer}
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          setCheckSubmitValidator(true);
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (userId === NEW) {
                createUser(values, setResponse, res => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.USERS, res?.id));
                });
              } else {
                updateUser(values, setResponse);
              }
              setCheckSubmitValidator(false);
            }
          });
          handleSubmit();
        });
      }}
      
      onDeleteButton={values.id && canModify ? (() => {
        if (values.id !== account.id && !values.su) {
          ConfirmationModal(
            'Delete',
            `Are you sure to delete user: ${values.name}?`,
            () => {
              deleteUser(values.id, setConnectionResponse, () => {
                history.replace(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.USERS));
              });
            });
        } else {
          WarningModal('Operation not allowed', 'You cannot delete this account');
        }
      }) : undefined}
    >
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">User</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.USERS),
            breadcrumbName: 'Users List'
          },
          {
            path: '',
            breadcrumbName: values.id ? 'Update User' : 'Create User'
          }
        ]}
      />
      <div>
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <div className="drawer_config">
            <h5>Information</h5>
            <div className="drawer_body_config">
              <Row gutter={[16, 16]} justify="start">
                <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Form.Item help={!!errors.name && checkSubmitValidator && ''}
                             label={<span className="required-item">Name</span>}>
                    <Input
                      id="cUInputName"
                      isInput={canModify}
                      value={values.name}
                      name="name"
                      onChange={handleChange}
                      size={'small'}
                      placeholder="First Name"
                    />
                    {checkSubmitValidator && errors.name && <span className="form-feedback"> {errors.name} </span>}
                  </Form.Item>
                </Col>
                <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Form.Item help={!!errors.login && checkSubmitValidator && ''}
                             label={<span className="required-item">User name</span>}>
                    <Input
                      id="cUInputUserName"
                      isInput={canModify && !values.id}
                      value={values.login}
                      name="login"
                      onChange={handleChange}
                      size={'small'}
                      placeholder="User name"
                    />
                    {checkSubmitValidator && errors.login && <span className="form-feedback"> {errors.login} </span>}
                  </Form.Item>
                </Col>
                <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Form.Item help={!!errors.email && checkSubmitValidator && ''}
                             label={<span className="required-item">Email</span>}>
                    <Input
                      id="cPInputEmail"
                      isInput={canModify}
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      size={'small'}
                      placeholder="Email"
                    />
                    {checkSubmitValidator && errors.email && <span className="form-feedback"> {errors.email} </span>}
                  </Form.Item>
                </Col>
                <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                  
                  <Form.Item help={!!errors.roleId && checkSubmitValidator && ''}
                             label={<span className="required-item">Role</span>}>
                    <Select
                      id="cUInputRole"
                      disabled={user.su || !canModify}
                      value={stringOrUndefined(values.roleId)}
                      showSearch
                      style={{marginRight: '8px'}}
                      placeholder="Select"
                      optionFilterProp="children"
                      size={'small'}
                      onChange={(data) => {
                        const role = roles.filter(role => role.id === data)[0];
                        setCanSelectTeam(ACCOUNT_ROLES.USER_TEAM === role.name || ACCOUNT_ROLES.ADMIN_USER === role.name || ACCOUNT_ROLES.TEAM_MAINTAINER === role.name)
                        setCanSelectManufacturer(ACCOUNT_ROLES.OEM_ADMIN === role.name || ACCOUNT_ROLES.OEM_TEAM_USER === role.name);
                        setFieldValue('roleId', data);
                        setFieldValue('roleName', role.name);
                      }}
                    >
                      {
                        roles.map((role, index) => (
                          <Option key={index} value={role.id}> {role.name}</Option>
                        ))
                      }
                    </Select>
                    {checkSubmitValidator && errors.roleId && <span className="form-feedback"> {errors.roleId} </span>}
                  </Form.Item>
                </Col>
                <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Form.Item label="Status">
                    <Switch disabled={user.su || !canModify} checked={values.active}
                            onChange={data => setFieldValue('active', data)}/> Active
                  </Form.Item>
                </Col>
                {
                  (!isAdminOrMantainerTeam && canSelectTeam && values.roleId) &&
                  <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>

                      <Form.Item help={!!errors.teamId && checkSubmitValidator && ''}
                                 label={<span className="required-item">Team</span>}>
                          <Select
                              id="cUInputTeams"
                              disabled={!canModify}
                              showSearch
                              style={{marginRight: '25px'}}
                              placeholder="Select"
                              optionFilterProp="children"
                              size={'small'}
                              value={stringOrUndefined(values.teamId)}
                              onChange={(values) => {
                                setFieldValue('teamId', values);
                              }}
                              virtual={false}
                          >
                            {
                              account?.teamList?.map(team => (
                                <Select.Option value={team.teamId}>
                                  {team.fullName}
                                </Select.Option>
                              ))
                            }
                          </Select>
                        {checkSubmitValidator && errors.teamId &&
                        <span className="form-feedback"> {errors.teamId} </span>}
                      </Form.Item>
                  </Col>
                }
                {
                  (!isOemAdmin && canSelectManufacturer && values.roleId) &&
                  <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                      <Form.Item help={!!errors.teamId && checkSubmitValidator && ''}
                                 label={<span className="required-item">Manufacturer</span>}>
                          <Select
                              id="cUInputManufacturers"
                              disabled={!canModify}
                              showSearch
                              style={{marginRight: '25px'}}
                              placeholder="Select"
                              optionFilterProp="children"
                              size={'small'}
                              value={stringOrUndefined(values.manufacturerId)}
                              onChange={(values) => {
                                setFieldValue('manufacturerId', values);
                              }}
                              virtual={false}
                          >
                            {
                              manufacturerList.map(manufacturer => (
                                <Select.Option value={manufacturer.id}>
                                  {manufacturer.nameManufacturer}
                                </Select.Option>
                              ))
                            }
                          </Select>
                        {checkSubmitValidator && errors.manufacturerId &&
                        <span className="form-feedback"> {errors.manufacturerId} </span>}
                      </Form.Item>
                  </Col>
                }
              </Row>
            </div>
          </div>
        </Form>
      </div>
    </DetailLayout>
  );
  
};
