import React from 'react';
import { ActivityType, EQUIPMENT_TYPES, EquipmentTypesType } from '../../../constants/constants';
import { ScanTypes } from '../../../store/types/players';

interface IconProps {
  style?: React.CSSProperties
  className?: string
  width?: number | string
  alt?: string
}

interface EquipmentIconProps extends IconProps {
  type: EquipmentTypesType;
}

interface ArchiveIconProps extends IconProps {
  archive: boolean;
}

interface ScanIconProps extends  IconProps {
  type: ScanTypes;
}

interface ActivityIconProps extends IconProps {
	type: ActivityType;
}


const Success: React.FC<IconProps> = props => <img src="/images/check-good.svg" width={props.width} alt={props.alt}/>;
const Warning: React.FC<IconProps> = props => <img src="/images/warning-icon.svg" width={props.width} alt={props.alt}/>;
const Error: React.FC<IconProps> = props => <img src="/images/error-icon.svg" width={props.width} alt={props.alt}/>;
const Archive: React.FC<ArchiveIconProps> = props => <img src={`/images/archive-icons/${props?.archive ? 'archive' : 'unarchive'}-icon.svg`} className={props.className} {...props} alt={props.alt}/>
const Delete: React.FC<IconProps> = props => <img src={`/images/player/delete-icon.svg`} className={props.className} {...props} alt={props.alt}/>
const Unassign: React.FC<IconProps> = props => <img src={`/images/player/unassign-icon.svg`} className={props.className} {...props} alt={props.alt}/>
const ArchiveOutLined: React.FC<ArchiveIconProps> = props => <img src={`/images/archive-icons/${props?.archive ? 'archive' : 'unarchive'}-outline-icon.svg`} className={props.className} {...props} alt={props.alt}/>
const Scan: React.FC<ScanIconProps> = props => <img src={`/images/icon-scan/${props.type}.svg`} className={props.className} style={props.style} alt={props.alt} width={props.width}/>
const Activity: React.FC<ActivityIconProps> = props => <img src={`/images/activity-type/${props.type.toUpperCase()}.svg`} className={props.className} style={props.style} alt={props.alt} width={props.width}/>
const Equipment: React.FC<EquipmentIconProps> = (props) => {
  if(props?.type && Object.values(EQUIPMENT_TYPES).includes(props.type)) {
    return <img src={`/images/equipmentType/${props.type?.toLowerCase()}.svg`} {...props} alt={props.alt}/>;
  }
  return <img src="/images/icons-equipment/generic.svg" className={props.className} {...props} alt={props.alt}/>
}

interface IconSubComponents {
  Success: React.FC<IconProps>;
  Warning: React.FC<IconProps>;
  Error: React.FC<IconProps>;
  Equipment: React.FC<EquipmentIconProps>;
  Archive: React.FC<ArchiveIconProps>;
  ArchiveOutLined: React.FC<ArchiveIconProps>;
  Scan: React.FC<ScanIconProps>;
  Activity: React.FC<ActivityIconProps>;
  Delete: React.FC<IconProps>;
  Unassign: React.FC<IconProps>;
}

const Icon: React.FC<{}> & IconSubComponents = props => (
  <div {...props}>{props.children}</div>
);

Icon.Success = Success;
Icon.Error = Error;
Icon.Warning = Warning;
Icon.Equipment = Equipment;
Icon.Archive = Archive;
Icon.ArchiveOutLined = ArchiveOutLined;
Icon.Scan = Scan;
Icon.Activity = Activity;
Icon.Delete = Delete;
Icon.Unassign = Unassign;

export default Icon;
