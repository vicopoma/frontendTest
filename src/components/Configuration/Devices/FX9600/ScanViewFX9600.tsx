import React, { useEffect, useState } from 'react';
import { Badge, Form, Input } from 'antd';
import { Layout } from 'antd/es';
import { ASCEND, SCANNER_DEVICE_FX9600_FILTER, TABLE_EDIT_NAME, } from '../../../../constants/constants';
import { FX9600State } from '../../../../store/types/devices';
import { Columns } from '../../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../../Shared/NavigationBar/NavigationBar';
import { API } from '../../../../settings/server.config';
import { useBodyFilterParams, useFilterParams } from '../../../../hook/customHooks/customHooks';
import { TableTab } from '../../../Shared/TableTab/TableTab';
import "./ScanViewFX9600.scss";
import { ScanDetailFX9600 } from './ScanDetailFX9600';
import { SuccessMessage } from '../../../Shared/Messages/Messages';

enum FX9600Column {
  ipAddress = 'ipAddress',
  status = 'status.title',
  location = 'mapDescription',
  site = 'siteName',
  firmwareVersion = 'firmwareVersion',
  name = 'title'
}

export const FX9600 = () => {
  
  const [trigger, setTrigger] = useState<number>(0);

  const { filter: FX9600filters, addFilter } = useFilterParams(SCANNER_DEVICE_FX9600_FILTER);
  const { addBodyFilter } = useBodyFilterParams(SCANNER_DEVICE_FX9600_FILTER, { trigger: 0 });

  useEffect(() => {
    addBodyFilter({ trigger: trigger });
  }, [trigger]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTrigger(prevValue => prevValue + 1);
    }, 120000);
    return () => {
      clearInterval(intervalId);
    }
  }, []);
  
  const columns: Array<Columns> = [
    {
      title: 'Name',
      key: FX9600Column.name,
      dataIndex: FX9600Column.name,
      sorter: true,
      width: 22,
    },
    {
      title: 'Site Name',
      key: FX9600Column.site,
      dataIndex: FX9600Column.site,
      sorter: true,
      width: 17,
    },
    {
      title: 'Hostname',
      dataIndex: 'ipAddress',
      key: FX9600Column.ipAddress,
      sorter: true,
      defaultSortOrder: ASCEND,
      width: 16,
    },
    {
      title: 'Antenna',
      key: 'antenna',
      dataIndex: 'antenna',
      width: 30,
      render: (a: any, b: FX9600State) => {
        return (<div className="rhombus-container">
          {b.rfidAntennas.map((antenna, idx) => {
            return (
              <div className={`rhombus ${antenna.status}`}>
                <div className="content">{antenna.id}</div>
              </div>
            )
          })}
        </div>);
      },
    },
    {
      title: 'Status',
      key: FX9600Column.status,
      dataIndex: FX9600Column.status,
      sorter: true,
      width: 17,
      render: (a: any, b: FX9600State) => {
        if (b.status?.title === 'Failure') return <Badge color="red" text="Failure"/>;
        if (b.status?.title === 'Running') return <Badge color="green" text="Running"/>;
        return <Badge color="gray" text={b.status?.title}/>
      }
    },
    
  ];
  
  // const status: Array<string> = ['Failure', 'Publishing', 'Disabled', 'Running', 'n/a', 'Rebooting', 'Initialized', 'Updating'];
  
  const partFilters: Array<any> = [
    {
      query: 'ipAddress',
      display: (
        <Form.Item className='select-label-up'>
          <Input.Search
            id="cDFX9Hostname"
            style={{width: '100%'}}
            size="small"
            defaultValue={FX9600filters['keyword'] ? FX9600filters['keyword'].params[0] : undefined}
            onSearch={(value => {
              addFilter({
                keyword: {
                  params: [value]
                }
              });
              SuccessMessage({
                description: 'Antennas information updated',
              })
            })}
            placeholder="Search hostname or site"
          />
        </Form.Item>
      )
    },
  ];
  
  return (
    <Layout>
      <div className="card-container device-fx9600">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Device FX9600</span>
            </div>
          }
        />
        <TableTab
          url={API.DEVICES.FX9600.FX9600_LIST_MWE()}
          fetchType="GET"
          filters={partFilters}
          columns={columns}
          componentName=""
          filterName={SCANNER_DEVICE_FX9600_FILTER}
          columnEditName={TABLE_EDIT_NAME.FX_9600_COLUMN}
          useTableLoader={false}
          defaultFiltersObject={{
            sort: {
              params: [FX9600Column.name, 'asc']
            }
          }}
          render={(data: any, id: number) => <ScanDetailFX9600 data={data} trigger={trigger} />}
        />
      </div>
    </Layout>
  );
};
