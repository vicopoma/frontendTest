import React from 'react';
import { FilePdfOutlined, } from '@ant-design/icons';

import { Button, Modal } from 'antd';

// @ts-ignore
import Pdf from 'react-to-pdf';

import { useBarcodeReportState } from '../../../hook/hooks/barcodeReport';

import './BardoceReportStyles.scss';

export const BarcodeReport = ({closeModal, showModal}: { showModal: boolean, closeModal: Function }) => {
  const {barcodeReport} = useBarcodeReportState();
  const ref = React.createRef<any>();
  const test = (Pdf);
  
  return (
    <>
      <Modal
        footer={
          <Pdf targetRef={ref} filename="div-blue.pdf">
            {({toPdf}: { toPdf: any }) => (
              <Button
                id="generatePdfButton"
                icon={<FilePdfOutlined/>}
                type="primary"
                
                onClick={toPdf}>Generate pdf</Button>
            )}
          </Pdf>
        }
        visible={showModal} onCancel={() => closeModal()}>
        {test}
        <div className="pdf-table-body" ref={ref}>
          <table className="pdf-table-table">
            <tr>
              <th>
                <h4
                  className="pdf-table-h4">{`${barcodeReport.reportName} ${barcodeReport.year} - ${barcodeReport.phase}`}</h4>
              </th>
            </tr>
            
            {
              barcodeReport.teams.map(team => (
                <>
                  <tr>
                    <td>
                      <div style={{justifyContent: 'center'}} className="pdf-back-detail-01">
                        <div className="pdf-team-icon">
                          {/* <img src="DAL.svg" alt=""/> */}
                        </div>
                        <div>
                          <h4 style={{color: '#013399'}}>{team.fullName}</h4>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {
                    team.players.map(player => (
                      <>
                        <tr>
                          <div className="pdf-back-detail-01">
                            <div className="pdf-player">
                              <h4 style={{color: '#029261'}}>Player:</h4>
                              {/* <img src="helmet-player.svg" alt=""/>*/}
                            </div>
                            <div>
                              <h4 style={{color: '#029261'}}>{player.fullName}</h4>
                            </div>
                          </div>
                        </tr>
                        <div style={{marginBottom: '30px'}}>
                          {
                            player.equipment.map(equipment => (
                              <>
                                <tr>
                                  <td>
                                    <div className="pdf-barcode">
                                      <div className="pdf-equipment">{equipment.equipmentType.toLocaleUpperCase()}</div>
                                      <div>
                                        {
                                          <img className="pdf-barcode-img" alt="Barcode Generator TEC-IT"
                                               src={`https://barcode.tec-it.com/barcode.ashx?data=${equipment.equipmentCode}&code=EANUCC128&multiplebarcodes=false&translate-esc=true&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0`}/>
                                        }
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </>
                            ))
                          }
                        </div>
                      
                      
                      </>
                    ))
                  }
                </>
              ))
            }
          </table>
        </div>
      </Modal>
    </>
  );
};
