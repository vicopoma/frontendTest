import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Button, Form, Select } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { DATE_FORMATS, datePickerFormat } from '../../../constants/constants';
import './Calendar.scss';
import { MONTHS, YEARS } from './Constants';
import { TableLoader } from '../TableLoader/TableLoader';

interface DayCell {
  opacity: string,
  children: ReactNode,
  date: moment.Moment
}

interface Month {
  month: number,
  year: number,
}

export const MonthCalendar = ({defaultValue, dataCellRender, onChange, filters, loading}: {
  defaultValue?: Month
  dataCellRender: (date: moment.Moment, day: string, dateString: string) => ReactNode,
  onChange?: (values: Month) => void,
  filters?: Array<{ query: string, display: JSX.Element }>
  loading?: boolean
}) => {
  
  const daysName: Array<string> = [];
  const [data, setData] = useState<Array<Array<DayCell>>>([]);
  const [values, setValues] = useState<Month>(defaultValue ?
    defaultValue :
    {
      year: moment(new Date()).year(),
      month: moment(new Date()).month() + 1
    });
  
  const updateCalendar = (nValues: Month) => {
    if (onChange) {
      onChange(nValues);
    }
  };
  
  const goToNextMonth = () => {
    setValues(prevState => {
      if (prevState.month + 1 <= 12) {
        updateCalendar({
          ...prevState,
          month: prevState.month + 1,
        });
        return {
          ...prevState,
          month: prevState.month + 1,
        };
      }
      updateCalendar({
        ...prevState,
        month: 1,
        year: prevState.year + 1
      });
      
      return {
        ...prevState,
        month: 1,
        year: prevState.year + 1
      };
    });
  };
  
  const goToLastMonth = () => {
    setValues(prevState => {
      if (prevState.month > 1) {
        updateCalendar({
          ...prevState,
          month: prevState.month - 1,
        });
        return {
          ...prevState,
          month: prevState.month - 1,
        };
      }
      
      updateCalendar({
        ...prevState,
        month: 12,
        year: prevState.year - 1
      });
      
      return {
        ...prevState,
        month: 12,
        year: prevState.year - 1
      };
    });
  };
  
  for (let i = 0; i < 7; ++i) {
    daysName.push(moment(new Date()).startOf('week').isoWeekday(i).format('dddd').toUpperCase().substring(0, 3));
  }
  
  const initialDate = moment(`${values.month}-01-${values.year}`, datePickerFormat);
  
  const searchData = useCallback(() => {
    let calendar: Array<Array<DayCell>> = [];
    let currentDate = moment(`${values.month}-01-${values.year}`, datePickerFormat);
    let currentDay = currentDate.isoWeekday();
    
    while (currentDay > 0) {
      currentDate = currentDate.add(-1, 'days');
      currentDay--;
    }
    
    for (let i = 0; i < 6; ++i) {
      let week: Array<DayCell> = [];
      for (let j = 0; j < 7; ++j, currentDate = currentDate.add(1, 'days')) {
        const day = dataCellRender(currentDate, currentDate.format('DD'), currentDate.format(DATE_FORMATS.monthDayYear));
        week.push({
          opacity: (currentDate.month() + 1 === values.month ? '1' : '0.5'),
          children: day,
          date: moment(currentDate.format(datePickerFormat), datePickerFormat)
        });
      }
      calendar.push(week);
    }
    setData(calendar);
  }, [values.month, values.year, dataCellRender]);
  
  useEffect(() => {
    searchData();
  }, [searchData]);
  
  const years = YEARS();
  
  return (
    <>
      {
        loading && <TableLoader/>
      }
      <div className="calendar-vl">
        <div className="calendar-filter btn-header" style={{borderBottom: 'none'}}>
          <Form.Item className='select-label-up'>
            <Button
              size="small"
              type="default"
              icon={<ArrowLeftOutlined/>}
              onClick={goToLastMonth}
              style={{ height: "47px", marginTop: "4px" }}
            />
          </Form.Item>
          <Form.Item className='select-label-up'>
            <label className='label-select'>Month</label>
            <Select
              value={values.month}
              style={{width: '120px', height: '24px'}}
              className="filters-selector"
              size="small"
              onChange={(e) => {
                const value = e + '';
                setValues(values => {
                  return {
                    ...values,
                    month: +value
                  };
                });
                
                updateCalendar({
                  month: +value,
                  year: values.year
                });
              }}
            >
              {
                MONTHS.map((month, index) => (
                  <Select.Option key={index} value={index + 1}> {month}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item className='select-label-up'>
            <Button
              size="small"
              type="default"
              icon={<ArrowRightOutlined/>}
              style={{marginRight: '6px', height: "47px",marginTop: "4px"}}
              onClick={goToNextMonth}
            />
          </Form.Item>
          <Form.Item className='select-label-up'>
            <label className='label-select'>Year</label>
          <Select
            size="small"
            value={values.year}
            style={{width: '100px', height: '24px', marginRight: '15px'}}
            className="filters-selector"
            onChange={(value) => {
              setValues(values => {
                return {
                  ...values,
                  year: +value
                };
              });
              
              updateCalendar({
                year: +value,
                month: values.month
              });
            }}
          >
            {
              years.map((year, index) => (
                <Select.Option key={index} value={year}> {year} </Select.Option>
              ))
            }
          </Select>
          </Form.Item>
          {
            filters?.map((obj, index) => (
              <span key={index} style={{marginRight: '8px'}}> {obj.display}</span>
            ))
          }
        </div>
        <div className="calendar-body">
          <table className="calendar-content">
            <thead>
            <tr>
              {
                daysName.map((day, index) => (
                  <th
                    key={index}>
                    {day}
                  </th>
                ))
              }
            </tr>
            </thead>
            <tbody>
            {
              data.map((week, indexMonth) => (
                <tr key={indexMonth}>
                  {
                    week.map((day, indexDay) => {
                      return (
                        <td key={indexDay} style={{opacity: day.opacity}} className="calendar-day">
                          <div
                            className="container-day"
                            style={{
                              borderColor: day.date.format(datePickerFormat) === moment(new Date()).format(datePickerFormat) ? '#013369' : '',
                              opacity: day.date.format(datePickerFormat) === moment(new Date()).format(datePickerFormat) ? '1' : ''
                            }}
                            onClick={() => {
                              if (day.date.month() !== initialDate.month()) {
                                if (day.date < initialDate) {
                                  goToLastMonth();
                                } else {
                                  goToNextMonth();
                                }
                              }
                            }}
                          >
                            {day.children}
                            {
                              //initialDate.month() === day.date.month() && initialDate.date() === day.date.date() &&
                              day.date.date() === 1 &&
                              <footer className="footer-month">
                                {MONTHS[day.date.month()]}
                              </footer>
                            }
                          </div>
                        </td>
                      );
                    })
                  }
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
