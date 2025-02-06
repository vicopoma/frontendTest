import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Upload } from 'antd';
import { CloseOutlined, FileAddOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useAccountState } from '../../hook/hooks/account';
import { useImportDataDispatch, useImportDataState } from '../../hook/hooks/importData';
import { LogsViewer } from '../Shared/LogsViewer/LogsViewer';
import { isJson } from '../../helpers/Utils';
import moment from 'moment';
import { LOG_HISTORY_DEFAULT } from '../../store/types/importData';

export const PlayerImportModal = ({ open, setOpen } : { open: boolean, setOpen: Function }) => {
  const { teamSelected } = useAccountState();
  const [uploadedFile, setUploadedFile] = useState<{ [key: string]: any }>({});
  const [importState, setImportState] = useState<number>(0);
  const {currentImportDetails} = useImportDataState();
  const {importApparelCsv, replaceLogCurrentDetails} = useImportDataDispatch();

  useEffect(() => {
    if (currentImportDetails.percentage === 100) {
      // setProgressStatus(PROGRESS_STATUS.SUCCESS);
      setImportState(2);
    } else if (currentImportDetails.percentage > 0 && currentImportDetails.percentage < 100) {
      setImportState(1);
    }
  }, [currentImportDetails.percentage]);

  return (
    <Modal
      destroyOnClose={true}
      maskClosable={false}
      width={850}
      style={{ padding: '8px'}}
      footer={null}
      title="Import Player CSV " 
      visible={open} 
      onCancel={() => {
        setOpen(false);
        replaceLogCurrentDetails(LOG_HISTORY_DEFAULT);
        setUploadedFile({})
        setImportState(0);
      }}
    >
      <div className="upload-player">
      {Object.keys(uploadedFile).length === 0 ? 
        <div>
          <Upload
            accept=".csv"
            key=".csv"
            beforeUpload={(file) => {
              replaceLogCurrentDetails(LOG_HISTORY_DEFAULT);
              setUploadedFile({ file: file });
              return false;
            }}
          >
            <Button
              className="upload-button"
              size="small"
            >
              <Row>
                <Col span={24} style={{ display: 'inline-flex' }}>
                  <FileAddOutlined style={{ margin: '5px 10px 5px 5px' }} />
                  Select .csv File 
                </Col>
              </Row>
            </Button>  
          </Upload>
          
          </div> :
          <Button
            className="upload-button file"
            size="small"
          >
            <Row>
              <Col span={22} style={{ display: 'inline-flex' }}>
                <FileDoneOutlined style={{ margin: '5px 10px 5px 5px' }} />
                {uploadedFile.file.name} 
              </Col>
              <Col span={2}>
                <CloseOutlined 
                  onClick={() => {
                    if (importState !== 1)
                      setImportState(0);
                      replaceLogCurrentDetails(LOG_HISTORY_DEFAULT);
                      setUploadedFile({});
                  }}
                  style={{ color: 'red' }}
                />
              </Col>
            </Row>
          </Button>
      }
        <Button
          className="btn-green btn-import"
          size="middle"
          disabled={Object.keys(uploadedFile).length === 0 || importState > 0} 
          onClick={() => {
            const formData = new FormData();
            formData.append('file', uploadedFile.file);
            setImportState(1)
            importApparelCsv(formData, () => {}, () => {}, teamSelected.teamId).then(() => {
            });
          }}
        >
          Import
        </Button>
      </div>
      <LogsViewer
        logs={isJson(currentImportDetails?.value) ? JSON.parse(currentImportDetails?.value) : [{
          value: '',
          date: moment(currentImportDetails.date).utc().toISOString(),
          fileName: '',
          status: 'ERROR',
          type: '',
          line: '',
          message: currentImportDetails.message
        }]}
        progressStatus={importState}
        style={{ maxHeight: '500px' }}
      />
    </Modal>
  )
}