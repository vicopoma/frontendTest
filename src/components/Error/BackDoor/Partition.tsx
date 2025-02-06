import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Layout } from 'antd';
import { DownloadOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { API } from '../../../settings/server.config';
import { useAccountDispatch } from '../../../hook/hooks/account';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { DATE_FORMATS, DESCEND, PARTITION, TABLE_EDIT_NAME } from '../../../constants/constants';
import { Columns } from '../../Shared/Table/CustomTable/Table';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { InfiniteTable } from '../../Shared/Table/InfiniteTable';
import CustomInput from '../../Shared/CustomInput/Input';
import moment from 'moment';
import { SelectOptions } from '../../Shared/Select/Select';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { useNotificationContext } from '../../../context/notifications';
import { usePartitionFunctions } from '../../../hook/customHooks/backdoor';
import { useLoaderDispatch } from '../../../hook/hooks/loader';
import { bytesToString } from '../../../helpers/Utils';

export const Partition = () => {
  const { forceArchive, forceRestore } = usePartitionFunctions();
  const { updateNotifications } = useAccountDispatch();
  const { updateProgressBar } = useNotificationContext();
  const [trigger, setTrigger] = useState(0);
  const { bodyFilter: partitionBodyFilter, addBodyFilter } = useBodyFilterParams(PARTITION);
  const { showLoader } = useLoaderDispatch();
  const [disableButton, setDisableButton] = useState<string>('');
  const [tags, setTags] = useState<Array<SelectOptions>>(() => {
    if (partitionBodyFilter?.keys) {
      const currentTags: Array<SelectOptions> = []
      partitionBodyFilter.keys.forEach((data: any) => {
        currentTags.push({
          value: data,
          display: data,
        })
      })
      return currentTags
    }
    return []
  });

  const updateTrigger = useCallback(() => {
    setTrigger(prevState => {
      addBodyFilter({
        trigger: prevState + 1,
      })
      return prevState + 1;
    });
  }, [addBodyFilter, setTrigger]);

  useEffect(() => {
    addBodyFilter({
      keys: [],
      status: "",
      operator: "OR"
    })
  }, [addBodyFilter]);

  const unblockButton = () => {
    setTimeout(() => setDisableButton(''), 1000);
  }

  const columns: Array<Columns> = [
    {
      title: 'Create Date',
      dataIndex: 'createDate',
      key: 'create_date',
      sorter: true,
      render: (date: string) => moment(new Date(date)).local().format(DATE_FORMATS.yearMonthDayHourMin),
    },
    {
      title: 'Last Modified By',
      dataIndex: 'modifiedBy',
      key: 'modified_by',
      sorter: true,
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'modifiedDate',
      key: 'modified_date',
      sorter: true,
      render: (date: string) => moment(new Date(date)).local().format(DATE_FORMATS.yearMonthDayHourMin),
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      key: 'expired_date',
      sorter: true,
      render: (date: string) => {
        if(date) {
          const hourDiff = moment(new Date(date)).diff(moment(new Date()), 'hours') + 1;
          if(0 <= hourDiff && hourDiff < 24) {
            return <div style={{ color: 'red'}}>
              {moment(new Date(date)).local().format(DATE_FORMATS.yearMonthDayHourMin)}
            </div>
          } else {
            return moment(new Date(date)).local().format(DATE_FORMATS.yearMonthDayHourMin);
          }
        } else {
          return '';
        }
      },
    },
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
      align: 'left',
      sorter: true,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'left',
      sorter: true,
    },
    {
      title: 'Start Calendar Date',
      dataIndex: 'startDate',
      key: 'start',
      sorter: false,
      render: (date: string) => moment(new Date(date)).utc().format(DATE_FORMATS.yearMonthDay),
    },
    {
      title: 'End Calendar Date',
      dataIndex: 'endDate',
      key: 'end_date',
      sorter: false,
      render: (date: string) => moment(new Date(date)).utc().format(DATE_FORMATS.yearMonthDay),
    },
    {
      title: 'Partition Name',
      dataIndex: 'partitionName',
      key: 'partition_name',
      defaultSortOrder: DESCEND,
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: string) => (status === 'ARCHIVE' ? <Badge color="#D9D9D9" text="Archived" /> : <Badge color="#1DAB35" text="Active" />)
    },
    {
      title: 'Created By',
      dataIndex: 'createBy',
      key: 'create_by',
      sorter: true
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => bytesToString(size),
    },
    {
      title: '',
      dataIndex: '',
      key: 'action_buttons',
      render: (a, partition: any) => {
        if (partition.status !== 'ARCHIVE') {
          return <Button
            disabled={disableButton === `${partition.week}-${partition.year}` || partition.status.includes('PROCESSING')}
            id={`${partition?.week}-${partition?.year}-archive`}
            className="btn-green"
            style={{ width: '110px', height: '30px'}}
            onClick={() => {
              ConfirmationModal(`Archive`,
                <>
                  Are you sure you want to archive
                  <b> {`Year: ${partition?.year} Week: ${partition?.week}`}
                  </b>
                  ?
                </>,
                () => {
                  showLoader(true);
                  setDisableButton(`${partition.week}-${partition.year}`);
                  forceArchive(partition.week, partition.year, () => { updateNotifications(true); updateProgressBar(); unblockButton(); showLoader(false); }, () => showLoader(false));
                });
            }}>
            <DownloadOutlined />
            ARCHIVE
          </Button>
        } else {
          return <Button
            disabled={disableButton === `${partition.week}-${partition.year}` || partition.status.includes('PROCESSING')}
            id={`${partition?.week}-${partition?.year}-restore`}
            className="btn-yellow"
            style={{ width: '110px', height: '30px'}}
            onClick={async () => {
              ConfirmationModal(`Restore`,
                <>
                  Are you sure you want to Restore
                  <b> {`Year: ${partition?.year} Week: ${partition?.week}`}
                  </b>
                  ?
                </>,
                () => {
                  showLoader(true);
                  setDisableButton(`${partition.week}-${partition.year}`);
                  forceRestore(partition.week, partition.year, () => { updateNotifications(true); updateProgressBar(); unblockButton(); showLoader(false); }, () => showLoader(false));
                });
            }}>
            <UploadOutlined style={{ height: "50px"}} />
            RESTORE
          </Button>
        }

      }
    }
  ];

  const partitionFilters: Array<{ query: string, display: JSX.Element }> = [
    {
      query: 'week',
      display: (
        <CustomInput.SearchAndTag
          id='BPInputSearch'
          key="patition-section"
          placeholder="Search..."
          size="small"
          style={{ minWidth: '400px' }}
          nameView={`partition_${''}`}
          bodyFilterName={PARTITION}
          onChange={(value: SelectOptions[]) => {
            setTags(value)
            const keys: Array<string> = []
            value.forEach(val => {
              keys.push(val.display + '')
            })
            addBodyFilter({
              keys: keys
            })
          }}
          onOperatorChange={(operator: string) => {
            addBodyFilter({
              operator: operator
            })
          }}
          operator={partitionBodyFilter?.operator ? partitionBodyFilter?.operator : 'AND'}
          tagValues={tags}
          options={[]}
        />
      )
    },
    {
      query: 'week',
      display: (
        <Button
          id="syncButton"
          onClick={() => updateTrigger()}
          size="small"
          className="search-btn-head"
          style={{ margin: '13px 0 0 10px' }}
        >
          <UndoOutlined style={{ color: '#013369' }}/>Sync
        </Button>
      )
    }
  ];

  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Partition</span>
            </div>
          }
        />
        <InfiniteTable
          url={API.PARTITION.PAGE()}
          bodyFilters={{
            keys: [],
            status: '',
            operator: 'OR',
            trigger,
          }}
          fetchType="POST"
          columns={columns}
          componentName={''}
          filters={partitionFilters}
          filterName={PARTITION}
          columnEditName={TABLE_EDIT_NAME.PARTITION}
          defaultFiltersObject={{
            sort: {
              params: ['partition_name', 'desc']
            },
            page: {
              params: ['0']
            },
            size: {
              params: [100]
            },
          }}
          paged={true}
          useTableLoader={false} />
      </div>
    </Layout>
  );
};
