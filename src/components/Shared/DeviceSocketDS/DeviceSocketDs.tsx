import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceDS9908rDispatch } from '../../../hook/hooks/deviceDS9908r';
import { FetchResponse } from '../Drawer/Drawer';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { API } from '../../../settings/server.config';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ConfigurationKeys, ConfigurationTabs, ROUTES } from '../../../settings/routes';
import { CONFIGURATION_SIDER, SCAN_DEVICE } from '../../../constants/constants';
import { history } from '../../../store/reducers';

export const SocketDS = ({children, methodName, suscribeDisabled, suscribeFunction, setConnectionResponse, trigger }: {
  children?: ReactNode
  methodName: string,
  suscribeDisabled?: boolean,
  suscribeFunction: (message: any) => void,
  setConnectionResponse: React.Dispatch<React.SetStateAction<FetchResponse>>,
  trigger?: string,
}) => {
  
  const {statusDevice, changeVolume} = useDeviceDS9908rDispatch();
  
  const [statusSwitch, setStatusSwitch] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);

  const timerId = useRef<NodeJS.Timeout | null>(null);
  
  const connection = new HubConnectionBuilder()
  .withUrl(API.DEVICES.DS9908R.SOCKET_CONNECTION())
  .withAutomaticReconnect([1000])
  .build();
  
  const start = async () => {
    
    await connection.start()
    .then(result => {
      if (statusSwitch) {
        setConnected(() => true);
        setConnectionResponse({
          type: 'success',
          title: 'Success',
          description: 'Now you are connected to DS9908R app'
        });
        if (!timerId.current) {
          timerId.current = setTimeout(() => {
            setReconnectAttempts(data => data + 1);
            timerId.current = null;
          }, 10000);
        }   
      } else {
        setConnected(() => false);
        setConnectionResponse({
          type: 'warning',
          title: 'Warning',
          description: <div className="tooltip-device">The device is disabled, check the
            <span key={`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`}
                  onClick={() => {
                    sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
                      collapsed: false,
                      menuItem: `${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`,
                      params: '',
                      subMenu: [ConfigurationTabs.DEVICE],
                    }));
                    history.push(ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`));
                  }}
                  style={{cursor: 'pointer', color: '#1E90FF'}}
                  className="title"
            > Configuration </span></div>
        });
        if (!timerId.current) {
          timerId.current = setTimeout(() => {
            setReconnectAttempts(data => data + 1);
            timerId.current = null;
          }, 5000);
        }       
      }
      connection.on(methodName, message => {
        if(!suscribeDisabled) suscribeFunction(message.toUpperCase());
      });
    })
    .catch(e => {
      setConnected(() => false);
      if (reconnectAttempts < 2) {
        setConnectionResponse({
          title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R app... </>,
          type: 'info',
          description: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R app... </>,
        });
        if (!timerId.current) {
          timerId.current = setTimeout(() => {
            setReconnectAttempts(data => data + 1);
            timerId.current = null;
          }, 5000);
        }
      } else {
        setConnectionResponse({
          type: 'warning',
          title: 'Warning',
          description: <div>Please, check if scanner service is available. Contact the administrator, check the
            <span key={`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`}
                  onClick={() => {
                    sessionStorage.setItem(CONFIGURATION_SIDER, JSON.stringify({
                      collapsed: false,
                      menuItem: `${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`,
                      params: '',
                      subMenu: [ConfigurationTabs.DEVICE],
                    }));
                    history.push(ROUTES.CONFIGURATION.PAGE(`${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`));
                  }}
                  style={{cursor: 'pointer', color: '#1E90FF'}}
                  className="title"
            > Configuration </span></div>
        });
        if (!timerId.current) {
          timerId.current = setTimeout(() => {
            setReconnectAttempts(data => data + 1);
            timerId.current = null;
          }, 30000);
        }         
      }
    });
  };

  const EMPTY_FUNCTION = useCallback(() => {}, []);
  
  useEffect(() => {
    statusDevice(setStatusSwitch, EMPTY_FUNCTION);
    const volumeValue = sessionStorage.getItem('volume');
    if (volumeValue) {
      const vol = parseInt(volumeValue);
      changeVolume(Math.abs(vol - 2), EMPTY_FUNCTION);
    } else {
      changeVolume(2, EMPTY_FUNCTION);
      sessionStorage.setItem('volume', '1');
    }
  }, [statusDevice, setStatusSwitch, changeVolume, reconnectAttempts, EMPTY_FUNCTION]);
  
  useEffect(() => {
    start();
    return () => {
      connection.stop().then(() => {
        console.info('Connection Stopped');
        if (connected) {
          console.info('Verifying Connection');
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reconnectAttempts, statusSwitch, suscribeDisabled]);
  
  useEffect(() => {
    setConnectionResponse({
      title: <> <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/> Connecting to DS9908R app... </>,
      type: 'info',
    });
    return () => {
      setConnectionResponse({
        title: '',
        type: undefined
      });
    };
  }, [setConnectionResponse]);
  
  return <> {children} </>;
};
