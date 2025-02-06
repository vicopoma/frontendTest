import { Button, Carousel, Col, Form, Input, Row, Upload } from 'antd';
import React, { useEffect } from 'react';
import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons';

import './ScanViewFX9600.scss';
import { Select } from '../../../Shared/Select/Select';
import { useFormik } from 'formik';
import { useObjectFetch } from '../../../../hook/customHooks/fetchs';
import { API } from '../../../../settings/server.config';
import { Antennas, DEFAULT_FX9600, FX9600State } from '../../../../store/types/devices';
import { imageToBase64 } from '../../../../helpers/Utils';
import { SuccessMessage } from '../../../Shared/Messages/Messages';
import { ACCOUNT_ROLES } from '../../../../constants/constants';
import { useAccountState } from '../../../../hook/hooks/account';

enum ANTENNA_POSITION {
  TOP = 'TOP', 
  TOP_RIGHT = 'TOP_RIGHT',
  RIGHT = 'RIGHT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM = 'BOTTOM', 
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  LEFT = 'LEFT', 
  TOP_LEFT = 'TOP_LEFT', 
}

const AntennaCard = (
  { antenna, handleChange, idx }: 
  { antenna: Antennas, handleChange: Function, idx: number }
) => {
  const {account} = useAccountState();
  const isZebraAdmin = account.role.name === ACCOUNT_ROLES.ZEBRA_ADMIN;
  return (
    <div className="antenna-card">
      <div className={`running ${antenna.status}`}>
        {antenna.id}
      </div>
      <div className="antenna-card-detail">
        <div style={{ paddingTop: '20px' }}>
        <Form>
          <Row justify="space-between">
            <Col><span className="label">Name: </span> Antenna {antenna.id}</Col>
            <Col className={`antenna-status antenna-status-${antenna.status}`}>
              {antenna.status}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={9}>
              <Form.Item label={<div className="label title">Position</div>}>
                <Select
                  id="cFX9600position"
                  disabled={!isZebraAdmin}
                  size="small" 
                  value={antenna.position}
                  onChange={(option: string) => {
                    handleChange(`rfidAntennas.${idx}.position`, option);
                  }}
                  options={[
                  { value: ANTENNA_POSITION.TOP, display: 'Top' },
                  { value: ANTENNA_POSITION.TOP_RIGHT, display: 'Top Right' },
                  { value: ANTENNA_POSITION.RIGHT, display: 'Right' },
                  { value: ANTENNA_POSITION.BOTTOM_RIGHT, display: 'Bottom Right' },
                  { value: ANTENNA_POSITION.BOTTOM, display: 'Bottom' },
                  { value: ANTENNA_POSITION.BOTTOM_LEFT, display: 'Bottom Left' },
                  { value: ANTENNA_POSITION.LEFT, display: 'Left' },
                  { value: ANTENNA_POSITION.TOP_LEFT, display: 'Top Left' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={15}>
              <Form.Item label={<div className="label title">Description</div>}>
                <Input
                  id="cFX9600description"
                  disabled={!isZebraAdmin}
                  size="small"
                  value={antenna.description}
                  maxLength={255}
                  onChange={(e) => {
                    handleChange(`rfidAntennas.${idx}.description`, e.target.value)
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </div>
      </div>
    </div>
  )
}

export const ScanDetailFX9600 = ({data , trigger }: { data: any, trigger: number }) => {
  const {account} = useAccountState();
  const isZebraAdmin = account.role.name === ACCOUNT_ROLES.ZEBRA_ADMIN;

  const url = [API.DEVICES.BASE()].join('');
  const { values: fx9600Info, loadObject, updatePutObject} = useObjectFetch<FX9600State>({ 
    url: url,
    defaultValue: DEFAULT_FX9600,
  });

  const {
    values,
    setFieldValue,
  } = useFormik<FX9600State>({
    initialValues: fx9600Info,
    enableReinitialize: true,
    onSubmit() {
    }
  });

  useEffect(() => {
    loadObject(API.DEVICES.FX9600.FX9600_DETAIL(data.id));
  }, [loadObject, trigger]);

  if (fx9600Info.id.length === 0) return <div style={{ textAlign: 'center' }}>
    Loading...
  </div>;

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <div className="title">Position Antenna Information</div>
      </Col>
      <Col span={8}>
        <div className="detail-container">
          <div className="title-container">Image Reference</div>
          <div className="image-container">
            <Carousel autoplay dots={{ className: 'image-container-dots' }}>
              {values.images.map((image, idx) => {
                return (
                  <div className="img-div">
                    <CloseCircleFilled className="close-button" onClick={() => {
                      setFieldValue('images', [...values.images].filter((a, imageIdx) => {
                        return idx !== imageIdx;
                      }));
                    }}/>
                    <img src={image} alt={`img-${idx}`} />
                  </div>
                )
              })}
            </Carousel>
          </div>
          <div className="btn-container">
            <Upload
              accept="image/png,image/jpeg"
              disabled={values.images.length >= 5}
              fileList={[]}
              beforeUpload={image => {
                imageToBase64(image).then(result => {
                  setFieldValue('images', [...values.images, result]);
                })
                .catch(err => {
                  console.log(err);
                });
                return false;
              }}
            >
              <Button disabled={values.images.length >= 5 || !isZebraAdmin} className="btn-up-image">
                <UploadOutlined style={{ color: 'var(--blue-dark)', marginRight: "8px" }} />
                Add Image.
              </Button>
            </Upload>
          </div>
        </div>
      </Col>
      <Col span={16}>
        <div className="detail-container">
          <div className="title-container">Antenna Position</div>
          <Row>
            {values.rfidAntennas.map((antenna: Antennas, idx: number) => {
              return <Col span={12}>
                <AntennaCard 
                  idx={idx}
                  handleChange={setFieldValue}
                  antenna={antenna} 
                />
              </Col> 
            })}
          </Row>
          <Row justify="end">
            <Col offset={23}>
              <Button 
                id="cFX9600Update" 
                size="middle" 
                className="btn-green"
                onClick={() => {
                  updatePutObject(values, '', () => {
                    SuccessMessage({
                      description: 'Antenna was updated.'
                    })
                  });
                }}
              >
                SAVE
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}

