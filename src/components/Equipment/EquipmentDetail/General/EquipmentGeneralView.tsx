import React, { useEffect, useState } from 'react';
import { Col, Row, } from 'antd';

import { GeneralSection } from './GeneralInformationSection/GeneralInformationSection';
import { PartSection } from './PartSection/PartsSection';
import { TagSection } from './TagSection/TagSection';
import { FetchResponse } from '../../../Shared/Drawer/Drawer';
import { UseStateProvider } from '../../../../context/customContexts';
import { TransferPopup } from './TransferSection/TransferPopup';
import { useBodyFilterParams } from '../../../../hook/customHooks/customHooks';
import { EMPTY_OBJECT, RECLAIM } from '../../../../constants/constants';
import { history } from '../../../../store/reducers';

type Props = {
  fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  reclaimRedirectionRoute?: (equipmentId: string) => string,
  teamId?: string,
}

export const EquipmentGeneral = ({fetchResponse, teamId, reclaimRedirectionRoute}: Props) => {
  const [showExpandedImg, setShowExpandedImg] = useState<boolean>(false);
  const [isNocsaeOpen, setIsNocsaeOpen] = useState<boolean>(false);
  const [, setReclaimable] = useState<boolean>(false);
  const { addBodyFilter, bodyFilter: reclaimEquipment } = useBodyFilterParams(RECLAIM);
  const [reclaimChanges, setReclaimChanges] = useState<number>(0);
  
  useEffect(() => {
    addBodyFilter({ 
      reclaimable: false, 
      equipment: EMPTY_OBJECT, 
      reclaimEquipment: false,
      reclaimableTag: '',
      closeReclaimTag: false,
    });
  }, [addBodyFilter]);

  return (
    <div>
      <UseStateProvider values={showExpandedImg} setState={setShowExpandedImg}>
        <Row gutter={[16, 16]} className="car-size">
          {
            <Col xs={24} sm={24} md={24} lg={12} xl={12} className="car-size">
              <Row>
                <GeneralSection
                  updateNocsaeStatus={setIsNocsaeOpen}
                  fetchResponse={fetchResponse}
                  isNocsaeOpen={isNocsaeOpen}
                  reclaimChanges={reclaimChanges}
                  style={{
                    width: '100%'
                  }}/>
              </Row>
              <Row>
                <TagSection
                  style={{
                    width: '100%'
                  }}
                  fetchResponse={fetchResponse}
                  teamId={teamId ? teamId : undefined}
                  isNocsaeOpen={isNocsaeOpen}
                  reclaimChanges={reclaimChanges}
                />
              </Row>
            </Col>
          }
          <Col xs={24} sm={24} md={24} lg={12} xl={12} className="car-size">
            <PartSection
              style={{
                maxHeight: '800px',
                minHeight: '505px'
              }}
            />
          </Col>
        </Row>
        {
        !!reclaimEquipment.reclaimable && 
        <TransferPopup 
          setReclaimable={setReclaimable} 
          onBackButton={() => {
            addBodyFilter({
              closeReclaimTag: true,
              reclaimable: false,
            });
            setReclaimChanges(prevState => prevState + 1);
          }} 
          onReclaimButton={(equipmentId: string) => {
            addBodyFilter({
              reclaimEquipment: true,
              reclaimable: false,
            });
            history.replace(reclaimRedirectionRoute?.(equipmentId) ?? '');
            setReclaimChanges(prevState => prevState + 1);
          }}
        />
        }
      </UseStateProvider>
    </div>
  );
};
