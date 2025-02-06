import React, { useState } from 'react';
import { Checkbox, Col, Input, Row } from 'antd';
import './CheckBox.scss';

export const CheckBoxGroup = ({
                                data,
                                onChange,
                                columnsNumber,
                                search
                              }: {
  data: Array<{ key: string, value: string }>,
  onChange: (list: Array<any>) => void,
  columnsNumber?: number
  search?: boolean
}) => {
  
  const allList = data.map(objects => objects.key);
  const [checkedList, setCheckList] = useState<Array<any>>(allList);
  const [checkAll, setCheckAll] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  
  const updateList = async (id: string, checked: boolean) => {
    if (!checked) {
      return checkedList.filter(data => data !== id);
    } else {
      return [...checkedList, id];
    }
  };
  
  return <>
    <div className="filter-checkbox">
      {
        search && <Input
            id="eSearch"
            style={{marginBottom: '15px'}}
            placeholder="Search..."
            onChange={(value) => {
              setSearchValue(value.target.value);
            }}
        />
      }
      {
        data.length > 0 && (
          <Checkbox
            style={{marginBottom: '15px'}}
            onChange={e => {
              setCheckAll(e.target.checked);
              setCheckList(e.target.checked ? allList : []);
              onChange(e.target.checked ? allList : []);
            }} checked={checkAll}>
            All
          </Checkbox>
        )
      }
      <Row>
        {
          data.map((objectData, index) => (
            (objectData.value.toLowerCase().includes(searchValue.toLowerCase())) &&
            <Col className="checkbox-group-equip" span={!!columnsNumber ? 24 / columnsNumber : 24}
                 style={{marginBottom: '6px'}}>
                <Checkbox
                    checked={(checkedList.filter(data => data === objectData.key).length > 0)}
                    value={objectData.key}
                    onChange={(e) => {
                      updateList(e.target.value, e.target.checked).then(values => {
                        setCheckList(values);
                        setCheckAll(values.length === allList.length);
                        onChange(values);
                      });
                    }}
                > {objectData.value} </Checkbox>
            </Col>
          ))
        }
      </Row>
    </div>
  
  </>;
};
