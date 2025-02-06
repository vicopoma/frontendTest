import React, { useMemo, useRef, useState } from 'react';
import { Collapse } from 'antd';
import { FetchResponse } from '../../../Shared/Drawer/Drawer';
import { EquipmentToBeAssigned } from './EquipmentToBeAssigned';
import { EquipmentAssigned } from './EquipmentAssigned';
import { ArchivedEquipment } from './ArchivedEquipment';
import { usePlayerContext } from '../../../../context/player';
import { HeaderPlayerDetail } from './HeaderView';
import { EquipmentCounterBadge } from '../../../Equipment/EquipmentCounterBadge/EquipmentCounterBadge';
import { useArraySelector } from '../../../../hook/customHooks/customHooks';
import { EMPTY_ARRAY, EQUIPMENT_TYPES } from '../../../../constants/constants';

type Props = {
  setConnectionResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  sessionId?: string,
  playerId: string
}
enum EqAssignedTabs {
  ASSIGNED_EQ = 'assignedEq',
  TO_BE_ASSIGNED_EQ = 'toBeAssignedEq',
  ARCHIVED_EQ = 'archivedEq',
}

export const EquipmentAssignedView = ({setConnectionResponse, sessionId, playerId}: Props) => {
  const [countToBeAssigned, setCountToBeAssigned] = useState<number>(0);
  const { values } = usePlayerContext();
  const eqCounterRef: React.LegacyRef<HTMLDivElement> = useRef(null);

  const equipmentTypes = useMemo(() => [
    EQUIPMENT_TYPES.CLEAT,
    EQUIPMENT_TYPES.HELMET,
    EQUIPMENT_TYPES.SHOULDER_PAD,
    EQUIPMENT_TYPES.KNEE_BRACE,
    EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR,
  ], []);

  const totalAssignedTabs = useMemo(() => [
    EqAssignedTabs.ASSIGNED_EQ,
    EqAssignedTabs.TO_BE_ASSIGNED_EQ,
    EqAssignedTabs.ARCHIVED_EQ,
  ], []);

  const initialTabs = useMemo(() => sessionId ? [EqAssignedTabs.ASSIGNED_EQ, EqAssignedTabs.TO_BE_ASSIGNED_EQ,] : [EqAssignedTabs.ASSIGNED_EQ,] , [sessionId]);

  const { value: eqTypeSelected, add, has, erase } = useArraySelector({
    initialValues: equipmentTypes,
    totalDefaultValues: equipmentTypes,
    nonErasableValues: EMPTY_ARRAY,
  });

  const { add: addTab, erase: eraseTab, value: tabs, has: isActiveTab } = useArraySelector({
    initialValues: initialTabs,
    totalDefaultValues: totalAssignedTabs,
    nonErasableValues: EMPTY_ARRAY,
  })

  const equipmentCounter = (<div ref={eqCounterRef}>
    <EquipmentCounterBadge
      choosenEquipments={eqTypeSelected as EQUIPMENT_TYPES[]}
      equipmentAssigned={values?.equipmentAssigned}
      onClick={(eqType) => {
        if(has(eqType)) {
          erase(eqType);
        } else {
          add(eqType);
        }
      }}
    />
  </div>);

  const eqAssignedData = useMemo(() => {
    return (sessionId ? values.equipmentVMList : values.equipmentVMList.filter(equipment => !equipment.archived)).filter(equipment => {
      return has(equipment.nameEquipmentType + '');
    })
  }, [has, sessionId]);

  return (
    <div>
    <Collapse className="blue-scroll collapse-eq" activeKey={tabs} defaultActiveKey={["assignedEq", sessionId ? "toBeAssignedEq" : ""]}
      onChange={(updatedTabs) => {
        totalAssignedTabs.forEach(tab => {
          const cur = updatedTabs.indexOf(tab) >= 0;
          const prev = tabs.indexOf(tab) >= 0;
          if(prev && !cur && tab !== EqAssignedTabs.ASSIGNED_EQ) {
            eraseTab(tab);
          } else if(!prev && cur) {
            addTab(tab);
          }
        })
      }}
    >
      <Collapse.Panel key={EqAssignedTabs.ASSIGNED_EQ} header={
        <HeaderPlayerDetail 
          count={eqAssignedData.length}
          id="pEPAssignedEq"
          equipmentCounter={equipmentCounter}
          title={!!sessionId ? 'Scanned Equipment' : 'Assigned Equipment'}
          onClick={(e: any) => {
            if (isActiveTab(EqAssignedTabs.ASSIGNED_EQ) && !eqCounterRef?.current?.contains(e.target)) {
              eraseTab(EqAssignedTabs.ASSIGNED_EQ);
            }
          }}
        />
      } className="first-level-header-eq ant-collapse">
        <EquipmentAssigned sessionId={sessionId} hasEqType={has}/>
      </Collapse.Panel>
      <Collapse.Panel key={EqAssignedTabs.TO_BE_ASSIGNED_EQ} header={
        <HeaderPlayerDetail 
          count={countToBeAssigned} 
          id="pEPToBeAssignedEq"
          title={!!sessionId ? 'Rostered Equipment' : 'Equipment to be Assigned'}
        />
      } className="first-level-header-eq ant-collapse">
        <EquipmentToBeAssigned sessionId={sessionId} setCount={setCountToBeAssigned}/>
      </Collapse.Panel>
      {!sessionId && <Collapse.Panel key={EqAssignedTabs.ARCHIVED_EQ}  header={
        <HeaderPlayerDetail 
          title="Archived Equipment" 
          count={values.equipmentVMList.filter(equipment => equipment.archived).length} 
          id="pEPArchivedEq"
        />
      } className="first-level-header-eq ant-collapse">
        <ArchivedEquipment sessionId={sessionId}/>
      </Collapse.Panel>}
    </Collapse>
    </div>
  );
};
