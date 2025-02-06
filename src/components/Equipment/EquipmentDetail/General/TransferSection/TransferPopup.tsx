import { Button, Col, Row } from 'antd';
import React from 'react';
import { RECLAIM } from '../../../../../constants/constants';
import { CloseOutlined } from '@ant-design/icons';
import { useBodyFilterParams } from '../../../../../hook/customHooks/customHooks';

export const TransferPopup = ({ onBackButton, onReclaimButton, setReclaimable } : {
  setReclaimable: React.Dispatch<React.SetStateAction<boolean>>,
  onBackButton: () => void,
  onReclaimButton: (equipmentId: string) => void,
}) => {
  const { addBodyFilter, bodyFilter: reclaimEquipment } = useBodyFilterParams(RECLAIM);
  return (
    <div className="reclaim-detail" style={{ backgroundColor: 'white', }}>
      <div className="reclaim-title">RECLAIM</div>
      <div className="data-item">
        <span className="data-label">Current Team:  </span> {reclaimEquipment.equipment?.teamName}
      </div>
      <div className="data-item">
        <span className="data-label">EquipmentType: </span> {reclaimEquipment.equipment?.nameEquipmentType}
      </div>
      <div className="data-item">
        <span className="data-label">Manufacturer: </span> {reclaimEquipment.equipment?.nameManufacturer}
      </div>
      <div className="data-item">
        <span className="data-label">Model: </span> {reclaimEquipment.equipment?.nameModel}
      </div>
      <div className="data-item">
        <span className="data-label">Year: </span> {reclaimEquipment.equipment?.modelYear}
      </div>
      <Row className="button-group" justify="end">
        <Col>
          <Button 
            className="button" 
            icon={<CloseOutlined />} 
            onClick={() => { 
              setReclaimable(false); 
              addBodyFilter({ reclaimable: false, });
              onBackButton();
            }} 
            shape='round'>BACK</Button>
          <Button 
            className="reclaim-button button" 
            onClick={() => {
              onReclaimButton(reclaimEquipment?.equipment?.id + '');
            }}
            shape="round"
          >
            RECLAIM
          </Button>
        </Col>
      </Row>  
    </div>
  )
}