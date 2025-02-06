import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Row, Table } from 'antd';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useManufacturerList } from '../../../hook/hooks/manufacturer';
import { CustomFieldView } from './CustomFieldView';
import { equipmentModelValidators } from '../../../constants/validators';
import { CustomField } from '../../../store/types';
import { useFormik } from 'formik';
import { useAccountState } from '../../../hook/hooks/account';
import { Input, TextArea } from '../../Shared/CustomInput/CustomInput';
import { ACCOUNT_ROLES, MESSAGE_TYPE, MODEL_YEAR } from '../../../constants/constants';
import { generateEquipmentTypeName, roleCanModify } from '../../../helpers/Utils';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router';
import { useCustomFieldList } from '../../../hook/hooks/customField';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { useEquipmentModelCrud } from '../../../hook/customHooks/equipmentModel';
import { history } from '../../../store/reducers';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { Select } from '../../Shared/Select/Select'; 
import { stringOrUndefined } from '../../../helpers/ConvertUtils';

export const EquipmentModelDetail = () => {
  
  const paths = useLocation().pathname.split('/');
  const equipmentModelId = paths[paths.length - 1];
  const {equipmentTypeList} = useEquipmentTypeState();
  const {account} = useAccountState();
  
  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '',
    description: '',
    type: undefined
  });
  
  const {manufacturersArray} = useManufacturerList();
  const {manufacturerList, getManufacturerList} = manufacturersArray;
  
  const {equipmentModel, put, post, deleteEquipmentModel} = useEquipmentModelCrud(equipmentModelId);
  const {
    customField,
    deleteCustomField,
    postCustomField,
    putCustomField,
    customFieldList,
    replaceCustomField
  } = useCustomFieldList(equipmentModelId);
  
  useEffect(() => {
    getManufacturerList();
  }, [getManufacturerList]);
  
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  
  const {handleSubmit, values, handleChange, errors, setFieldValue, validateForm, touched} = useFormik({
    initialValues: equipmentModel,
    validationSchema: equipmentModelValidators,
    enableReinitialize: true,
    onSubmit() {
    
    }
  });
  
  const columns = [{
    title: 'Name Field',
    dataIndex: 'nameField',
    key: 'nameField',
    width: 50,
  }, {
    title: 'Type Field',
    dataIndex: 'typeField',
    key: 'typeField',
    width: 50,
  }, {
    title: 'Default Value',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 50,
  }, {
    title: 'Required',
    dataIndex: 'required',
    key: 'required',
    width: 50,
    render: (data: boolean) => {
      return <Checkbox disabled checked={data}/>;
    }
  }, {
    title: '',
    dataIndex: 'button',
    key: 'button',
    width: 30,
    render: (data: any, item: CustomField) => {
      return (
        canModify && <>
            <Button
                id="cEMEdit"
                onClick={() => {
                  replaceCustomField(item);
                }} style={{border: 'none', boxShadow: 'none'}}>
                <img className="img-h anticon"
                     src="/images/edit.svg"
                     alt="" width="18px"
                     height="18px"/>
            </Button>
            <Button
                id="cEMDelete"
                size="small"
                style={{border: 'none'}}
                icon={<img className="img-h anticon" src="/images/unassign-icon.svg" alt="" height="18px"/>}
                onClick={() => {
                  deleteCustomField(item.id);
                }}/>
        </>
      );
    }
  },
  ];
  
  return (
    <DetailLayout
      width={'50%'}
      canModify={canModify}
      alertResponse={connectionResponse}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              if (values.id) {
                put(values, setResponse);
              } else {
                post(values, setResponse, (res) => {
                  history.replace(ROUTES.CONFIGURATION.DETAIL(ConfigurationKeys.EQUIPMENT_MODEL, res.id));
                });
              }
            }
          });
          handleSubmit();
        });
      }}
      onDeleteButton={values.id ? ((setResponse) => {
        ConfirmationModal('Delete', `Are you sure to delete this Equipment Model: ${values.nameModel}?`,
          () => deleteEquipmentModel(equipmentModelId, undefined, () => {
            SuccessMessage({description: 'Equipment Model Deleted Successfully'});
            history.replace(ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_MODEL));
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
              <span className="navigation-bar-configuration">Equipment Model</span>
            </div>
          }
          navigationRoute={[
            {
              path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.EQUIPMENT_MODEL),
              breadcrumbName: 'Equipment Model List'
            },
            {
              path: '',
              breadcrumbName: values.id ? 'Update Equipment model' : 'Create Equipment model'
            }
          ]}
        />
        <h5>General Information</h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Equipment Type</span>}
                           help={!!errors.equipmentTypeId && touched.equipmentTypeId && ''}>
                  <Select
                    id="cEMInputEquipmentType"
                    disabled={!canModify}
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    size={'small'}
                    onChange={(value) => setFieldValue('equipmentTypeId', value)}
                    value={stringOrUndefined(values.equipmentTypeId)}
                    options={equipmentTypeList.map(equipmentType => (
                      {
                        value: equipmentType.id, 
                        display: generateEquipmentTypeName(equipmentType.nameEquipmentType)
                      }
                    ))}
                  />
                  {touched.equipmentTypeId && errors.equipmentTypeId &&
                  <span className="form-feedback"> {errors.equipmentTypeId}</span>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Manufacturer</span>}
                           help={!!errors.manufacturerId && !!touched.manufacturerId && ''}>
                  <Select
                    id="cEMInputManufacturer"
                    disabled={!canModify}
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    size="small"
                    onChange={(value) => setFieldValue('manufacturerId', value)}
                    value={values.manufacturerId ? values.manufacturerId : undefined}
                    options={manufacturerList.map(manufacturer => (
                      {
                        value: manufacturer.id,
                        display: manufacturer.nameManufacturer
                      }
                    ))}
                  />
                  {touched.manufacturerId && errors.manufacturerId &&
                  <span className="form-feedback"> {errors.manufacturerId}</span>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Name model</span>}
                           help={!!errors.nameModel && !!touched.nameModel && ''}>
                  <Input
                    id="cEMInputNameModel"
                    value={values.nameModel}
                    isInput={canModify}
                    size="small"
                    onChange={handleChange}
                    name="nameModel"
                    placeholder="Name Model"
                  />
                  {touched.nameModel && errors.nameModel && <span className="form-feedback"> {errors.nameModel}</span>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className={'required-item'}>Model Year</span>}
                           help={!!errors.modelYear && !!touched.modelYear && ''}>
                  <Select
                    id="cPInputEquipmentModelYear"
                    showSearch
                    value={!!values.modelYear ? values.modelYear : undefined}
                    size="small"
                    placeholder="Model Year"
                    onChange={(value) => {
                      setFieldValue('modelYear', value);
                    }}
                    options={MODEL_YEAR.map(modelYear => (
                      {
                        value: modelYear,
                        display: modelYear
                      }
                    ))}
                  />
                  {touched.modelYear && errors.modelYear && <span className="form-feedback"> {errors.modelYear}</span>}
                </Form.Item>
              </Col>
            
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label={'Description'} help={!!errors.description && ''}>
                  <TextArea
                    id="cEMInputDescription"
                    isInput={canModify}
                    placeholder="Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                  {errors.description && <span className="form-feedback"> {errors.description}</span>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        {equipmentModel.id && <>
            <CustomFieldView
                customField={customField}
                setConnectionResponse={setConnectionResponse}
                equipmentModelId={equipmentModel.id}
                post={postCustomField}
                put={putCustomField}/>
            <Table
                dataSource={customFieldList}
                columns={columns}
            />
        </>}
      </div>
    </DetailLayout>
  );
};
