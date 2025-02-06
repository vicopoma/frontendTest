import React, { CSSProperties } from 'react';
import { Form, Row } from 'antd';
import { NoData } from '../../../../../Shared/NoDataAvailable/NoData';
import { useEquipmentContext } from '../../../../../../context/equipment';
import { PartSelector } from '../PartSelector';
import { NECK_RESTRAINT } from '../../../../../../constants/constants';

interface GenericPartsProps {
  style?: CSSProperties,
  chosenCard: boolean,
  chooseCard: () => void
}

export const GenericParts = ({ style, chosenCard, chooseCard } : GenericPartsProps) => {
    
    const {values} = useEquipmentContext();
    // 
    return (
      <div className="info_body_back" style={style} onClick={chooseCard}>
        <h5> Parts </h5>
        <div
          className="blue-scroll"
          style={{
            overflowY: 'auto',
            maxHeight: values?.guiNameList?.length > 0 && values?.nameModel?.length > 0 && !!values?.equipmentModelId ? '245px' : '410px',
            overflowX: 'hidden'
          }}
        >
          {
            values?.partTypeWithPartDTOList?.length > 0 ?
              <Form
                layout="vertical" className="card-scroll-bar">
                <Row gutter={[16, 16]}>
                  {
                    values?.partTypeWithPartDTOList?.map((partType, indexPartType) => (
                      !values.guiNameList.includes(partType.namePartType, 0) && 
                      partType.namePartType !== NECK_RESTRAINT && (
                        <PartSelector key={partType?.namePartType} partType={partType} index={indexPartType}/>
                      )
                    ))
                  }
                </Row>
                <Row gutter={[16, 16]}>
                  {
                    values?.partTypeWithPartDTOList?.map((partType, indexPartType) => (
                      !values.guiNameList.includes(partType.namePartType, 0) && 
                      partType.namePartType === NECK_RESTRAINT && (
                        <PartSelector partType={partType} index={indexPartType} note={true} />
                      )
                    ))
                  }
                </Row>
              </Form>
              : <NoData/>
          }
        </div>
      </div>
    );
  }
;