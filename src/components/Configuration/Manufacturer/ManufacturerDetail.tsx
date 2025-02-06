import React, { useState } from 'react';
import { Col, Form, Row } from 'antd';
import { useFormik } from 'formik';

import { manufacturerValidators } from '../../../constants/validators';
import { useManufacturer } from '../../../hook/hooks/manufacturer';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { roleCanModify } from '../../../helpers/Utils';
import { ACCOUNT_ROLES, MESSAGE_TYPE } from '../../../constants/constants';
import { useAccountState } from '../../../hook/hooks/account';
import { Input, TextArea } from '../../Shared/CustomInput/CustomInput';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { SuccessMessage } from '../../Shared/Messages/Messages';


export const ManufacturerDetail = () => {
  const paths = useLocation().pathname.split('/');
  const manufacturerId = paths[paths.length - 1];
  const {manufacturer, createManufacturer, updateManufacturer, deleteManufacturer} = useManufacturer(manufacturerId);
  
  const {account} = useAccountState();
  
  const [connectionResponse] = useState<FetchResponse>({title: '', description: '', type: undefined});
  
  const {handleSubmit, values, handleChange, errors, validateForm, touched} = useFormik({
    initialValues: manufacturer,
    validationSchema: manufacturerValidators,
    enableReinitialize: true,
    onSubmit() {
    
    }
  });
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  return (
    <DetailLayout
      width={'35%'}
      canModify={canModify}
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                updateManufacturer(values, setResponse);
              } else {
                createManufacturer(values, setResponse, (res) => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.MANUFACTURER, res.id));
                });
              }
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? ((setResponse) => {
        ConfirmationModal('Delete', `Are you sure to delete this manufacturer: ${values.nameManufacturer}?`,
          () => deleteManufacturer(manufacturerId, undefined, () => {
            SuccessMessage({description: 'Manufacturer Deleted Successfully'});
            history.replace(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANUFACTURER));
          }, (result, response) => {
            setResponse({
              title: 'Warning',
              type: MESSAGE_TYPE.WARNING,
              description: response?.message
            });
          })
        );
      }) : undefined}
    >
      <div className="drawer_config">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Manufacturer</span>
            </div>
          }
          navigationRoute={[
            {
              path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANUFACTURER),
              breadcrumbName: 'Manufacturer List'
            },
            {
              path: '',
              breadcrumbName: values.id ? 'Update Manufacturer' : 'Create Manufacturer'
            }
          ]}
        />
        <h5>Information</h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label={<span className="required-item">Name Manufacturer</span>}
                           help={!!errors.nameManufacturer && !!touched.nameManufacturer && ''}>
                  <Input
                    id="cInputNameManufacture"
                    key="cInputNameManufacture"
                    isInput={canModify}
                    placeholder="Name..."
                    value={values.nameManufacturer}
                    name="nameManufacturer"
                    onChange={handleChange}
                  />
                  {touched.nameManufacturer && errors.nameManufacturer &&
                  <span className="form-feedback"> {errors.nameManufacturer}</span>}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={'Description'} help={!!errors.description && ''}>
                  <TextArea id="cInputDescriptionManufacturer" isInput={canModify} placeholder="Description"
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
