import React, { useCallback, useEffect, useState } from 'react';
import { Form, Radio, Select, Switch } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import moment from 'moment-timezone';
import CustomInput from '../../../Shared/CustomInput/Input';

import { InfiniteTable } from '../../../Shared/Table/InfiniteTable';
import {
  ACCOUNT_ROLES,
  ACTIVITY_TYPE,
  DATE_FORMATS,
  EQUIPMENT_TYPES,
  pageSize,
  SCAN_DETAIL_FILTER,
  TABLE_EDIT_NAME
} from '../../../../constants/constants';
import { FilterState, ManufacturerWithModel, ScanState } from '../../../../store/types';
import { useEquipmentTypeState } from '../../../../hook/hooks/equipmentType';
import { useScanReportFilterBuilder } from '../../../../hook/hooks/scan';
import Image from '../../../Shared/Image/Image';
import { SelectorTree } from '../../../Shared/TreeFormComponents/SelectorTree/SelectorTree';
import { useEquipmentState } from '../../../../hook/hooks/equipment';
import { TreeNode } from '../../../Shared/TreeFormComponents/TreeFormTypes';
import { equipmentGeneralInformation, playerInfoColumn, } from './columnTypes';
import { FilterQuery } from '../../../../Types/Types';
import { API } from '../../../../settings/server.config';
import { debounce, downloadCsv, generateEquipmentTypeName, isBoolean, toPrint } from '../../../../helpers/Utils';
import { useNotificationContext } from '../../../../context/notifications';
import { useBodyFilterParams } from '../../../../hook/customHooks/customHooks';
import { SelectOptions } from '../../../Shared/Select/Select';
import { useScanFunctions } from '../../../../hook/customHooks/scan';
import { useAccountState } from '../../../../hook/hooks/account';

const SCAN_TREE_SELECTOR = {
  MANUFACTURER: 'scan-manufacturer-tree'
};

export const ScanReportsByList = ({ setScanReportType, scanReportType, reload }: {
  setScanReportType: React.Dispatch<React.SetStateAction<number>>,
  scanReportType: number,
  reload: number
}) => {
  const { account } = useAccountState();
  const path = useLocation().pathname.split('/');
  const activityType = path[path.length - 2];
  const sessionId = path[path.length - 1];
  const { equipmentTypeList } = useEquipmentTypeState();
  const { manufacturerWithModels } = useEquipmentState();
  const { scanSearchKeyword: {searchScanByKeyword, scanByKeyword }} = useScanFunctions();
  
  const [subMenuTree, setSubMenuTree] = useState<Array<TreeNode>>([]);
  const [, setTrigger] = useState<number>(0);
  const {
    eqType,
    enableFetch,
    setEqTypeId,
    setEnableFetch,
    initBodyFilter,
    restart
  } = useScanReportFilterBuilder(sessionId);

  const [component, setComponent] = useState('');
  const { bodyFilter: scanDetailFilter, addBodyFilter } = useBodyFilterParams(component);

  const { finishedStatus } = useNotificationContext();
  const [, setTag] = useState<string>(scanDetailFilter?.keyword ? scanDetailFilter?.keyword : '');
  const [tags, setTags] = useState<Array<SelectOptions> > ( scanDetailFilter?.keys ? scanDetailFilter.keys.map((data: string) => ({value: data, display: data})) : []);
  const isCleatSelected = equipmentTypeList?.filter(eqpType => eqpType.id === scanDetailFilter?.equipmentTypeId?.[0] && eqpType.nameEquipmentType === EQUIPMENT_TYPES.CLEAT)?.length > 0;
  const isKneeBraceSelected = equipmentTypeList?.filter(eqpType => eqpType.id === scanDetailFilter?.equipmentTypeId?.[0] && eqpType.nameEquipmentType === EQUIPMENT_TYPES.KNEE_BRACE)?.length > 0;

  const initExtraScanBodyFilter = {
    includeExtraEquipments: true,
    includeExtraCleats: true,
    includeExtraKneeBraces: true,
  }
  const { bodyFilter: extraScanDetailFilter, addBodyFilter: addExtraScanBodyFilter } = useBodyFilterParams(SCAN_DETAIL_FILTER + sessionId, initExtraScanBodyFilter);

  useEffect(() => {
    if (isBoolean(extraScanDetailFilter?.includeExtraEquipments) && !!scanDetailFilter.sessionId && (isCleatSelected || isKneeBraceSelected)) {
      if (isCleatSelected) {
        addBodyFilter({
          includeExtraCleats: extraScanDetailFilter?.includeExtraCleats,
          includeExtraEquipments: extraScanDetailFilter?.includeExtraCleats,
        });
      } else {
        addBodyFilter({
          includeExtraKneeBraces: extraScanDetailFilter?.includeExtraKneeBraces,
          includeExtraEquipments: extraScanDetailFilter?.includeExtraKneeBraces,
        });
      }
    }
  }, [extraScanDetailFilter, isCleatSelected, isKneeBraceSelected, scanDetailFilter.sessionId]);

  useEffect(() => {
    if(scanDetailFilter?.keys) {
      setTags(scanDetailFilter?.keys.map((data: string) => ({
        value: data,
        display: data
      })))
    }
  }, [scanDetailFilter?.keys])

  useEffect(() => {
    setComponent(SCAN_DETAIL_FILTER + eqType + sessionId);
  }, [eqType, sessionId]);

  useEffect(() => {
    if(scanDetailFilter.keys) {
      setTags(scanDetailFilter.keys.map((data: string) => ({value: data, display: data})));
    }
  }, [scanDetailFilter.keys]);
  
  useEffect(() => {
    setTag(scanDetailFilter?.keyword);
  }, [scanDetailFilter?.keyword])

  useEffect(() => {
    let condition = false;
    finishedStatus.forEach(item => {
      if (item.code === sessionId) {
        condition = true;
      }
    })
    if (condition) {
      setTrigger(trigger => {
        addBodyFilter({
          trigger: trigger
        });
        return trigger + 1;
      });
    }
  }, [addBodyFilter, component, finishedStatus, sessionId]);

  useEffect(() => {
    return () => {
      setEnableFetch(false);
    };
  }, [component, setEnableFetch, addBodyFilter]);

  useEffect(() => {
    restart();
  }, [reload, restart]);


  const buildSubTreeNodeFromManufacturer = useCallback((manufacturerWithModels: Array<ManufacturerWithModel>): TreeNode => {
    return {
      name: 'Manufacturer',
      id: '5',
      value: '0',
      display: 'Manufacturer',
      icon: <img className="img-h anticon" src="/images/manufacturer-icon.svg" width="18" alt="" />,
      shown: true,
      className: 'filter-menu-select-first',
      children: manufacturerWithModels.map((manufacturer, index) => {
        return {
          name: manufacturer.nameManufacturer,
          display: manufacturer.nameManufacturer,
          shown: true,
          id: manufacturer.nameManufacturer + '',
          checkbox: {
            checked: true,
          },
          className: 'filter-menu-select-second',
          children: manufacturer.models.map((models) => {
            return {
              name: models.nameModel,
              display: models.nameModel,
              value: `${models.id}|${manufacturer.id}`,
              id: models.nameModel + '',
              shown: true,
              checkbox: {
                checked: true,
              },
            };
          }),
          value: manufacturer.id,
        };
      })
    };
  }, []);

  useEffect(() => {
    setSubMenuTree([buildSubTreeNodeFromManufacturer(manufacturerWithModels)]);
  }, [buildSubTreeNodeFromManufacturer, manufacturerWithModels]);

  const searchKeysFunction = (value: string) => {
    const body = {
      ...scanDetailFilter,
      keyword: value
    }
    searchScanByKeyword(body);
  }
  const debouncedSearchKeys = useCallback(debounce(searchKeysFunction, 600), []);

  const scanFilters: Array<FilterQuery> = [
    {
      query: 'tab',
      width: '2',
      display: (
        <Form.Item className='select-label-up'>
          <Radio.Group size="large" defaultValue={scanReportType + ''}>
            <Radio.Button
              id="aViewSchedule"
              value="1"
              onChange={() => {
                setScanReportType(1);
              }}>
              <img src="/images/player-icon.svg" width="14px" alt="" />
            </Radio.Button>
            <Radio.Button
              id="aViewList"
              value="0"
              onChange={() => setScanReportType(0)}>
              <UnorderedListOutlined />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      )
    },
    {
      query: 'customSearch',
      display: (
        <CustomInput.SearchAndTag
          id='cPInputSearch'
          placeholder="Search..."
          size="small"
          style={{minWidth: '400px'}}
          nameView={`activity_${activityType}_scan_${sessionId}_list`}
          bodyFilterName={component}
          tagValues={tags}
          onChange={(value: SelectOptions[]) => {
            setTags(value);
            const data: Array<string> = [];
            for (const cur of value) {
              data.push(cur.value);
            }
            addBodyFilter({
              keys: data
            });
          }}
          onOperatorChange={(operator: string) => {
            addBodyFilter({
              operator: operator
            })
          }}
          onSearch={debouncedSearchKeys}
          operator={scanDetailFilter?.operator ? scanDetailFilter?.operator : 'AND'}
          options={scanByKeyword.map(data => ({
            value: data,
            display: data
          }))}
        />
      )
    },
    {
      query: 'Equipment Type',
      width: '2',
      display: (
        <Form.Item className='select-label-up'>
          <label className='label-select'>Equipment Type</label>
          <Select
            className="filters-selector"
            style={{ width: '100%', minWidth: '150px' }}
            size={'small'}
            optionFilterProp="children"
            placeholder="Equipment Type"
            value={scanDetailFilter?.equipmentTypeId ? scanDetailFilter?.equipmentTypeId : undefined}
            onChange={(value) => {
              setEqTypeId(value);
            }}
          >
            {
              equipmentTypeList.map((equipmentType, index) => (
                <Select.Option key={index} value={equipmentType.id}>
                    {
                      generateEquipmentTypeName(equipmentType.nameEquipmentType)
                    }
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
      )
    },
    {
      query: 'Manufacturer',
      display: <Form.Item className='select-label-up' >
        <label className='label-select'>Manufacturer</label>
        <SelectorTree
          style={{ minWidth: '160px' }}
          selectAll
          selectorTreeName={SCAN_TREE_SELECTOR.MANUFACTURER + eqType}
          icon={
            <Image className="filters-selector-img" key={1} src={`/images/model-equipment-icon.svg`}
              srcDefault={'/images/model-equipment-icon.svg'} alt="logo" width="18px" />
          }
          nodes={subMenuTree}
          placeholder="Manufacturer"
          isApply={(dataPerLevel, dataPerNode) => {
            const cleanedDataPerLevelTwo: Set<string> = new Set<string>();
            dataPerLevel[1].forEach(value => {
              cleanedDataPerLevelTwo.add(value.split('|')[0]);
            });
            addBodyFilter({
              manufacturerId: Array.from(dataPerLevel[0]),
              equipmentModelId: Array.from(cleanedDataPerLevelTwo)
            });
          }}
        />
      </Form.Item>
    },
    ((isCleatSelected || isKneeBraceSelected) && activityType === ACTIVITY_TYPE.GAME && account?.role?.name === ACCOUNT_ROLES.ZEBRA_ADMIN) ? {
      query: 'switchAllCleats',
      display: <Form.Item className="select-label-up" style={{ width: '245px' }}>
        <label className="label-switch"> Show Filtered {isCleatSelected ? 'Cleats' : 'Knee Braces'} </label>
        <Switch
          checked={isCleatSelected ? !extraScanDetailFilter?.includeExtraCleats : !extraScanDetailFilter?.includeExtraKneeBraces}
          className="filters-switch" 
          onChange={e => {
            if (isCleatSelected) {
              addExtraScanBodyFilter({
                includeExtraEquipments: !e,
                includeExtraCleats: !e,
              });
            } else {
              addExtraScanBodyFilter({
                includeExtraEquipments: !e,
                includeExtraKneeBraces: !e,
              });
            }
          }}
        />
      </Form.Item>
    } : {
      query: 'switchAllCleats',
      display: <></>
    }
  ];

  const currentType = scanDetailFilter?.equipmentTypeId?.length > 0 ? equipmentTypeList.filter(type => type.id === scanDetailFilter?.equipmentTypeId[0]) : [];
  const scanExtraInfo = currentType.length > 0 ? currentType[0]?.extraInformation?.map(info => (
    {
      title: toPrint(info),
      dataIndex: info.toLowerCase(),
      key: info.toLowerCase(),
      sorter: false,
      render: (a: any, b: ScanState, c: any, d: string) => {
        return b?.scanInfoExtraList?.filter(data => data.typeName === d)[0]?.value;
      }
    }
  )) : [];

  const helmetCode = currentType[0]?.nameEquipmentType === EQUIPMENT_TYPES.HELMET ?
    [
      {
        title: 'Model code',
        dataIndex: 'modelCode',
        key: 'model_code',
        sorter: true,
        render: (a: any, b: ScanState, c: any, d: string) => {
          return b?.scanInfoExtraList?.filter(data => data.typeName === d)[0]?.value;
        }
      }
    ] : [];
  
  const columns = [
    ...equipmentGeneralInformation(activityType),
    ...helmetCode,
    ...scanExtraInfo,
    ...playerInfoColumn];

  const defaultFilters: FilterState = {
    page: {
      params: ['0']
    },
    size: {
      params: [pageSize]
    }
  };
  
  return (
    <>
      {
        <InfiniteTable
          key={enableFetch + ''}
          columnEditName={TABLE_EDIT_NAME.SCAN_REPORT_LIST_COLUMN + eqType}
          columns={columns}
          defaultFiltersObject={defaultFilters}
          filters={scanFilters}
          filterName={component}
          filterLabels="vertical"
          filterPosition="after"
          url={API.SCANNER.SCANS_BY_ACTIVITY('')}
          fetchType="POST"
          paged
          bodyFilters={initBodyFilter}
          downloadButtons={{
            title: 'Download',
            buttonArray: [
              { 
                title: 'Download CSV', 
                hoverText: 'Download Scanned Players',
                onClick: (columns: any, disableLoader: any) => {
                  const newColumns: Array<string> = [];
                  for (const column of columns) {
                    newColumns.push(column?.dataIndex ? column?.dataIndex : column?.key);
                  }
                  downloadCsv(
                    `Scan-${eqType}-${moment(new Date()).format(DATE_FORMATS.monthDayYearHourMin)}-export.csv`,
                    API.SCANNER.SCANS_DOWNLOAD_REPORT(),
                    'POST',
                    {
                      ...scanDetailFilter,
                      ianaTimeZone: moment.tz.guess(),
                      includePlayer: false,
                      columns: newColumns
                    }, 'application/json', () => disableLoader());
                }
              },
              { 
                title: 'Download All', 
                hoverText: 'Includes All Players',
                onClick: (columns: any, disableLoader: any) => {
                  const newColumns: Array<string> = [];
                  for (const column of columns) {
                    newColumns.push(column?.dataIndex ? column?.dataIndex : column?.key);
                  }
                  downloadCsv(
                    `Scan-${eqType}-${moment(new Date()).format(DATE_FORMATS.monthDayYearHourMin)}-export-all-players.csv`,
                    API.SCANNER.SCANS_DOWNLOAD_REPORT(),
                    'POST',
                    {
                      ...scanDetailFilter,
                      ianaTimeZone: moment.tz.guess(),
                      includePlayer: true,
                      columns: newColumns
                    }, 'application/json', () => disableLoader());
                }
              }, 
            ],
          }}
          onDownloadButtonClick={undefined}
        />
      }
    </>
  );
};
