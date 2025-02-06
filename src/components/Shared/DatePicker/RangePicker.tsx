import { Button, Input, Tooltip } from 'antd';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker } from './DatePicker';
import './DatePicker.scss';

interface RangePickerProps {
  format?: string,
  onChange?: (range: [Moment, Moment]) => void,
  onOk?: (range: [Moment, Moment]) => void;
  validDates?: {
    startDate?: (startDate: Moment, endDate: Moment) => boolean,
    endDate?: (startDate: Moment, endDate: Moment) => boolean,
  }
  value?: [Moment, Moment],
  minuteInterval?: 1 | 5,
}

export const RangePicker = ({ format, onChange, onOk, validDates, value, minuteInterval = 1 } : RangePickerProps) => {
  const [dateRange, setDateRange] = useState<[Moment, Moment]>(value || [moment().startOf('day'), moment().endOf('day')]);
  const prevDateRange = useRef<[Moment, Moment]>(value || [moment().startOf('day'), moment().endOf('day')]);
  const [showTooltip, setShowTooltip] = useState<[boolean, boolean]>([false, false]);
  useEffect(() => {
    if (value) setDateRange(value);
  }, [setDateRange, value]);

  return (
    <div className="range-picker-container">
      <Button className="range-picker-button">
      <div style={{ display: 'flex' }}>
        <span>
          <Tooltip 
            placement="bottomLeft" 
            trigger={['click']} 
            overlayClassName="date-picker-tooltip" 
            onVisibleChange={e => {
              setShowTooltip([e, showTooltip[1]]);
              if(!e) {
                setDateRange(prevDateRange.current);
              }
            }}
            visible={showTooltip[0]}
            title={(
            <>
              <DatePicker 
                value={dateRange[0]}
                validDate={(date) => {
                  if(validDates?.startDate) {
                    return validDates?.startDate(date, dateRange[1]);
                  }
                  return true;
                }}
                minuteInterval={minuteInterval}
                onChange={date => {
                  setDateRange(prevState => {
                    if (date.isAfter(prevState[1])) {
                      onChange?.([date.clone(), date.clone().endOf('day')]);
                      if(onOk) {
                        return [date.clone(), date.clone().endOf('day')];
                      }
                      return value ?? [date.clone(), date.clone().endOf('day')];
                    }
                    if(validDates?.endDate && !validDates?.endDate(date, prevState[1])) {
                      onChange?.([date.clone(), date.clone().endOf('day')]);
                      if(onOk) {
                        return [date.clone(), date.clone().endOf('day')];
                      }
                      return value ?? [date.clone(), date.clone().endOf('day')];
                    }
                    onChange?.([date, prevState[1]]);
                    if(onOk) {
                      return [date, prevState[1]];
                    }
                    return value ?? [date, prevState[1]];
                  });
                }}
                onOk={() => {
                  prevDateRange.current = dateRange;
                  onOk?.(dateRange);
                  setShowTooltip([false, showTooltip[1]]);
                }}
              />
            </>
          )}>
            <div>
              <div>
                <label className="label-select">From</label>
                <Input className="date-input" value={dateRange[0].format(format ?? 'MM-DD-YYYY HH:mm')} />
              </div>
            </div>
          </Tooltip>
        </span>
        
        <span>
          <Tooltip 
            overlayClassName="date-picker-tooltip" 
            trigger={['click']} 
            onVisibleChange={e => {
              setShowTooltip([showTooltip[0], e]);
              if(!e) {
                setDateRange(prevDateRange.current);
              }
            }}
            visible={showTooltip[1]}
            title={(
            <DatePicker
            minuteInterval={minuteInterval} 
            onChange={date => {
              setDateRange(prevState => {
                if (date.isBefore(prevState[0])) {
                  onChange?.([date.clone(), date.clone()]);
                  if (onOk) {
                    return [date.clone(), date.clone()]; 
                  }
                  return value ?? [date.clone(), date.clone()];
                }
                onChange?.([prevState[0], date]);
                if(onOk) {
                  return [prevState[0], date];
                }
                return value ?? [prevState[0], date]
              });
            }}
            value={dateRange[1]}
            validDate={(date) => {
              if(date.isBefore(dateRange[0])) return false;
              if(validDates?.endDate) {
                return validDates?.endDate(dateRange[0], date);
              }
              return true;
            }}
            onOk={() => {
              prevDateRange.current = dateRange;
              onOk?.(dateRange);
              setShowTooltip([showTooltip[0], false]);
            }}
            />
          )}>
            <div>
              <label className="label-select">To</label>
              <Input className="date-input" value={dateRange[1].format(format ?? 'MM-DD-YYYY HH:mm')} />
            </div>
          </Tooltip>
        </span>
      </div>
      </Button>
    </div>
  )
}