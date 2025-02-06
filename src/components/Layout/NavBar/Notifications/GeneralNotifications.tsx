import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Col, List, Pagination, Progress, Row, Spin } from 'antd';
import { BellOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import './GeneralNotifications.scss';
import moment from 'moment';

import { ACTIVITY_TYPE, DATE_FORMATS, PROGRESS_BAR_DETAILS, PROGRESS_BAR_TYPES } from '../../../../constants/constants';
import { useOnClickOutSideHandler } from '../../../../hook/customHooks/customHooks';
import { useNotificationContext } from '../../../../context/notifications';
import { ROUTES } from '../../../../settings/routes';
import { ProgressBar } from '../../../../Types/Types';
import { downloadCsv } from '../../../../helpers/Utils';
import { API } from '../../../../settings/server.config';
import { SuccessMessage } from '../../../Shared/Messages/Messages';

export const GeneralNotifications = ({closeNotifications}: {
  closeNotifications: Function
}) => {
  
  const {progressBarData} = useNotificationContext();
  const loader = false;
  const notification = useRef(null);
  
  useOnClickOutSideHandler(notification, () => {
    closeNotifications();
  });

  return (
    <div
      ref={notification}
      className="notification-layout">
      {
        <List
          header={
            <Row gutter={[16, 16]}>
              <Col span={3}>
                <BellOutlined className="notifications-icon"/>
              </Col>
              <Col span={18}>
                <div className="notifications-title"> Notifications</div>
              </Col>
              <Col span={3}>
                <CloseOutlined className="notifications-close-icon" style={{ height: '10px' }} onClick={() => closeNotifications()}/>
              </Col>
            </Row>
          }
          bordered
          size="large">
          <div className="notification-list blue-scroll">
            {
              !loader ? progressBarData?.map(data => (
                Object.keys(data).map(key => { 
                  if (key.includes(PROGRESS_BAR_TYPES.EXPORT_SCAN_ALL)
                      || key.includes(PROGRESS_BAR_TYPES.EXPORT_SCAN_BY_VENUE)
                      || key.includes(PROGRESS_BAR_TYPES.EXPORT_SCAN_BY_TEAM)
                      || key.includes(PROGRESS_BAR_TYPES.EXPORT_EQUIPMENT_TAG_HISTORY)
                      || key.includes(PROGRESS_BAR_TYPES.EXPORT_USER)) {
                    return (
                      <DownloadItem key={key} values={{key, value: data[key]}}/>
                    );
                  } else if (key.includes(PROGRESS_BAR_TYPES.MANUAL_IMPORT) || key.includes(PROGRESS_BAR_TYPES.OEM_IMPORT)) {
                    return (
                      <ImportItem key={key} values={{key, value: data[key]}} />
                    )
                  } else if (key.includes(PROGRESS_BAR_TYPES.RESTORING_PARTITION)) {
                    return (
                      <PartitionItem key={key} values={{key, value: data[key]}} />
                    )
                  } else if (key.includes(PROGRESS_BAR_TYPES.SYNCHRONIZED_RAW_BLINK)) {
                    return (
                      <RawBlinkSyncItem key={`${key}-${data[key]?.endProgressBar}`} values={{key, value: data[key]}} />
                    )
                  }
                  return (
                    <PracticeGeneratedItem key={key} values={{value: data[key], key: key}}/>
                  );
                })
              )) : (
                <List.Item>
                  <Spin indicator={<LoadingOutlined style={{fontSize: 24}}/>}/>
                </List.Item>
              )
            }
          </div>
          <List.Item>
            <Pagination hideOnSinglePage defaultCurrent={0} total={progressBarData.length}/>
          </List.Item>
        </List>
      }
    </div>
  );
};

export const PracticeGeneratedItem = ({values}: { values: { value: ProgressBar, key: string } }) => {
  const data = values.value;
  const key = values.key;
  const isPractice = key.split(':')?.[0] === PROGRESS_BAR_TYPES.REGENERATION_PRACTICE_DATA;
  return (
    <List.Item>
      <Row>
        <Col style={{width: '200px'}} span={24}>
          <div>
            <b>Processing: </b>
            {`${data.extra ? data.extra.teamAbbr : data.teamAbbr}
						${moment(data?.extra?.activityStartdate).format(DATE_FORMATS.monthDayYear)}
						${moment(data?.extra?.activityStartdate).format(DATE_FORMATS.hourMinA)} -
						${moment(data?.extra?.activityEndDate).format(DATE_FORMATS.hourMinA)}`}
            
            {
              ` ${data?.extra?.title}`
            }
          </div>
        </Col>
        <Col style={{width: '200px'}} span={24}>
          {
            data?.endProgressBar && <div><b> Finish
                Time: </b> {data?.endProgressBar ? moment(data.endProgressBar).format(DATE_FORMATS.monthDayYearHourMin) : 'no date'}
            </div>
          }
        </Col>
        {
          data.percentage === 100 && !data.messageObservation && (
            <Col span={24}>
              <Link to={{
                pathname: ROUTES.ACTIVITY.SELECTOR(isPractice ? ACTIVITY_TYPE.PRACTICE : ACTIVITY_TYPE.GAME, key?.split(':')[1])
              }}>
                Click to see the {isPractice ? 'practice' : 'game'}.
              </Link>
            </Col>
          )
        }
        <Col style={{width: '200px'}} span={24}>
          <Progress
            percent={data.percentage}
            status={PROGRESS_BAR_DETAILS[data.status].status}
            strokeColor={PROGRESS_BAR_DETAILS[data.status].color}
          />
        </Col>
        {
          data.messageObservation && (
            <Col span={24}>
              <b> Observation: </b> {data.messageObservation}
            </Col>
          )
        }
      </Row>
    </List.Item>
  );
};

export const DownloadItem = ({values}: { values: { value: ProgressBar, key: string } }) => {
  
  const data = values.value;
  const key = values.key;
  
  const now = moment(new Date()); //todays date
  const end = moment(data.endProgressBar); // another date
  const duration = moment.duration(now.diff(end));
  const minutes = duration.asMinutes();
  const processName = data?.extra.process ? data.extra.process: data.extra.fileName;
  
  return (
    <List.Item>
      <Row>
        <Col style={{width: '200px'}} span={24}>
          <div>
            <b>Processing:</b> {data.extra ? processName : data.fileName}
          </div>
        </Col>
        <Col style={{width: '200px'}} span={24}>
          {
            data?.endProgressBar && <div><b> Finish
                Time: </b> {data?.endProgressBar ? moment(data.endProgressBar).format(DATE_FORMATS.monthDayYearHourMin) : 'no date'}
            </div>
          }
        </Col>
        {
          data.percentage === 100 && !data.messageObservation && minutes <= 10 && (
            <Col span={24}>
              <div
                style={{
                  cursor: 'pointer',
                  color: '#4183C4'
                }}
                onClick={() => {
                  downloadCsv(data.extra ? data.extra.fileNameDownload : data.fileNameDownload, [API.DOWNLOAD.BASE(), API.DOWNLOAD.ALL_SCANS_FILE()].join(''), 'POST', {
                    fileName: data.extra ? data.extra.fileNameDownload : data.fileNameDownload,
                    type: key
                  }, 'application/json', () => {
                    SuccessMessage({description: 'Your file has been downloaded'});
                  });
                }}>
                Download {data.extra ? data.extra.fileName : data.fileName}
              </div>
            </Col>
          )
        }
        <Col style={{width: '200px'}} span={24}>
          <Progress
            percent={data.percentage}
            status={PROGRESS_BAR_DETAILS[data.status].status}
            strokeColor={PROGRESS_BAR_DETAILS[data.status].color}
          />
        </Col>
        {
          data.messageObservation && (
            <Col span={24}>
              <b> Observation: </b> {data.messageObservation}
            </Col>
          )
        }
      </Row>
    </List.Item>
  );
};

export const ImportItem = ({values}: { values: { value: ProgressBar, key: string } }) => {
  const data = values.value;
  const processName = data?.extra.process ? data.extra.process: data.extra.title;
  return (
    <List.Item>
      <Row>
        <Col style={{width: '200px'}} span={24}>
          <div>
            <b>Processing:</b>
            {` ${data.extra ? processName : data.fileName}
						${moment(data?.activityStartdate).format(DATE_FORMATS.monthDayYear)}
						${moment(data?.activityStartdate).format(DATE_FORMATS.hourMinA)} -
						${moment(data?.activityEndDate).format(DATE_FORMATS.hourMinA)}`}
          </div>
        </Col>
        <Col style={{width: '200px'}} span={24}>
          {
            data?.endProgressBar && <div><b> Finish
                Time: </b> {data?.endProgressBar ? moment(data.endProgressBar).format(DATE_FORMATS.monthDayYearHourMin) : 'no date'}
            </div>
          }
        </Col>
        <Col style={{width: '200px'}} span={24}>
          <Progress
            percent={data.percentage}
            status={PROGRESS_BAR_DETAILS[data.status].status}
            strokeColor={PROGRESS_BAR_DETAILS[data.status].color}
          />
        </Col>
        {
          data.messageObservation && (
            <Col span={24}>
              <b> Observation: </b> {data.messageObservation}
            </Col>
          )
        }
      </Row>
    </List.Item>
  );
};

export const PartitionItem = ({values}: { values: { value: ProgressBar, key: string } }) => {
  const data = values.value;
  return (
    <List.Item>
      <Row>
        <Col style={{width: '200px'}} span={24}>
          <div>
            <b>Processing:</b>
            {` ${data.extra ? data.extra.title : data.fileName}`}
          </div>
        </Col>
        <Col style={{width: '200px'}} span={24}>
          {
            data?.endProgressBar && <div><b> Finish
                Time: </b> {data?.endProgressBar ? moment(data.endProgressBar).format(DATE_FORMATS.monthDayYearHourMin) : 'no date'}
            </div>
          }
        </Col>
        <Col style={{width: '200px'}} span={24}>
          <Progress
            percent={data.percentage}
            status={PROGRESS_BAR_DETAILS[data.status].status}
            strokeColor={PROGRESS_BAR_DETAILS[data.status].color}
          />
        </Col>
        {
          data.messageObservation && (
            <Col span={24}>
              <b> Observation: </b> {data.messageObservation}
            </Col>
          )
        }
      </Row>
    </List.Item>
  );
};

export const RawBlinkSyncItem = ({values}: { values: { value: ProgressBar, key: string } }) => {
  const data = values.value;
  const processName = data?.extra.process ? data.extra.process: data.extra.title;
  return (
    <List.Item>
      <Row>
        <Col style={{width: '200px'}} span={24}>
          <div>
            <b>Processing:</b>
            {` ${data.extra ? processName : data.fileName}
						${moment(data?.extra?.activityStartdate).format(DATE_FORMATS.monthDayYear)}
						${moment(data?.extra?.activityStartdate).format(DATE_FORMATS.hourMinA)} -
						${moment(data?.extra?.activityEndDate).format(DATE_FORMATS.monthDayYear)}
						${moment(data?.extra?.activityEndDate).format(DATE_FORMATS.hourMinA)}`}
          </div>
        </Col>
        <Col style={{width: '200px'}} span={24}>
          {
            data?.endProgressBar && <div><b> Finish
                Time: </b> {data?.endProgressBar ? moment(data.endProgressBar).format(DATE_FORMATS.monthDayYearHourMin) : 'no date'}
            </div>
          }
        </Col>
        <Col style={{width: '200px'}} span={24}>
          <Progress
            percent={data.percentage}
            status={PROGRESS_BAR_DETAILS[data.status].status}
            strokeColor={PROGRESS_BAR_DETAILS[data.status].color}
          />
        </Col>
        {
          data.messageObservation && (
            <Col span={24}>
              <b> Observation: </b> {data.messageObservation}
            </Col>
          )
        }
      </Row>
    </List.Item>
  );
};