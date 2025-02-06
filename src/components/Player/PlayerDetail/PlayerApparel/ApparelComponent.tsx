import React from 'react';
import { Col, Input, Row, Select } from 'antd';
import { ApparelElement } from '../../../../store/types/players';
import { SelectValue } from 'antd/lib/select';

export const ApparelComponent = ({ apparel, index, labelSpan = 12, setFieldValue } : { 
  apparel: ApparelElement,
  index: number,
  labelSpan?: number,
  setFieldValue: Function,
}) => {
  

  return (
    <Row>
      <Col span={labelSpan} className="label">{apparel.apparelName}:</Col>
      <Col span={24 - labelSpan} id={apparel.apparelName.toLowerCase().replaceAll(' ', '-')}>
        {apparel.typeField === 'OPTIONS' ? 
          <Select 
            className="form-component"
            id={apparel.apparelName.replaceAll(' ', '-')}
            onChange={(value: SelectValue) => {
              setFieldValue(`apparelDTOList.${index}.apparelComponentSelect`, value);
            }}
            options={
              [{
                value: '',
                label: 'None'
              }, ...apparel.apparelComponentDTOList.map(component => {
                return {
                  label: component.apparelComponentName,
                  value: component.id,
                }
              })]
            }
            placeholder="Select"
            size="small"
            value={apparel.apparelComponentSelect}
          /> : 
          <Input 
            id={apparel.apparelName.toLowerCase().replaceAll(' ', '-')}
            className="form-component"
            onChange={(e) => {
              setFieldValue(`apparelDTOList.${index}.apparelComponentDescription`, e.target.value);
            }}
            size="small"
            value={apparel.apparelComponentDescription}
            placeholder="Text"
          />
        }
      </Col>
    </Row>
  )
}