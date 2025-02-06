import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useNotificationContext } from '../../../context/notifications';

export const LoaderButton = ({
  children,
  onClick,
  className,
  icon,
  shape,
  style,
  htmlType,
  type,
  id,
  size,
  disable,
  loading,
  triggerProgressBar,
}: {
  className?: string,
  children?: ReactNode,
  onClick: Function,
  icon?: ReactNode,
  style?: CSSProperties,
  shape?: any,
  htmlType?: any,
  type?: any
  id?: any
  size?: any
  disable?: boolean,
  loading?: boolean,
  triggerProgressBar?: number,
}) => {

  const fetch = async () => {
    await onClick();
  };

  const [loader, setLoader] = useState<boolean>(false);
  const [disabler, setDisabler] = useState<boolean>(false);
  const [timeDisabler, setTimeDisabler] = useState<boolean>(false);

  const { updateProgressBar } = useNotificationContext();

  const timerDisable = () => {
    setTimeout(() => setTimeDisabler(false), 1000);
  };

  useEffect(() => {
    if(triggerProgressBar && triggerProgressBar > 0) {
      updateProgressBar();
    }
  }, [triggerProgressBar]);

  return (
    <Button
      id={id}
      className={className}
      disabled={disabler || timeDisabler || disable}
      loading={loader || loading}
      icon={loader && (icon ? icon : <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />)}
      shape={shape}
      style={style}
      htmlType={htmlType}
      type={type}
      size={size}
      onClick={() => {
        setLoader(true);
        setDisabler(true);
        setTimeDisabler(true);
        fetch()
          .then(() => {
            setLoader(false);
            setDisabler(false);
            timerDisable();
          });
      }}
    >
      {children}
    </Button>
  );
};
