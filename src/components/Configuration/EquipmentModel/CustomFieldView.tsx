import React, { useState } from 'react';
import { Button, Checkbox, Col, Form, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { customFieldValidators } from '../../../constants/validators';
import { CustomField } from '../../../store/types';
import { useFormik } from 'formik';
import { ACCOUNT_ROLES, TYPE_FIELDS } from '../../../constants/constants';
import { useAccountState } from '../../../hook/hooks/account';
import { Input } from '../../Shared/CustomInput/CustomInput';
import { roleCanModify } from '../../../helpers/Utils';
import { FetchResponse } from '../../Shared/Drawer/Drawer';
import { Select } from '../../Shared/Select/Select';

type Props = {
  customField: CustomField,
  equipmentModelId: string,
  setConnectionResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  post: Function,
  put: Function
}

export const CustomFieldView = ({customField, setConnectionResponse, equipmentModelId, post, put}: Props) => {
  
  const {account} = useAccountState();
  
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  
  const {handleSubmit, values, errors, handleChange, setFieldValue, resetForm} = useFormik({
    initialValues: customField,
    validationSchema: customFieldValidators,
    enableReinitialize: true,
    onSubmit(values: CustomField) {
      if (values.id) {
        put(values, setConnectionResponse, resetForm);
      } else {
        values.equipmentModelId = equipmentModelId;
        post(values, setConnectionResponse, resetForm);
      }
      setCheckSubmitValidator(false);
    }
  });
  const canModify: boolean = roleCanModify(account.role.name, ACCOUNT_ROLES.ZEBRA_ADMIN);  
  return (
    <>
      <h5>Custom Fields</h5>
      {
        canModify &&
        <Row className="drawer_body_config">
            <Form layout="vertical">
                <Row gutter={[16, 2]}>
                    <Col span={5}>
                        <Form.Item label={<span className="required-item">Name field</span>}
                                   help={!!errors.nameField && checkSubmitValidator && ''}>
                            <Input
                                id="nameField"
                                isInput={canModify}
                                size={'small'}
                                placeholder="Name field"
                              // name="nameField"
                                value={values.nameField}
                                onChange={handleChange}/>
                          {
                            checkSubmitValidator && !!errors.nameField &&
                            <span className="form-feedback"> {errors.nameField}  </span>
                          }
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label={<span className="required-item">Type field</span>}
                                   help={!!errors.typeField && checkSubmitValidator && ''}>
                            <Select
                                id="cEMTypeField"
                                disabled={!canModify}
                                showSearch
                                style={{marginRight: '8px'}}
                                placeholder="Select"
                                size={'small'}
                                onChange={(value) => {
                                  setFieldValue('typeField', value);
                                  setFieldValue('defaultValue', '');
                                }}
                                value={values?.typeField ? values?.typeField : undefined}
                                options={TYPE_FIELDS.map(typeField => (
                                  {
                                    value: typeField.value,
                                    display: typeField.title
                                  }
                                ))}
                            />
                          {
                            checkSubmitValidator && !!errors.typeField &&
                            <span className="form-feedback"> {errors.typeField}  </span>
                          }
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item label={<span className={values.required ? 'required-item' : ''}>Default value</span>}
                                   help={!!errors.defaultValue && checkSubmitValidator && ''}>
                          {
                            values.typeField === 'checkbox' ? (
                              <Checkbox id="cEMDefaultValue" checked={!!values.defaultValue} name="defaultValue"
                                        onChange={handleChange}/>
                            ) : (
                              <Input
                                id="cEMDefaultValue"
                                isInput={canModify}
                                size={'small'}
                                placeholder="Default value"
                                name="defaultValue"
                                value={values.defaultValue}
                                onChange={(e) => {
                                  handleChange(e);
                                }}/>
                            )
                          }
                          {
                            checkSubmitValidator && !!errors.defaultValue && <span
                                className="form-feedback">  {`Default Value should must be a \`${values.typeField !== 'checkbox' ? values.typeField : 'boolean'}\``}  </span>
                          }
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label="Required">
                            <Checkbox id="cEMRequired" disabled={!canModify} checked={values.required} name="required"
                                      onChange={handleChange}/>
                        </Form.Item>
                    </Col>
                  {
                    canModify &&
                    <>
                      {
                        !!customField.id ? (
                          <>
                            <Col style={{alignSelf: 'center'}} span={3}>
                              <Button
                                id="cEMEditCustomField"
                                onClick={() => {
                                  handleSubmit();
                                }}
                                type="primary"
                                style={{width: '100%'}}
                              >
                                Edit
                              </Button>
                            </Col>
                            <Col style={{alignSelf: 'center'}} span={3}>
                              <Button
                                id="cEMClearCustomField"
                                onClick={() => resetForm()}
                                type="primary"
                                danger>
                                Clear
                              </Button>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col style={{alignSelf: 'center'}} span={3}>
                              <Button
                                id="cEMAdd"
                                onClick={() => {
                                  handleSubmit();
                                  setCheckSubmitValidator(true);
                                }}
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined/>}
                                style={{backgroundColor: '#4CAF50', border: '#4CAF50', marginLeft: '35%'}}>
                              
                              </Button>
                            </Col>
                            <Col style={{alignSelf: 'center'}} span={3}>
                              <Button
                                id="cEMClear"
                                onClick={() => resetForm()}
                                type="primary"
                                danger>
                                Clear
                              </Button>
                            </Col>
                          </>
                        )
                      }
                    </>
                  }
                </Row>
            </Form>
        </Row>
      }
    </>
  );
};
