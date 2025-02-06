import React, { useCallback, useEffect, useState } from 'react';
import { Filters } from '../../Shared/Filters/Filters';
import { DatePicker, Empty, Form } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import { SelectorTree } from '../../Shared/TreeFormComponents/SelectorTree/SelectorTree';
import { useScanFunctions } from '../../../hook/customHooks/scan';
import { ScanRender } from '../ScanRender/ScanRender';
import { HeaderScanDistributionView } from '../ScanRender/HeaderView';
import moment from 'moment';
import {
  DATE_FORMATS,
  SCAN_DISTRIBUTION_BODY_FILTER
} from '../../../constants/constants';
import { ScanTable } from '../ScanRender/ScanTable';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { useAccountState } from '../../../hook/hooks/account';
import { TeamsSelector } from '../../Shared/TreeSelectors/TeamsSelector';
import { useLoaderDispatch } from '../../../hook/hooks/loader';
import { Select } from '../../Shared/Select/Select';
import { TreeNode } from '../../Shared/TreeFormComponents/TreeFormTypes';
import { useDownloadFunctions } from '../../../hook/customHooks/download';
import { progressBarSessionStorageHandler } from '../../../helpers/Utils';
import { SeasonWeekSelector } from '../../Shared/TreeSelectors/SeasonWeekSelector';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DropdownButtonGroup } from '../../Shared/ButtonGroup/ButtonGroup';

export const ScanByVenue = () => {
  
  const { showLoader } = useLoaderDispatch();
  const { account } = useAccountState();
  const { teamList, siteList } = account;
  const { scanByVenue: {loadScanByVenue, scanByVenues} } = useScanFunctions();
  const { downloadAllScansByVenue, downloadDetailedScanDistribution } = useDownloadFunctions();
  
  const [, setTypeTeamFilterSelector] = useState<Array<TreeNode>>([]);
  const [triggerProgresBar, setTriggerProgressBar] = useState<number>(0);
  
  const { addBodyFilter, bodyFilter } = useBodyFilterParams(SCAN_DISTRIBUTION_BODY_FILTER, {
    startDate: moment().format(DATE_FORMATS.yearMonthDay),
    endDate: moment().format(DATE_FORMATS.yearMonthDay),
    teamIds: teamList.map(team => team.teamId),
    locations: siteList,
    status: 'ACT',
    type: null
  });

  const [reset, setReset] = useState((bodyFilter?.date !== '' && Object.keys(bodyFilter.season || {}).length === 0)  ? 1 : 0);
  
  useEffect(() => {
    showLoader(true);
    loadScanByVenue(bodyFilter, () => {
      showLoader(false);
    }, () => {
      showLoader(false);
    });
  }, [bodyFilter, loadScanByVenue, showLoader]);
  
  const buildTypeTeamsFilter = useCallback((): TreeNode => {
    return {
      value: 'home/visit',
      name: 'Teams',
      display: 'Teams',
      icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
      className: 'filter-menu-select-first',
      children: [
        {
          value: 'home',
          name: 'Home',
          display: 'Home',
          icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
          className: 'filter-menu-select-first',
          shown: true,
          id: 'home',
        },
        {
          value: 'visit',
          name: 'Away',
          display: 'Away',
          icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
          className: 'filter-menu-select-first',
          shown: true,
          id: 'visitor',
        }
      ],
      shown: true,
      id: 'home/visit'
    };
  }, []);
  
  useEffect(() => {
    setTypeTeamFilterSelector([buildTypeTeamsFilter()]);
  }, [buildTypeTeamsFilter]);
  
  return (
    <div  className="scan-dis-layout blue-scroll">
      <Filters
        leftOptions={[
          {
						display: (
							<SeasonWeekSelector 
                name={'SeasonWeekScanDistribution'}
								onApply={(dataPerLevel, dataPerNode) => {
									const weeks = Array.from(dataPerLevel[1]).map(week => {
										return week.split('|')[0];
									});
									addBodyFilter({
										startDate: undefined,
										endDate: undefined,
										season: {
											season: dataPerLevel[0].values().next().value,
											weekList: weeks
										}
									});
								}}
								reset={reset}
							/>
						),
					},
          {
            display: (
              <Form.Item className='select-label-up'>
                <label className='label-select'> Locations</label>
                <SelectorTree
                  selectAll
                  icon={<img className="img-h anticon" src="/images/team-site-icon.svg" alt="" width="17px"/>}
                  nodes={[{
                    value: '0',
                    name: 'LocationTree',
                    display: 'Location',
                    id: 'location',
                    shown: true,
                    className: 'filter-menu-select-first',
                    children: siteList.map(site => ({
                      value: site,
                      name: site,
                      display: site,
                      id: site,
                      shown: true,
                      className: 'filter-menu-select-second'
                    }))
                  }]}
                  onChange={(selectedValuesPerLevel: (Iterable<unknown> | ArrayLike<unknown>)[]) => {
                    addBodyFilter({
                      locations: Array.from(selectedValuesPerLevel[0])
                    });
                  }}
                  placeholder="Location"
                  selectorTreeName="Location"
                />
              </Form.Item>
            ),
          },
          {
            display: (
              <TeamsSelector
                name="ScanVenueTeamsTeams"
                onChange={(teams) => {
                  addBodyFilter({
                    teamIds: teams
                  });
                }}
              />
            ),
          },
          {
            display: (
              <Form.Item className='select-label-up'>
                <label className='label-select'> Home/Away</label>
                <Select
                  className="filters-selector"
                  style={{width: '125px'}}
                  value={bodyFilter?.gameType ?? ''}
                  size="small"
                  id={`gameType`}
                  onChange={(value) => {
                    addBodyFilter({
                      gameType: value.length > 0 ? value : null
                    })
                  }}
                  options={[
                    {
                      display: 'All',
                      value: ''
                    },
                    {
                      display: 'Home',
                      value: 'home'
                    },
                    {
                      display: 'Away',
                      value: 'away'
                    },
                  ]}
                />
              </Form.Item>
            ),
          },
          {
						display: (
              <Form.Item className='select-label-up'>
                <label className='label-select'> Status</label>
                <Select
                  className="filters-selector"
                  style={{width: '125px'}}
                  value={!!bodyFilter?.status ? bodyFilter?.status : ''}
                  size="small"
                  id={`status`}
                  placeholder="Status"
                  onChange={(value) => {
                    addBodyFilter({
                      status: value
                    })
                  }}
                  options={[
                    {
                      display: 'All',
                      value: ''
                    },
                    {
                      display: 'Active',
                      value: 'ACT'
                    },
                    {
                      display: 'Inactive',
                      value: 'DEC'
                    },
                  ]}
                />
              </Form.Item>
						)
					},
          {
            display: (
              <Form.Item className='select-label-up'>
                <DatePicker
                  allowClear={false}
                  value={bodyFilter.startDate ? moment(bodyFilter.startDate) : null}
                  size='small'
                  format={DATE_FORMATS.monthDayYear}
                  onChange={(a: any) => {
                    setReset(prev => prev + 1);
                    if(reset < 0) {
                      setReset(prev => prev * -1);
                    }
                    addBodyFilter({
                      startDate: a.format(DATE_FORMATS.yearMonthDay),
                      endDate: a.format(DATE_FORMATS.yearMonthDay),
                      season: {},
                    });
                  }}
                />
              </Form.Item>
            ),
          },
        ]}
        rightOptions={[
          { 
						display: (
							<DropdownButtonGroup 
								icon={<DownOutlined style={{ color: '#013369' }} />}
								label="Download"
                triggerProgressBar={triggerProgresBar}
								disabled={((!bodyFilter?.startDate || !bodyFilter?.endDate) && 
									((bodyFilter?.season?.weekList?.length || 0) === 0 || Object.keys(bodyFilter?.season).length === 0)) ||
									((bodyFilter?.teamIds?.length || 0) === 0)
								}
								buttonArray={[
									{
										title: 'Download Totals',
										icon: <DownloadOutlined style={{ color: '#013369', marginRight: "8px" }} />,
										onClick: () => {
                      ConfirmationModal('Download', 'Are you sure to download?', () => {
                        downloadAllScansByVenue(bodyFilter, (res, httpResponse) => {
                          let code = `${bodyFilter.startDate}-scans-distribution-by-venue.csv`;
                          if(!bodyFilter.startDate) {
                            code = `${bodyFilter.season.season}-scans-distribution-by-venue.csv`;
                          }
                          const key = typeof res === 'string' ? res : '';
                          progressBarSessionStorageHandler(code, key);
                          SuccessMessage({description: httpResponse.message});
                          setTriggerProgressBar(prevState => prevState + 1);
                        });
                      });
                    }
									},
									{
										title: 'Download Detail',
										icon: <DownloadOutlined style={{ color: '#013369', marginRight: "8px" }} />,
										onClick: () => {
											ConfirmationModal('Download', 'Are you sure to download the detailed report?', () => {
												downloadDetailedScanDistribution(bodyFilter, 'Venue', (res, httpResponse) => {
													let code = `${bodyFilter.startDate}-scans-distribution-details-by-venue.csv`;
													if(!bodyFilter.startDate) {
														code = `${bodyFilter.season.season}-scans-distribution-details-by-venue.csv`;
													}
													const key = typeof res === 'string' ? res : '';
													progressBarSessionStorageHandler(code, key);
													SuccessMessage({description: httpResponse.message});
													setTriggerProgressBar(prevState => prevState + 1);
												});
											});
										}
									},
								]}
							/>
						)
					}
        ]}
      />
      
      {
        scanByVenues.length > 0 ? (
          <ScanRender
            data={{
              key: 'main',
              children: scanByVenues.map((scans, index) => ({
                id: `${scans.siteName}-${scans.type}-${scans.teamName}`,
                header: (
                  <HeaderScanDistributionView
                    img={<img src={`/images/teams/logos/${scans.teamName}.svg`} width="40px" alt=""/>}
                    title={(
                      <>
                        <div className="scan-venue-title">{scans.siteName}</div>
                        <div className="scan-venue-type">{scans.type.toUpperCase()}</div>
                      </>
                    )}
                    equipmentList={scans.equipmentAssignedList}
                    fx9600={scans.fx9600}
                    mc33={scans.mc33}
                    manual={scans.manual}
                    total={scans.total}
                  />
                ),
                headerClassName: 'first-level-header ant-collapse',
                key: index + '',
                children: scans.scanDistributionList.map((distribution, index2) => ({
                  key: distribution.startGameDate + index2,
                  id: `${moment(distribution.startGameDate).format(DATE_FORMATS.yearMonthDayHourMin)}-${distribution.teamGame}`,
                  header: (
                    <HeaderScanDistributionView
                      img={<div> {`${distribution.title} (${distribution.teamGame})`} </div>}
                      title={<div className="scan-venue-subtitle"> {moment(distribution.startGameDate).format(DATE_FORMATS.monthDayYearHourMin)} </div>}
                      fx9600={distribution.fx9600}
										  mc33={distribution.mc33}
										  manual={distribution.manual}
										  total={distribution.players}
										  equipmentList={distribution.equipmentAssignedList}
                      totalEquipmentList={scans.equipmentAssignedList}
                      tooltip={true}
                    />
                  ),
                  body: <ScanTable sessionId={distribution.sessionId} teamId={distribution.teamId} status={bodyFilter?.status}/>,
                  headerClassName: 'second-level-header sub-level', 
                }))
              }))
            }}
          />
        ) : <Empty/>
      }
    </div>
  )
}