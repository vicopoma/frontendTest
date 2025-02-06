import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Modal, Row, Tabs, Upload } from 'antd';
import { NavigationBar, NavigationBarState } from '../../../Shared/NavigationBar/NavigationBar';
import { BackDoorConfigKeys, ROUTES } from '../../../../settings/routes';
import { useLocation } from 'react-router-dom';
import { NEW } from '../../../../constants/constants';
import { DetailLayout } from '../../../Shared/DetailLayout/DetailLayout';
import { useFormik } from 'formik';
import { ConfirmationModal } from '../../../Shared/Modals/Modals';
import { EquipmentTemplate as EquipmentTemplateType, useEquipmentTemplate } from '../../../../hook/customHooks/backdoor';
import { ZoomInOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { CustomFields } from './CustomFields';
import { EquipmentModels } from './EquipmentModels';
import { imageToBase64 } from '../../../../helpers/Utils';
import { SuccessMessage } from '../../../Shared/Messages/Messages';
import { history } from '../../../../store/reducers';

export const EquipmentTemplate = ({ navigationBar }: {
  navigationBar?: NavigationBarState,
}) => {

  const paths = useLocation().pathname.split('/');
  const path = paths[paths.length - 1];
  
  const { 
    equipmentTemplate, 
    loadEquipmentTemplate,
    createEquipmentTemplate,
    updateEquipmentTemplate, 
    deleteEquipmentTemplate,
  } = useEquipmentTemplate(path);

  const [showExpandedImg, setShowExpandedImg] = useState<boolean>(false);

  const { values, setFieldValue, setValues, handleChange } = useFormik<EquipmentTemplateType>({
    initialValues: equipmentTemplate,
    onSubmit() {}
  });

  const defaultNavigationRoute = [
    {
      path: ROUTES.BACKDOOR.PAGE(BackDoorConfigKeys.EQUIPMENT_TEMPLATE),
      breadcrumbName: 'Equipment Template'
    },
    {
      path: ROUTES.PLAYER.DETAIL(path),
      breadcrumbName: `${values.name}`
    }
  ];

  useEffect(() => {
    if (path && path !== '' && path !== NEW) {
      loadEquipmentTemplate((res: EquipmentTemplateType) => {
        setValues(res)
      });
    }
  }, [loadEquipmentTemplate, path, setValues]);
  
  return (
    <DetailLayout 
      className="eq-template"
      canModify={true} 
      onChange={(setResponse) => {
        if (path === NEW) {
          ConfirmationModal('Save', 'Are you sure to save the equipment template?', () => {
            createEquipmentTemplate(values, (a: any) => {
              setValues(values);
              SuccessMessage({ description: 'The equipment template was created'});
              history.replace(ROUTES.BACKDOOR.DETAIL(BackDoorConfigKeys.EQUIPMENT_TEMPLATE, a.id))
            });
          })  
        } else {
          if (values.name && values.name !== '') {
            ConfirmationModal('Update', 'Are you sure to update the equipment template?', () => {
              updateEquipmentTemplate(values, (a: any, b: any) => {
                setValues(values);
                SuccessMessage({ description: 'The equipment template was updated'})
              });
            });
          }
        }
      }}
      onDeleteButton={values.id ? (() => {
        ConfirmationModal('Delete', `Are you sure to delete this Equipment Template: ${values.name}?`, () => {
          deleteEquipmentTemplate(values, () => {
            history.goBack();
          });
        });
      }) : undefined}
    >
        <Modal
          maskStyle={{
            display: 'none'
          }}
          width="auto"
          wrapClassName="img-eq-template-modal"
          visible={showExpandedImg}
          onCancel={() => setShowExpandedImg(false)}
          closable
          maskClosable={false}
          destroyOnClose
          footer={null}
          title={equipmentTemplate?.name}
        >
          <div className="img-eq-template blue-scroll">
            {values?.img && <img src={values?.img} alt="" width="80%" />}
          </div>
        </Modal>
      {
        navigationBar ? <NavigationBar {...navigationBar} />
          :
          <NavigationBar
            navTitle={
              <div className="navigationbar-header">
                <img src="/images/player-icon.svg" alt="" width="20px"/>
                <span className="navigation-bar">Equipment Template</span>
              </div>
            }
            navigationRoute={defaultNavigationRoute}
          />
      }
      <NavigationBar 
        navTitle={
          <div>
            <Row>
              <Col>
                <div className="eq-template-container image-hover-text-container">
                  <div className="image-hover-image" >
                    {!!values?.img && <CloseCircleOutlined 
                      className="close-icon" 
                      onClick={() => {
                        setFieldValue('img', undefined);
                        setShowExpandedImg(false);
                      }}
                    />}
                    <img style={{ width: '100px' }} src={values.img} alt="" />
                  </div>
                  {!!values.img && <div className="image-hover-text"
                    onClick={() => {
                      setShowExpandedImg(true);
                    }}>
                    <div className="image-hover-text-bubble">
                      <span className="image-hover-text-title"> <ZoomInOutlined /></span>
                      Click to zoom
                    </div>
                  </div>}
                  {!values.img && <Upload
                    multiple={false}
                    accept="image/png,image/jpeg"
                    beforeUpload={(file) => {
                      imageToBase64(file)
                      .then(result => {
                        if (file.size / 1024 / 1024 <= 5) {
                          setFieldValue('img', result);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                      return false;
                    }}  
                    fileList={[]}
                  >
                      <Button className="btn-upload-eq-template">Upload Image</Button>
                    </Upload>
                  }
                </div>
              </Col>
              <Col className="eq-template-title">
                <div className="label">Template Name</div>
                <Input
                  id="cUInputName"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  size="middle"
                  placeholder="Template Name"
                />
              </Col>
            </Row>
          </div>
        } 
        style={{
          height: '165px',
        }}
      />
      <div className="eq-template-tabs">
        <Tabs
          type="card"
          destroyInactiveTabPane={true}
          defaultActiveKey="equipment-model"
          className="blue-scroll"
        >
          <Tabs.TabPane tab="Equipment Model" key="equipment-model" className="blue-scroll">
            <EquipmentModels 
              modelList={values.equipmentModelRelatedList}
              setFieldValue={setFieldValue}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Custom Fields" key="custom-fields">
            <CustomFields 
              components={values.components} 
              setFieldValue={setFieldValue}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      
    </DetailLayout>
  );
};
