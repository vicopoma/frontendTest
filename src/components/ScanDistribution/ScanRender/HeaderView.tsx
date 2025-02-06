import React from 'react';
import { Badge } from '../../Shared/Badge/Badge';
import Icon from '../../Shared/CommomIcons/Icons';
import { EQUIPMENT_TYPES } from '../../../constants/constants';
import { EquipmentAssign, ScanType } from '../../../store/types/players';
import { Tooltip } from 'antd';
import './HeaderView.scss';

interface HeaderViewProps {
	img?: React.ReactNode,
	title?: React.ReactNode,
	fx9600?: number,
	manual?: number,
	mc33?: number,
	total?: number,
	equipmentList?: Array<EquipmentAssign>,
	totalEquipmentList?: Array<EquipmentAssign>,
	tooltip?: boolean,
}

export const HeaderScanDistributionView = ({img, title, fx9600, mc33, manual, total, equipmentList, totalEquipmentList, tooltip = false}: HeaderViewProps) => {
	const equipmentType = [
		{
			equipment: 'Cleats',
			type: EQUIPMENT_TYPES.CLEAT,
		},
		{
			equipment: 'Helmet',
			type: EQUIPMENT_TYPES.HELMET,
		},
		{
			equipment: 'Shoulder Pads',
			type: EQUIPMENT_TYPES.SHOULDER_PAD,
		},
		{
			equipment: 'Knee Brace',
			type: EQUIPMENT_TYPES.KNEE_BRACE,
		},
		{
			equipment: 'Supplemental Headgear',
			type: EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR,
		},
	];
	const totalScans = (fx9600 || 0) + (mc33 || 0) + (manual || 0);
	return (
		<div className="first-level">
			<div className="equipment-section">
				<div className="img-section">
					<div className="img-header-bg"><img src="/images/bg-select-team.svg" width="14px" alt="" /></div>
					<span>
					{img}
					</span>
				</div>
				<div className="team-name header-label-team">
					{title}
				</div>
				<div className="eq-badge">
					{tooltip ? equipmentType.map((equipment, index) => {
						const amount = equipmentList?.filter(item => item.nameEquipmentType === equipment.equipment)[0]?.amount || 0;
						let color = 'green';
						if (total && amount < total) {
							color = 'red';
						} else if(total && amount > total) {
							color = '#fcd12a';
						}
						return (
							<span className="scan-distribution-tooltip" key={index}>
								<Tooltip title={
									<>
										{<label> Register by </label>}
										<div>
											{
												Object.keys(ScanType).sort((a, b) => {
													if(a && b && a[a.length - 1] > b[b.length - 1]) {
														return 1;
													} else {
														return -1;
													}
												}).map((scanType, index) => {
													const scan = equipmentList?.filter(item => item.nameEquipmentType === equipment.equipment)?.[0];
													const equipmentObject: any = scan ? scan : undefined;
													const amountScanDevice = equipmentObject?.[`${scanType.toLowerCase()}`] || 0;
													const totalScanDevice = equipmentList?.filter(item => item.nameEquipmentType === equipment.equipment)[0]?.amount || 0;
                          return (
                            <div key={index} className="tooltip-detail">
                              <div className="scan-data-header">
                                <div className="scan-count">
                                  {amountScanDevice}
                                </div>
                                {<div className="scan-percentage">
                                  {Number.isNaN(amountScanDevice / totalScanDevice) ? '—' : (amountScanDevice / totalScanDevice * 100).toFixed(2)}%
                                </div>}
                              </div>
                              <div className="scan-count-device">
                                <div className="device-img">
                                  <Icon.Scan type={scanType as ScanType}/>
                                </div>
                                {scanType}
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </>
                } overlayClassName="scan-distribution-tooltip">
									<div id={equipment.type + '-second-level'}>
										<Badge className="custom-badge" style={{ border: `solid 1px ${color}` }}>
											<Icon.Equipment type={equipment.type}/>
                      {amount}
                      {total && ` /  ${total}`}
										</Badge>
									</div>
								</Tooltip>
							</span>
            )
          }) : equipmentType.map((equipment, index) => {
						const amount = equipmentList?.filter(item => item.nameEquipmentType === equipment.equipment)[0]?.amount || 0;
						const total = totalEquipmentList ? totalEquipmentList?.filter(item => item.nameEquipmentType === equipment.equipment)[0]?.amount || 0 : undefined;
						return (
              <div id={`${equipment.type}-${index}-first-level`} key={index}>
                <Badge className="custom-badge" >
                  <Icon.Equipment type={equipment.type}/>
                  {amount}
                  {total && ` /  ${total}`}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
      <div className="scan-section">
        <div>
          <Icon.Scan type={ScanType.FX9600} width="16px"/> FX
          <label>
            {Math.round(100 * (fx9600 || 0) / (totalScans ?? 1))}%
          </label>
        </div>
        <div>
          <Icon.Scan type={ScanType.MC33} width="9px"/> MC33 <label> {Math.round(100 * (mc33 || 0) / (totalScans ?? 1))}% </label>
        </div>
        <div>
          <Icon.Scan type={ScanType.MANUAL} width="17px"/> Manual <label> {Math.round(100 * (manual || 0) / (totalScans ?? 1))}% </label>
        </div>
      </div>
    </div>
  )
}
