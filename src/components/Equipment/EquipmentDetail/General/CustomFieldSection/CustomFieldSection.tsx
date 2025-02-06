import React from 'react';
import { Checkbox, Col, Form, Row } from 'antd';
import { FormikErrors } from 'formik';
import { EquipmentCustomField } from '../../../../../store/types';
import { Input } from '../../../../Shared/CustomInput/CustomInput';
import { NoData } from '../../../../Shared/NoDataAvailable/NoData';
import { useEquipmentContext } from '../../../../../context/equipment';

export const CustomFieldSection = ({style}: {
  style?: React.CSSProperties
}) => {
  
  const {values, errors, setFieldValue} = useEquipmentContext();
  
  return (
    <div className="info_body_back" style={style}>
      <h5>Custom Field</h5>
      {
        values?.customfield?.length > 0 ?
          <Form layout="vertical" className="card-scroll-bar">
            <Row gutter={[16, 16]}>
              {
                values?.customfield?.map((customField, index: number) => {
                  return (customField.typeField === 'checkbox' ? (
                    <Col span={12} key={index}>
                      <Form.Item key={index} label={<span
                        className={customField.required ? 'required-item' : ''}>{customField.nameField}</span>}>
                        <Checkbox id="eIEquipmentInformation" defaultChecked={customField.value === 'true'}
                                  name="defaultValue" onChange={(e) => {
                          setFieldValue(`customfield[${index}].value`, e.target.checked);
                        }}/>
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={12} key={index}>
                      <Form.Item key={index} label={<span
                        className={customField.required ? 'required-item' : ''}>{customField.nameField}</span>}>
                        <Input
                          id="eIEquipmentInformation"
                          isInput={true}
                          size={'small'}
                          placeholder={customField.nameField}
                          value={customField.value}
                          name={`customfield[${index}].value`}
                          onChange={(e) => {
                            setFieldValue(`customfield[${index}].value`, e.target.value);
                          }}/>
                        {
                          customField.typeField === 'number' ? (
                            <>
                              {!!errors && !!errors.customfield && !!errors.customfield[index] && <span
                                  className="form-feedback"> {`${customField.nameField} must be a \`number\``} </span>}
                            </>
                          ) : (
                            <>
                              {!!errors && !!errors.customfield && !!errors.customfield[index] && <span
                                  className="form-feedback"> {(errors.customfield[index] as FormikErrors<EquipmentCustomField>).value} </span>}
                            </>
                          )
                        }
                      </Form.Item>
                    </Col>
                  ));
                })}
            </Row>
          </Form>
          : <NoData logoWidth="12%"/>
      }
    </div>
  );
};
