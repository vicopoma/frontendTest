import React, { ReactNode, useState, useEffect } from 'react';
import './Table.scss';
import { Tooltip } from 'antd';
import { TableCell } from './TableCell';

export interface Columns {
  title: ReactNode,
  subTitle?: ReactNode,
  columnName?: string
  dataIndex: string,
  key: string // to use it with draggable select this option has to be unique.
  sorter?: boolean
  render?: (dataIndex: any, object: any, c: number, dataIndexName: string) => ReactNode
  defaultSortOrder?: string
  width?: number
  exactWidth?: number
  align?: 'left' | 'right' | 'center' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'end' | 'justify' | 'match-parent' | 'start',
  fixed?: 'left' | 'right',
  borderRight?: any,
  borderLeft?: any,
  children?: Array<Columns>,
  show?: boolean, //Column is going to be shown if show === undefined || show === true
  nonErasable?: boolean, // If a column cannot be deselect in draggable select
  hideTitle?: boolean,
}

export const Table = ({columns, sortParams, dataSource, onColumnChoice, onRowClick, noDataClassname}: {
  columns: Array<Columns>
  dataSource: Array<any>
  onColumnChoice?: (key: string, orderType: string) => void,
  onRowClick?: (data: any) => void,
  loading?: boolean
  noDataClassname?: string
  sortParams: Array<string>
}) => {
  
  const [columnSorted, setColumnSorted] = useState<string>(sortParams?.[0]);
  const [columnType, setColumnType] = useState<string | undefined>(sortParams?.[1]);

  useEffect(() => {
    setColumnSorted(sortParams?.[0]);
    setColumnType(sortParams?.[1]);
  }, [sortParams]);

  const svgColumnType = (columnType?: string) => {
    return columnType === 'asc' ? 'up' : 'down';
  };

  return (
    <>
      <table className="custom-table">
        <thead className="custom-table-thead">
        <tr>
          {
            columns.map((column, index) => (
              <th
                className={column?.fixed ? `fix-${column.fixed}` : ''}
                style={{
                  cursor: column?.sorter ? 'pointer' : 'auto',
                  background: columnSorted === column?.key && column.key?.length > 0 ? '#EFF7FC' : '',
                  width: column?.width ? column.width + '%' : 'auto',
                  zIndex: 3,
                }}
                key={index}
                onClick={() => {
                  if (onColumnChoice) {
                    if (column?.sorter) {
                      if (columnSorted === column.key) {
                        if (columnType === 'asc') {
                          setColumnType('desc');
                          onColumnChoice(columnSorted, 'desc');
                        } else {
                          setColumnType('asc');
                          onColumnChoice(columnSorted, 'asc');
                        }
                      } else {
                        setColumnSorted(column.key);
                        setColumnType('asc');
                        onColumnChoice(column.key, 'asc');
                      }
                    }
                  }
                }}
              >
              <div className='border-table'></div>
                {
                  column?.title && column.sorter ? (
                      <Tooltip
                        placement="topLeft"
                        title={`Click to sort ${columnSorted !== column.key || columnType === 'desc' ? 'ascend' : 'descend'}`}>
                        <table>
                          <tbody>
                          <tr style={{display: 'flex'}}>
                            <td>
                              <div>
                                {!column.hideTitle && column.title}
                              </div>
                              <div>
                                {column?.subTitle}
                              </div>
                            </td>
                            <td>
                              {
                                column?.title && column.sorter &&
                                <img
                                    src={`/images/sort-arrow-types/sort-table-${columnSorted === column.key ? svgColumnType(columnType) : 'gray'}.svg`}
                                    alt="" width="12px"/>
                              }
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </Tooltip>) :
                    (
                      <table>
                        <tbody>
                        <tr style={{display: 'flex'}}>
                          <td>
                            <div>
                              {!column.hideTitle && column.title}
                            </div>
                            <div>
                              {column?.subTitle}
                            </div>
                          </td>
                          <td>
                            {
                              column?.title && column.sorter &&
                              <img
                                  src={`/images/sort-arrow-types/sort-table-${columnSorted === column.key ? svgColumnType(columnType) : 'gray'}.svg`}
                                  alt="" width="12px"/>
                            }
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    )
                }
              </th>
            ))
          }
        </tr>
        </thead>
        {
          dataSource.length > 0 ? (
            <tbody className="custom-table-tbody">
            {
              dataSource.map((data, rowIndex) => {
                return (
                  <tr
                    key={rowIndex}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(data);
                      }
                    }}
                  >
                    {
                      columns.map((column, index) => (
                        <TableCell
                          key={index + rowIndex + ''}
                          columnSorted={columnSorted} 
                          column={column}
                          data={data}
                          index={index}
                          rowIndex={rowIndex}
                        />              
                      ))
                    }
                  </tr>
                );
              })
            }
            </tbody>
          ) : (
            <tbody key="nodata" className={noDataClassname ?? "no-data"}>
            <tr>
              <th style={{ height: '100%' }}>
                <img src="/images/nodata-icon-01.svg" alt="" width="100px"/>
              </th>
            </tr>
            </tbody>
          )
        }
      </table>
    </>
  );
};
