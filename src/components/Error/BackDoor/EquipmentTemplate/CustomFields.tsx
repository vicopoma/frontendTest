import React, { useEffect, useState } from 'react';
import { useEquipmentParts } from '../../../../hook/customHooks/backdoor';
import { Button, Col, Form, Input, Row } from 'antd';
import { Select } from '../../../Shared/Select/Select';
import Icon from '../../../Shared/CommomIcons/Icons';
import { WarningMessage } from '../../../Shared/Messages/Messages';

export const CustomFields = ( 
  { components, setFieldValue } : 
  { components: { [key: string]: string }, setFieldValue: Function}
) => {

  const { equipmentParts, loadEquipmentParts } = useEquipmentParts();

  const [specificPart, setSpecificPart] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    loadEquipmentParts('helmet');
  }, [loadEquipmentParts]);

  return (
    <div className="eq-template-tab">
      <div className="title">Custom Fields</div>
      <div className="edit-field">
        <Row>
          <Col>
            <Form.Item
              label={<span>Specific Part</span>}
            >
              <Select
                popup
                id="bEqSpecificPart"
                showSearch
                style={{ marginRight: '20px', width: '200px' }}
                placeholder="Select"
                size="small"
                value={specificPart ?? undefined}
                onChange={(value: string) => {
                  setSpecificPart(value);
                  setLabel(value);
                }}
                options={equipmentParts.map(part => ({ value: part, display: part }))}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item 
              label={<span>Label</span>}
            >
              <Input
                id="cUInputName"
                value={label}
                name="name"
                onChange={(e) => {
                  setLabel(e.target.value);
                }}
                size={'small'}
                placeholder="Label"
              />
            </Form.Item>
          </Col>
          <Col>
            <Button
              className="btn-green"
              disabled={specificPart === "" || label === ""}
              icon={<img className="img-h anticon" src="/images/plus-icon.svg" alt="" width="14px"/>}
              onClick={() => {
                const isRepeated = Object.keys(components).some((key: string) => {
                  return components[key].toLowerCase() === label.toLowerCase();
                });
                if (isRepeated) {
                  WarningMessage({
                    description: `The label '${label}' is already used`,
                  });
                } else {
                  setFieldValue('components', { ...components, 
                    [specificPart]: label,
                  });
                  setSpecificPart('');
                  setLabel('');
                } 
              }}
            > Add Field Component </Button>
          </Col>
        </Row>
      </div>
      <div className="eq-template-hr" />
      <div className="list">
        {Object.keys(components).map((key: string) => {
          return (
            <div className="item-list-container">
              <div className="item-list">
                <div>
                  Especific Part: <span className="item-text">{key}</span> 
                </div>
                <div>
                  Label: <span className="item-text">{components[key]}</span>
                </div>
              </div>
              <div onClick={() => {
                let updatedComponents = { ...components};
                delete updatedComponents[key];
                setFieldValue('components', updatedComponents);
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