import React from 'react';
import { RangePicker } from '../Shared/DatePicker/RangePicker';
import { Form } from 'antd';

export const Test = () => {
  return (
    <Form.Item className='select-label-up'>
      <RangePicker 
        validDates={{
          endDate: (startDate, endDate) => {
            return endDate.diff(startDate, 'weeks') === 0;
          }
        }}
        // value={dateRange} 
      />
    </Form.Item>
  )
}
