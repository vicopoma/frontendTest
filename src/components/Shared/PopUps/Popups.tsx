import React from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

export const ConfirmationPopUp = ({className, children, onText, cancelText, title, onConfirm}: {
  className?: string,
  children: JSX.Element
  onText: string,
  cancelText: string,
  title: string,
  onConfirm: any,
}) => {
  return (
    <Popconfirm
      title={title}
      icon={<ExclamationCircleOutlined/>}
      okText={onText}
      cancelText={cancelText}
      overlayClassName={className}
      onConfirm={onConfirm}
    >
      {children}
    </Popconfirm>
  );
};
