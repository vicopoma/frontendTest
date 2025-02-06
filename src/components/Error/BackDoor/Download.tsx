import React, { useEffect, useState } from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadCsv } from '../../../helpers/Utils';
import { API } from '../../../settings/server.config';
import { LoaderButton } from '../../Shared/LoaderButton/LoaderButton';
import { useMaintenanceHooks } from '../../../hook/customHooks/maintenance';
import { Select } from '../../Shared/Select/Select';

export const Download = () => {
  const [status, setStatus] = useState(false);

  const { maintenanceLogList: { maintenanceLogList, getMaintenanceLogList } } = useMaintenanceHooks();
  const [selectedValue, setSelectedValue] = useState<string>('');
  useEffect(() => {
    getMaintenanceLogList()
  }, [getMaintenanceLogList]);


  return (
    <Layout>
      <div className="card-container">
        <div className="navigationbar-header-configuration">
          <span className="navigation-bar-configuration">Additional Tools</span>
        </div>
        <div className="image-background">
          <Row gutter={[16, 16]}>
            <Col span={24} className="backdoor">
              <h4>List of available options</h4>
              <div className="backdoor-body">
                <h5><DownloadOutlined /> Download</h5>
                <Row gutter={[16, 16]}>
                  <Col style={{ display: 'flex' }} span={6} xs={24} md={12} lg={8} xl={6}>
                    <Select
                      style={{ marginRight: '8px' }}
                      id="log-file-list"
                      placeholder="Maintenance Log File"
                      onChange={(value) => {
                        setSelectedValue(value);
                      }}
                      options={maintenanceLogList.map(data => ({
                        display: data,
                        value: data
                      }))} />
                    <LoaderButton
                      disable={status}
                      onClick={async () => {
                        if (selectedValue.length > 0) {
                          setStatus(true);
                          await downloadCsv(
                            `${selectedValue}.zip`,
                            API.MAINTENANCE.BASE() + API.MAINTENANCE.DOWNLOAD_LOG_FILES(selectedValue),
                            'GET',
                            undefined,
                            undefined,
                            () => {
                              setStatus(false);
                            });
                        }
                      }}
                    >
                      Download Log
                    </LoaderButton>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="about-footer">
        <Divider />
        <div className="footer">
          <img src="images/logo-zebra-black.svg" alt="" /> <span> © Zebra Technologies</span>
        </div>
      </div>
    </Layout>
  );
};
