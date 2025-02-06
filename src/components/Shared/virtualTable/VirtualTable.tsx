import React from 'react';
import { Spin } from 'antd';
// @ts-ignore
import { InfinityTable as Table } from 'antd-table-infinity';
import { DataSource, VirtualElementTable } from '../../../constants/interfaceTable';
import 'antd-table-infinity/index.css';

export default ({dataSource, loading, columns, y, onRow, onChange, handleFetch}: VirtualElementTable) => {
  
  const loadMoreContent = () => (
    <div>
      <Spin tip="Loading..."/>
    </div>
  );
  
  return (
    <>
      {
        dataSource.length > 0 &&
        <Table
            onRow={(r: DataSource) => ({
              onClick: () => onRow ? onRow() : ('########')
            })}
            rowKey={(record: DataSource) => record?.id}
            loading={loading}
            onFetch={handleFetch}
            pageSize={100}
            loadingIndicator={loadMoreContent()}
            columns={columns}
            scroll={{x: 1000, y: y}}
            dataSource={dataSource}
            bordered
            debug
            onChange={onChange}
        />
      }
    </>
  );
}
