import React, { CSSProperties, useEffect, useState } from 'react';
import { Alert, Button, Col, Layout, Row } from 'antd';
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import './DetailLayout.scss';
import { history } from '../../../store/reducers';
import { useAccountState } from '../../../hook/hooks/account';

export interface FetchResponse {
  type: 'error' | 'success' | 'warning' | 'info' | undefined,
  title: React.ReactNode,
  description?: React.ReactNode
}
interface DetailLayoutProps {
  title?: React.ReactNode,
  closable?: boolean
  onClose?: Function
  onBack?: Function
  canModify?: boolean
  onChange?: (getResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => void
  width?: string
  children?: React.ReactNode
  visible?: boolean,
  alertResponse?: FetchResponse,
  onDeleteButton?: (getResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => void,
  onCreateAnotherButton?: (getResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => void,
  deleteDetails?: {
    text?: string,
    icon?: React.ReactNode,
    className?: string,
    style?: CSSProperties
  }
  leftFooter?: Array<React.ReactNode>
  disableBackButton?: boolean,
  className?: string,
}

export const DetailLayout = ({ title, canModify, onChange, children, alertResponse, onDeleteButton, deleteDetails, leftFooter, onCreateAnotherButton, onBack, disableBackButton, className }: DetailLayoutProps) => {

  const { teamSelected } = useAccountState();
  const [trigger, setTrigger] = useState<number>(0);
  const [response, setResponse] = useState<FetchResponse>({
    type: undefined,
    title: '',
    description: ''
  });

  useEffect(() => {
    if (teamSelected?.teamId) {
      setTrigger(prevState => prevState + 1);
    }
  }, [teamSelected?.teamId]);

  useEffect(() => {
    if (trigger > 1) {
      history.goBack();
    }
  }, [trigger]);

  useEffect(() => {
    if (alertResponse) {
      setResponse(alertResponse);
    }
  }, [alertResponse]);

  return (
    <Layout className={className}>
      <div className="card-container">
        <div className="header-selector">
          {title}
        </div>
        <div className="body-selector">
          {children}
        </div>
        <div className="footer-selector">
          <>
            <Row justify="space-between">
              <Col>
                <div style={{ display: 'flex' }}>
                  {
                    onDeleteButton &&
                    <Button
                      id="deleteDrawerObjectButton"
                      key={deleteDetails?.text}
                      className={deleteDetails?.className ?? "btn-red-outline"}
                      style={{ marginRight: '8px' }}
                      onClick={() => onDeleteButton(setResponse)}
                      icon={deleteDetails?.icon ?? <DeleteOutlined />}>
                      {deleteDetails?.text ?? 'DELETE'}
                    </Button>
                  }
                  {
                    leftFooter?.map((obj, index) => <div key={index}> {obj}</div>)
                  }
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div className="alert-drawer">
                    {
                      response.type !== undefined &&
                      <Alert
                        style={{ minWidth: '300px' }}
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
                  {
                    onCreateAnotherButton &&
                    <Button
                      id="drawerButtonCreateAnother"
                      key="create-another"
                      className={"btn-blue"}
                      icon={<img className="img-h anticon" src="/images/duplicate-icon.svg" alt="" width="15px"/>}
                      onClick={() => onCreateAnotherButton(setResponse)}
                    >
                      {'CREATE ANOTHER'}
                    </Button>
                  }
                  {!disableBackButton && <Button id="drawerButtonCancelClose" className="btn-blue-link" onClick={() => {
                    if (onBack) {
                      onBack();
                    } else {
                      history.goBack();
                    }
                  }} icon={<CloseOutlined />}>
                    BACK
                  </Button>}
                  {
                    canModify && (
                      <Button
                        id="drawerButtonSave"
                        className="btn-green"
                        onClick={() => {
                          onChange?.(setResponse);
                        }}
                        icon={<SaveOutlined />}>
                        SAVE
                      </Button>
                    )
                  }
                </div>
              </Col>
            </Row>
          </>
        </div>
      </div>
    </Layout>
  );
};
