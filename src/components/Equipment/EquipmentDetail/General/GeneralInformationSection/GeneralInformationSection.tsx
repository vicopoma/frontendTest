import React, { useCallback, useEffect, useState } from 'react';
import { Col, Form, Popconfirm, Row } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useEquipmentTypeState } from '../../../../../hook/hooks/equipmentType';
import { Input } from '../../../../Shared/CustomInput/CustomInput';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../../../../settings/routes';
import { useBodyFilterParams, useModelSelect } from '../../../../../hook/customHooks/customHooks';
import { useEquipmentContext } from '../../../../../context/equipment';
import { useManufacturerList } from '../../../../../hook/hooks/manufacturer';
import { ACCOUNT_ROLES, COMMON_ERRRORS, DAY_IN_HOURS, EQUIPMENT_TYPES, KNEE_BRACES_SIDE, NEW, NOCSAE, RECLAIM, ROLE_HIERARCHY } from '../../../../../constants/constants';
import { generateEquipmentTypeName, isInAllowedTime, isOemRole, roleCanModify, tagValidator, toPrint, verifyScannerInput } from '../../../../../helpers/Utils';
import { useEquipmentFunctions } from '../../../../../hook/customHooks/equipment';
import { useEquipmentModelFunctions, useEquipmentModelList } from '../../../../../hook/customHooks/equipmentModel';
import { usePartTypeFunctions } from '../../../../../hook/customHooks/partType';
import { useStateContext } from '../../../../../context/customContexts';
import { EQ_INFORMATION_VAR } from '../../../../../store/types';
import { usePartFunctions } from '../../../../../hook/customHooks/part';
import { Select } from '../../../../Shared/Select/Select';
import { useAccountState } from '../../../../../hook/hooks/account';
import { FetchResponse } from '../../../../Shared/Drawer/Drawer';
import { hexToAscii } from '../../../../../helpers/ConvertUtils';
import { useSocketDSProvider } from '../../../../../context/socketDS';
import { ManufacturerModelDrawer } from './ManufacturerModelDrawer';

export const GeneralSection = ({fetchResponse, isNocsaeOpen, style, updateNocsaeStatus, reclaimChanges}: { style?: React.CSSProperties, updateNocsaeStatus: any, fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, isNocsaeOpen: boolean, reclaimChanges: number}) => {
  const { account, teamSelected } = useAccountState();

  const isOEM = account.role.name === ACCOUNT_ROLES.OEM_ADMIN || account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  
  const {equipmentTypeList} = useEquipmentTypeState();
  
  const paths = useLocation().pathname.split('/');
  const tab = paths[1];
  const path = isOemRole(account.role.name) ? paths[paths.length - 3] : paths[paths.length - 2];
  const isHelmetType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET && data.id === path).length > 0;
  const isCleatType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.CLEAT && data.id === path).length > 0;
  const equipmentId = paths[paths.length - 1];
  const {
    values,
    errors,
    setFieldValue,
    handleBlur,
    touched,
    handleChange,
    setStyleNumberPartType
  } = useEquipmentContext();
  const {setState: setShowExpandedImg} = useStateContext();
  const [isHelmetTypeSelected, setIsHelmetTypeSelected] = useState<boolean>(false);
  const [isCleatTypeSelected, setIsCleatTypeSelected] = useState<boolean>(false);
  const [triggerCleat, setTriggerCleat] = useState<number>(0);
  const {PartsStyleNumber: {loadPartsStyleNumber, partsStyleNumber}} = usePartFunctions();
  const {manufacturersByEquipmentType: {getManufacturerByEquipmentType, manufacturerList}} = useManufacturerList();
  const {equipmentCode: {getEquipmentTypePlayerCode}, searchNocsaeTag, searchManualTag} = useEquipmentFunctions();
  const {equipmentModelDetailByIdAndTypeId: {getEquipmentModelDetailByIdAndTypeId}} = useEquipmentModelFunctions();
  const {equipmentModelList, getEquipmentModelByEquipmentTypeIdManufacturerType} = useEquipmentModelList();
  const {partTypeAndPartsByEquipment: {updatePartTypeAndPartByEquipment}} = usePartTypeFunctions();
  const { addBodyFilter, bodyFilter: nocsaeEquipment } = useBodyFilterParams(NOCSAE);
  const { bodyFilter: reclaimBodyFilter } = useBodyFilterParams(RECLAIM);

  const models = useModelSelect(equipmentModelList);
  
  const allowEdit = (!values?.imported && isInAllowedTime(values?.createDate, DAY_IN_HOURS)) || equipmentId === NEW || !values?.id;
  const isZebraAdmin = roleCanModify(account?.role?.name, ACCOUNT_ROLES.ZEBRA_ADMIN);
  const showStyleNumberSelector = equipmentTypeList.filter(data =>
    data.nameEquipmentType === EQUIPMENT_TYPES.CLEAT && (data.id === path || data.id === values?.[EQ_INFORMATION_VAR.EQUIPMENT_TYPE_ID])).length > 0;
  
  const showKneeSideBraceSwitch = equipmentTypeList.filter(data =>
    data.nameEquipmentType === EQUIPMENT_TYPES.KNEE_BRACE && (data.id === path || data.id === values?.[EQ_INFORMATION_VAR.EQUIPMENT_TYPE_ID])).length > 0
  const isOem = account.role.name === ACCOUNT_ROLES.OEM_ADMIN || account.role.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  const [nocsaeTrigger, setNocsaeTrigger] = useState<number>(0);
  const [showManufacturerModelDrawer, setShowManufacturerModelDrawer] = useState<boolean>(false);

  useEffect(() => {
    setIsHelmetTypeSelected(equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.HELMET && values?.equipmentTypeId === data.id).length > 0);
    setIsCleatTypeSelected(equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.CLEAT && values?.equipmentTypeId === data.id).length > 0);
  }, [equipmentTypeList, values?.equipmentTypeId]);
  
  useEffect(() => {
    if(ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] <= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_ADMIN]) {
      setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, account.manufacturerId);
    }
  }, [account.nameManufacturer, setFieldValue]);

  useEffect(() => {
    if (values?.equipmentTypeId) {
      getManufacturerByEquipmentType(values?.equipmentTypeId);
    }
  }, [getManufacturerByEquipmentType, values?.equipmentTypeId]);
  
  useEffect(() => {
    if (values?.equipmentTypeId && values?.manufacturerId) {
      getEquipmentModelByEquipmentTypeIdManufacturerType(values?.equipmentTypeId, values?.manufacturerId);
    }
  }, [getEquipmentModelByEquipmentTypeIdManufacturerType, values?.equipmentTypeId, values?.manufacturerId]);
  
  useEffect(() => {
    if (tab === ROUTES.PARAMS.EQUIPMENT) {
      if (equipmentId === NEW) {
        getEquipmentTypePlayerCode(path, (codeEquipmentPlayer) => {
          setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_CODE, codeEquipmentPlayer?.newCode);
        });
      }
      setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_TYPE_ID, path);
    }
  }, [getEquipmentTypePlayerCode, equipmentId, path, setFieldValue, tab]);
  
  useEffect(() => {
    loadPartsStyleNumber();
  }, [loadPartsStyleNumber]);
  
  useEffect(() => {
    const selectedPart = partsStyleNumber.find(currentPart => currentPart.id === values?.[EQ_INFORMATION_VAR.STYLE_NUMBER_ID]);
    setStyleNumberPartType?.(prevState => ({
      ...prevState,
      id: selectedPart?.partTypeId ?? '',
      partIdSelected: selectedPart?.id ?? ''
    }));
  }, [partsStyleNumber, setStyleNumberPartType, values]);

  useEffect(() => {
    if(nocsaeTrigger > 0 && equipmentId === NEW && (isHelmetType || isHelmetTypeSelected || isCleatType || isCleatTypeSelected)) {
      if(nocsaeEquipment.validNocsae) {
        setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, nocsaeEquipment.manufacturerId);
        const modelName = nocsaeEquipment.nameModel + (nocsaeEquipment?.modelCode ? ` - ${(nocsaeEquipment?.modelCode + '').toLowerCase()}` : '');
        setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, modelName);
        setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, nocsaeEquipment.equipmentModelId);
        setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, nocsaeEquipment.partTypeWithPartDTOList);
        setFieldValue(EQ_INFORMATION_VAR.GUI_NAME_LIST, nocsaeEquipment.guiNameList);
        setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, nocsaeEquipment.guiImage);
      } else {
        if(!isOem) {
          setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, '');
        }
        setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, '');
        setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, '');
        setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
        setFieldValue(EQ_INFORMATION_VAR.GUI_NAME_LIST, []);
        setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, null);
      }
    }
  }, [nocsaeTrigger, equipmentId, isHelmetType, isHelmetTypeSelected, isOem, nocsaeEquipment, setFieldValue, isCleatType, isCleatTypeSelected]);

  useEffect(() => {
    addBodyFilter({
      validNocsae: false,
    });
  }, [isHelmetTypeSelected, isCleatTypeSelected, addBodyFilter]);

  useEffect(() => {
    if (reclaimChanges > 0 && reclaimBodyFilter?.reclaimEquipment && values?.id) {
      setFieldValue(EQ_INFORMATION_VAR.TEAM_ID, teamSelected?.teamId);
      setFieldValue(EQ_INFORMATION_VAR.TEAM_NAME, teamSelected?.fullName);
      setFieldValue(EQ_INFORMATION_VAR.PLAYER_ID, '');
      setFieldValue(EQ_INFORMATION_VAR.DISPLAY_NAME, '');
    }
  }, [reclaimChanges, reclaimBodyFilter, setFieldValue, values?.id]);

  useEffect(() => {
    if (triggerCleat > 0 && (isCleatType || isCleatTypeSelected)) {
      const modelYears = models.years(values?.nameModel + (values?.modelCode ? (' - ' + values.modelCode) : ''))
        .filter(model => ((equipmentId !== NEW && !allowEdit) || model.status === 'ACTIVE'));
      const modelYear = modelYears?.[modelYears.length - 1];
      setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, '');
      setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, modelYear?.id);
      setFieldValue(EQ_INFORMATION_VAR.STYLE_NUMBER_ID, null);
      constructParts(values.equipmentTypeId, modelYear?.id, values?.id);
    }
  }, [equipmentId, isCleatType, setFieldValue, triggerCleat]);
  
  const constructParts = (equipmentTypeId: string, equipmentModelId: string, equipmentId: string) => {
    if (!!equipmentModelId) {
      const body = {
        partTypeWithPartDTOList: values[EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST],
      }
      updatePartTypeAndPartByEquipment(body, equipmentTypeId, equipmentModelId, equipmentId,
        (res) => {
          setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, res.partTypeWithPartDTOList);
          setFieldValue(EQ_INFORMATION_VAR.GUI_NAME_LIST, res.guiNameList);
          setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, res.guiImage);
          setFieldValue(EQ_INFORMATION_VAR.SPECIFIC_PARTS_LIST, res.specificPartsList);
          setShowExpandedImg(false);
        },
        () => {
          setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
        });
      getEquipmentModelDetailByIdAndTypeId(equipmentId, equipmentModelId,
        (res) => {
          setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, res.customField);
        },
        () => {
          setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, []);
        });
    } else {
      setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
      setFieldValue(EQ_INFORMATION_VAR.GUI_NAME_LIST, []);
      setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, null);
      setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, []);
      setFieldValue(EQ_INFORMATION_VAR.SPECIFIC_PARTS_LIST, []);
    }
    
  };

  const handleNocsaeTagConfirm = () => {
    if (isCleatType || isCleatTypeSelected) {
      searchManualTag(values?.adidasBarcode, (res: any) => {
        if(res) {
          addBodyFilter({
            equipmentModelId: res.equipmentModelId,
            guiImage: res.guiImage,
            guiNameList: res.guiNameList,
            manufacturerId: res.manufacturerId,
            nameModel: res.nameModel,
            modelCode: res.modelCode,
            partTypeWithPartDTOList: res.partTypeWithPartDTOList,
            tag: values?.nocsaeTag,
            validNocsae: true,
          });
          setNocsaeTrigger(prevValue => prevValue + 1);
        } else {
          addBodyFilter({
            validNocsae: false,
          });
        }
      });
    } else {
      searchNocsaeTag(values?.nocsaeTag, (res: any) => {
        if(res) {
          addBodyFilter({
            equipmentModelId: res.equipmentModelId,
            guiImage: res.guiImage,
            guiNameList: res.guiNameList,
            manufacturerId: res.manufacturerId,
            nameModel: res.nameModel,
            modelCode: res.modelCode,
            partTypeWithPartDTOList: res.partTypeWithPartDTOList,
            tag: values?.nocsaeTag,
            validNocsae: true,
          });
          setNocsaeTrigger(prevValue => prevValue + 1);
        } else {
          addBodyFilter({
            validNocsae: false,
          });
        }
        
      }, () => {
        addBodyFilter({
          validNocsae: false,
        });
      });
    } 
  }

  useEffect(() => {
    if (values?.adidasBarcode) {
      handleNocsaeTagConfirm();
    }
  }, [values?.adidasBarcode]);

  const modelCode = values?.modelCode ? (' - ' + values.modelCode) : '';

  const suscribeFunction = useCallback((message: string) => {
    const value = verifyScannerInput(message);
    if (tagValidator(value)) {
      setFieldValue(EQ_INFORMATION_VAR.NOCSAE_TAG, hexToAscii(value));
    } else {
      fetchResponse({
        title: COMMON_ERRRORS.WRONG_TAG_FORMAT.TITLE,
        type: 'warning',
        description: COMMON_ERRRORS.WRONG_TAG_FORMAT.DESCRIPTION
      });
    }
  }, [setFieldValue]);

  const { setHandleSuscribe } = useSocketDSProvider();

  useEffect(() => {
    if (isNocsaeOpen && equipmentId === NEW) {
      if (isHelmetType) {
        setHandleSuscribe(() => suscribeFunction);
      }
      if ((tab === ROUTES.PARAMS.PLAYER || tab === ROUTES.PARAMS.ACTIVITY) && isHelmetTypeSelected) {
        setHandleSuscribe(() => suscribeFunction);
      }      
    }
  }, [suscribeFunction, isNocsaeOpen]);
  
  return (
    <div className="info_body_back" style={style}>
      <h5>General</h5>
      <div style={{top: 20, position: "absolute", right: 20}}>
        {(isHelmetType) && equipmentId === NEW ? 
          <Popconfirm
            cancelText="Close"
            okText="Search"
            onConfirm={handleNocsaeTagConfirm}
            title={
              <div className="search-nocsae" onKeyPress={(e) => {
                if(e.key === 'Enter') {
                  handleNocsaeTagConfirm();
                }
              }}>
                <div>Search a tag</div>
                <Input 
                  id="nocsaeInput"
                  isInput 
                  name={EQ_INFORMATION_VAR.NOCSAE_TAG}
                  onChange={handleChange}
                  placeholder="Search..."
                  size="small"
                  style={{ width: '180px'}}
                  value={values?.nocsaeTag?.toUpperCase()}
                />
              </div>
            }
            onVisibleChange={(visible) => {
              updateNocsaeStatus(visible);
            }}
          >
            <div style={{ color: "var(--blue-antd)", fontWeight: 500, textDecoration: "underline", cursor:'pointer' }} onClick={() => setFieldValue(EQ_INFORMATION_VAR.NOCSAE_TAG, '')} >
              Search by Scanning a {isCleatType ? 'Box' : 'Tag'}
              <img alt="" src="/images/tag_nocsae.jpg" style={{ height: "16px", marginLeft: "5px"}} />
            </div>
          </Popconfirm>
          : <Form.Item style={{ width: '100%' }} label={<span style={{ fontWeight: 500 }}>Equipment Code</span>} help={!!errors.equipmentCode && !!touched.equipmentCode && ''}>
          <Input
            id="equipmentCodeInput"
            isInput={false}
            size="small"
            placeholder="Equipment Code"
            value={values?.equipmentCode}
            name={EQ_INFORMATION_VAR.EQUIPMENT_CODE}
            onChange={handleChange}
            style={{ color: 'var(--green)', fontWeight: 600}}
          />
        </Form.Item>}
      </div>
      {(isHelmetType) && equipmentId === NEW && <Form.Item style={{ width: '100%' }} label={<span style={{ fontWeight: 500 }}>Equipment Code</span>} help={!!errors.equipmentCode && !!touched.equipmentCode && ''}>
        <Input
          id="equipmentCodeInput"
          isInput={false}
          size="small"
          placeholder="Equipment Code"
          value={values?.equipmentCode}
          name={EQ_INFORMATION_VAR.EQUIPMENT_CODE}
          onChange={handleChange}
          style={{ color: 'var(--green)', fontWeight: 600}}
        />
      </Form.Item>}
      
      <Form layout="vertical" style={{marginTop: 15}}>
        <Row gutter={[16, 16]}>
          {
            (tab === ROUTES.PARAMS.PLAYER || tab === ROUTES.PARAMS.ACTIVITY) &&
            (
              <Col span={12}>
                <Form.Item
                  label={<span className="required-item">Equipment Type</span>}
                  help={!!errors.equipmentTypeId && !!touched.equipmentTypeId && ''}>
                  <Select
                    popup
                    id="eIEquipmentType"
                    disabled={!!values?.id}
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    size="small"
                    onChange={async (value: string) => {
                      if (value) {
                        const isKneeBraceType = equipmentTypeList.filter(eqType => eqType.id === value && eqType.nameEquipmentType === EQUIPMENT_TYPES.KNEE_BRACE);
                        if(isKneeBraceType) {
                          setFieldValue(EQ_INFORMATION_VAR.KNEE_BRACE_SIDE, KNEE_BRACES_SIDE.LEFT);
                        } else {
                          setFieldValue(EQ_INFORMATION_VAR.KNEE_BRACE_SIDE, undefined);
                        }
                        getEquipmentTypePlayerCode(
                          value,
                          (res) => {
                            setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_CODE, res.newCode);
                          });
                      }
                      setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_TYPE_ID, value);
                      setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, '');
                      setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, '');
                      setFieldValue(EQ_INFORMATION_VAR.NAME_MANUFACTURER, '');
                      setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, '');
                      setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, []);
                      setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
                      setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, null);
                      setShowExpandedImg(false);
                    }}
                    value={(values?.equipmentTypeId && values?.equipmentTypeId !== 'new') ? values?.equipmentTypeId : undefined}
                    options={equipmentTypeList.map(equipmentType => ({value: equipmentType.id, display: generateEquipmentTypeName(equipmentType.nameEquipmentType)}))}
                  />
                  {touched.equipmentTypeId && errors.equipmentTypeId &&
                  <span className="form-feedback"> {errors.equipmentTypeId}</span>}
                </Form.Item>
              </Col>
            )
          }
          {
            (tab === ROUTES.PARAMS.PLAYER || tab === ROUTES.PARAMS.ACTIVITY) && <>{
              equipmentId === NEW && (isHelmetTypeSelected) ? 
              <Col span={12}>
                <div style={{ float: 'right' }}>
                <Form.Item
                  label={<span></span>}
                  help={!!errors.equipmentTypeId && !!touched.equipmentTypeId && ''}
                >
                  <Popconfirm
                    cancelText="Close"
                    okText="Search"
                    onConfirm={handleNocsaeTagConfirm}
                    title={
                      <div className="search-nocsae" onKeyPress={(e) => {
                        if(e.key === 'Enter') {
                          handleNocsaeTagConfirm();
                        }
                      }}>
                        <div>Search a tag</div>
                        <Input 
                          id="nocsaeInput"
                          isInput 
                          name={EQ_INFORMATION_VAR.NOCSAE_TAG}
                          onChange={handleChange}
                          placeholder="Search..."
                          size="small"
                          style={{ width: '180px'}}
                          value={values?.nocsaeTag?.toUpperCase()}
                        />
                      </div>
                    }
                    onVisibleChange={(visible) => {
                      updateNocsaeStatus(visible);
                    }}
                  >
                    <div style={{ color: 'var(--blue-antd)', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setFieldValue(EQ_INFORMATION_VAR.NOCSAE_TAG, '')} >
                      Search by Scanning a {isCleatTypeSelected ? 'Box': 'Tag'}
                      <img alt="" src="/images/tag_nocsae.jpg" style={{ height: "16px", marginLeft: "5px"}} />
                    </div>
                  </Popconfirm>
                </Form.Item>
                </div>
              </Col> : <Col span={12}></Col>}</>
          }
          {
            showStyleNumberSelector && (
              <Col span={8}>
                <Form.Item label={<span> Style # </span>}>
                  <Select
                    popup
                    id="eIStyleNumber"
                    disabled={!allowEdit}
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    size="small"
                    check={true}
                    value={!!values?.[EQ_INFORMATION_VAR.STYLE_NUMBER_ID] ? values?.[EQ_INFORMATION_VAR.STYLE_NUMBER_ID] : undefined}
                    onChange={(value) => {
                      const selectedPart = partsStyleNumber.find(currentPart => currentPart.id === value);
                      setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, selectedPart?.manufacturerId);
                      setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, selectedPart?.nameModel);
                      setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, selectedPart?.equipmentModelId);
                      setFieldValue(EQ_INFORMATION_VAR.STYLE_NUMBER_ID, selectedPart?.id);
                      constructParts(values.equipmentTypeId, selectedPart?.equipmentModelId ?? '', values?.id);
                    }}
                    options={partsStyleNumber
                      .filter(style => ((equipmentId !== NEW && !allowEdit) || style.statusDescription === 'ACTIVE'))
                      .map(part => ({value: part.id, display: part.namePart}))}
                  />
                </Form.Item>
              </Col>
            )
          }
          <Col span={showStyleNumberSelector ? 8 : 12}>
            <Form.Item
              label={<span className="required-item">Manufacturer</span>}
              help={!!errors.manufacturerId && !!touched.manufacturerId && ''}>
              {isOEM ? 
              <Input 
                isInput={false} 
                value={account.nameManufacturer} 
                size={'small'}
              /> :
              <Select
                popup
                id="eIManufacturer"
                disabled={!allowEdit || ROLE_HIERARCHY[account.role.name as ACCOUNT_ROLES] <= ROLE_HIERARCHY[ACCOUNT_ROLES.OEM_ADMIN]}
                showSearch
                style={{marginRight: '8px'}}
                placeholder="Select"
                size="small"
                value={values?.manufacturerId ? values.manufacturerId : undefined}
                onChange={(value: string) => {
                  setFieldValue(EQ_INFORMATION_VAR.MANUFACTURER_ID, value + '');
                  setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, '');
                  setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, '');
                  setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, []);
                  setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
                  setFieldValue(EQ_INFORMATION_VAR.MODEL_CODE, '');
                  setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, null);
                  setFieldValue(EQ_INFORMATION_VAR.STYLE_NUMBER_ID, null);
                  setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, '');
                  setShowExpandedImg(false);
                }}
                onBlur={handleBlur}
                options={manufacturerList.map(manufacturer => ({value: manufacturer.id, display: manufacturer.nameManufacturer}))}
              />}
              {touched.manufacturerId && errors.manufacturerId &&
              <span className="form-feedback"> {errors.manufacturerId}</span>}
            </Form.Item>
            {errors.nameManufacturer && <span className="form-feedback"> {errors.nameManufacturer}</span>}
          </Col>
          <Col span={showStyleNumberSelector ? 8 : 12}>
            <Form.Item label={<span className="required-item">Equipment Model</span>}
                       help={!!errors.nameModel && !!touched.nameModel && ''}>
              <Select
                popup
                id="eIEquipmentModel"
                disabled={!allowEdit && !isZebraAdmin}
                showSearch
                style={{marginRight: '8px'}}
                className="capital-letter"
                placeholder="Select"
                size="small"
                onBlur={handleBlur}
                onChange={(value: string) => {
                  setFieldValue(EQ_INFORMATION_VAR.NAME_MODEL, value);
                  setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, '');
                  setFieldValue(EQ_INFORMATION_VAR.MODEL_CODE, '');
                  setFieldValue(EQ_INFORMATION_VAR.CUSTOM_FIELD, []);
                  setFieldValue(EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST, []);
                  setFieldValue(EQ_INFORMATION_VAR.GUI_IMAGE, null);
                  setFieldValue(EQ_INFORMATION_VAR.STYLE_NUMBER_ID, null);
                  setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, '');
                  setTriggerCleat(prevState => prevState + 1);
                  setShowExpandedImg(false);
                }}
                value={values?.nameModel ? (values.nameModel + modelCode) : undefined}
                options={
                  models.models.filter(model => {
                    const status = models.values[`${model}`]?.models.filter(item => item.statusDescription === 'ACTIVE');
                    return status && !!status.length;
                  }).map(model => ({value: model, display: showKneeSideBraceSwitch ? toPrint(model) : model}))}
              />
              {touched.nameModel && errors.nameModel && <span className="form-feedback"> {errors.nameModel}</span>}
            </Form.Item>
          </Col>
          {(!isCleatType && !isCleatTypeSelected) && <Col span={showKneeSideBraceSwitch ? 12 : 6}>
            <Form.Item
              label={<span className="required-item">Model Year</span>}
              help={!!errors.equipmentModelId && !!touched.equipmentModelId && ''}>
              <Select
                popup
                id="eIEquipmentModelYear"
                disabled={!allowEdit && !isZebraAdmin}
                showSearch
                style={{marginRight: '8px'}}
                placeholder="Select"
                size="small"
                onBlur={handleBlur}
                onChange={(value: string) => {
                  setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, '');
                  setFieldValue(EQ_INFORMATION_VAR.EQUIPMENT_MODEL_ID, value);
                  setFieldValue(EQ_INFORMATION_VAR.STYLE_NUMBER_ID, null);
                  constructParts(values.equipmentTypeId, value, values?.id);
                }}
                value={values?.equipmentModelId ? values?.equipmentModelId : undefined}
                options={
                  models.years(values?.nameModel + (values?.modelCode ? (' - ' + values.modelCode) : ''))
                  .filter(model => ((equipmentId !== NEW && !allowEdit) || model.status === 'ACTIVE'))
                  .map(model => (
                    {
                      value: model.id,
                      display: model.year,
                    }))
                }
              />
              {touched.equipmentModelId && errors.equipmentModelId &&
              <span className="form-feedback"> {errors.equipmentModelId}</span>}
            </Form.Item>
          </Col>}
          <Col span={(showKneeSideBraceSwitch || isCleatType || isCleatTypeSelected) ? 24 : 18}>
            <Form.Item label={<span className="">Note</span>} help={!!errors.note && !!touched.note && ''}>
              <Input
                size="small"
                id="eInputEquipmentTypeNote"
                isInput
                placeholder="Note"
                value={values?.note}
                name={EQ_INFORMATION_VAR.NOTE}
                onChange={handleChange} />
              {errors.note && <span className="form-feedback"> {errors.note}</span>}
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          {isCleatType && equipmentId === NEW && (
            <Col 
              className="drawer-open-button" 
              onClick={() => setShowManufacturerModelDrawer(true)} 
            >
              <ExclamationCircleFilled 
                style={{ 
                  marginRight: '9px',
                  fontSize: '20px'
                }}
              />
              Add Manufacturer and Equipment Model
            </Col>
          )}
        </Row>
      </Form>
      {showManufacturerModelDrawer && <ManufacturerModelDrawer 
        showDrawer={showManufacturerModelDrawer}
        closeDrawer={() => setShowManufacturerModelDrawer(false)}
      />}
    </div>
  );
};
