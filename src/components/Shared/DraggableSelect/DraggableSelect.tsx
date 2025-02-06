import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { Checkbox } from 'antd';

import './Draggable.scss';
import { useArraySelector, useOnClickOutSideHandler } from '../../../hook/customHooks/customHooks';
import { Columns } from '../Table/CustomTable/Table';

export interface Card {
  title: ReactNode,
  id: string,
  key: string,
  dataIndex?: string,
  persistent?: boolean,
}

export const DraggableSelect = ({data, title, onChange, chosenValues, defaultSortOrderById}: {
  title: string,
  data: Array<Columns>,
  onChange?: (items: Array<Card>, selectedValues: Array<string>) => void,
  chosenValues?: Array<any>,
  defaultSortOrderById?: Array<any>
}) => {
  
  const [columns, setColumns] = useState<Array<Card>>([]);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  
  const checked = useMemo(() => {
    return (chosenValues ? chosenValues : data).map((column) => column?.key);
  }, [chosenValues, data]);
  
  const totalValues = useMemo(() => {
    return data.map((column) => column?.key);
  }, [data]);

  const nonErasableValues = useMemo(() => {
    return data.filter(column => column?.nonErasable)
      .map(column => column?.key);
  }, [data]);
  
  const {add, erase, has, size, addAll, eraseAll, value} = useArraySelector({
    initialValues: checked,
    totalDefaultValues: totalValues,
    nonErasableValues: nonErasableValues,
  });
  
  useEffect(() => {
    const currentColumns: Array<Card> = [];
    if (defaultSortOrderById) {
      defaultSortOrderById.forEach((column) => {
        currentColumns.push({
          id: column?.key,
          key: column?.key,
          title: column.title,
          persistent: column?.nonErasable,
        });
      });
    } else {
      data.forEach((column, index) => {
        currentColumns.push({
          id: column?.key,
          key: column?.key,
          title: column?.title,
          persistent: column?.nonErasable,
        });
      });
    }
    setColumns(currentColumns);
  }, [data, defaultSortOrderById]);
  
  const getItemStyle = (isDragging: boolean, draggableStyle: any): React.CSSProperties => ({
    userSelect: 'none',
    background: isDragging ? '#013369' : 'white',
    color: isDragging ? 'white' : '',
    fontWeight: 'bold',
    ...draggableStyle
  });
  
  const getListStyle = (isDraggingOver: boolean) => ({});
  
  const reorder = (list: Array<Card>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    return result;
  };
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      columns,
      result.source.index,
      result.destination.index
    );
    setColumns(items);
    if (onChange) {
      onChange(items, value);
    }
  };
  
  
  const dropDown = useRef(null);
  useOnClickOutSideHandler(dropDown, () => {
    setShowCustomize(false);
  });
  
  return (
    <div
      style={{
        marginRight: '8px'
      }}>
      <b> {title} </b>
      <img
        style={{
          cursor: 'pointer'
        }}
        src="/images/sort-arrow-types/sort-column-icon.svg"
        alt=""
        onClick={() => {
          setShowCustomize(prevState => !prevState);
        }}
        width="25px"/>
      {
        showCustomize && (
          <div
            ref={dropDown}
            className="sorter-menu">
            <div key="menuHead" className="sorter-menu-head">
              <Checkbox
                checked={columns.length === size}
                onChange={(e) => {
                  if (e.target.checked) {
                    addAll(values => {
                      if (onChange) {
                        onChange(columns, values);
                      }
                    });
                  } else {
                    eraseAll(values => {
                      if (onChange) {
                        onChange(columns, values);
                      }
                    });
                  }
                }}
              > All </Checkbox>
            </div>
            <div
              
              className="sorter-menu-body">
              <div
                className="sorter-menu-select blue-scroll"
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {columns.map((item, index) => (
                          item?.key?.length > 0 && !!item?.title && 
                          <Draggable key={item?.key} draggableId={item?.key} index={index}>
                            {(provided, snapshot) => (
                              <div
                                className="check-filter"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <Checkbox
                                  checked={has(item?.key)}
                                  style={{marginRight: '8px'}}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      add(item?.key, (values => {
                                        if (onChange) {
                                          onChange(columns, values);
                                        }
                                      }));
                                    } else {
                                      erase(item?.key, values => {
                                        if (onChange) {
                                          onChange(columns, values);
                                        }
                                      });
                                    }
                                  }}
                                />
                                {item?.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};