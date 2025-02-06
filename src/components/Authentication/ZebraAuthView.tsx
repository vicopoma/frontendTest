import React from 'react';
import { Button, Col, Input, Row } from 'antd';
import { ArrowLeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useFormik } from 'formik';
import { loginFields, loginValidators } from '../../constants/validators';
import { useAccountDispatch } from '../../hook/hooks/account';

export const ZebraAuthView = ({setZebraForm}: { setZebraForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  
  const {sendLogin} = useAccountDispatch();
  
  const {handleSubmit, handleChange, errors, touched} = useFormik({
    initialValues: loginFields,
    validationSchema: loginValidators,
    onSubmit(values: { username: string, password: string }) {
      sendLogin(values);
    }
  });
  
  return (
    <>
      <form onSubmit={handleSubmit} name="normal_login" className="login-form">
        <div className="login_input">
          <Input id="username" prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"
                 name="username" onChange={handleChange}/>
          {(errors.username && touched.username) ? <span className="login-alerts"> {errors.username} </span> : ''}
        </div>
        <div className="login_input">
          <Input id="current-password" autoComplete="current-password"
                 prefix={<LockOutlined className="site-form-item-icon"/>} type="password" placeholder="Password"
                 name="password" onChange={handleChange}/>
          {(errors.password && touched.password) ? <span className="login-alerts"> {errors.password} </span> : ''}
        </div>
        <Row gutter={[16, 16]}>
          <Col md={12} sm={{order: 1}} xs={{span: 24, order: 2}}>
            <Button
              block
              icon={<ArrowLeftOutlined/>}
              id="backButton"
              onClick={() => {
                setZebraForm(false);
              }} key="2" className="btn-blue-link">
              GO BACK!
            </Button>
          </Col>
          <Col md={12} sm={{order: 2}} xs={{span: 24, order: 1}}>
            <Button block id="loginButton" key="1" htmlType="submit" className="btn-green">
              LOGIN
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
};