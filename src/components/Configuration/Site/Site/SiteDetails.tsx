import React, { useState } from 'react';
import { useSite, useZoneList } from '../../../../hook/hooks/site';
import { Button, Col, Form, Row, Select, Table } from 'antd';
import { ConfirmationPopUp } from '../../../Shared/PopUps/Popups';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Input as CustomInput } from '../../../Shared/CustomInput/CustomInput';
import { Zone } from '../../../../store/types';
import { DetailLayout } from '../../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';
import { ConfigurationKeys, ROUTES } from '../../../../settings/routes';

export const SiteDrawer = () => {
  
  const paths = useLocation().pathname.split('/');
  const siteId = paths[paths.length - 1];
  
  const {site} = useSite(siteId);
  const {zones, zonesAssigned, postZone, deleteZone} = useZoneList(site.siteId);
  
  const [zoneSelect, setZoneSelect] = useState<string>('');
  
  const columns = [
    {
      title: 'Zone Name',
      dataIndex: 'name',
      width: 40,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 40,
    },
    {
      title: '',
      width: 20,
      render: (a: any, b: Zone) => {
        return (
          <ConfirmationPopUp onText={'Yes'} cancelText={'No'} title={'Are you sure to delete the zone?'}
                             onConfirm={() => {
                               deleteZone(b.id);
                             }}>
            <Button
              id="ConfirmationButton"
              type="primary"
              size="small"
              danger
              shape="circle"
              icon={<DeleteFilled/>}
            >
            </Button>
          </ConfirmationPopUp>
        
        );
      }
    }
  ];
  
  const handleSubmit = () => {
    if (!!zoneSelect) {
      const zoneSelected = zones.filter(zone => ('' + zone.zoneId) === ('' + zoneSelect));
      
      if (zoneSelected.length) {
        const newZone: Zone = {
          id: '',
          description: zoneSelected[0].description,
          name: zoneSelected[0].name,
          zoneId: zoneSelected[0].id,
          siteId: site.siteId
        };
        postZone(newZone, () => setZoneSelect(''));
      }
    }
  };
  
  return (
    <DetailLayout
      width={'45%'}
      canModify={false}
      onChange={() => {
      }}
    >
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">Site </span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.SITE),
            breadcrumbName: 'Sites List'
          },
          {
            path: '',
            breadcrumbName: site.name
          }
        ]}
      />
      <div className="drawer_config">
        <h5> General </h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row align={'middle'} gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="Name :">
                  <CustomInput isInput={false} value={site.name}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Longitude :">
                  <CustomInput isInput={false} value={!!site.lng ? ('' + site.lat) : '--'}/>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Latitude :">
                  <CustomInput isInput={false} value={!!site.lat ? ('' + site.lat) : '--'}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <h5> Add Zone </h5>
        <div className="drawer_body_config">
          <Form layout="vertical">
            <Row align={'middle'} gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item label="Zone">
                  <Select
                    id="cTAZone"
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    optionFilterProp="children"
                    size={'small'}
                    value={!!zoneSelect ? zoneSelect : undefined}
                    onChange={(value: string) => {
                      setZoneSelect(value);
                    }}>
                    {
                      zones.map(zone => (
                        <Select.Option value={`${zone.zoneId}`}> {zone.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Row align={'middle'} gutter={[16, 2]}>
                  <Col style={{alignSelf: 'center'}} span={12}>
                    <Button
                      id="cTAAdd"
                      onClick={() => handleSubmit()}
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<PlusOutlined/>}
                      style={{backgroundColor: '#4CAF50', border: '#4CAF50', marginLeft: '50%', marginTop: '70%'}}
                    >
                    </Button>
                  </Col>
                  <Col style={{alignSelf: 'center'}} span={12}>
                    <Button
                      id="cTAClear"
                      type="primary"
                      size="small"
                      icon={<DeleteFilled/>}
                      style={{marginTop: '70%'}}
                      danger
                      onClick={() => setZoneSelect('')}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        
        </div>
        <Table columns={columns} dataSource={zonesAssigned}
               pagination={{
                 pageSize: 5
               }}/>
      </div>
    </DetailLayout>
  );
};
