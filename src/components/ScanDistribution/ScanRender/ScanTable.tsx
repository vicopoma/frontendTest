import React, { useEffect, useState } from 'react';
import { useScanFunctions, useScanTableConstructor } from '../../../hook/customHooks/scan';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import moment from 'moment';
import { DATE_FORMATS, SCAN_BY_SESSION_BODY_FILTER } from '../../../constants/constants';
import { Filters } from '../../Shared/Filters/Filters';
import { Button, Form, Input, Table } from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import { Select } from '../../Shared/Select/Select';
import { ManufacturersSelector } from '../../Shared/TreeSelectors/ManufacturersSelector';
import { asciiToHex, hexToAscii } from '../../../helpers/ConvertUtils';

interface ScanTableProps {
  sessionId: string
  teamId: string
	status: string
}

export const ScanTable = ({ sessionId, teamId, status }: ScanTableProps) => {
  
  const {equipmentTypeList} = useEquipmentTypeState();
  const { scanBySession: { loadScanBySession, scanBySessions} } = useScanFunctions();
  
  const [eqType, setEqType] = useState<string> (equipmentTypeList?.[0].id);
  const filterName = [SCAN_BY_SESSION_BODY_FILTER, sessionId, teamId, eqType].join('-');
  const manufacturerSelectorName = [SCAN_BY_SESSION_BODY_FILTER, sessionId, teamId, 'selector', eqType].join('-');
  const [manufacturerShow, setManufacturerShow] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [refreshSelector, setRefreshSelector] = useState<number>(0);
  
  const { scanBodyFilter, addBodyFilter, enableFetch, setEnableFetch, setEquipmentTypeChange, setReset, manufacturersWithModels }
    = useScanTableConstructor(eqType, teamId, sessionId, status, filterName);
  
  useEffect(() => {
    if(enableFetch) {
      loadScanBySession(scanBodyFilter);
    }
  }, [enableFetch, loadScanBySession, scanBodyFilter]);
  
  useEffect(() => {
    if(!manufacturerShow) {
      setEnableFetch(false);
      for (const equipment of equipmentTypeList) {
        const current = [SCAN_BY_SESSION_BODY_FILTER, sessionId, teamId, 'selector', equipment.id].join('-');
        sessionStorage.removeItem(current);
      }
      addBodyFilter({
        manufacturerId: undefined
      });
      setTrigger(true);
    }
  }, [addBodyFilter, equipmentTypeList, manufacturerShow, sessionId, setEnableFetch, teamId])
  
  useEffect(() => {
    setRefreshSelector(prevState => prevState + 1);
    setManufacturerShow(false);
  }, [status]);
  
  useEffect(() => {
    if(trigger && !scanBodyFilter.manufacturerId) {
      setEqType(equipmentTypeList?.[0]?.id);
      setEquipmentTypeChange(prevState => prevState + 1);
      setManufacturerShow(true);
      setTrigger(false);
      setReset(true);
    }
  }, [equipmentTypeList, scanBodyFilter.manufacturerId, setEnableFetch, setEquipmentTypeChange, setReset, trigger]);
  
  return (
    <div>
      <Filters
        leftOptions={[
          {
            display: (
              <Form.Item className='select-label-up'>
                <Input.Search
                  key={scanBodyFilter?.keyword}
                  defaultValue={scanBodyFilter?.keyword}
                  size="small"
                  placeholder="Search..."
                  onSearch={(value) => {
                    addBodyFilter({
                      keyword: value,
                      tag: asciiToHex(value.toUpperCase()),
                    })
                  }}
                />
              </Form.Item>
            )
          },
          {
            display: (
              <Form.Item className='select-label-up'>
                <label className='label-select'>Equipment Type</label>
                <Select
                  className="filters-selector"
                  style={{width: '125px'}}
                  value={eqType}
                  size="small"
                  id={`scan-${sessionId}-${teamId}`}
                  placeholder="Equipment Type"
                  onChange={(value) => {
                    setEqType(value);
                  }}
                  options={equipmentTypeList
                  .map(equipment => ({value: equipment.id, display: equipment.nameEquipmentType}))
                  }
                />
              </Form.Item>
            )
          },
          {
            display: (
              <ManufacturersSelector
                key={eqType + refreshSelector + manufacturersWithModels?.length }
                key2={eqType + refreshSelector}
                name={manufacturerSelectorName}
                equipmentType={eqType}
                onApply={(dataPerLevel, dataPerNode) => {
                  const cleanedDataPerLevelTwo: Set<string> = new Set<string>();
                  dataPerLevel[1].forEach(value => {
                    cleanedDataPerLevelTwo.add(value.split('|')[0]);
                  });
                  addBodyFilter({
                    manufacturerId: Array.from(dataPerLevel[0]),
                    equipmentModelId: Array.from(cleanedDataPerLevelTwo),
                  });
                }}
              />
            ),
          },
          {
            display: (
              <Form.Item className='select-label-up'>
                <label className='label-select'>Devices</label>
                <Select
                  className="filters-selector"
                  style={{width: '125px'}}
                  value={scanBodyFilter?.deviceType ?? ''}
                  size="small"
                  id={`device-${sessionId}-${teamId}`}
                  onChange={(value) => {
                    addBodyFilter({
                      deviceType: value.length > 0 ? value : null
                    })
                  }}
                  options={[
                    {
                      display: 'All',
                      value: ''
                    },
                    {
                      display: 'FX9600',
                      value: 'FX9600'
                    },
                    {
                      display: 'MC33',
                      value: 'MC33'
                    },
                    {
                      display: 'Manual',
                      value: 'MANUAL'
                    }
                  ]}
                />
              </Form.Item>
            )
          },
          {
            display: (
              <Form.Item className='select-label-up'>
                <Button
                  size="small"
                  onClick={() => {
                    setRefreshSelector(prevState => prevState + 1);
                    setManufacturerShow(false);
                  }}>
                  <UndoOutlined style={{ color: '#013369' }}/>
                  Reset
                </Button>
              </Form.Item>
            )
          }
        ]}
      />
      <Table
        pagination={false}
        columns={ScanTableColumns}
        dataSource={scanBySessions}
      />
    </div>
  )
}

export const ScanTableColumns = [
  {
    title: 'Equipment Type',
    dataIndex: 'nameEquipmentType',
    key: 'nameEquipmentType'
  },
  {
    title: 'Manufacturer',
    dataIndex: 'nameManufacturer',
    key: 'nameManufacturer'
  },
  {
    title: 'Model',
    dataIndex: 'nameModel',
    key: 'nameModel'
  },
  {
    title: 'Equipment Code',
    dataIndex: 'equipmentCode',
    key: 'equipmentCode'
  },
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
    render: (tag: string) => hexToAscii(tag)
  },
  {
    title: 'Scan Time',
    dataIndex: 'scanTime',
    key: 'scanTime',
    render: (a: string) => moment(a).local().format(DATE_FORMATS.monthDayYearHourMin)
  },
  {
    title: 'Player Assigned',
    dataIndex: 'displayName',
    key: 'displayName'
  },
  {
    title: 'Scan Device',
    dataIndex: 'deviceType',
    key: 'deviceType'
  }
]