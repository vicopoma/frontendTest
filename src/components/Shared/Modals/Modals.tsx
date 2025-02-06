import React from 'react';
import { Modal } from 'antd';
import { CloseCircleFilled, WarningTwoTone } from '@ant-design/icons';

import './Modal.scss';

export const ConfirmationModal = (title: React.ReactNode, description: React.ReactNode, onOk: Function) => {
  Modal.confirm({
    className: 'modal-confirmation-drawer',
    icon: <WarningTwoTone twoToneColor="#ff9200"/>,
    title: title,
    centered: (true),
    content: (
      <div>
        {description}
      </div>
    ),
    onOk() {
      onOk();
    },
    onCancel() {
    },
    okText: 'Yes',
    cancelText: 'No, Cancel',
    okButtonProps: {
      id: 'mCOk',
    }
  });
};

export const WarningModal = (title: string, description: string) => {
  Modal.warning({
    title: title,
    centered: (true),
    content: (
      <div>
        {description}
      </div>
    )
  });
};

export const ErrorModal = (title: string, description: string) => {
  Modal.error({
    icon: <CloseCircleFilled/>,
    className: 'error-modal',
    title: title,
    centered: (true),
    content: (
      <div>
        {description}
      </div>
    )
  });
};
