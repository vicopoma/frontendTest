import React, { useEffect } from 'react';
import { Drawer } from '../../../../Shared/Drawer/Drawer';
import { Col, Form, Row } from 'antd';
import { useManufacturerList } from '../../../../../hook/hooks/manufacturer';
import { Select } from '../../../../Shared/Select/Select';
import { Input } from '../../../../Shared/CustomInput/CustomInput';
import { EQUIPMENT_TYPES, MODEL_YEAR } from '../../../../../constants/constants';
import { useCustomModel } from '../../../../../hook/customHooks/equipmentModel';
import { useFormik } from 'formik';
import { manufacturerEquipmentModelValidators } from '../../../../../constants/validators';
import { useEquipmentTypeState } from '../../../../../hook/hooks/equipmentType';
import { ConfirmationModal } from '../../../../Shared/Modals/Modals';

export const ManufacturerModelDrawer = (
  { showDrawer, closeDrawer } : 
  { showDrawer: boolean, closeDrawer: Function }
) => {

  const { equipmentTypeList } = useEquipmentTypeState();
  const cleatId = equipmentTypeList.filter(equipmentType => {
    return equipmentType.nameEquipmentType === EQUIPMENT_TYPES.CLEAT;
  })?.[0]?.id;

  const { manufacturersByEquipmentType } = useManufacturerList();
  const { manufacturerList, getManufacturerByEquipmentType } = manufacturersByEquipmentType;

  const { equipmentModel, createCustomModel } = useCustomModel();
  const { handleSubmit, values, handleChange, errors, setFieldValue, validateForm, touched} = useFormik({
    initialValues: equipmentModel,
    validationSchema: manufacturerEquipmentModelValidators,
    enableReinitialize: true,
    onSubmit() {
    
    }
  });

  useEffect(() => {
    if (cleatId?.length > 0) {
      getManufacturerByEquipmentType(cleatId);
      setFieldValue('equipmentTypeId', cleatId);
      setFieldValue('equipmentTypeName', EQUIPMENT_TYPES.CLEAT);
    }
  }, [getManufacturerByEquipmentType, cleatId]);

  return (
    <Drawer
      title="Add Manufacturer and Model"
      onClose={closeDrawer}
      canModify={true}
      enableSaveButton={true}
      width="40%"
      visible={showDrawer}
      onChange={(setResponse) => {
        ConfirmationModal('Save', 'Are you sure to save the information?', () => {
          validateForm(values).then(result => {
            if (Object.keys(result).length === 0) {
              createCustomModel(values, () => {
                closeDrawer();
                window.location.reload();
              })
            }
          });
          handleSubmit();
        });
      }}
    >
      <Form layout="vertical" className="modal-activity">
        <div className="drawer_config">
          <h5>General Information</h5>
          <div className="">
            <div className="drawer_body_config">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label={<span className="required-item">Manufacturer</span>}
                            help={!!errors.manufacturerId && !!touched.manufacturerId && ''}>
                    <Select
                      id="cSelectManufacturer"
                      name="manufacturerId"
                      showSearch
                      style={{marginRight: '8px'}}
                      placeholder="Select"
                      size="small"
                      onChange={(value, option) => {
                        if (value !== '') {
                          setFieldValue('manufacturerName', option.title);  
                        } else {
                          setFieldValue('manufacturerName', '');
                        }
                        return setFieldValue('manufacturerId', value)
                      }}
                      value={values?.manufacturerId?.length > 0 ? values.manufacturerId : ''}
                      options={[...manufacturerList.map(manufacturer => (
                        {
                          value: manufacturer.id,
                          display: manufacturer.nameManufacturer,
                        }
                      )), {
                        value: ' ',
                        display: 'Other',
                      }]}
                    />
                    {touched.manufacturerId && errors.manufacturerId &&
                      <span className="form-feedback"> {errors.manufacturerId}</span>}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span className="required-item">Manufacturer Name</span>}
                            help={!!errors.manufacturerName && !!touched.manufacturerName && ''}>
                    <Input
                      disabled={values?.manufacturerId !== ' '}
                      id="eInputNameManufacture"
                      key="cInputNameManufacture"
                      size="small"
                      isInput={true}
                      placeholder="Name..."
                      value={values?.manufacturerName}
                      name="manufacturerName"
                      onChange={handleChange}
                    />
                    {touched.manufacturerName && errors.manufacturerName &&
                      <span className="form-feedback"> {errors.manufacturerName}</span>}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span className="required-item">Model Name</span>}
                            help={!!errors.nameModel && !!touched.nameModel && ''}>
                    <Input
                      id="eInputModelName"
                      key="cInputNameManufacture"
                      size="small"
                      isInput={true}
                      placeholder="Name..."
                      value={values?.nameModel}
                      name="nameModel"
                      onChange={handleChange}
                    />
                    {touched.nameModel && errors.nameModel &&
                    <span className="form-feedback"> {errors.nameModel}</span>}
                  </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label={<span>Model Year</span>}
                           help={!!errors.modelYear && !!touched.modelYear && ''}>
                  <Select
                    id="eInputEquipmentModelYear"
                    showSearch
                    value={!!values?.modelYear ? values.modelYear : undefined}
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
            </div>
          </div>
        </div>
        {
          
        }
      </Form>
    </Drawer>
  )
}