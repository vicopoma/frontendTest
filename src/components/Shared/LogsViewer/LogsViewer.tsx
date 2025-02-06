import React from 'react';
import { Log } from '../../../store/types/importData';
import { dateFormatTable, IMPORT_STATUS } from '../../../constants/constants';
import { Col, Row } from 'antd';
import moment from 'moment';
import './LogsViewer.scss';

export const LogsViewer = ({logs, progressStatus, style}: {
  logs: Array<Log>,
  progressStatus: number,
  style?: React.CSSProperties
}) => {
  
  return (
    <>
      {progressStatus > 0 && (
        <div style={style} className="log-viewer blue-scroll">
          {
            progressStatus === 1 && logs.length === 1 ? <div> ...in progress </div> :
              progressStatus >= 1 && logs && logs?.map((logLine, index) => {
                let color = 'white';
                if (logLine.status === IMPORT_STATUS.SUCCESS) {
                  color = '#4DFF00';
                }
                if (logLine.status === IMPORT_STATUS.ERROR) {
                  color = 'red';
                }
                return (
                  <Row style={{minWidth: '1500px'}} gutter={[16, 3]} justify="start">
                    <Col style={{textAlign: 'right', color: 'gray'}}>
                      {index}
                    </Col>
                    <Col style={{color: 'yellow'}}>
                      <b>
                        {`${moment.utc(logLine.date).local().format(dateFormatTable)}`}
                      </b>
                    </Col>
                    <Col>
                      {` ${logLine.fileName} (line ${logLine.line}): ${logLine.type} ${logLine.value} ${logLine.message}`}
                    </Col>
                    <Col style={{color: color}}>
                      <b>
                        {`[${logLine.status}]`}
                      </b>
                    </Col>
                  </Row>
                );
              })
          }
          {
            progressStatus === 2 && <div style={{color: 'white'}}> For more details you can download logs... </div>
          }
        </div>
      )
      }
    </>
  );
};
