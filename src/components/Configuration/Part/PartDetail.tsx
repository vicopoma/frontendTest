import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'antd';
import { useFormik } from 'formik';
import { usePart } from '../../../hook/hooks/part';
import { partValidator } from '../../../constants/validators';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { useAccountState } from '../../../hook/hooks/account';
import { generateEquipmentTypeName, roleCanModify } from '../../../helpers/Utils';
import { ACCOUNT_ROLES, MESSAGE_TYPE } from '../../../constants/constants';
import { Input, TextArea } from '../../Shared/CustomInput/CustomInput';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router';
import { useManufacturerList } from '../../../hook/hooks/manufacturer';
import { history } from '../../../store/reducers';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { useEquipmentModelList } from '../../../hook/customHooks/equipmentModel';
import { usePartTypeList } from '../../../hook/customHooks/partType';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { Select } from '../../Shared/Select/Select';

export const PartDetail = () => {
  
  const paths = useLocation().pathname.split('/');
  const partId = paths[paths.length - 1];
  
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const {account} = useAccountState();
  const [connectionResponse] = useState<FetchResponse>({title: '', description: '', type: undefined});
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  const {equipmentTypeList} = useEquipmentTypeState();
  const {part, post, put, deletePart} = usePart(partId);
  const {manufacturersByEquipmentType} = useManufacturerList();
  const {manufacturerList, getManufacturerByEquipmentType} = manufacturersByEquipmentType;
  const {equipmentModelList, getEquipmentModelByEquipmentTypeIdManufacturerType} = useEquipmentModelList();
  const {partTypeByEquipmentTypeAndModel} = usePartTypeList();
  const {partTypeList, getPartTypeByEquipmentTypeAndEquipmentModel} = partTypeByEquipmentTypeAndModel;
  const {handleSubmit, values, handleChange, errors, setFieldValue, validateForm, touched, handleBlur} = useFormik({
    initialValues: part,
    enableReinitialize: true,
    validationSchema: partValidator,
    onSubmit() {
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
  
  useEffect(() => {
    if (!!values.equipmentTypeId) {
      getPartTypeByEquipmentTypeAndEquipmentModel(values.equipmentTypeId, values.equipmentModelId);
    }
  }, [getPartTypeByEquipmentTypeAndEquipmentModel, values.equipmentTypeId, values.equipmentModelId]);
  
  return (
    <DetailLayout
      width={'40%'}
      canModify={canModify}
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          setCheckSubmitValidator(true);
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                put(values, setResponse);
              } else {
                post(values, setResponse, (res) => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.PART, res.id));
                });
              }
              setCheckSubmitValidator(false);
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? ((setResponse) => {
        ConfirmationModal('Delete', `Are you sure to delete this part: ${values.namePart}?`,
          () => deletePart(values.id, undefined, () => {
            SuccessMessage({description: 'Equipment Model Deleted Successfully'});
            history.push(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART));
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
            <span className="navigation-bar-configuration">Parts</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.PART),
            breadcrumbName: 'Parts List'
          },
          {
            path: '',
            breadcrumbName: values.id ? 'Update Part' : 'Create Part'
          }
        ]}
      />
      <div className="drawer_config">
        <h5>Information</h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Equipment Type</span>}
                           help={!!errors.equipmentTypeId && checkSubmitValidator && ''}>
                  <Select
                    id="cPInputEquipmentType"
                    disabled={!canModify}
                    showSearch
                    placeholder="Equipment Type"
                    value={!!values.equipmentTypeId ? values.equipmentTypeId : undefined}
                    onChange={(value) => {
                      setFieldValue('equipmentTypeId', value);
                      setFieldValue('manufacturerId', '');
                      setFieldValue('equipmentModelId', '');
                      setFieldValue('partTypeId', '');
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
                <Form.Item label={<span className={!values.manufacturerId ? ' ' : 'required-item'}>Manufacturer</span>}
                           help={!!errors.manufacturerId && checkSubmitValidator && ''}>
                  <Select
                    id="cPInputManufacturer"
                    disabled={!canModify}
                    showSearch
                    value={!!values.manufacturerId ? values.manufacturerId : undefined}
                    placeholder="Manufacturer"
                    onChange={(value) => {
                      setFieldValue('partTypeId', '');
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
              <Col span={24}>
                <Form.Item
                  label={<span className={!values.manufacturerId ? ' ' : 'required-item'}>Equipment Model</span>}
                  help={!!errors.equipmentModelId && checkSubmitValidator && ''}>
                  <Select
                    id="cPInputEquipmentModel"
                    disabled={!canModify || !values.manufacturerId}
                    showSearch
                    value={!!values.equipmentModelId ? values.equipmentModelId : undefined}
                    placeholder="Equipment Model"
                    onChange={(value) => {
                      setFieldValue('equipmentModelId', value);
                      setFieldValue('partTypeId', '');
                    }}
                    onBlur={handleBlur}
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
              <Col span={24}>
                <Form.Item label={<span className="required-item">Part Type</span>}
                           help={!!errors.partTypeId && checkSubmitValidator && ''}>
                  <Select
                    id="cPInputPartTypeDrawer"
                    disabled={!canModify}
                    placeholder="Part Type"
                    showSearch
                    value={!!values.partTypeId ? values.partTypeId : undefined}
                    onChange={(value) => {
                      setFieldValue('partTypeId', value);
                    }}
                    onBlur={handleBlur}
                    options={partTypeList.map(partType => (
                      {
                        value: partType.id,
                        display: partType.namePartType
                      }
                    ))}
                  />
                  {touched.partTypeId && errors.partTypeId &&
                  <span className="form-feedback"> {errors.partTypeId} </span>}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={<span className="required-item">Name</span>}
                           help={!!errors.namePart && checkSubmitValidator && ''}>
                  <Input
                    id="cPInputName"
                    isInput={canModify}
                    placeholder="Name..."
                    value={values.namePart}
                    name="namePart"
                    onChange={handleChange}
                  />
                  {checkSubmitValidator && errors.namePart &&
                  <span className="form-feedback"> {errors.namePart} </span>}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Description" help={!!errors.description}>
                  <TextArea id="cPInputDescription" isInput={canModify} placeholder="Description"
                            value={values.description} name="description" onChange={handleChange}/>
                  {errors.description && <span className="form-feedback"> {errors.description} </span>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </DetailLayout>
  );
};
