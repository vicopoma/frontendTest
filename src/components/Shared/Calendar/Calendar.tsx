import React from 'react';
import { MonthCalendar } from './MonthCalendar';
import './Calendar.scss';

export const Calendar = () => {
  
  return (
    <MonthCalendar
      onChange={(values => {
      })}
      dataCellRender={(date, day) => (
        <>
          <div className="day-value">
            {day}
          </div>
          {
            <div className="day-content">
              <div className="bar-info success">
                <div className="info-team">
                  <img src="/images/teams/logos/ARZ.svg" alt=""/>
                  <span>REHAB</span>
                </div>
                <span>11:00</span>
              </div>
              <div className="bar-info cancel">
                <div className="info-team">
                  <img src="/images/teams/logos/ARZ.svg" alt=""/>
                  <span>SPRINT</span>
                </div>
                <span>11:00</span>
              </div>
              <div className="bar-info reset">
                <div className="info-team">
                  <span>ARI</span>
                  <img src="/images/teams/logos/ARZ.svg" alt=""/>
                  <span>-</span>
                  <img src="/images/dolphins-log.svg" alt=""/>
                  <span>ARI</span>
                </div>
                <span>11:00</span>
              </div>
              <div className="bar-info more">
                <div className="info-team">
                  <img src="/images/dots-01.svg" alt=""/>
                  <span>4 +</span>
                </div>
                <span>11:00</span>
              </div>
            </div>
          }
        </>
      )}
    />
  );
};
