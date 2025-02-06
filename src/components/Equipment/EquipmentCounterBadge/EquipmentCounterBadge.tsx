import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { Img } from 'react-image';
import { EquipmentAssign, ScanType } from '../../../store/types/players';
import Icon from '../../Shared/CommomIcons/Icons';
import { EQUIPMENT_TYPE_SETTER, EQUIPMENT_TYPES } from '../../../constants/constants';
import './EquipmentCounterBadge.scss'

interface EquipmentCounterBadgeProps {
  choosenEquipments?: Array<EQUIPMENT_TYPES>
  equipmentAssigned: Array<EquipmentAssign>
  onClick?: (equipmentType: string) => void
  onClickEqType?: Array<EQUIPMENT_TYPES>
  initialValue?: string,
  customEquipments?: Array<EQUIPMENT_TYPES>
  warning?: boolean,
  statisticsTooltip?: boolean
}

export const EquipmentCounterBadge = ({
  choosenEquipments, 
  customEquipments, 
  equipmentAssigned, 
  initialValue, 
  onClick,
  onClickEqType = [], 
  statisticsTooltip,
  warning = false, 
} : EquipmentCounterBadgeProps) => {
  
  const [chosen, setChosen] = useState<string> (() => {
    for (const [key, value] of Object.entries(EQUIPMENT_TYPE_SETTER)) {
      if(value.sort === initialValue) {
        return key;
      }
    }
    return '';
  });
  
  return (
    <div className="equip-assign">
      {
        Object.values(customEquipments ?? EQUIPMENT_TYPES).map(type => {
            const equipmentArray = equipmentAssigned?.filter(equipment => {
              return equipment.nameEquipmentType === type;
            });
            const isWarning = (equipmentArray?.[0]?.amount > 1 && warning) ? 'yellow' : 'green';
            const isError = equipmentArray?.length === 0 ? 'red' : isWarning;
            const isClickable = !!onClick && (onClickEqType.length === 0 || (onClickEqType.filter(equipment => {
              return equipment === type;
            }).length > 0 && equipmentArray?.[0]?.amount > 1));
            const EquipmentData = () => (
              <div
                key={type}
                id={type}
                className={`badge-equip border-${(choosenEquipments && choosenEquipments.indexOf(type) < 0) ? 'grey' : isError} ${(chosen === type && isClickable) || (choosenEquipments && choosenEquipments.indexOf(type) < 0) ? 'chosen' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={() => {
                  if(!choosenEquipments && onClickEqType.length === 0) {
                    setChosen(type);
                  }
                  if (isClickable) onClick?.(type);
                }}
              >
                <Icon.Equipment type={type}/>
                <span>{!!equipmentArray?.length ? equipmentArray?.[0]?.amount : 0}</span>
              </div>
            )
            return (
              <span key={type} className="scan-distribution-tooltip">
                {
                  statisticsTooltip ? (
                    <Tooltip
                      title={
                        <>
                          <label> Register by </label>
                          <div>
                            {
                              Object.keys(ScanType).sort((a, b) => {
                                if(a && b && a[a.length - 1] > b[b.length - 1]) {
                                  return 1;
                                } else {
                                  return -1;
                                }
                              }).map(scanType => {
                                const scan = equipmentArray?.[0]?.frequencyCount?.filter(value => value.device === scanType)[0];
                                const percentage = (scan?.count ?? 0) / equipmentArray[0]?.amount;
                                return (
                                  <div className="tooltip-detail" key={scanType}>
                                    <div className="scan-data">
                                      <div className="scan-count">
                                        {scan?.count ?? 0}
                                      </div>
                                      <div className="scan-percentage">
                                        {Number.isNaN(percentage) ? '—' : (percentage * 100).toFixed(2)}%
                                      </div>
                                    </div>
                                    <div className="scan-count-device">
                                        <div className="device-img">
                                          <Icon.Scan type={scanType as ScanType} />
                                        </div>
                                      {scanType}
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </>
                      }
                      overlayClassName="scan-distribution-tooltip"
                    >
                      <div>
                        <EquipmentData/>
                      </div>
                    </Tooltip>
                  ) : (
                    <EquipmentData/>
                  )
                }
              </span>
            )
          }
        )
      }
      {
        equipmentAssigned?.filter(equipment => {
          const values = Object.values(EQUIPMENT_TYPES).filter(type => type === equipment.nameEquipmentType);
          return values.length === 0;
        }).map((equipment, index) => (
          <div
            key={index + equipment?.nameEquipmentType.toLowerCase()}
            className={`badge-equip ${chosen === index + equipment?.nameEquipmentType.toLowerCase() && onClick ? 'chosen' : ''}`}
            onClick={() => {
              setChosen(index + equipment?.nameEquipmentType.toLowerCase());
              onClick?.(equipment?.nameEquipmentType.toLowerCase());
            }}
          >
            <Img
              key={index + 'image'}
              src={['/images/icons-equipment/generic.svg']}
              alt=""
            />
            <span>{equipment?.amount}</span>
          </div>
        ))
      }
    </div>
  );
};