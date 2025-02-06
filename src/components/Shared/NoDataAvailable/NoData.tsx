import React from 'react';
import './NoData.scss';

export const NoData = ({logoWidth}: {
  logoWidth?: string
}) => {
  return (
    <div className="no-data">
      <img src="/images/nodata-icon-01.svg" width={logoWidth ? logoWidth : '100px'} alt=""/>
    </div>
  );
};