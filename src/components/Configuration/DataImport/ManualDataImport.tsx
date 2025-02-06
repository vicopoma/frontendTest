import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Progress, Row, Select, Upload } from 'antd';
import { CloseOutlined, DownloadOutlined, FileAddOutlined, FileDoneOutlined } from '@ant-design/icons';

import { LoaderButton } from '../../Shared/LoaderButton/LoaderButton';
import { useImportDataDispatch, useImportDataState } from '../../../hook/hooks/importData';
import {
  EQUIPMENT_TYPES,
  IMPORT_TYPE_FILES,
  IMPORT_TYPES,
  MASTER_DATA,
  PROGRESS_STATUS,
  ACCOUNT_ROLES,
  FILE_EXTENSIONS,
} from '../../../constants/constants';
import { UploadFile } from 'antd/es/upload/interface';
import { ErrorMessage } from '../../Shared/Messages/Messages';
import { LogsViewer } from '../../Shared/LogsViewer/LogsViewer';
import { downloadCsv, isJson, isOemRole } from '../../../helpers/Utils';
import moment from 'moment';
import { useAccountState } from '../../../hook/hooks/account';
import { LOG_HISTORY_DEFAULT } from '../../../store/types/importData';
import { API } from '../../../settings/server.config';
import Image from '../../Shared/Image/Image';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useNotificationContext } from '../../../context/notifications';
import { useLoaderDispatch } from '../../../hook/hooks/loader';

export const ManualDataImport = () => {
  
  const {account} = useAccountState();
  const { updateProgressBar } = useNotificationContext();
  const {importDataCsv, replaceLogCurrentDetails} = useImportDataDispatch();
  const {currentImportDetails} = useImportDataState();
  const [allowedFiles, setAllowedFiles] = useState<Set<Array<string>>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: any }>({});
  
  const [importState, setImportState] = useState<number>(0);
  const [teamId, setTeamId] = useState<string>('');
  const [manufacturerId, setManufacturerId] = useState<string>(account.manufacturerId ?? '');
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const { showLoader } = useLoaderDispatch();
  
  const [forcedImportState, setForcedImportState] = useState({
    show: false,
    status: false,
  });
  const [progressStatus, setProgressStatus] = useState<PROGRESS_STATUS>(PROGRESS_STATUS.NORMAL);
  
  const isZebraAdmin = account.role.name === ACCOUNT_ROLES.ZEBRA_ADMIN;
  const isOEM = isOemRole(account.role.name);
  const { equipmentTypeList } = useEquipmentTypeState();

  const { equipmentTypeDTOList } = account;
  const hasShoulderPad = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '2');
  const hasHelmet = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '1');

  const [importType, setImportType] = useState<string>(isOEM ? (hasShoulderPad ? MASTER_DATA.OEM_SHOULDER : MASTER_DATA.OEM_HELMET) : MASTER_DATA.CLEAT);
  const [equipmentTypeId, setEquipmentTypeId] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    if (importType) {
      if(importType === MASTER_DATA.OEM_SHOULDER) {
        setEquipmentTypeId(equipmentTypeList.filter(equipment => equipment.nameEquipmentType === 'Shoulder Pads')?.[0].id)
        setManufacturerId(account.manufacturerId ?? '');
      } else if(importType === MASTER_DATA.OEM_HELMET) {
        setEquipmentTypeId(equipmentTypeList.filter(equipment => equipment.nameEquipmentType === 'Helmet')?.[0].id)
        setManufacturerId(account.manufacturerId ?? '');
      } else {
        setEquipmentTypeId('');
        setManufacturerId('');
      }
      let allowed = new Set<Array<string>>();
      IMPORT_TYPE_FILES[importType as MASTER_DATA].forEach(fileTypes => {
        allowed.add(fileTypes);
      });
      setAllowedFiles(allowed);
      setUploadedFiles({});
      setTeamId('');
      setShowProgress(!!account.importId);
    }
  }, [importType]);
  
  useEffect(() => {
    if (currentImportDetails.percentage === 100) {
      setProgressStatus(PROGRESS_STATUS.SUCCESS);
      setImportState(2);
    } else if (currentImportDetails.percentage > 0 && currentImportDetails.percentage < 100) {
      setImportState(1);
    }
  }, [currentImportDetails.percentage]);
  
  const handleSubmit = () => {
    showLoader(true);
    setImportState(1);
    const formData = new FormData();
    Object.keys(uploadedFiles).forEach(key => {
      const currentFile = uploadedFiles[key];
      if (key === FILE_EXTENSIONS.CSV) {
        formData.append('file', currentFile);
      }
      if (key === FILE_EXTENSIONS.ZIP) {
        formData.append('zip', currentFile);
      }
      if (key === FILE_EXTENSIONS.XLSX) {
        formData.append('file', currentFile);
      }
    });
    importDataCsv(formData, setUploadedFiles, setProgressStatus, importType, forcedImportState?.status, teamId, manufacturerId).then(() => {
      updateProgressBar();
      setShowProgress(true);
      showLoader(false);
    });
  };
  
  const onRemove = (file: UploadFile<any>) => {
    let copy: { [key: string]: any } = {};
    Object.keys(uploadedFiles).forEach(key => {
      const typeFile = file.name.split('.');
      if (typeFile[typeFile.length - 1] === key) {
        copy[key] = uploadedFiles[key];
      }
    });
    setUploadedFiles(copy);
  };

  
  let uploadButtons: Array<JSX.Element> = [];
  
  allowedFiles.forEach((value) => {
    const file = Object.keys(uploadedFiles).filter(ext => value.indexOf(ext) !== -1);
    uploadButtons.push(
      !file[0] ? 
      <Upload
        className="upload-button"
        key={value.join('')}
        accept={value.join(',')}
        onRemove={onRemove}
        beforeUpload={file => {
          setImportState(0);
          replaceLogCurrentDetails(LOG_HISTORY_DEFAULT);
          setProgressStatus(PROGRESS_STATUS.NORMAL);
          if (file.size / 1024 / 1024 <= 10) {
            const name = file.name.split('.');
            const fileExt = '.' + name[name.length - 1];
            if(Array.from(allowedFiles).some(fileGroup => fileGroup.includes(fileExt))) {
              setUploadedFiles(prevState => {
                return {
                  ...prevState,
                  [fileExt]: file
                };
              });
            } else {
              ErrorMessage({description: 'Invalid input type'});
            }
          } else {
            ErrorMessage({description: 'File size is too large (more than 2MB)'});
          }
          return false;
        }}
        showUploadList={false}
      >
        <Button
          size="small"
          disabled={!!account.importId}
          style={{
            backgroundColor: '#FFF',
            borderStyle: 'dashed',
            color: 'var(--blue-antd)',
            borderColor: 'var(--blue-antd)',
            borderRadius: '4px',
            borderWidth: '1px',
            marginRight: '7px',
            minWidth: '350px',
            height: '44px'
          }}
        >
          <Row>
            <Col span={24} style={{ display: 'inline-flex' }}>
              <FileAddOutlined style={{ margin: '5px 10px 5px 5px' }} />
              Select {value.join(', ')} File 
            </Col>
          </Row>
        </Button>
      </Upload>
    : <Button
      size="small"
      disabled={!!account.importId}
      style={{
        backgroundColor: '#FFF',
        borderStyle: 'solid',
        color: 'var(--blue-antd)',
        borderColor: 'var(--blue-antd)',
        borderRadius: '4px',
        borderWidth: '1px',
        marginRight: '5px',
        minWidth: '350px',
        height: '44px'
      }}>
        <Row>
          <Col span={22} style={{ display: 'inline-flex' }}>
            <FileDoneOutlined style={{ margin: '5px 10px 5px 5px' }} />
            {uploadedFiles[file[0]]?.name} 
          </Col>
          <Col span={2}>
            <CloseOutlined 
              onClick={() => {
                onRemove(uploadedFiles[file[0]])
              }}
              style={{ color: 'red' }}
            />
          </Col>
        </Row>
      </Button>) ;
  });

  return (
    <div className="drawer_config">
      <div className="info_body_back">
        <Row gutter={[16, 16]}>
          <Col>
            <Form.Item className='select-label-up'>
              <label className='label-select'>Import Type</label>
              <Select
                className="filters-selector blue-scroll"
                disabled={!!account.importId}
                size="small"
                style={{ width: '150px'}}
                onChange={(value: string) => {
                  if (value === MASTER_DATA.CLEAT || value === MASTER_DATA.HELMET || value === MASTER_DATA.SHOULDER) {
                    setForcedImportState({
                      show: true,
                      status: false
                    });
                  } else {
                    setForcedImportState({
                      show: false,
                      status: false
                    });
                  }
                  setImportType(value + '');
                  setImportState(0);
                  setTeamName('');
                }}
                value={importType}
              >
                {!isOEM && <Select.OptGroup label={IMPORT_TYPES.EQUIPMENT_TYPE}>
                  <Select.Option value={MASTER_DATA.CLEAT}> {EQUIPMENT_TYPES.CLEAT}</Select.Option>
                  <Select.Option value={MASTER_DATA.HELMET}> {EQUIPMENT_TYPES.HELMET}</Select.Option>
                  <Select.Option value={MASTER_DATA.SHOULDER}> {EQUIPMENT_TYPES.SHOULDER_PAD} </Select.Option>
                </Select.OptGroup>}
                {!isOEM && <Select.OptGroup label={IMPORT_TYPES.SITE_CONFIG}>
                  <Select.Option value={MASTER_DATA.SITE}> {MASTER_DATA.SITE}</Select.Option>
                  <Select.Option value={MASTER_DATA.ZONES}> {MASTER_DATA.ZONES}</Select.Option>
                </Select.OptGroup>}
                {isOEM && <Select.OptGroup label={IMPORT_TYPES.OEM_EQUIPMENT_TYPE}>
                  {hasShoulderPad && <Select.Option value={MASTER_DATA.OEM_SHOULDER}> {EQUIPMENT_TYPES.SHOULDER_PAD} </Select.Option>}
                  {hasHelmet && <Select.Option value={MASTER_DATA.OEM_HELMET}> {EQUIPMENT_TYPES.HELMET} </Select.Option>}
                </Select.OptGroup>}
              </Select>
            </Form.Item>
          </Col>
          {(importType === MASTER_DATA.OEM_SHOULDER || importType === MASTER_DATA.OEM_HELMET) && <Col>
            <Form.Item className='select-label-up'>
              <label className='label-select'>Team</label>
              <Select
                className="filters-selector blue-scroll"
                style={{ minWidth: '110px'}}
                disabled={!!account.importId}
                size="small"
                onChange={(teamId, team: any) => {
                  setTeamName(team?.key)
                  setTeamId(teamId + '');
                }}
                value={teamId}
                virtual={false}
              >
                {account.teamList.map(team => {
                  const pathImage = `/images/teams/logos/${team.fullName}.svg`;
                  return <Select.Option value={team.teamId} key={team.fullName}>
                      <Image key={team.fullName} src={pathImage} srcDefault={'/images/team-icon.svg'} alt="logo" style={{ width: "25px", marginRight: "10px" }} />
                      <span style={{ marginTop: '50px' }}>{team.fullName}</span>
                    </Select.Option>
                  }
                )}
              </Select>
            </Form.Item>
          </Col>}
          {isZebraAdmin && (importType === MASTER_DATA.OEM_SHOULDER || importType === MASTER_DATA.OEM_HELMET) && <Col>
            <Form.Item className='select-label-up'>
              <label className='label-select'>Manufacturer</label>
              <Select
                className="filters-selector blue-scroll"
                disabled={!!account.importId}
                size='small'
                style={{ width: "175px" }}
                value={manufacturerId}
                onChange={(manufacturerId) => {
                  setManufacturerId(manufacturerId + '')
                }}
              >
                {
                  account.manufacturerList.map(manufacturer => (
                    <Select.Option value={manufacturer.id}>
                      {manufacturer.nameManufacturer}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>}
          {(importType === MASTER_DATA.OEM_SHOULDER || importType === MASTER_DATA.OEM_HELMET) && <Col>
            <Form.Item className='select-label-up'>
              <Button 
                  style={{ 
                    backgroundColor: !equipmentTypeId || !teamName ? '#808080' : '#046BDA',
                    borderRadius: '4px', 
                    color: '#FFF', 
                    height: '44px',
                  }}
                  disabled={!equipmentTypeId || !teamName}
                  onClick={() => {
                    downloadCsv(
                      '', 
                      API.DOWNLOAD.GENERATE_TEMPLATE(equipmentTypeId, teamName), 
                      'GET');
                  }}
                >
                  <DownloadOutlined />
                  Download template
              </Button>
            </Form.Item>
          </Col>}
        </Row>
        <Row>
          <Col>
            {/*((isOEM && teamId !== '') || !isOEM) && */uploadButtons.map(button => (
              <Form.Item className='select-label-up'>
                {button}
              </Form.Item> 
            ))}
          </Col>
          <Col span={3.5}>
            <Form.Item className='select-label-up'>
            {
              !account.importId && forcedImportState?.show && <Checkbox
                  disabled={!!account.importId}
                  checked={forcedImportState.status}
                  onChange={(value) => {
                    setForcedImportState({
                      ...forcedImportState,
                      status: value.target.checked
                    });
                  }}
              >
                  Forced Update Records
              </Checkbox>
            }
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item className='select-label-up'>
              <LoaderButton
                disable={(allowedFiles.size !== Object.keys(uploadedFiles).length) || !importType || !!account.importId || ((teamId === '' || manufacturerId === '') && (importType === MASTER_DATA.OEM_SHOULDER || importType === MASTER_DATA.OEM_HELMET))}
                size="small"
                style={{
                  backgroundColor: (allowedFiles.size !== Object.keys(uploadedFiles).length) || !importType || !!account.importId || ((teamId === '' || manufacturerId === '') && (importType === MASTER_DATA.OEM_SHOULDER || importType === MASTER_DATA.OEM_HELMET)) ? '#808080': '#1DAB35',
                  borderRadius: '4px',
                  color: '#FFF',
                  height: '44px',
                  width: '100px'
                }}
                onClick={handleSubmit}
              >
                Start Import
              </LoaderButton>
            </Form.Item>
          </Col>
          {/*Object.keys(uploadedFiles).length > 0 && <Col span={7}>
            <Form.Item className='select-label-up'>
            {
              Object.keys(uploadedFiles).map((data, index) => {
                return (
                  <div key={index}>
                    <label
                      key={index}
                      style={{
                        marginRight: '5px'
                      }}
                    > {(uploadedFiles[data] as File).name}
                    </label>
                    <DeleteOutlined
                      onClick={() => {
                        onRemove(uploadedFiles[data]);
                      }}
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                );
              })
            }
            </Form.Item>
          </Col>*/}
          <Col span={5}>
            {
              showProgress && currentImportDetails.percentage !== -1 &&
              (
                <Row gutter={[16, 16]}>
                  <Col>
                    <Form.Item className='select-label-up'>
                    <div style={{
                      width: 150
                    }}>
                      <Progress
                        percent={currentImportDetails.percentage}
                        status={progressStatus}
                        format={() => `${Math.round(currentImportDetails.percentage)}%`}
                        size="small"
                      />
                    </div>
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
            
          </Col>
        </Row>
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
        progressStatus={importState}/>
      {
        importState === 2 && (
          <div className="drawer_body_config">
            <Row gutter={[16, 16]} style={{marginTop: '-25px'}}>
              <Col span={20}>
                <span style={{
                  color: '#1DAB35',
                  marginRight: '10px',
                }}>
                  COMPLETE
                </span>
                <i> {`${currentImportDetails.size / 1024} kb  Total time: ${currentImportDetails.time / 1000} sec`} </i>
              </Col>
              <Col span={24}>
                <LoaderButton
                  onClick={() => {
                    downloadCsv(`logs-${currentImportDetails.fileName}`, API.IMPORT.GET_CVS_SUMMARY(currentImportDetails.id), 'GET');
                  }}
                >
                  Download logs
                </LoaderButton>
              </Col>
            </Row>
          </div>
        )
      }
    </div>
  );
};
