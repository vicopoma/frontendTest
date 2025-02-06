import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'antd';
import { useFormik } from 'formik';
import { partTypeValidator } from '../../../constants/validators';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { generateEquipmentTypeName, roleCanModify } from '../../../helpers/Utils';
import { ACCOUNT_ROLES, MESSAGE_TYPE } from '../../../constants/constants';
import { useAccountState } from '../../../hook/hooks/account';
import { Input, TextArea } from '../../Shared/CustomInput/CustomInput';

import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router-dom';
import { useManufacturerList } from '../../../hook/hooks/manufacturer';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { useEquipmentModelList } from '../../../hook/customHooks/equipmentModel';
import { usePartTypeCrud } from '../../../hook/customHooks/partType';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { Select } from '../../Shared/Select/Select';
import { stringOrUndefined } from '../../../helpers/ConvertUtils';

export const PartTypeDetail = ({openDrawer, closeDrawer}: { openDrawer: boolean, closeDrawer: Function }) => {
  
  const path = useLocation().pathname.split('/');
  const partTypeId = path[path.length - 1];
  
  const {account} = useAccountState();
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const {partType, deletePartType, savePartType, updatePartType} = usePartTypeCrud(partTypeId);
  const {
    manufacturersByEquipmentType: {manufacturerList, getManufacturerByEquipmentType}
  } = useManufacturerList();
  
  const {equipmentModelList, getEquipmentModelByEquipmentTypeIdManufacturerType} = useEquipmentModelList();
  
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const [connectionResponse, ] = useState<FetchResponse>({
    title: '',
    description: '',
    type: undefined
  });
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  const {handleSubmit, values, handleChange, errors, setFieldValue, validateForm, resetForm} = useFormik({
    initialValues: partType,
    enableReinitialize: true,
    validationSchema: partTypeValidator,
    onSubmit() {
      //nothing to do
    }
  });
  
  useEffect(() => {
    if (values?.equipmentTypeId) {
      getManufacturerByEquipmentType(values.equipmentTypeId);
    }
  }, [getManufacturerByEquipmentType, values.equipmentTypeId]);
  
  useEffect(() => {
    if (values.manufacturerId) {
      getEquipmentModelByEquipmentTypeIdManufacturerType(values.equipmentTypeId, values.manufacturerId);
    }
  }, [getEquipmentModelByEquipmentTypeIdManufacturerType, values.equipmentTypeId, values.manufacturerId]);
  
  return (
    <DetailLayout
      width="35%"
      onClose={() => {
        closeDrawer();
        resetForm();
      }}
      canModify={canModify}
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          setCheckSubmitValidator(true);
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                updatePartType(values, setResponse);
              } else {
                savePartType(values, setResponse, res => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART_TYPE, res.id));
                });
              }
              setCheckSubmitValidator(false);
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? ((setResponse) => {
        ConfirmationModal('Delete', `Are you sure to delete this Part Type: ${values.namePartType}?`,
          () => deletePartType(values.id, undefined, () => {
            SuccessMessage({description: 'Part Type Deleted Successfully'});
            history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART_TYPE));
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
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">Part Type</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART_TYPE),
            breadcrumbName: 'Part Type List'
          },
          {
            path: '',
            breadcrumbName: values.id ? 'Update Part Type' : 'Create Part Type'
          }
        ]}
      />
      <div className="drawer_config">
        <h5>Information</h5>
        <div className="drawer_body_config">
          <Row align={'middle'} gutter={[16, 2]}>
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item label={<span className="required-item">Name</span>}
                                 help={!!errors.namePartType && checkSubmitValidator && ''}>
                        <Input
                          id="cPTInputName"
                          isInput={canModify}
                          placeholder="Name..."
                          value={values.namePartType}
                          name="namePartType"
                          onChange={handleChange}
                        />
                        {checkSubmitValidator && errors.namePartType &&
                        <span className="form-feedback"> {errors.namePartType} </span>}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label={<span className="required-item">Equipment Type</span>}
                                 help={!!errors.equipmentTypeId && checkSubmitValidator && ''}>
                        <Select
                          id="cPTInputEquipmentType"
                          disabled={!canModify}
                          showSearch
                          placeholder="Equipment Type"
                          value={stringOrUndefined(values.equipmentTypeId)}
                          onChange={(value) => {
                            setFieldValue('equipmentTypeId', value);
                            setFieldValue('manufacturerId', '');
                            setFieldValue('equipmentModelId', '');
                          }}
                          options={equipmentTypeList.map(equipmentType => (
                            {
                              value: equipmentType.id,
                              display: generateEquipmentTypeName(equipmentType.nameEquipmentType)
                            }
                          ))}
                        />
                        {checkSubmitValidator && errors.equipmentTypeId &&
                        <span className="form-feedback"> {errors.equipmentTypeId} </span>}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className={!values.manufacturerId ? '' : 'required-item'}>Manufacturer</span>}
                        help={!!errors.manufacturerId && checkSubmitValidator && ''}>
                        <Select
                          id="cPTInputManufacturer"
                          disabled={!canModify || !values?.equipmentTypeId}
                          showSearch
                          value={stringOrUndefined(values.manufacturerId)}
                          placeholder="Manufacturer"
                          onChange={(value) => {
                            setFieldValue('manufacturerId', value);
                            setFieldValue('equipmentModelId', '');
                          }}
                          options={[
                            {
                              value: "",
                              display: "None"
                            },
                            ...manufacturerList.map(manufacturer => ({
                              value: manufacturer.id,
                              display: manufacturer.nameManufacturer
                            }))
                          ]}
                        />
                        {checkSubmitValidator && errors.manufacturerId &&
                        <span className="form-feedback"> {errors.manufacturerId} </span>}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={<span className={!values.manufacturerId ? '' : 'required-item'}>Equipment Model</span>}
                        help={!!errors.equipmentModelId && checkSubmitValidator && ''}>
                        <Select
                          id="cPTInputEquipmentModel"
                          disabled={!canModify || !values?.manufacturerId}
                          showSearch
                          value={stringOrUndefined(values.equipmentModelId)}
                          placeholder="Equipment Model"
                          onChange={(value) => {
                            setFieldValue('equipmentModelId', value);
                          }}
                          options={equipmentModelList.map(equipmentModel => (
                            {
                              value: equipmentModel.id,
                              display: `${equipmentModel.nameModel} ${equipmentModel.modelYear ? equipmentModel.modelYear : ''}`
                            }
                          ))}
                        />
                        {checkSubmitValidator && errors.equipmentModelId &&
                        <span className="form-feedback"> {errors.equipmentModelId} </span>}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                
                <Col span={24}>
                  <Form.Item label="Description" help={!!errors.description && checkSubmitValidator}>
                    <TextArea id="cPTInputDescription" isInput={canModify} placeholder="Description"
                              value={values.description} name="description" onChange={handleChange}/>
                    {errors.description && <span className="form-feedback"> {errors.description} </span>}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Row>
        </div>
      </div>
    </DetailLayout>
  );
};
