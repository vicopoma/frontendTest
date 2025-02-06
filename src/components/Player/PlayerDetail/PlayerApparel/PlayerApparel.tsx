import React from 'react';
import { Col, Input, Row } from 'antd';
import { ApparelComponent } from './ApparelComponent';
import { Apparel } from '../../../../store/types/players';
import Icon from '../../../Shared/CommomIcons/Icons';
import { EQUIPMENT_TYPES } from '../../../../constants/constants';

export const ApparelView = ({ values, setFieldValue }: { 
  values: Apparel, 
  setFieldValue: Function,
}) => {

  const { TextArea } = Input;

  const apparelArray = ['Shirt', 'Shorts', 'Girdle/Tights', 'Pants', 'Sweatshirt', 'Sweatpants'];
  const shoeArray = ['Workout Shoe Size', 'Workout Shoe Width'];
  const gloveArray = ['Glove Make', 'Glove Model', 'Glove Size'];
  const gameClothingArray = ['Game Jersey Size', 'Game Jersey Cut', 'Game Pants Waist Size', 'Game Pants Cut', 'Game Socks', 'Practice Socks'];

  const indexNote = values.apparelDTOList.findIndex((apparel) => apparel.apparelName === 'Note');

  return (
    <div className="apparel blue-scroll">
      <Row>
        <Col span={19}>
          <Row>
            <Col span={7}>
              <div className="section">
                <div>
                  <img src="/images/player/apparel.svg" className="icon" alt="" />
                  <span className="header">
                    Apparel
                  </span>
                </div>
                <div className="detail">
                  {
                    values.apparelDTOList.map((apparel, apparelIndex) => {
                      return (apparelArray.includes(apparel.apparelName) && 
                        <ApparelComponent 
                          apparel={apparel} 
                          index={apparelIndex} 
                          setFieldValue={setFieldValue}
                        />
                      )
                    })
                  }
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div className="section">
                <div>
                  <img src="/images/player/shoe.svg" className="icon" alt="" />
                  <span className="header">
                    Shoe
                  </span>
                </div>
                <div className="detail">
                  {
                    values.apparelDTOList.map((apparel, apparelIndex) => {
                      return (shoeArray.includes(apparel.apparelName) && 
                        <ApparelComponent 
                          apparel={apparel} 
                          index={apparelIndex} 
                          labelSpan={13} 
                          setFieldValue={setFieldValue}
                        />
                      )
                    })
                  }
                </div>
              </div>

              <div className="section">
                <div>
                  <img src="/images/player/glove.svg" className="icon" alt="" />
                  <span className="header">
                    Glove
                  </span>
                </div>
                <div className="detail">
                  {
                    values.apparelDTOList.map((apparel, apparelIndex) => {
                      return (gloveArray.includes(apparel.apparelName) && 
                        <ApparelComponent 
                          apparel={apparel} 
                          index={apparelIndex} 
                          labelSpan={13} 
                          setFieldValue={setFieldValue}
                        />
                      )
                    })
                  }
                </div>
              </div>
            </Col>

            <Col span={7}>  
              <div className="section">
                <div>
                  <img src="/images/player/game-clothing.svg" className="icon" alt="" />
                  <span className="header">
                    Game Clothing
                  </span>
                </div>
                <div className="detail">
                  {
                    values.apparelDTOList.map((apparel, apparelIndex) => {
                      return (gameClothingArray.includes(apparel.apparelName) && 
                        <ApparelComponent 
                          apparel={apparel} 
                          index={apparelIndex} 
                          labelSpan={14} 
                          setFieldValue={setFieldValue}
                        />
                      )
                    })
                  }
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="section">
                <div>
                  <div className="header">
                    Game Clothing Notes
                  </div>
                  <TextArea 
                    id="clothing-notes"
                    onChange={(e) => {
                      setFieldValue(`apparelDTOList.${indexNote}.apparelComponentDescription`, e.target.value);
                    }}
                    placeholder="Add clothing note" 
                    style={{ width: '1200px', height: '80px', resize: 'none', marginTop: '5px' }}
                    value={values.apparelDTOList[indexNote]?.apparelComponentDescription}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={5}>
          <div>
            <div className="header">
              Main Equipment
            </div>
          </div>
          <div>
            <div className="eq-section">
              <Icon.Equipment className="icon" type={EQUIPMENT_TYPES.HELMET} />
              <div>
                <div className="label">Helmet</div>
                <div className="eq-data">{values.helmetSize}</div>
              </div>
            </div>
            <div className="eq-section">
              <Icon.Equipment className="icon" type={EQUIPMENT_TYPES.SHOULDER_PAD} />
              <div>
                <div className="label">Shoulder Pads</div>
                <div className="eq-data">{values.shoulderPadSize}</div>
              </div>
            </div>
            <div className="eq-section">
              <Icon.Equipment className="icon" type={EQUIPMENT_TYPES.CLEAT} />
              <div>
                <div className="label">Cleats</div>
                <div className="eq-data">{values.cleatSize}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}