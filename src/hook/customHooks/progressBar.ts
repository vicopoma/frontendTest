import { useCallback, useEffect, useState } from 'react';
import { API } from '../../settings/server.config';
import { ProgressBar } from '../../Types/Types';
import { ResponseListType, useListFetch } from './fetchs';
import { useAccountDispatch, useAccountState } from '../hooks/account';
import { PROGRESS_BAR_STATUS, PROGRESS_BAR_TYPES, SESSION_STORAGE } from '../../constants/constants';
import { downloadCsv } from '../../helpers/Utils';
import { SuccessMessage, WarningMessage } from '../../components/Shared/Messages/Messages';

const url = API.PROGRESS_BAR.BASE();

export const useProgressBarFunctions = () => {
	const {
		loadList: loadProgressBarData,
		values: progressBarData,
		status
	} = useListFetch<{ [key: string]: ProgressBar }>({url});
	return {
		progressBarData: {
			loadProgressBarData: useCallback((callBack: ResponseListType<{ [key: string]: ProgressBar }>) => {
			loadProgressBarData(API.PROGRESS_BAR.PROCESS(),
					(res, httpResponse) => {
						callBack(res, httpResponse);
					});
			}, [loadProgressBarData]),
			progressBarData,
			status
		}
	};
};

export const useProgressBarStatus = () => {
	const { account } = useAccountState();
	
	const {updateNotifications} = useAccountDispatch();
	const {progressBarData: {loadProgressBarData}} = useProgressBarFunctions();
	const [progressBarArray, setProgressBarArray] = useState<Array<{ [key: string]: ProgressBar }>>([]);
	const [pendingStatus, setPendingStatus] = useState<Set<{ code: string, key: string }>>(new Set());
	const [recentFinishedStatus, setRecentFinishedStatus] = useState<Set<{ code: string, key: string, fileName: string }>>(new Set());
	const [pulling, setPulling] = useState<number>(0);
	
	const updateProgressBar = useCallback((addNotification: boolean = true) => {
		if (addNotification) {
			updateNotifications(addNotification);
		}
		if(!!account?.role?.id) {
			loadProgressBarData((res) => {
				setProgressBarArray(res);
			});
		}
	}, [loadProgressBarData, updateNotifications, account?.role?.id]);
	
	useEffect(() => {
		const currentPending: Set<{ code: string, key: string, fileName: string }> = new Set();
		const currentFinished: Set<{ code: string, key: string, fileName: string }> = new Set();
		setPendingStatus(() => {
			const newPendingStatus = progressBarArray?.filter((data) => {
				const current = Object.keys(data).filter((key) => {
					if (data[key]?.percentage < 100 && data[key]?.status !== PROGRESS_BAR_STATUS.ERROR) {
						if(data[key].extra) {
							currentPending.add({ code: data[key].extra.fileName, key: key, fileName: data[key].extra.fileNameDownload });
						} else {
							currentPending.add({ code: data[key].fileName, key: key, fileName: data[key].fileNameDownload });
						}
					} else {
						if(data[key]?.status !== PROGRESS_BAR_STATUS.ERROR) {
							const waitingValues: Array<{ code: string, key: string }> = JSON.parse(localStorage.getItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD) || '[]');
							const  waitingValuesUpdated = waitingValues.filter(item => {
								if(item.key === key) {
									if(data[key]?.messageObservation) {
										WarningMessage({ description: data[key]?.messageObservation })
										return false;
									} else {
										if(data[key].extra) {
											currentFinished.add({ ...item, fileName: data[key].extra.fileNameDownload});
										} else {
											currentFinished.add({ ...item, fileName: data[key].fileNameDownload});
										}
										
									}
								}
								return true;
							});
							localStorage.setItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD, JSON.stringify(waitingValuesUpdated));
						}
					}
					return data[key]?.percentage < 100 && data[key]?.status !== PROGRESS_BAR_STATUS.ERROR;
				});
				return current.length > 0;
			});

			if (newPendingStatus.length > 0) {
				setTimeout(() => {
					setPulling(pulling => pulling + 1);
				}, 1000);
			}
			if(currentFinished.size > 0) {
				setRecentFinishedStatus(currentFinished);
			}
			return currentPending;
		});
	}, [progressBarArray]);
	
	useEffect(() => {
		updateProgressBar(false);
	}, [pulling, updateProgressBar]);
	
	useEffect(() => {
		const waitingValues: Array<{ code: string, key: string }> = JSON.parse(localStorage.getItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD) || '[]');
		recentFinishedStatus.forEach(key => {
			let includeKey = false;
			waitingValues.forEach(item => {
				if(item.key === key.key) {
					includeKey = true;
				}
			})
			if (key.code.includes('.csv', 0) && includeKey) {
				const deleteValue = waitingValues.filter(values => values.key !== key.key);
				localStorage.setItem(SESSION_STORAGE.ACTIVITY_DOWNLOAD, JSON.stringify(deleteValue));
				downloadCsv(key.fileName, [API.DOWNLOAD.BASE(), API.DOWNLOAD.ALL_SCANS_FILE()].join(''), 'POST', {
					fileName: key.fileName,
					type: PROGRESS_BAR_TYPES.EXPORT_SCAN_ALL
				}, 'application/json', () => {
				 	SuccessMessage({description: 'Your file has been downloaded'});
				});
			}
		});
	}, [recentFinishedStatus]);
	
	return {
		updateProgressBar,
		progressBarArray,
		recentFinishedStatus,
		pendingStatus,
		recentlyFinished: useCallback((id: string) => {
			return true;
		}, [recentFinishedStatus])
	};
};