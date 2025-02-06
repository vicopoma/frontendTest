import React, { useEffect } from 'react';
import { Badge, Col, Form, Row } from 'antd';
import { useImportData, useImportDataList } from '../../../hook/hooks/importData';
import moment from 'moment';
import { dateFormat, dateFormatTable, FILTERS } from '../../../constants/constants';
import { LogsViewer } from '../../Shared/LogsViewer/LogsViewer';
import { downloadCsv, statusImportColor } from '../../../helpers/Utils';
import { useFilterStates } from '../../../hook/hooks/filters';
import { API } from '../../../settings/server.config';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router-dom';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';
import { LoaderButton } from '../../Shared/LoaderButton/LoaderButton';

export const ImportResultDetails = ({showDrawer, closeDrawer}: {
  showDrawer: boolean,
  closeDrawer: Function
}) => {
  return (
    <DetailLayout
      visible={showDrawer}
      width="60%"
      onClose={closeDrawer}
      canModify={false}
      onChange={() => {
      }}>
      <ImportResultLogViewer/>
    </DetailLayout>
  );
};

export const ImportResultLogViewer = () => {
  const path = useLocation().pathname.split('/');
  const logDetailId = path[path.length - 1];
  const importResultFilter = useFilterStates(FILTERS.IMPORT_RESULT);
  const {
    importResultById: {
      loadImportResultById,
      logDetails
    }
  } = useImportData();
  
  const {
    logsStatus: {getLatestRecords, logs}
  } = useImportDataList();
  
  useEffect(() => {
    loadImportResultById(logDetailId);
    getLatestRecords(logDetailId);
  }, [getLatestRecords, loadImportResultById, logDetailId]);
  
  return (
    <>
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">Result Detail</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.MANAGEMENT_DATA_IMPORT),
            breadcrumbName: 'Result List'
          },
          {
            path: '',
            breadcrumbName: `${logDetails.fileName} - ${moment(logDetails?.date).local().format(dateFormat)}`
          }
        ]}
      />
      <Form>
        <div className="drawer_config">
          <h5> Information </h5>
          <div className="drawer_body_config">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item label={`${importResultFilter?.isImported?.params[0] === 'true' ? 'Import' : 'Export'} Date`}>
                  {moment(logDetails?.date).local().format(dateFormatTable)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Status">
                  <Badge
                    color={statusImportColor(logDetails?.message)}
                    text={logDetails?.message}/>
                </Form.Item>
              </Col>
              <Col span={24}>
                <LogsViewer
                  style={{
                    fontSize: '11px'
                  }}
                  logs={logs}
                  progressStatus={2}/>
              </Col>
              <Col span={12}/>
            
            </Row>
            <Row justify="end">
              <Col span={24}>
                <LoaderButton
                  onClick={() => {
                    downloadCsv(`logs-${logDetails.fileName}`, API.IMPORT.GET_CVS_SUMMARY(logDetailId), 'GET');
                  }}
                >
                  Download logs
                </LoaderButton>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </>
  );
};
