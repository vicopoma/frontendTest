import React from 'react';
import { Col, Row } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface HeaderViewProps {
  count?: number,
  equipmentCounter?: JSX.Element,
  onClick?: Function,
  title: string,
  id: string,
}

export const HeaderPlayerDetail = ({ count, equipmentCounter, id, title, onClick }: HeaderViewProps) => {
  return (
    <div onClick={(e) => { onClick && onClick(e)}} style={{ width: "100%"}}>
      <Row align="middle" justify="space-between">
        <Col>
          <div className="header-text">{title}</div>
          {equipmentCounter && <div style={{ display: 'inline-flex'}}>{equipmentCounter}</div>}
        </Col>
        <Col>
          <Row align="middle" justify="end">
            <Col style={{ paddingRight: "5px"}}>
              <div className="counter-text">{count ?? 0}</div>
              <DownOutlined className="down-arrow-icon" id={id} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}