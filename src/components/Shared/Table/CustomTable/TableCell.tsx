import { Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Columns } from './Table';

export interface TableCellProps {
  columnSorted: string,
  column: Columns,
  data: any,
  index: number,
  rowIndex: number,
}                                                                                                                                                                                                      

export const TableCell = ({ columnSorted, column, data, index, rowIndex }: TableCellProps) => {
  const cellRef = useRef<any>(null);
  const [needTooltip, setNeedTooltip] = useState<boolean>(false);

  const cellStyle = {
    background: columnSorted === column.key && column.key?.length > 0 ? '#EFF7FC' : '',
    textAlign: column?.align ? column.align : 'left',
    borderLeftStyle: column?.borderLeft ? column.borderLeft : '',
    borderRightStyle: column?.borderRight ? column.borderRight : ''
  }
  
  useEffect(() => {
    if(cellRef.current && data) {
      setNeedTooltip(() => cellRef.current?.scrollWidth > cellRef.current?.clientWidth);
    }
  }, [data, setNeedTooltip]);

  return (
    <td
      className={column?.fixed ? `fix-${column.fixed}` : ''}
      key={index}
      style={column?.exactWidth ? {
        ...cellStyle,
        maxWidth: column?.exactWidth ? column.exactWidth : 'auto',
        minWidth: column?.exactWidth ? column.exactWidth : 'auto',
      } : {
        ...cellStyle,
        width: column?.width ? column.width + '%' : 'auto',
      }}
    >
      {
        column?.render ? <> {column.render(data[column?.dataIndex], data, rowIndex, column?.dataIndex)}</>
          : column?.dataIndex && <div className='cut-text' ref={(e) => { cellRef.current = e }}>
            {needTooltip ? 
              <Tooltip  placement='topLeft' title={data[column?.dataIndex]}>{data[column?.dataIndex]}</Tooltip> : 
              <>{data[column?.dataIndex]}</>
            }
            
          </div>
        }
    </td>
  )
}
