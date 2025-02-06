import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { Table, Tabs } from 'antd';

const SOCKET_URL = process.env.REACT_APP_API_SOCKET;

const columns = [
  {
    title: '#',
    dataIndex: 'index',
    id: 'index',
    render: (a: any, b: any, index: number) => {
      // (a,b, index);
      return <div> {index} </div>;
    }
  },
  {
    title: 'eventTime',
    dataIndex: 'eventTime',
    id: 'eventTime',
  },
  {
    title: 'eventTrigger',
    dataIndex: 'eventTrigger',
    id: 'eventTrigger'
  },
  {
    title: 'eventType',
    dataIndex: 'eventType',
    id: 'eventType'
  },
  {
    title: 'tenant',
    dataIndex: 'tenant',
    id: 'tenant'
  },
  {
    title: 'version',
    dataIndex: 'version',
    id: 'version'
  },

];

const columns2 = [
  {
    title: 'battery',
    dataIndex: 'battery',
    id: 'battery',
  },
  {
    title: 'date',
    dataIndex: 'date',
    id: 'date'
  },
  {
    title: 'extendedId',
    dataIndex: 'extendedId',
    id: 'extendedId'
  },
  {
    title: 'barcode',
    dataIndex: 'source',
    id: 'source'
  },
  {
    title: 'status',
    dataIndex: 'status',
    id: 'status'
  },
  {
    title: 'id',
    dataIndex: 'id',
    id: 'id'
  }
];

export const ConfigScanner = () => {
  
  const [test, setTest] = useState<any>({});
  const [data, setData] = useState<Array<any>>([]);
  
  
  const [test2, setTest2] = useState<any>({});
  const [data2, setData2] = useState<Array<any>>([]);
  
  useEffect(() => {
    const client = new Client();
    client.configure({
      brokerURL: SOCKET_URL,
      onConnect: () => {
        client.subscribe('/api/topic/public', message => {
          const result = JSON.parse(message.body);
          const msg = JSON.parse(result?.message);
          setTest(msg.header);
        });
        
        client.subscribe('/api/desktop', message => {
          const res = JSON.parse(message?.body);
          setTest2(res?.listKafka[0]?.tag);
        });
      },
      debug: (str) => {
        // (new Date(), str);
      }
    });
    client.activate();
  }, []);
  
  useEffect(() => {
    setData(data => [...data, test]);
  }, [test]);
  
  useEffect(() => {
    setData2(data2 => [...data2, test2]);
  }, [test2]);
  
  
  const {TabPane} = Tabs;
  return (
    <div className="card-container">
      <div className="btn-activity">
      </div>
      <Tabs type="card">
        <TabPane key="1" tab={<span><img src="/images/icon-03.svg" alt="" width="18px"/> FX9600 </span>}>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="date"
          />
        </TabPane>
        <TabPane key="2" tab={<span><img src="/images/icon-03.svg" alt="" width="18px"/> DS9908R </span>}>
          <Table
            dataSource={data2}
            columns={columns2}
            rowKey="date"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

