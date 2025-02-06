import React from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select } from 'antd';
import { useFormik } from 'formik';
import { SiteLocationState } from '../../../../store/types/siteLocation';
import { useSiteLocationDispatch, useSiteLocationState } from '../../../../hook/hooks/siteLocation';
import { siteLocationValidator } from '../../../../constants/validators';

export const SiteLocationDrawer = ({showDrawer, closeDrawer}: { showDrawer: boolean, closeDrawer: Function }) => {  
  const {siteLocation} = useSiteLocationState();
  const {saveSiteLocation, updateSiteLocation} = useSiteLocationDispatch();
  
  const {values, setFieldValue, handleSubmit, handleChange, errors} = useFormik({
    initialValues: siteLocation,
    validationSchema: siteLocationValidator,
    enableReinitialize: true,
    onSubmit(value: SiteLocationState) {
      if (value.id) {
        updateSiteLocation(value);
      } else {
        saveSiteLocation(value);
      }
    }
  });
  
  
  return (
    <Drawer
      title={
        <div className="header_drawer_title_equip">
          {!!siteLocation.id ?
            <label>EDIT SITE LOCATION</label>
            : <label>NEW SITE LOCATION</label>
          }
        </div>
      }
      visible={showDrawer}
      width={'50vw'}
      style={{position: 'absolute'}}
      placement={'right'}
      onClose={() => closeDrawer()}
      keyboard={false}
      maskClosable={false}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => {
            closeDrawer();
          }} style={{marginRight: 8}}>
            CLOSE
          </Button>
          <Button onClick={() => {
            handleSubmit();
          }} type="primary">
            SAVE
          </Button>
        </div>
      }
    >
      <div className="drawer_body_config">
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label={<span className="required-item">Site</span>} help={!!errors.siteId && ''}>
                <Select
                  id="siteIdSelect"
                  showSearch
                  placeholder="Select"
                  optionFilterProp="children"
                  size={'small'}
                  value={values.siteId ? values.siteId : undefined}
                  onChange={(value => setFieldValue('siteId', value))}
                >
                  {
                    // sites.map(site => (
                    //   <Select.Option value={site.id}> {site.largeName}</Select.Option>
                    // ))
                  }
                </Select>
                {errors.siteId && <label style={{color: 'red'}}> {errors.siteId}</label>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="required-item">Name</span>} help={!!errors.largeName && ''}>
                <Input name="largeName" placeholder="Name" onChange={handleChange} value={values.largeName}
                       size="small"/>
                {errors.largeName && <label style={{color: 'red'}}> {errors.largeName} </label>}
              </Form.Item>
            </Col>
          
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label={<span className="required-item"> Site Location Type</span>}
                         help={!!errors.siteLocationType && ''}>
                <Select
                  id="locationTypeSelect"
                  showSearch
                  placeholder="Select"
                  optionFilterProp="children"
                  size={'small'}
                  value={values.siteLocationType ? values.siteLocationType : undefined}
                  onChange={(value => setFieldValue('siteLocationType', value))}
                >
                  <Select.Option value="CR_HOME"> Home </Select.Option>
                </Select>
                {errors.siteLocationType && <label style={{color: 'red'}}> {errors.siteLocationType}</label>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="required-item">Site Location Code</span>}
                         help={!!errors.siteLocationCode && ''} required={!!errors.siteLocationCode}>
                <Input name="siteLocationCode" placeholder="Site location code" value={values.siteLocationCode}
                       onChange={handleChange} size="small"/>
                {errors.siteLocationCode && <label style={{color: 'red'}}> {errors.siteLocationCode}</label>}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    
    </Drawer>
  );
};
