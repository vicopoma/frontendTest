import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Select, Slider, Spin, Switch } from 'antd';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BarcodeOutlined, BuildOutlined, FieldBinaryOutlined, LoadingOutlined } from '@ant-design/icons';

import { useDeviceDS9908rDispatch } from '../../../../hook/hooks/deviceDS9908r';
import { API } from '../../../../settings/server.config';
import { Drawer, FetchResponse } from '../../../Shared/Drawer/Drawer';
import { hexToAscii } from '../../../../helpers/ConvertUtils';

export const DS9908RDrawer = ({showDrawer, closerDrawer}: { showDrawer: boolean, closerDrawer: Function }) => {
  
  const {beepDevice, statusDevice, changeLightColor, reboot, changeVolume} = useDeviceDS9908rDispatch();
  
  const [statusSwitch, setStatusSwitch] = useState<boolean>(false);
  const [beeps, setBeeps] = useState<string>('');
  const [typeScan, setTypeScan] = useState<string>('');
  const [realTag, setRealTag] = useState<string>('');
  const [color, setColor] = useState<string>('green');
  const [colorSW, setColorSW] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [manualConnected, setManualConnected] = useState<boolean>(true);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [reconnectManualAttempts, setReconnectManualAttempts] = useState<number>(0);
  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    title: '',
    description: '',
    type: undefined
  });
  
  const connection = new HubConnectionBuilder()
  .withUrl(API.DEVICES.DS9908R.SOCKET_CONNECTION())
  .withAutomaticReconnect([1000])
  .build();
  
  const start = async () => {
    await connection.start()
    .then(result => {
      setConnected(true);
      setReconnectAttempts(0);
      if (statusSwitch) {
        setConnectionResponse({
          type: 'success',
          title: 'Success',
          description: 'Now you are connected to DS9908R'
        });
      } else {
        setConnectionResponse({
          type: 'warning',
          title: 'Warning',
          description: 'The device is disabled'
        });
      }
      connection.on('ReceiveMessage', message => {
        const data = message.split('|-|');
        setRealTag(data[0]);
        setTypeScan(data[1]?.trim());
      });
    })
    .catch(e => {
      setConnectionResponse({
        title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R app... </>,
        type: 'info',
      });
      setConnected(false);
      if (reconnectAttempts < 2) {
        setTimeout(() => setReconnectAttempts(data => data + 1), 5000);
      } else {
        setConnectionResponse({
          type: 'warning',
          title: 'Warning',
          description: 'Please, check if scanner service is available. Contact the administrator'
        });
      }
    });
  };
  
  useEffect(() => {
      start();
      return () => {
        connection.stop().then(() => console.info('Connection Stopped'));
      };
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [reconnectAttempts, statusSwitch]);
  
  useEffect(() => {
    setConnectionResponse({
      title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R app... </>,
      type: 'info',
    });
  }, [setConnectionResponse]);
  
  useEffect(() => {
    statusDevice(setStatusSwitch, setConnectionResponse);
    const volumeValue = sessionStorage.getItem('volume');
    if (volumeValue) {
      const vol = parseInt(volumeValue);
      changeVolume(Math.abs(vol - 3), setConnectionResponse);
      setVolume(vol);
    } else {
      changeVolume(2, setConnectionResponse);
      setVolume(1);
    }
  }, [statusDevice, changeVolume]);
  
  useEffect(() => {
    if (reconnectManualAttempts > 0) {
      if (reconnectManualAttempts <= 20) {
        if (!statusSwitch) {
          setManualConnected(false);
          setConnectionResponse({
            title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R... </>,
            type: 'info',
          });
          statusDevice(setStatusSwitch, setConnectionResponse);
          setTimeout(() => {
            setReconnectManualAttempts(reconnectManualAttempts + 1);
          }, 2500);
        } else {
          setManualConnected(true);
        }
      } else {
        setManualConnected(true);
        setConnectionResponse({
          type: 'warning',
          title: 'Warning',
          description: 'Please, check if the scanner ds9908r device is connected !'
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDevice, reconnectManualAttempts]);
  
  const [volume, setVolume] = useState<number>(0);
  
  const handleChange = (value: any) => {
    setVolume(value);
    sessionStorage.setItem('volume', value);
    changeVolume(Math.abs(value - 3), setConnectionResponse);
  };
  
  return <>
    {
      <Drawer
        visible={true}
        title="SETTINGS"
        width="auto"
        onClose={() => closerDrawer()}
        canModify={false}
        onChange={() => {
        }}
        alertResponse={connectionResponse}
      >
        <Form className="drawer_config" layout="vertical">
          <div className="header_drawer_title_equip">
            <h5>Scanner Actions</h5>
          </div>
          <Row className="drawer_body_config">
            <Col span={8}>
              <Form.Item label="Connect Scanner">
                <Button
                  id="connectButton"
                  disabled={!connected || !manualConnected}
                  className="btn-blue-border"
                  size="small"
                  type="default"
                  onClick={() => {
                    if (!statusSwitch) {
                      setReconnectManualAttempts(reconnectAttempts + 1);
                    } else {
                      setStatusSwitch(false);
                      setReconnectManualAttempts(reconnectAttempts + 1);
                    }
                  }}
                > {!statusSwitch ? 'Connect' : 'Reconnect'}
                </Button>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Reboot Scanner">
                <Button
                  id="connectionCheckerButton"
                  disabled={!connected || !statusSwitch}
                  danger
                  size="small"
                  type="default"
                  onClick={() => {
                    reboot(setConnectionResponse);
                  }}
                > Reboot
                </Button>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Volume">
                <div className="icon-wrapper">
                  <Slider disabled={!connected || !statusSwitch} min={1} max={3}
                          onChange={(value: any) => handleChange(value)} value={volume}/>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <div className="header_drawer_title_equip">
            <h5>Test DS9908R</h5>
          </div>
          <Row className="drawer_body_config">
            <Col span={12}>
              <Form.Item label="Beeper">
                <Row gutter={[16, 16]}>
                  <Col span={16}>
                    <Select
                      id="beepSelect"
                      disabled={!connected || !statusSwitch}
                      size="small"
                      placeholder="Select"
                      onChange={(value) => setBeeps(value + '')}
                    >
                      <Select.Option value="0"> ONE SHORT HIGH</Select.Option>
                      <Select.Option value="1"> TWO SHORT HIGH</Select.Option>
                      <Select.Option value="2"> THREE SHORT HIGH</Select.Option>
                      <Select.Option value="3"> FOUR SHORT HIGH</Select.Option>
                      <Select.Option value="4"> FIVE SHORT HIGH</Select.Option>
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Button
                      id="beepButton"
                      disabled={!connected || !statusSwitch}
                      size="small"
                      type="primary"
                      className="btn-green"
                      onClick={() => beepDevice(beeps, setConnectionResponse)}> Beep </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            {
              <Col span={12}>
                <Form.Item label="LED">
                  <Row gutter={[16, 16]}>
                    <Col span={18}>
                      <Select
                        id="colorSelect"
                        disabled={!connected || !statusSwitch}
                        size="small"
                        placeholder="Select"
                        value={color}
                        onChange={(value) => {
                          setColorSW(false);
                          setColor(value + '');
                        }}
                      >
                        <Select.Option value="red"> Red </Select.Option>
                        <Select.Option value="yellow"> Yellow </Select.Option>
                        <Select.Option value="green"> Green </Select.Option>
                      </Select>
                    </Col>
                    <Col span={4}>
                      <Switch
                        disabled={!connected || !statusSwitch}
                        key={color}
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={colorSW}
                        onChange={(value) => {
                          setColorSW(value);
                          changeLightColor(color, value ? 'on' : 'off', setConnectionResponse);
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            }
            <Col span={12}>
              <Button
                id="verifyConnectionButton"
                disabled={connected}
                onClick={() => {
                  setConnectionResponse({
                    title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R
                      app... </>,
                    type: 'info',
                  });
                  start();
                }}> Verify App Connection </Button>
            </Col>
          </Row>
          <div className="header_drawer_title_equip">
            <h5>Test Scans</h5>
          </div>
          <Row className="drawer_body_config">
            <Col span={24}>
              <div className="barcode-number"><span><BarcodeOutlined/> Real scan:</span><p>{realTag}</p></div>
              <div className="barcode-number"><span><BuildOutlined/> Type Scan:</span><p>{typeScan}</p></div>
              {typeScan === 'EPC' && <div className="barcode-number"><span><FieldBinaryOutlined/> Scan ASCII:</span>
                  <p>{hexToAscii(realTag)}</p></div>}
            </Col>
          </Row>
        </Form>
      </Drawer>
    }
  </>;
};
