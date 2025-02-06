import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import { EQ_INFORMATION_VAR } from '../../../../../store/types';
import { TagComponent } from '../../../../Shared/Tag/TagComponent';
import { FetchResponse } from '../../../../Shared/Drawer/Drawer';
import { useEquipmentContext } from '../../../../../context/equipment';
import { RECLAIM, TAG_VALIDATOR_TYPES } from '../../../../../constants/constants';
import { useEquipmentFunctions } from '../../../../../hook/customHooks/equipment';
import { useBodyFilterParams } from '../../../../../hook/customHooks/customHooks';

export const TagSection = ({ fetchResponse, style, teamId, isNocsaeOpen, setReclaimable, reclaimChanges}: {
  fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  isNocsaeOpen: boolean,
  style?: React.CSSProperties,
  teamId?: string,
  setReclaimable?: React.Dispatch<React.SetStateAction<boolean>>,
  reclaimChanges?: number,
}) => {
  const { values, setSave, setFieldValue } = useEquipmentContext();
  const { getReclaimableEquipment } = useEquipmentFunctions();
  const [flag, setFlag] = useState<number>(0);
  const { addBodyFilter } = useBodyFilterParams(RECLAIM);

  useEffect(() => {
    if (!values?.id) {
      setFlag(flag => flag+1)
    }
  }, [values?.id])

  return (
    <div className="info_body_back" style={style}>
      <Row>
        <Col span={15}>
          <h5> Assigned Tag </h5>
        </Col>
      </Row>
      <div className="card-scroll-bar">
        <TagComponent
          initialValues={values?.[EQ_INFORMATION_VAR.TAGS]}
          fetchResponse={fetchResponse}
          equipmentId={values?.id}
          onChange={useCallback((tags: Array<string>) => {
            setFieldValue('tags', tags || []);
          }, [setFieldValue])}
          onError={useCallback((messages, codes) => {
            const value = codes.includes(TAG_VALIDATOR_TYPES.INVALID_FORMAT, 0) || codes.includes(TAG_VALIDATOR_TYPES.BELONG_DIFF_TEAM, 0);
            setSave(!value);
          }, [setSave])}
          onReclaim={(value: boolean, tag: string) => {
            getReclaimableEquipment(tag, (equipment) => {
              addBodyFilter({ 
                reclaimable: true, 
                reclaimableTag: tag,
                closeReclaimTag: false, 
                equipment
              });
            });
            setReclaimable?.(value);
          }}
          setFlag={setFlag}
          flag={flag}
          teamId={teamId ? teamId : undefined}
          isNocsaeOpen={isNocsaeOpen}
          reclaimChanges={reclaimChanges || 0}
        />
      </div>
    </div>
  );
};
