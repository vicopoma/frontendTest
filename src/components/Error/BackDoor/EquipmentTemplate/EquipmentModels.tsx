import React, { useEffect, useState } from 'react';
import { EqTemplateModel } from '../../../../hook/customHooks/backdoor';
import { useEquipmentTypeState } from '../../../../hook/hooks/equipmentType';
import { EQUIPMENT_TYPES, PART_STATUS_DESC } from '../../../../constants/constants';
import { useManufacturerList } from '../../../../hook/hooks/manufacturer';
import { Button, Col, Form, Row } from 'antd';
import { Select } from '../../../Shared/Select/Select';
import { useEquipmentModelList } from '../../../../hook/customHooks/equipmentModel';
import { useModelSelect } from '../../../../hook/customHooks/customHooks';
import { toPrint } from '../../../../helpers/Utils';
import Icon from '../../../Shared/CommomIcons/Icons';
import { WarningMessage } from '../../../Shared/Messages/Messages';

export const EquipmentModels = (
  { modelList, setFieldValue } :
  { modelList: Array<EqTemplateModel>, setFieldValue: Function }
) => {
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const helmetId = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET)?.[0]?.id;
  
  const {manufacturersByEquipmentType: {getManufacturerByEquipmentType, manufacturerList}} = useManufacturerList();
  const {equipmentModelList, getEquipmentModelByEquipmentTypeIdManufacturerType} = useEquipmentModelList();
  const models = useModelSelect(equipmentModelList);

  const [manufacturerId, setManufacturerId] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');
  const [modelName, setModelName] = useState('');
  
  const [differentManufacturers, setDifferentManufacturers] = useState<boolean>(false);
  
  useEffect(() => {
    if (helmetId) {
      getManufacturerByEquipmentType(helmetId);
    }
  }, [getManufacturerByEquipmentType, helmetId]);

  useEffect(() => {
    if (helmetId && manufacturerId && manufacturerId !== '') {
      getEquipmentModelByEquipmentTypeIdManufacturerType(helmetId, manufacturerId);
    }
  }, [getEquipmentModelByEquipmentTypeIdManufacturerType, helmetId, manufacturerId]);

  return (
    <div className="eq-template-tab">
      <div className="title">Equipment Models</div>
      <div className="edit-field">
        <Row>
          <Col>
            <Form.Item
              label={<span>Manufacturer</span>}
            >
              <Select
                popup
                id="bEqManufacturer"
                showSearch
                style={{ marginRight: '20px', width: '200px' }}
                placeholder="Select"
                size="small"
                value={manufacturerId ?? undefined}
                onChange={(value: string, option: any) => {
                  setManufacturerId(value);
                  setManufacturerName(option.title);
                  setModelName('');
                  const isDifferentManufacturer = modelList.filter((model) => {
                    return model.manufacturerName !== option.title;
                  }).length > 0;
                  setDifferentManufacturers(isDifferentManufacturer);
                }}
                options={manufacturerList.map(manufacturer => ({value: manufacturer.id, display: manufacturer.nameManufacturer}))}
              />
              {differentManufacturers && <span className="form-feedback">
                Different manufacturers
              </span>}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item 
              label={<span>Equipment Model</span>}
            >
              <Select
                popup
                id="bEqEquipmentModel"
                disabled={manufacturerId === ""}
                showSearch
                style={{ marginRight: '20px', width: '200px' }}
                className="capital-letter"
                placeholder="Select"
                size="small"
                onChange={(value: string) => {
                  setModelName(value);
                }}
                value={modelName ?? undefined}
                options={
                  models.models.filter(model => {
                    const status = models.values[`${model}`]?.models.filter(item => item.statusDescription !== PART_STATUS_DESC.DELETE);
                    return status && !!status.length;
                  }).map(model => ({value: model, display: model}))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button
              className="btn-green"
              disabled={manufacturerId === "" || modelName === "" || differentManufacturers}
              icon={<img className="img-h anticon" src="/images/plus-icon.svg" alt="" width="14px"/>}
              onClick={() => {
                const [curModel, modelCode] = modelName.split(' - ');
                const isRepeated = modelList.filter((model) => {
                  return (model.equipmentModelCode || '').toLowerCase() === modelCode &&
                    model.equipmentModelName.toLowerCase() === curModel && 
                    model.manufacturerName === manufacturerName;
                }).length > 0;
                const isDifferentManufacturer = modelList.filter((model) => {
                  return model.manufacturerName !== manufacturerName;
                }).length > 0;
                if (isRepeated) {
                  WarningMessage({
                    description: 'This Equipment Model is already added',
                  });
                }
                if (!isRepeated && !isDifferentManufacturer) {
                  setFieldValue('equipmentModelRelatedList', [...modelList, {
                    equipmentModelCode: modelCode,
                    equipmentModelName: curModel,
                    manufacturerName: manufacturerName,
                    equipmentTypeName: 'Helmet',
                  }]);
                  setManufacturerId('');
                  setModelName('');
                }
              }}
            > Add Equipment Model </Button>
          </Col>
        </Row>
      </div>
      <div className="eq-template-hr" />
      <div className="list three-col blue-scroll">
        {modelList.map((model: EqTemplateModel, idx: number) => {
          return (
            <div className="item-list-container">
              <div className="item-list">
                <div>
                  Manufacturer: <span className="item-text">{model.manufacturerName}</span> 
                </div>
                <div>
                  EquipmentModel: <span className="item-text">
                  {toPrint(model.equipmentModelName)}
                  {(model.equipmentModelCode ? ` - ${model.equipmentModelCode}` : '').toUpperCase()}</span>
                </div>
              </div>
              <div onClick={() => {
                const curModelList = [...modelList];
                curModelList.splice(idx, 1);
                setFieldValue('equipmentModelRelatedList', [...curModelList]);
              }}>
                <Icon.Delete 
                  width="20px"
                  style={{  
                    border: '0px', 
                    marginRight: '5px', 
                    display:'flex', 
                    alignItems: 'center', 
                    justifyContent:'center', 
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}