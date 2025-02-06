import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { OpenFile, Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { toolbarPlugin, ToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

import { useBarcodeReportDispatch } from '../../../hook/hooks/barcodeReport';
import { getRequest, getToken } from '../../../settings/httpClients';
import { API } from '../../../settings/server.config';
import { useFilterStates } from '../../../hook/hooks/filters';
import { PLAYERS_FILTER } from '../../../constants/constants';
import { paramBuilder, unZipBase64String } from '../../../helpers/Utils';
import { useLoaderDispatch } from '../../../hook/hooks/loader';

interface ToolbarProps {
  fileUrl: string;
  fileName: string;
}

const PDF: React.FC<ToolbarProps> = ({fileUrl, fileName}) => {
  const toolbarPluginInstance = toolbarPlugin();
  const {Toolbar} = toolbarPluginInstance;
  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: (file: OpenFile) => {
      return `Report-${fileName}`;
    },
  });
  const {DownloadButton} = getFilePluginInstance;
  return (
    <div
      style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#eeeeee',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          padding: '4px',
        }}
      >
        <Toolbar>
          {
            (props: ToolbarSlot) => {
              const {
                CurrentPageInput, EnterFullScreen, GoToNextPage, GoToPreviousPage,
                NumberOfPages, ShowSearchPopover, Zoom, ZoomIn,
                ZoomOut,
              } = props;
              return (
                <>
                  <div style={{padding: '0px 2px'}}>
                    <ShowSearchPopover/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <ZoomOut/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <Zoom/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <ZoomIn/>
                  </div>
                  <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
                    <GoToPreviousPage/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <CurrentPageInput/> / <NumberOfPages/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <GoToNextPage/>
                  </div>
                  <div style={{padding: '0px 2px', marginLeft: 'auto'}}>
                    <EnterFullScreen/>
                  </div>
                  <div style={{padding: '0px 2px'}}>
                    <DownloadButton/>
                  </div>
                </>
              );
            }
          }
        </Toolbar>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Viewer
          fileUrl={fileUrl}
          plugins={[
            toolbarPluginInstance,
            getFilePluginInstance
          ]}
        />
      </div>
    </div>
  );
};


export const Report = ({closeModal, showModal}: { showModal: boolean, closeModal: Function }) => {
  const {resetBarcodeReport} = useBarcodeReportDispatch();
  
  const {showLoader} = useLoaderDispatch();
  const ReportFilter = useFilterStates(PLAYERS_FILTER);
  
  const closeReport = () => {
    closeModal();
    resetBarcodeReport();
  };
  
  const [showPDF, setShowPDF] = useState<boolean>(false);
  const [data, setData] = useState<string>('');
  const queries = paramBuilder(ReportFilter);
  
  const load = useCallback(() => {
    showLoader(true);
    getRequest(API.PLAYER.PLAYER_BARCODE() + queries, getToken()).then(e => {
      setData(unZipBase64String(e?.body.report));
      setShowPDF(true);
      showLoader(false);
    });
  }, [setShowPDF, setData, showLoader, queries]);
  
  useEffect(() => {
    load();
  }, [load]);
  
  return (
    <>
      {
        showPDF && <Modal
            title="Report"
            visible={showModal}
            onOk={() => closeReport()}
            style={{top: 20}}
            onCancel={() => closeReport()}
            width={750}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.js">
                <div
                    style={{
                      height: '500px',
                      width: '100%'
                    }}
                >
                    <PDF
                        fileUrl={`data:application/pdf;base64,${data}`}
                        fileName={'report.pdf'}
                    />
                </div>
            </Worker>
        </Modal>
      }
    </>
  );
};
