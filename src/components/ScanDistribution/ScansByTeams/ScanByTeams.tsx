import React, { useEffect, useState } from 'react';
import { DownOutlined, DownloadOutlined } from '@ant-design/icons';
import { ScanRender } from '../ScanRender/ScanRender';
import '../ScanDistribution.scss';
import Icon from '../../Shared/CommomIcons/Icons';
import { ACTIVITY_TYPE, DATE_FORMATS, SCAN_DISTRIBUTION_BODY_FILTER } from '../../../constants/constants';
import { HeaderScanDistributionView } from '../ScanRender/HeaderView';
import { ScanTable } from '../ScanRender/ScanTable';
import { Filters } from '../../Shared/Filters/Filters';
import { DatePicker, Empty, Form } from 'antd';
import { TeamsSelector } from '../../Shared/TreeSelectors/TeamsSelector';
import { useScanFunctions } from '../../../hook/customHooks/scan';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import moment from 'moment';
import { useAccountState } from '../../../hook/hooks/account';
import { useLoaderDispatch } from '../../../hook/hooks/loader';
import { Select } from '../../Shared/Select/Select';
import { useDownloadFunctions } from '../../../hook/customHooks/download';
import { progressBarSessionStorageHandler } from '../../../helpers/Utils';
import { SeasonWeekSelector } from '../../Shared/TreeSelectors/SeasonWeekSelector';
import { SuccessMessage } from '../../Shared/Messages/Messages';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { DropdownButtonGroup } from '../../Shared/ButtonGroup/ButtonGroup';

export const ScanByTeams = () => {
	
	const { scanDistribution: { loadScanDistribution, scanDistributions }} = useScanFunctions();
	const { showLoader } = useLoaderDispatch();
	const { account } = useAccountState();
	const { teamList,siteList } = account;
	const { downloadAllScansByTeam, downloadDetailedScanDistribution } = useDownloadFunctions();
  
	const { addBodyFilter, bodyFilter } = useBodyFilterParams(SCAN_DISTRIBUTION_BODY_FILTER, {
		startDate: moment().format(DATE_FORMATS.yearMonthDay),
		endDate: moment().format(DATE_FORMATS.yearMonthDay),
		teamIds: teamList.map(team => team.teamId),
		locations: siteList,
		status: 'ACT',
		type: null,
	});

	const [reset, setReset] = useState((bodyFilter?.date !== '' && Object.keys(bodyFilter.season || {}).length === 0)  ? 1 : 0);
	const [triggerProgresBar, setTriggerProgressBar] = useState<number>(0);

	const [trigger, setTrigger] = useState<number>(0);

	useEffect(() => {
		showLoader(true);
		loadScanDistribution(bodyFilter, () => {
			showLoader(false);
			setTrigger(prevState => {
				if(prevState % 2 === 0) {
					return prevState + 1;
				} else {
					return prevState + 2;
				}
			});
		}, () => {
			showLoader(false);
		});
	}, [bodyFilter, loadScanDistribution, showLoader])

	useEffect(() => {
		if(trigger % 2 === 1) {
			setTimeout(() => {
				setTrigger(prevState => prevState + 1);
			}, 100);
		}
	}, [trigger]);
	
	return (
		<div className="scan-dis-layout blue-scroll">
			<Filters
				leftOptions={[
					{
						display: (
							<Form.Item className='select-label-up'>
								<label className='label-select'> Activity</label>
			          <Select
									className="filters-selector"
				          style={{width: '125px'}}
				          value={bodyFilter?.type ?? ''}
				          size="small"
				          id={`eventType`}
				          onChange={(value) => {
				          	addBodyFilter({
						          type: value.length > 0 ? value : null
					          })
				          }}
				          options={[
					          {
					          	display: 'All',
						          value: ''
					          },
					          {
					          	display: 'Practice',
						          value: 'PRACTICE'
					          },
					          {
						          display: 'Game',
						          value: 'GAME'
					          },
				          ]}
			          />
							</Form.Item>
	          )
					},
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
									onChange={(a: any, b: any) => {
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
								disabled={((!bodyFilter?.startDate || !bodyFilter?.endDate) && 
									((bodyFilter?.season?.weekList?.length || 0) === 0 || Object.keys(bodyFilter?.season).length === 0)) ||
									((bodyFilter?.teamIds?.length || 0) === 0)
								}
								triggerProgressBar={triggerProgresBar}
								buttonArray={[
									{
										title: 'Download Totals',
										icon: <DownloadOutlined style={{ color: '#013369', marginRight: "8px" }} />,
										onClick: () => {
											ConfirmationModal('Download', 'Are you sure to download the report?', () => {
												downloadAllScansByTeam(bodyFilter, (res, httpResponse) => {
													let code = `${bodyFilter.startDate}-scans-distribution-by-team.csv`;
													if(!bodyFilter.startDate) {
														code = `${bodyFilter.season.season}-scans-distribution-by-team.csv`;
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
												downloadDetailedScanDistribution (bodyFilter, 'Team', (res, httpResponse) => {
													let code = `${bodyFilter.startDate}-scans-distribution-details-by-team.csv`;
													if(!bodyFilter.startDate) {
														code = `${bodyFilter.season.season}-scans-distribution-details-by-team.csv`;
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
				scanDistributions.length > 0 ? <ScanRender data={{
					key: 'main',
					children: scanDistributions.map((team: any) => ({
						header: <HeaderScanDistributionView
							img={<img src={`/images/teams/logos/${team.teamName}.svg`} width='40px' alt=''/>}
							title={`${team.teamName}`}
							fx9600={team.fx9600}
							mc33={team.mc33}
							manual={team.manual}
							total={team.total}
							equipmentList={team.equipmentAssignedList}
						/>,
						id: team.teamName,
						key: team.teamName,
						headerClassName: 'first-level-header ant-collapse',
						children: trigger % 2 === 0 ? team.scanDistributionList.map((distributionList: any) => {
							let type = distributionList.title;
							let activityType;
							if(type.indexOf('@') !== -1) {
								type = 'Game';
								activityType = ACTIVITY_TYPE.GAME;
							} else {
								type = 'Practice';
								activityType = ACTIVITY_TYPE.PRACTICE;
							}
							return {
								header: (
									<HeaderScanDistributionView
										img={<Icon.Activity type={activityType} width="20px" />}
										title={(
											<div className="second-level-title"> {type.toUpperCase()} {moment(distributionList.startGameDate).format(DATE_FORMATS.monthDayYearHourMin)} </div>
										)}
										fx9600={distributionList.fx9600}
										mc33={distributionList.mc33}
										manual={distributionList.manual}
										total={distributionList.players}
										equipmentList={distributionList.equipmentAssignedList}
										totalEquipmentList={team.equipmentAssignedList}
										tooltip={true}
									/>
								),
								id: `${moment(distributionList.startGameDate).format(DATE_FORMATS.yearMonthDayHourMin)}-${team.teamName}`,
								headerClassName: 'second-level-header sub-level-team', 
								body: <ScanTable sessionId={distributionList.sessionId} teamId={team.teamId} status={bodyFilter?.status}/>
							}
						}) : undefined
					})),
				}}/> : <Empty style={{background: 'white'}}/>
			}
		</div>
	)
}