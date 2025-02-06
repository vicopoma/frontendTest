import React, { ReactNode } from 'react';
import './Table.scss';

export const Tooltip = ({children, title}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div className="tooltip">
      <div className="tooltip-arrow"/>
      <div title={title} className="tooltip-inner"> {children} </div>
    </div>
  );
};
