import React, { useEffect, useState } from 'react';
import { Layout } from 'antd/es';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { useMweIntegrationDispatch, useMweIntegrationState } from '../../../hook/hooks/mweIntegration';
import { useFormik } from 'formik';
import { MweIntegrationData } from '../../../store/types/mweIntegration';
import { mweIntegrationDataValidator } from '../../../constants/validators';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';

export const MWEIntegration = () => {
  const {mweData} = useMweIntegrationState();
  const {saveMweIntegrationData, testMweIntegrationData, loadMweIntegrationData} = useMweIntegrationDispatch();
  const [buttonType, setButtonType] = useState<number>(0);
  useEffect(() => {
    loadMweIntegrationData();
  }, [loadMweIntegrationData]);
  
  const {handleSubmit, handleChange, errors, setFieldValue, values} = useFormik({
    initialValues: mweData,
    validationSchema: mweIntegrationDataValidator,
    enableReinitialize: true,
    onSubmit(data: MweIntegrationData) {
      if (buttonType === 0) {
        saveMweIntegrationData(data);
      } else {
        testMweIntegrationData(data);
      }
    }
  });
  
  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Integration MWE </span>
            </div>
          }
        />
        <Form onSubmitCapture={handleSubmit}>
          <div className="drawer_config">
            <div className="drawer_body_config">
              <div className="header_drawer">
                <div>
                  <div className="header_drawer_title_equip">
                    <label><h4> Authentication </h4></label>
                  </div>
                </div>
              </div>
              <div className="info_body_back">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="Hostname" help={!!errors.hostName && ''}>
                      <Input id="cMIntegrationHostname" value={values.hostName} name="hostName" onChange={handleChange}
                             size="small" placeholder="Example dns or ip"/>
                      {errors.hostName && <label style={{color: 'red'}}> {errors.hostName} </label>}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Checkbox id="cMIntegrationHttps" checked={values.https}
                              onChange={e => setFieldValue('https', e.target.checked)}> https </Checkbox>
                  </Col>
                </Row>
              </div>
              <div className="info_body_back">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="Username" help={!!errors.userName && ''}>
                      <Input id="cMIntegrationUsername" value={values.userName} name="userName" onChange={handleChange}
                             size="small" placeholder=""/>
                      {errors.userName && <label style={{color: 'red'}}> {errors.userName} </label>}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Password" help={!!errors.password && ''}>
                      <Input.Password id="cMIntegrationPassoword" value={values.password} name="password"
                                      onChange={handleChange} size="small" placeholder="password"/>
                      {errors.password && <label style={{color: 'red'}}> {errors.password} </label>}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          {/* <div className="drawer_body_config">
            <Checkbox id="cMIntegrationCheckLogin" checked={values.active} onChange={e => setFieldValue('active', e.target.checked)}> Enable login MWE</Checkbox>
          </div> */}
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button id="cMIntegrationTest" onClick={async () => {
              setButtonType(1);
              handleSubmit();
            }} style={{marginRight: 8}}
            >
              TEST
            </Button>
            <Button id="cMIntegrationSave" onClick={async () => {
              setButtonType(0);
              handleSubmit();
            }} type="primary">
              SAVE
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};
