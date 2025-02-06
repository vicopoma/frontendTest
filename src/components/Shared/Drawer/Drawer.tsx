import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Drawer as AntDrawer, Row } from 'antd';
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import './Drawer.scss';

export interface FetchResponse {
  type: 'error' | 'success' | 'warning' | 'info' | undefined,
  title: React.ReactNode,
  description?: React.ReactNode
}

export const Drawer = ({
                         title,
                         closable,
                         canModify,
                         onClose,
                         onChange,
                         width,
                         children,
                         visible,
                         alertResponse,
                         onDeleteButton,
                         enableSaveButton = true,
                         extraButton,
                         enableExtraButton = false,
                         openButton = false,
                         enableOpenButton = false
                       }: {
  title: React.ReactNode,
  closable?: boolean
  onClose: Function
  canModify: boolean
  onChange: (getResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => void
  width?: string
  children?: React.ReactNode
  visible?: boolean,
  alertResponse?: FetchResponse,
  onDeleteButton?: () => void,
  enableSaveButton?: boolean,
  extraButton?: React.ReactNode
  enableExtraButton?: boolean,
  openButton?: React.ReactNode,
  enableOpenButton?: boolean,
}) => {
  
  const [response, setResponse] = useState<FetchResponse>({
    type: undefined,
    title: '',
    description: ''
  });
  
  useEffect(() => {
    if (alertResponse) {
      setResponse(alertResponse);
    }
  }, [alertResponse]);
  
  return (
    <AntDrawer
      visible={visible}
      placement="right"
      closable={closable}
      width={window.innerWidth > 1010 ? width : '100%'}
      onClose={() => onClose()}
      getContainer={false}
      keyboard={false}
      maskClosable={false}
      title={
        <div className="header_drawer_title_equip">
          <label>{title}</label>
        </div>
      }
      footer={
        <>
          <Row>
            <Col span={onDeleteButton ? 8 : 0}>
              {
                onDeleteButton &&
                <Button
                    id="deleteDrawerObjectButton"
                    className="btn-red-outline"
                    onClick={() => onDeleteButton()}
                    icon={<DeleteOutlined/>}
                > DELETE </Button>
              }
            </Col>
            
            <Col span={onDeleteButton ? 16 : 24}>
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <div className="alert-drawer">
                  {
                    response.type !== undefined &&
                    <Alert
                        closable
                        onClose={() => {
                          setResponse({
                            ...response,
                            type: undefined,
                          });
                        }}
                        message={response.title}
                        description={response.description}
                        type={response.type}
                        showIcon
                    />
                  }
                </div>
                <Button id="drawerButtonCancelClose" className="btn-blue-link btn-cancel-close" style={{ padding: '4px 15px'}} onClick={() => onClose()}
                        icon={<CloseOutlined/>}>
                  {canModify ? 'CANCEL' : 'CLOSE'}
                </Button>
                
                {
                  enableSaveButton && canModify && <Button id="drawerButtonSave" className="btn-green" onClick={() => onChange(setResponse)}
                                       icon={<SaveOutlined/>}> SAVE </Button>
                }
                {enableOpenButton && openButton}
                {enableExtraButton && extraButton}
              </div>
            </Col>
          </Row>
        </>
      }
    >
      {children}
    </AntDrawer>
  );
};
