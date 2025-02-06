import React, { CSSProperties } from 'react';
import { Col, Form, Modal, Row } from 'antd';
import { ZoomInOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useEquipmentContext } from '../../../../../../context/equipment';
import { PartSelector } from '../PartSelector';
import './SpecificParts.scss';
import { useStateContext } from '../../../../../../context/customContexts';
import { PART_STATUS_DESC } from '../../../../../../constants/constants';

interface SpecificPartsProps {
  style?: CSSProperties,
  chosenCard: boolean,
  chooseCard: () => void
}
export const SpecificParts = ({ style, chosenCard, chooseCard } : SpecificPartsProps) => {

  const { values } = useEquipmentContext();
  const { values: showExpandedImg, setState: setShowExpandedImg } = useStateContext();
  const modelConfigPart = values?.partTypeWithPartDTOList?.filter((partType => {
    return partType.namePartType === 'Model Config';
  }))?.[0];
  const subModel = modelConfigPart?.parts.filter(part => {
    return part.id === modelConfigPart?.partIdSelected && part.statusDescription === PART_STATUS_DESC.ACTIVE;
  })?.[0]?.namePart;

  return (
    values?.guiNameList?.length > 0 && values?.nameModel?.length > 0 && !!values?.equipmentModelId ? (
      <div className="info_body_back" style={style}>
        <Modal
          maskStyle={{
            display: 'none'
          }}
          width="auto"
          wrapClassName="img-part-modal"
          visible={showExpandedImg}
          onCancel={() => setShowExpandedImg(false)}
          closable
          maskClosable={false}
          destroyOnClose
          footer={null}
          title={values.nameModel}
        >
          {
            values?.guiImage && <img src={values?.guiImage} alt="" width="100%" />
          }
        </Modal>
        <Row justify="space-between">
          <Col>
            <h5> {subModel ?? values.nameModel.toUpperCase()}</h5>
          </Col>
          <Col onClick={chooseCard} id='eDUpDownButton'> 
            {
              !chosenCard ? <CaretUpOutlined /> : <CaretDownOutlined />
            }
          </Col>
        </Row>
        <div style={{ display: !chosenCard ? 'none' : undefined }}>
          <Row gutter={[16, 16]}>
          {values?.guiImage && <Col span={showExpandedImg ? 0 : 9} style={{ textAlign: 'center' }}>
              <div className="image-hover-text-container">
                <div className="image-hover-image">
                  <img src={values.guiImage}
                    width="150px"
                    alt="" />
                </div>
                <div className="image-hover-text"
                  onClick={() => {
                    setShowExpandedImg(true);
                  }}>
                  <div className="image-hover-text-bubble">
                    <span className="image-hover-text-title"> <ZoomInOutlined /></span>
                    Click to zoom
                  </div>
                </div>
              </div>
            </Col>}
            <Col span={(showExpandedImg || !values.guiImage) ? 24 : 15}>
              <Form
                layout="vertical"
                className="card-scroll-bar"
                style={{
                  overflowY: 'auto',
                  maxHeight: '130px',
                  overflowX: 'hidden'
                }}
              >
                <Row gutter={[16, 16]}>
                  {
                    values.partTypeWithPartDTOList.map((partType, indexPartType) => (
                      values.guiNameList.includes(partType.namePartType, 0) && (
                        <PartSelector key={partType?.namePartType} partType={partType} index={indexPartType} />
                      )
                    ))
                  }
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
        <div />
      </div>
    ) : <div />
  );
};