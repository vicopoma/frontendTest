import React, { useCallback, useState } from 'react';
import { MessageAlertBackTool, useMessageAlertList } from "../../../hook/customHooks/backdoor";
import './MessageAlert.scss';
import { useAccountState } from '../../../hook/hooks/account';
import { useInterval } from '../../../hook/customHooks/customHooks';
import { DATE_FORMATS } from '../../../constants/constants';
import moment from 'moment';
import { Button, Col, Row } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export const MessageAlertLayout = () => {
  const { account } = useAccountState();
  const { messageAlertList, loadMessageAlertList } = useMessageAlertList();
  const [ignoredMessages, setIgnoredMessages] = useState<Array<string>>([]);
  const [openMessages, setOpenMessages] = useState(false);

  const loadMessageAlert = useCallback(() => {
    if (account?.id !== '' && (account?.role?.name || '') !== '') {
      loadMessageAlertList(account?.id);
    }
  }, [account?.id, account?.role?.name, loadMessageAlertList]);

  const ignoreMessage = useCallback((id: string) => {
    setIgnoredMessages(prevState => {
      return [...prevState, id];
    });
  }, []);

  const resetIgnoredMessages = useCallback(() => {
    setIgnoredMessages([]);
  }, []);
  
  useInterval(loadMessageAlert, 60000, true);
  useInterval(resetIgnoredMessages, 600000, true);

  if (messageAlertList.length === 0) {
    return <></>;
  }

  return (
    <div className="message-alert-layout-container">
    {openMessages ?
      <div>
        <div className="message-alert-layout blue-scroll">
        {messageAlertList.filter(messageAlert => {
          return ignoredMessages.filter(id => id === messageAlert.id).length === 0;        
        }).map((messageAlert) => (
          <MessageAlert
            key={messageAlert.id} 
            ignoreMessage={ignoreMessage}
            loadMessageAlertList={loadMessageAlertList}
            messageAlert={messageAlert} 
          />
        ))}
        </div>
        <Button 
          className="message-alert-button" 
          size="small" 
          onClick={() => {
            setOpenMessages(prevState => !prevState);
          }}
        >
          <Row justify="space-between">
            <Col span={3}>
              <img 
                className="img-h anticon" 
                src="/images/message-alert.svg"
                alt=""
                width="35px"
              />
            </Col>
            <Col span={4}>
              <div className="message-alert-button-title">
                Message Alerts
              </div>
            </Col>
            <Col offset={13} span={2}>
              <div className="message-alert-button-number">
                {messageAlertList.length}
              </div>
            </Col>
            <Col span={2}>
              <DownOutlined 
                id="msg-arrow"
                className="message-alert-icon"
              />
            </Col>
          </Row>
        </Button>
      </div> : 
      messageAlertList.length > 0 && <Button 
        className="message-alert-button" size="small" onClick={() => {
        setOpenMessages(prevState => !prevState);
      }}>
        <Row justify="space-between">
          <Col span={3}>
            <img 
              className="img-h anticon" 
              src="/images/message-alert.svg"
              alt=""
              width="35px"
            />
          </Col>
          <Col span={4}>
            <div className="message-alert-button-title">
              Message Alerts
            </div>
          </Col>
          <Col offset={13} span={2}>
            <div className="message-alert-button-number">
              {messageAlertList.length}
            </div>
          </Col>
          <Col span={2}>
            <UpOutlined 
              className="message-alert-icon" 
              id="msg-arrow"
            />
          </Col>
        </Row>
        
      </Button>}
    </div>
  )
}

export const MessageAlert = (
  { ignoreMessage, messageAlert, loadMessageAlertList } : 
  { ignoreMessage: Function, messageAlert: MessageAlertBackTool, loadMessageAlertList: Function }
) => {
  const { account } = useAccountState();
  const { dismissMessageAlert } = useMessageAlertList();
  
  return (      
    <div className="message-alert-container">
      <div className="message-alert-inner">
        <div className="message-alert-content">
          <div className="message-alert-title">{messageAlert.title}</div>
          <div className="message-alert-description">{messageAlert.description}</div>
          <div className="message-alert-date">
            <span className="message-alert-title">From: </span> 
            {moment(messageAlert.startDate).format(DATE_FORMATS.monthDayYearHourMin)}
          </div>
          <div className="message-alert-date">
            <span className="message-alert-title">To: </span> 
            {moment(messageAlert.endDate).format(DATE_FORMATS.monthDayYearHourMin)}
          </div>
        </div>
      </div>
      {<div className="message-alert-footer">
        <div className="message-alert-dismiss" onClick={() => {
          dismissMessageAlert(account.id, messageAlert.id, () => {
            loadMessageAlertList(account.id);
          });
        }}>
          Dismiss
        </div>
      </div>}
    </div>
  )
}