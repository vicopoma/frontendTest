import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import { FormikErrors, FormikTouched } from 'formik';

export const ChangePassword = ({handleChange, values, errors, touched}: {
  handleChange: any,
  values: { currentPassword: string, newPassword: string, newPasswordConfirm: string }
  errors: FormikErrors<{ currentPassword: string, newPassword: string, newPasswordConfirm: string }>
  touched: FormikTouched<{ currentPassword: string, newPassword: string, newPasswordConfirm: string }>
}) => {
  return (
    <>
      <p>
        <h5> Change password </h5>
      </p>
      
      <div
        className="drawer_body"
        style={{
          padding: '20px 20px 10px 20px'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="Current password">
              <Input.Password
                value={values.currentPassword}
                name="currentPassword"
                onChange={handleChange}
                size="small"
                //value={values.newPassword}
              />
              {touched.currentPassword && errors.currentPassword &&
              <p className="form-feedback"> {errors.currentPassword}</p>}
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item label="New password">
              <Input.Password
                value={values.newPassword}
                name="newPassword"
                onChange={handleChange}
                size="small"
                //value={values.newPassword}
              />
              {touched.newPassword && errors.newPassword &&
              <p className="form-feedback"> {errors.newPassword}</p>}
            </Form.Item>
          </Col>
          
          <Col span={24}>
            <Form.Item label="Confirm new password">
              <Input.Password
                value={values.newPasswordConfirm}
                onChange={handleChange}
                name="newPasswordConfirm"
                size="small"
              />
              {touched.newPasswordConfirm && errors.newPasswordConfirm &&
              <p className="form-feedback"> {errors.newPasswordConfirm}</p>}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
