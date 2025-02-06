import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Col, Form, Row } from 'antd';
import { FETCH_STATUS } from '../../../constants/constants';
import { Columns } from '../Table/CustomTable/Table';

import './TableTab.scss';
import { Card, DraggableSelect } from '../DraggableSelect/DraggableSelect';
import { useColumnsSorter, useFilterParams } from '../../../hook/customHooks/customHooks';
import { FilterQuery } from '../../../Types/Types';
import { useTableFetch } from '../../../hook/customHooks/fetchs';
import { mergeLists } from '../../../helpers/Utils';
import CustomInput, { InputSearchAndTagsProps } from '../CustomInput/Input';
import { TableLoader } from '../TableLoader/TableLoader';
import { TabList } from './TabList';

export interface MultiCheckActions {
  icon: JSX.Element,
  id: string,
  title: string,
  onClick: Function,
}

export interface MultiCheckProps {
  count: number,
  actions: MultiCheckActions[],
}

export interface InfiniteTableProps {
  columns: Array<Columns>,
  filterLabels?: "vertical" | "horizontal",
  filters?: Array<FilterQuery>
  bodyFilters?: object
  filterName: string, //set filters name for redux
  optionsBar?: Array<{ display: JSX.Element }>
  url?: string,
  fetchType?: 'GET' | 'POST'
  componentName?: string,
  columnEditName: string, //set name to save in local storage
  onRowClick?: (data: any) => void,
  onColumnCustomize?: (items: Array<Card>) => void,
  defaultFiltersObject: any //set default data to request
  paged?: boolean,
  enableFetch?: boolean,
  onDownloadButtonClick?: (items: Array<Card>, disableLoader: Function, params: string) => void,
  onDownloadAllClick?: (items: Array<Card>, disableLoader: Function, params: string) => void,
  downloadButtons? : {title: string, buttonArray: Array<any>},
  onSearch?: "row" | "column",
  filterPosition?: "before" | "after"
  searchOptions?: InputSearchAndTagsProps
  useTableLoader?: boolean
  hideTableHeader?: boolean
  multiCheckSection?: MultiCheckProps
  height?: string
  noDataClassName?: string,
  render: Function
}

export function TableTab<T>(
  {
    columns,
    filters,
    filterLabels,
    bodyFilters,
    optionsBar,
    url,
    fetchType,
    defaultFiltersObject,
    paged,
    componentName,
    filterName,
    enableFetch = true,
    onColumnCustomize,
    columnEditName,
    onSearch,
    searchOptions,
    useTableLoader = true,
    hideTableHeader = false,
    height,
    noDataClassName,
    render,
  }: InfiniteTableProps) {
  
  const [tableFillType, ] = useState<number>(3);
  const [dataSource, setDataSource] = useState<Array<T>>([]);
  const [page, setPage] = useState<number>(0);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [lastFilterName, setLastFilterName] = useState<string>('');
  const refTable = useRef<HTMLHeadingElement>(null);
  
  const { filter: tableFilter, addFilter } = useFilterParams(filterName);

  const currentColumns = useMemo(() => columns.filter(column => {
    return (typeof column.show) === 'undefined' || column.show;
  }), [columns]);
  
  const {values, totalData, filterArray} = useColumnsSorter({
    initialValues: columns,
    component: columnEditName,
    defaultChecked: currentColumns
  });
  
  
  const {tableList, pagination, status, reset, setStatus } = useTableFetch<T>({
    type: fetchType ?? 'GET',
    url: url ?? '',
    paged,
    filtersDefault: defaultFiltersObject,
    bodyDefault: bodyFilters,
    trigger,
    setTrigger,
    setPage,
    enableFetch,
    filterName,
  });
  
  const { totalElements } = pagination;
  
  const updateColumnsFilter = useCallback((items, selectedValues) => {
    filterArray(items, selectedValues, 'key', currentValues => {
      onColumnCustomize?.(currentValues);
    });
  }, [filterArray, onColumnCustomize]);
  
  useEffect(() => {
    if (status === FETCH_STATUS.LOADING) {
      if (reset && useTableLoader) {
        setTableLoader(true);
      }
      return;
    }
    
    if (status === FETCH_STATUS.FINISHED) {
      setDataSource((prevState) => mergeLists(prevState, tableList, reset ? 3 : tableFillType, page));
      if (reset) {
        setPage(0);
      }
    }
    
    if (status === FETCH_STATUS.FAILED) {
      setPage(0);
      setDataSource([]);
    }
    if(useTableLoader) {
      setTableLoader(false);
    }
    
  }, [tableList, tableFillType, status, trigger, reset, setStatus, page]);

  useEffect(() => {
    if(filterName !== lastFilterName) {
      setLastFilterName(() => filterName);
      if(refTable.current) {
        refTable.current.scrollTop = 0;
        setPage(0);
      }
    }
  }, [filterName, lastFilterName]);
  
  const onColumnChoice = useCallback((key: string, type: string) => {
    setPage(0);
    addFilter({
      sort: {
        params: [key, type]
      },
      page: {
        params: ['0']
      }
    });
  }, [setPage, addFilter]);
  
  return (
    <>
      {tableLoader && <TableLoader />}
      <div className={componentName ? 'card-container' : ''}>
        {!hideTableHeader && <div className="btn-header">
          <Row>
          <Col span={24}>
          {
            (!!filters?.length || !!optionsBar?.length) && (
                <Row justify="space-between">
                  <Col>
                    <Row align="middle" gutter={[8, 0]}>
                      <h3 className="name-section-head"> {componentName} </h3>
                      <Form
                        layout={filterLabels}
                        style={{display: 'flex', flexWrap: 'wrap', minHeight: '80px', paddingBottom: '0px'}}>
                        {onSearch === 'column' && <InputSearch searchOptions={searchOptions}/>}
                        {filters?.map((filter, index) => {
                          return (
                            <Col
                              flex="auto"
                              style={{marginTop: '2px', marginBottom: '2px'}}
                              key={index}>
                                {filter.display}
                            </Col>);
                        })}
                      </Form>
                    </Row>
                  </Col>
                  <Col>
                    <Row justify="end" align='middle' style={{minHeight: '45px'}}>
                      {
                        optionsBar?.map((option, index) => (
                          <span key={index}>
                          {option.display}
                        </span>
                        ))
                      }
                      {
                        pagination && <div className="total-number"> {`Total: ${totalElements}`} </div>
                      }
                      {
                        <DraggableSelect
                          title=""
                          data={columns}
                          onChange={updateColumnsFilter}
                          chosenValues={values}
                          defaultSortOrderById={totalData}
                        />
                      }
                    </Row>
                  </Col>
                </Row>
            )
          }
          </Col>
            {onSearch && onSearch === 'row' && <Col span={24} style={{paddingTop: '5px'}}>
              {(
                <div className="input-search">
                  <InputSearch searchOptions={searchOptions}/>
                </div>
              )}
            </Col>}
          </Row>
        </div>}
        <div
          className="layout_back"
          style={{
            height: height ?? 'calc(100Vh - 250px)',
            overflowY: 'hidden',
          }}
          ref={refTable}
        >
          <TabList
            columns={values}
            dataSource={dataSource}
            onColumnChoice={onColumnChoice}
            loading={tableLoader}
            sortParams={tableFilter?.sort?.params || ['', '']}
            noDataClassname={noDataClassName}
            render={render}
          />
        </div>
      </div>
    </>
  );
}

const InputSearch = ({ searchOptions } : {searchOptions?: InputSearchAndTagsProps}) => {
  return (
    searchOptions ? <CustomInput.SearchAndTag
      id={searchOptions.id}
      inputKey={searchOptions.inputKey}
      placeholder={searchOptions.placeholder}
      size={searchOptions.size}
      style={{...searchOptions.style, width: '400px'}}
      onChange={searchOptions.onChange}
      onSearch={searchOptions.onSearch}
      tagValues={searchOptions.tagValues}
      options={searchOptions.options}
      tagMode={searchOptions.tagMode}
    /> : <div/>
  )
}

