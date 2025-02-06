import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { DATE_FORMATS, HEALTH_DEVICE } from '../../../constants/constants';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import moment, { Moment } from 'moment';
import { HealthDevice as HealthDeviceType, useHealthDeviceFunctions } from '../../../hook/customHooks/backdoor';
import { useLoaderDispatch } from '../../../hook/hooks/loader';
import { RangePicker } from '../../Shared/DatePicker/RangePicker';
import './BackDoor.scss';
import { HealthDeviceGraph } from './HealthDeviceGraph';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { Link } from 'react-router-dom';

export const HealthDevice = () => {
  const { showLoader } = useLoaderDispatch();
  const { healthDeviceList, loadHealthDeviceList } = useHealthDeviceFunctions();
  

  const {bodyFilter: healthDeviceBodyFilter, addBodyFilter} = useBodyFilterParams(HEALTH_DEVICE, {
    startDate: moment().minutes(0).subtract(2, 'days'),
    endDate: moment().minutes(0).subtract(2, 'days'),
  });
  const [siteSelected, setSiteSelected] = useState<string>(() => {
    if (!!healthDeviceBodyFilter.siteSelected && healthDeviceBodyFilter !== '') {
      return healthDeviceBodyFilter.siteSelected;
    }
    return ''
  });
  const [dateRange, setDateRange] = useState<[Moment, Moment]>(() => {
    return [
      moment(healthDeviceBodyFilter?.startDate), 
      moment(healthDeviceBodyFilter?.endDate)
    ];
  });

  useEffect(() => {
    showLoader(true);
    const dayDiff = moment(dateRange[1]).diff(moment(dateRange[0]), 'days');
    const startDate = dayDiff < 22 ? moment(dateRange[0]) : moment(dateRange[1]).subtract(22, 'days');
    loadHealthDeviceList(
      startDate.format(DATE_FORMATS.yearMonthDayHourMin), 
      moment(dateRange[1]).format(DATE_FORMATS.yearMonthDayHourMin),
      () => showLoader(false),
      () => showLoader(false),
    )
  }, [loadHealthDeviceList, dateRange]);

  useEffect(() => {
    addBodyFilter({
      siteSelected: siteSelected,
    })
  }, [addBodyFilter, siteSelected]);

  return (
    <DetailLayout 
      disableBackButton={siteSelected === ''}
      onBack={() => setSiteSelected('')}
    >
      <div className="">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Health Device</span>
            </div>
          }
          navigationRoute={
            siteSelected === '' ?
            [{
              path: '#',
              breadcrumbName: 'Health Device',
            }] :  
            [
              {
                path: 'something/../health-device',
                breadcrumbName: 'Health Device',
              },
              {
                path: '',
                breadcrumbName: siteSelected,
              }
            ]
          }
          itemRender={(route, params, routes, paths) => {
            const last = routes.indexOf(route) === routes.length - 1;
            return last ? (
              <span className={`navigation-bar${routes.length > 1 ? '-last' : ''}`}>{route.breadcrumbName}</span>
            ) : (
              <Link 
                className="navigation-bar" 
                to={route.path}
                onClick={() => setSiteSelected('')}
              >{route.breadcrumbName}</Link>
            );
          }}
        />
        <div className="image-background btn-header" style={{
          display: 'flex',
          gap: '10px',
          padding: '10px',
        }}>
          <Row style={{ width: '100%' }}>
            <Col span={24}>
              <Row justify="space-between">
                <Col>
                  <Row align="middle" gutter={[8, 0]}>
                    <RangePicker 
                      value={dateRange} 
                      minuteInterval={5}
                      validDates={{
                        startDate: (startDate, endDate) => {
                          return moment().startOf('day').diff(startDate, 'days') >= 0;
                          // endDate.startOf('day').diff(startDate.startOf('day'), 'days') >= 1;
                        },
                        endDate: (startDate, endDate) => {
                          return endDate.startOf('day').diff(startDate.startOf('day'), 'days') <= 1 && moment().startOf('day').diff(endDate, 'days') >= 0;
                          // return moment().startOf('day').diff(endDate.startOf('day'), 'days') >= 0;
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
                  </Row>
                </Col>
                <Col>
                  <Row justify="end" align='middle' style={{minHeight: '45px'}}>
                    <div className="card-detail">
                      <div className="card-detail-title">Health Device</div>
                      <div className="card-detail-list">
                        <div className="detail-item">
                          <img src="/images/device-status/warning.svg" alt="" />
                          <span className="detail-label">Warning</span>
                        </div>
                        <div className="detail-item">
                          <img src="/images/device-status/error.svg" alt="" />
                          <span className="detail-label">Error</span>
                        </div>
                        <div className="detail-item">
                          <img src="/images/device-status/stop.svg" alt="" />
                          <span className="detail-label">Stopped</span>
                        </div>
                        <div className="detail-item">
                          <img src="/images/device-status/rebbot.svg" alt="" />
                          <span className="detail-label">Rebooting</span>
                        </div>
                      </div>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="layout_back health-layout" style={{height: 'calc(100vh - 260px)' }}>
          {siteSelected === '' ? <div>
            <div className="health-dev-cards">
            {healthDeviceList.map((healthDevice) => {
              return (
                <Col>
                  <HealthDeviceCard selectSite={setSiteSelected} healthDevice={healthDevice} />
                </Col>
              )
            })}
            </div>
          </div> : 
          <HealthDeviceGraph
            showLoader={showLoader}
            startDate={healthDeviceBodyFilter.startDate} 
            endDate={healthDeviceBodyFilter.endDate}
            siteName={siteSelected}
          />}
        </div>
      </div>
    </DetailLayout>
  );
};

const HealthDeviceCard = (
  { healthDevice, selectSite }: 
  { healthDevice: HealthDeviceType, selectSite: React.Dispatch<React.SetStateAction<string>> }
) => {
  const total = healthDevice.warnings 
                + healthDevice.errors 
                + healthDevice.stoppeds 
                + healthDevice.rebootings;
  return (
    <div className={`card-device ${total > 0 ? 'warn' : 'ok'}`}
      onClick={() => selectSite(healthDevice.siteName)}
    >
      <div className="card-dev-head">
        <img src="/images/device-status/team-site-icon.svg" alt="" />
        <div className="card-header-text">
          <h3>{healthDevice.siteName}</h3>
          <h6>Antennas ({healthDevice.antennas})</h6>
        </div>
      </div>
      <hr />
      <div className="num-status">
        <div className="number-st">
          <h3>{healthDevice.warnings}</h3>
          <img src="/images/device-status/warning.svg" alt="" />
        </div>
        <div className="number-st">
          <h3>{healthDevice.errors}</h3>
          <img src="/images/device-status/error.svg" alt="" />
        </div>
        <div className="number-st">
          <h3>{healthDevice.stoppeds}</h3>
          <img src="/images/device-status/stop.svg" alt="" />
        </div>
        <div className="number-st">
          <h3>{healthDevice.rebootings}</h3>
          <img src="/images/device-status/rebbot.svg" alt="" />
        </div>
      </div> 
    </div>
  )
}
