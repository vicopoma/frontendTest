import React, { useState } from 'react';
import { Button, Layout, Progress, Table } from 'antd';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { RangePicker } from '../../Shared/DatePicker/RangePicker';
import moment, { Moment } from 'moment';
import { useRawBlinkSyncFunctions } from '../../../hook/customHooks/backdoor';
import { BLINKS_SYNC_FILTER, dateFormatMinute, PROGRESS_BAR_TYPES } from '../../../constants/constants';
import { useNotificationContext } from '../../../context/notifications';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { ConfirmationModal } from '../../Shared/Modals/Modals';

export const SyncRawBlink = () => {
  const {bodyFilter: rawBlinkSyncBodyFilter, addBodyFilter} = useBodyFilterParams(BLINKS_SYNC_FILTER, {
    startDate: moment().minutes(0).subtract(2, 'days'),
    endDate: moment().minutes(0).subtract(2, 'days'),
  });
  const [dateRange, setDateRange] = useState<[Moment, Moment]>(() => {
    return [
      moment(rawBlinkSyncBodyFilter?.startDate), 
      moment(rawBlinkSyncBodyFilter?.endDate)
    ];
  });

  const { synchronize } = useRawBlinkSyncFunctions();
  const { updateProgressBar, progressBarData } = useNotificationContext();

  const columns = [
    {
      dataIndex: 'startDate',
      key: 'startDate',
      title: 'Start Date',
      width: '14%',
    },
    {
      dataIndex: 'endDate',
      key: 'endDate',
      title: 'End Date',
      width: '14%',
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: 'Message',
      width: '30%',
    },
    {
      dataIndex: 'percentage',
      key: 'percentage',
      title: 'Progress',
      render: (a: string) => {
        return <Progress percent={Number(a)}/>
      }
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
      width: '14%',
    },
  ];

  const dataSource = progressBarData.filter(item => {
    const isRawBlinkSyncItem = Object.keys(item).filter(key => key === PROGRESS_BAR_TYPES.SYNCHRONIZED_RAW_BLINK).length > 0;
    return isRawBlinkSyncItem;
  }).map(item => {
    const rawBlinkSyncItem = item[PROGRESS_BAR_TYPES.SYNCHRONIZED_RAW_BLINK];
    return {
      title: rawBlinkSyncItem.extra.title,
      startDate: rawBlinkSyncItem.extra.activityStartdate,
      endDate: rawBlinkSyncItem.extra.activityEndDate,
      status: rawBlinkSyncItem.status,
      percentage: rawBlinkSyncItem.percentage,
    }
  }).filter((_, index) => index === 0);

  return (
    <Layout>
      <div className="card-container">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Raw Blink Sync</span>
            </div>
          }
        />
        <div className="image-background" style={{
          display: 'flex',
          gap: '10px',
        }}>
          <RangePicker 
            value={dateRange} 
            minuteInterval={5}
            validDates={{
              startDate: (startDate) => {
                return moment().startOf('day').diff(startDate, 'days') >= 0;
                // return moment().diff(startDate, 'days') >= 2;
              },
              endDate: (startDate, endDate) => {
                // return endDate.diff(startDate, 'days') < 2;
                return endDate.startOf('day').diff(startDate.startOf('day'), 'days') <= 2 && moment().startOf('day').diff(endDate, 'days') >= 0;
              }
            }}
            onOk={(value) => {
              setDateRange(value);
              addBodyFilter({
                startDate: value[0],
                endDate: value[1],
              });
            }}
          />
          <Button
            style={{
              marginTop: '7px',
            }} 
            onClick={() => {
              const startDate = moment.isMoment(rawBlinkSyncBodyFilter?.startDate)  
                ? rawBlinkSyncBodyFilter?.startDate.format(dateFormatMinute) 
                : moment(rawBlinkSyncBodyFilter?.startDate).format(dateFormatMinute);
              const endDate = moment.isMoment(rawBlinkSyncBodyFilter?.endDate)  
                ? rawBlinkSyncBodyFilter?.endDate.format(dateFormatMinute) 
                : moment(rawBlinkSyncBodyFilter?.endDate).format(dateFormatMinute);
              ConfirmationModal('Raw Blink Synchronization', 
                <div>
                  Are you sure to synchronize the raw blinks from {startDate} to {endDate}?
                </div>, 
                () => {
                  synchronize(
                    startDate, 
                    endDate, 
                    () => {
                      updateProgressBar();
                    }
                  );
                }
              );
            }}
            className="btn-green"
          >
            SYNC
          </Button>
        </div>
        <div className="card-container" style={{ padding: '20px 20px 0 0'}}>
          <Table
            pagination={false}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </div>
    </Layout>
  );
};
