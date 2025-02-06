import React, { useEffect } from 'react';
import { Button, Divider } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './Mobile.scss';
import { ROUTES } from '../../settings/routes';
import { useAccountDispatch, useAccountState } from '../../hook/hooks/account';

export const Mobile = ({type}: { type: string }) => {
  const {getInformationApk} = useAccountDispatch();
  const {mobile} = useAccountState();
  useEffect(() => {
    getInformationApk();
  }, [getInformationApk]);
  const random = crypto.getRandomValues(new Uint32Array(1))[0];
  return (
    <>
      <div className={`${type === ROUTES.PARAMS.HOME ? 'download-app-version-home' : 'download-app-version'}`}>
        {
          type !== ROUTES.PARAMS.HOME && <Divider><InfoCircleFilled/> Are you using a mobile device?</Divider>
        }
        <p>For a better experience we recommend download the mobile version</p>
        <Button
          type="primary"
          className="btn-bl-zebra-border"
          block
          icon={<img className="img-h" src="/images/logo-zebra-black.svg" alt="" height="100%"/>}
          href={`${process.env.REACT_APP_API_URI}/mobile/download-apk?ts=${random}`}
        >
        </Button>
        <div className="version-apk">
          <span className={`${type === ROUTES.PARAMS.HOME ? 'font-white' : 'font-blue'}`}>
           Version {mobile?.versionName}
          </span>
        </div>
        {/* <div className="version-apk">
          <span className={`${type === ROUTES.PARAMS.HOME ? 'font-white' : 'font-blue'}`}>
           Version Code {mobile.versionCode}
          </span>
        </div> */}
      </div>
    </>
  );
};


