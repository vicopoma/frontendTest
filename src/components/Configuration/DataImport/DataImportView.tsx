import React, { useState } from 'react';
import { Tabs } from 'antd';
import { Layout } from 'antd/es';
import { ManualDataImport } from './ManualDataImport';
import { IMPORT_DATA } from '../../../constants/constants';
import { ImportResultView } from './ImportResultView';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';

export const DataImport = () => {  
  const [currentKey, setCurrentKey] = useState<string>(IMPORT_DATA.RESULT);

  return (
    <Layout>
      <div className="card-container blue-scroll">
        <NavigationBar
          navTitle={
            <div className="navigationbar-header-configuration">
              <span className="navigation-bar-configuration">Import / Export Data </span>
            </div>
          }
        />
        <Tabs
          className="activity-tabs"
          type="card"
          activeKey={currentKey}
          onChange={(key) => {
            setCurrentKey(key);
          }}
          destroyInactiveTabPane
        >
          <Tabs.TabPane key={IMPORT_DATA.RESULT} tab="Results">
            <ImportResultView/>
          </Tabs.TabPane>
          <Tabs.TabPane key={IMPORT_DATA.IMPORT} tab="Manual Import">
            <ManualDataImport />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};
