import React, { useState } from 'react';
import { notification } from 'antd';

export const NotificationBody = ({description}: { description: string }) => {
  const [checkShowDetail, setCheckShowDetail] = useState(false);
  const showDetails = () => {
    setCheckShowDetail(!checkShowDetail);
  };
  return (
    <div>
      <p onClick={showDetails}>show details</p>
      <br/>
      {checkShowDetail && <p>{description}</p>}
    </div>
  );
};

export const WarningNotification = ({title, description}: { title: string, description: string }) => {
  const descriptionMessage = description.split('|');
  if (descriptionMessage[0]?.trim() === 'D101') {
    description = descriptionMessage[1];
  }
  notification.warning({
    message: `Warning - ${title}`,
    description: <NotificationBody description={description}/>
  });
};

export const ErrorNotification = ({title, description}: { title: string, description: string }) => {
  notification.error({
    message: `Error - ${title}`,
    description: <NotificationBody description={description}/>
  });
};

export const OpenNotification = ({title, description, style, className, icon}: {
  title: React.ReactNode,
  description: React.ReactNode,
  style?: React.CSSProperties,
  className?: string,
  icon?: React.ReactNode
}) => {
  notification.open({
    icon,
    message: title,
    description: description,
    style,
    className,
    duration: 0,
  });
};
