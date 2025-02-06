import { Col, Form, Row } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { equipmentTypeValidators } from '../../../constants/validators';
import { useEquipmentTypeDispatch, useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { roleCanModify } from '../../../helpers/Utils';
import { ACCOUNT_ROLES, NEW } from '../../../constants/constants';
import { useAccountState } from '../../../hook/hooks/account';
import { Input, TextArea } from '../../Shared/CustomInput/CustomInput';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router-dom';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { history } from '../../../store/reducers';

export const EquipmentTypeDetails = ({openDrawer, closeDrawer}: { openDrawer: boolean, closeDrawer: Function }) => {
  
  const path = useLocation().pathname.split('/');
  const equipmentTypeId = path[path.length - 1];
  
  const {equipmentType} = useEquipmentTypeState();
  const {postEquipmentType, putEquipmentType, deleteEquipmentType} = useEquipmentTypeDispatch();
  
  const {getEquipmentTypeById, getEquipmentTypeList} = useEquipmentTypeDispatch();
  const {account} = useAccountState();
  
  const {handleSubmit, values, handleChange, errors, validateForm, touched, resetForm} = useFormik({
    initialValues: equipmentType,
    validationSchema: equipmentTypeValidators,
    enableReinitialize: true,
    onSubmit() {
    }
  });
  
  useEffect(() => {
    if (!values.id) {
      resetForm();
    }
  }, [openDrawer, resetForm, values.id]);
  
  useEffect(() => {
    if (equipmentTypeId !== NEW) {
      getEquipmentTypeById(equipmentTypeId);
    }
    return () => {
      getEquipmentTypeById('');
    };
    
  }, [equipmentTypeId, getEquipmentTypeById]);
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '',
    description: '',
    type: undefined
  });
  
  return (
    <DetailLayout
      onClose={() => {
        resetForm();
        closeDrawer();
      }}
      canModify={canModify}
      width="35%"
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                putEquipmentType(values, setResponse);
              } else {
                postEquipmentType(values, setResponse, (res) => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_TYPE, res.id));
                });
              }
              getEquipmentTypeList();
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? (() => {
        ConfirmationModal(
          'Delete',
          `Are you sure to delete ${values.nameEquipmentType}?`,
          () => deleteEquipmentType(values.id, setConnectionResponse, () => {
            history.replace(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_TYPE));
          }));
      }) : undefined}
    >
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">Equipment Type</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_TYPE),
            breadcrumbName: 'Equipment Type List'
          },
          {
            path: '',
            breadcrumbName: values.id ? 'Update Equipment Type' : 'Create Equipment Type'
          }
        ]}
      />
      <div className="drawer_config">
        <h5>Information</h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label={<span className="required-item"> Equipment Type Name</span>}
                           help={!!errors.nameEquipmentType && !!touched.nameEquipmentType && ''}>
                  <Input
                    id="cInputEquipmentTypeName"
                    isInput={canModify}
                    placeholder="Equipment type name"
                    value={values.nameEquipmentType}
                    name="nameEquipmentType"
                    onChange={handleChange}
                  />
                  {errors.nameEquipmentType && <span className="form-feedback"> {errors.nameEquipmentType}</span>}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item help={!!errors.description && ''} label={'Description'}>
                  <TextArea id="cInputEquipmentTypeDescription" isInput={canModify} placeholder="Description"
                            value={values.description} name="description" onChange={handleChange}/>
                  {errors.description && <span className="form-feedback"> {errors.description}</span>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </DetailLayout>
  );
};
