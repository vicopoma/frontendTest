import React, { useEffect, useState } from 'react';
import { ActivityType, EMPTY_OBJECT } from '../../../../constants/constants';
import { paramBuilder } from '../../../../helpers/Utils';
import { useObjectFetch } from '../../../../hook/customHooks/fetchs';
import { API } from '../../../../settings/server.config';
import Icon from '../../../Shared/CommomIcons/Icons';
import './HistoryHeader.scss';

interface HeaderViewProps {
  activityType: ActivityType,
  defaultFiltersObject: any,
}

export const HistoryHeader = ({ activityType, defaultFiltersObject } : HeaderViewProps) => {
  const [params, setParams] = useState<string>('');
  const url = [API.SCANNER.SCAN_BASE(), API.SCANNER.SESSION_HISTORY()].join('');
  const { values, loadObject: getHistory } = useObjectFetch<any>({ url, defaultValue: EMPTY_OBJECT });

  useEffect(() => {
    if (Object.keys(defaultFiltersObject).length > 0) {
      setParams(paramBuilder(defaultFiltersObject));
    }
  }, [defaultFiltersObject]);

  useEffect(() => {
    if(params) getHistory(params);
  }, [activityType, getHistory, params]);

  return ( 
    <div className="history-section">
      <div className="img-section">
        <span>
          <Icon.Activity type={activityType} width="20px" />
        </span>
        
      </div>
      <div className="activity-count">
        {values?.totalElements}
      </div>
      <div className="team-name header-label-team">
        {activityType.toUpperCase() + 'S'}
      </div>
    </div>
  )
}