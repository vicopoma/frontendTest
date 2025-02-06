import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import './DatePicker.scss';
import { datePickerFormat } from '../../../constants/constants';
import { SelectOptions } from '../Select/Select';
import { Button, Select } from 'antd';

interface CalendarStateType {
  month: number,
  year: number, 
}

enum DATE_STATE {
  PREV_MONTH,
  CUR_MONTH,
  NEXT_MONTH,
}


interface Date {
  numberDay: string,
  isSelected: boolean,
  state: DATE_STATE,
  today: boolean,
  date: Moment,
  isValid: boolean,
}

type PickerProps = {
  value?: Moment,
  onChange?: (date: Moment) => void,
  style?: CSSProperties,
  validDate?: (date: Moment) => boolean,
  onOk?: (date: Moment) => void,
  minuteInterval?: 1 | 5;
}

export const DatePicker = ({ onChange, onOk, style, value, validDate, minuteInterval = 1 } : PickerProps) => {
  const [calendarState, setCalendarState] = useState<CalendarStateType>({
    month: Number((value || moment()).format('MM')) - 1,
    year: Number((value || moment()).format('YYYY')),
  });
  const [dates, setDates] = useState<Array<Date>>([]);
  const [selectedDate, setSelectedDate] = useState<Moment>(value || moment());
  

  const minuteOptions: SelectOptions[] = Array(60 / minuteInterval).fill(1).map((_, index) => {
    return {
      display: `${index * minuteInterval < 10 ? '0' : ''}${index * minuteInterval}`,
      value: `${index * minuteInterval < 10 ? '0' : ''}${index * minuteInterval}`,
    }
  });
  const hourOptions: SelectOptions[] = Array(24).fill(1).map((_, index) => {
    return {
      display: `${index < 10 ? '0' : ''}${index}`,
      value: `${index < 10 ? '0' : ''}${index}`,
    }
  });

  const buildDates = useCallback(() => {
    let calendar: Array<Date> = [];
    let currentDate = moment(`${calendarState.month + 1}-01-${calendarState.year}`, datePickerFormat);
    let currentDay = currentDate.isoWeekday();
    while (currentDay > 0) {
      currentDate = currentDate.add(-1, 'days');
      currentDay--;
    }
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 7; ++j, currentDate = currentDate.add(1, 'days')) {
        const day = currentDate.format('DD');
        const month = (Number(currentDate.format('MM')) + 11) % 12;
        const prevNextMonth = month < calendarState.month ? DATE_STATE.PREV_MONTH : DATE_STATE.NEXT_MONTH;
        const dateState = month === calendarState.month ? DATE_STATE.CUR_MONTH : prevNextMonth;
        calendar.push({
          date: moment(currentDate.format(datePickerFormat), datePickerFormat),
          numberDay: day, 
          state: dateState, 
          isSelected: currentDate.isSame(selectedDate, 'day'), 
          today: false,
          isValid: validDate ? validDate(currentDate) : true,
        });
      }
    }
    setDates(calendar);
  }, [selectedDate, calendarState, setDates, validDate]);

  useEffect(() => {
    buildDates();
  }, [buildDates]);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCalendarState(() => ({
        month: Number(value.format('MM')) - 1,
        year: Number(value.format('YYYY')),
      }));
    }
  }, [value]);

  const daysName: Array<string> = [];
  for (let i = 0; i < 7; ++i) {
    daysName.push(moment(new Date()).startOf('week').isoWeekday(i).format('dddd').toUpperCase().substring(0, 2));
  }

  const updateMonth = (prevState: CalendarStateType, diffMonth: 1 | -1) => {
    const nextMonthVal = prevState.month + diffMonth;
    if(nextMonthVal > 11) {
      return { month: 0, year: prevState.year + 1 };
    } 
    if(nextMonthVal < 0) {
      return { month: 11, year: prevState.year - 1 };
    } 
    return { ...prevState, month: nextMonthVal };
  }

  const updateYear = (diffYear: 1 | -1) => {
    setCalendarState(prevState => {
      return { ...prevState, year: prevState.year + diffYear };
    });
  }

  return (
    <div>
    <div className="calendar-container">
      <div className="calendar">
        <div className="month">
          <div className="next-left">
            <span onClick={() => setCalendarState(prevState => updateMonth(prevState, -1))}>
              <img src="/images/calendar/next-month.svg" alt=""/>
            </span>
            <span onClick={() => updateYear(-1)}>
              <img src="/images/calendar/next-year.svg" alt=""/>
            </span>
          </div>
          <div className="month-name">
            {moment().month(calendarState.month).format('MMMM').toUpperCase()}
            <span className="year">{calendarState.year}</span>
          </div>
          <div className="next-right">
            <span onClick={() => setCalendarState(prevState => updateMonth(prevState, 1))}>
              <img src="/images/calendar/next-month.svg" alt=""/>
            </span>
            <span onClick={() => updateYear(1)}>
              <img src="/images/calendar/next-year.svg" alt=""/>
            </span>
          </div>
        </div>
        <div className="days">
          {
            daysName.map(day => (<span key={`${calendarState.month}-${day}`}>{day}</span>))
          }
        </div>
        <div className="dates">
          { 
            dates.map(day => (
              <div className="calendar-date">
                <button 
                  className={`${day.state !== DATE_STATE.CUR_MONTH ? 'day-out' : 'normal'} ${day.today ? 'today' : ''} ${day.isSelected && 'selected'} ${!day.isValid ? 'invalid-date' : 'valid-date'}`}
                  onClick={() => {
                    if (day.isValid) {
                      setSelectedDate(prevState => {
                        const hour = Number(prevState.format('HH'));
                        const minute = Number(prevState.format('mm'));
                        onChange?.(day.date.clone().hour(hour).minute(minute));
                        return value ?? day.date.clone().hour(hour).minute(minute);
                      });
                      setCalendarState({
                        month: Number(day.date.format('MM')) - 1,
                        year: Number(day.date.format('YYYY')),
                      });
                    }
                  }}
                >
                  <time>{day.numberDay}</time>
                </button>
              </div>
            )) 
          }
        </div>
      </div>
      <div className="time-set-foot">
        <img src="time-set.svg" alt="" />
        <div>
          <Select 
            options={hourOptions} 
            dropdownStyle={{
              zIndex: 2000,
            }}
            style={{
              width: '65px',
            }}
            onChange={e => {
              const hour = Number(e);
              setSelectedDate(prevState => {
                if(hour > 24) return prevState;
                onChange?.(prevState.clone().hour(hour));
                return value ?? prevState.clone().hour(hour);
              });
            }}
            value={selectedDate.format('HH')}
          />
        </div>
        <span style={{ color: 'black' }}>:</span>
        <div>
          <Select 
            options={minuteOptions} 
            dropdownStyle={{
              zIndex: 2000,
            }}
            onChange={e => {
              const minute = Number(e);
              setSelectedDate(prevState => {
                if(minute > 60) return prevState;
                onChange?.(prevState.clone().minute(minute));
                return value ?? prevState.clone().minute(minute);
              });
            }} 
            style={{
              width: '65px',
            }}
            value={selectedDate.format('mm')}
          />
        </div>
        {onOk && <Button 
          className="btn-blue-antd"
          style={{ marginLeft: '15px' }}
          onClick={() => onOk(selectedDate)}
        >
          OK
        </Button>}
      </div>    
    </div>
    </div>
  )
}