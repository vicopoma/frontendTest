import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Dropdown, Form, Menu, Row, Tooltip } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import { FETCH_STATUS, pageSize } from '../../../constants/constants';
import { Columns, Table } from './CustomTable/Table';

import './InfiniteTable.scss';
import { Card, DraggableSelect } from '../DraggableSelect/DraggableSelect';
import { useColumnsSorter, useFilterParams } from '../../../hook/customHooks/customHooks';
import { FilterQuery } from '../../../Types/Types';
import { useTableFetch } from '../../../hook/customHooks/fetchs';
import { mergeLists } from '../../../helpers/Utils';
import { LoaderButton } from '../LoaderButton/LoaderButton';
import { ConfirmationModal } from '../Modals/Modals';
import CustomInput, { InputSearchAndTagsProps } from '../CustomInput/Input';
import { TableLoader } from '../TableLoader/TableLoader';

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
}

export function InfiniteTable<T>(
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
    onDownloadButtonClick,
    onDownloadAllClick,
    downloadButtons,
    onSearch,
    searchOptions,
    useTableLoader = true,
    hideTableHeader = false,
    multiCheckSection,
    height,
    noDataClassName,
  }: InfiniteTableProps) {
  
  const [canFetch, setCanFetch] = useState<boolean>(true);
  const lastScrolling = useRef(0);
  const [lastFetch, setLastFetch] = useState<boolean>(true);
  const [tableFillType, setTableFillType] = useState<number>(3);
  const [dataSource, setDataSource] = useState<Array<T>>([]);
  const [page, setPage] = useState<number>(0);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
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
  
  
  const {tableList, pagination, status, reset, setStatus, params} = useTableFetch<T>({
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
  
  const {totalPages, totalElements} = pagination;
  
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
  
  const handleTableFetch = (scrollingDown: boolean) => {
    const compareLastFetch = (lastFetch === scrollingDown) ? 1 : 2;
    const currentPage = scrollingDown ? (page + compareLastFetch) : (page - compareLastFetch);
    if (totalPages && currentPage >= 0 && currentPage <= totalPages) {
      const updateTableData = async (forward: number) => {
        setTableFillType(forward);
        setTrigger(true);
        addFilter({
          page: {
            params: [currentPage + ''],
          },
          size: {
            params: [pageSize]
          }
        });
      };
      
      if (canFetch && status !== FETCH_STATUS.LOADING) {
        setCanFetch(false);
        updateTableData(+scrollingDown).then(() => {
          setCanFetch(true);
          if (scrollingDown) {
            if (lastFetch === scrollingDown) setPage(page => page + 1);
            else setPage(page => page + 2);
          } else {
            if (lastFetch === scrollingDown) setPage(page => page - 1);
            else setPage(page => page - 2);
          }
          setLastFetch(scrollingDown);
        });
      }
    }
  };
  
  const handlingTableLimits = ({target}: { target: any }) => {
    if (page === -1) {
      target.scrollTop = 0;
      setPage(0);
      return;
    }
    const currentScroll: number = target.scrollTop + target.offsetHeight;
    const EPS: number = 20;
    if (Math.abs(currentScroll - target.scrollHeight) <= EPS && lastScrolling.current < target.scrollTop &&
      page !== undefined && totalPages && page >= 0 && page + 1 < totalPages) {
      const currentPage: number = (page + (lastFetch ? 1 : 2));
      if (currentPage >= 0 && currentPage <= totalPages) {
        if (dataSource.length > +pageSize) {
          target.scrollTop = target.scrollHeight / 2 - target.offsetHeight + EPS;
        }
        handleTableFetch(true);
      }
    } else if (target.scrollTop === 0 && lastScrolling.current > target.scrollTop && page && page >= 0) {
      const currentPage = (page - (!lastFetch ? 1 : 2));
      if (totalPages && currentPage >= 0 && currentPage <= totalPages) {
        if (dataSource.length > +pageSize) {
          target.scrollTop = target.scrollHeight / 2 + target.offsetHeight - EPS;
        }
        handleTableFetch(false);
      }
    }
    lastScrolling.current = target.scrollTop;
  };
  
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
                        onDownloadAllClick && (
                          <LoaderButton
                            className='icon-load'
                            size="small"
                            loading={loader}
                            onClick={() => {
                              ConfirmationModal('Download', 'Are you sure to download the report?', () => {
                                setLoader(true);
                                onDownloadAllClick && onDownloadAllClick(values, () => setLoader(false), params);
                              });
                            }}
                            style={{
                              marginRight: '8px'
                            }}
                          >
                            <DownloadOutlined style={{ color: '#013369' }} />
                            Download All
                          </LoaderButton>
                        )
                      }
                      {
                        onDownloadButtonClick && (
                          <LoaderButton
                            className='icon-load'
                            size="small"
                            loading={loader}
                            onClick={() => {
                              setLoader(true);
                              onDownloadButtonClick && onDownloadButtonClick(values, () => setLoader(false), params);
                            }}
                            style={{
                              marginRight: "8px"
                            }}
                          >
                            <DownloadOutlined style={{ color: '#013369' }} />
                            Download CSV
                          </LoaderButton>
                        )
                      }
                      {
                        downloadButtons && (
                          <Dropdown
                            overlay={<Menu>
                              {downloadButtons?.buttonArray?.map((button, index) => {
                                if (!button) return <></>;
                                if (!button.title) return button?.render();
                                return (
                                  <Menu.Item 
                                    key={index}
                                    style={{ marginRight: "8px"}}
                                    onClick={() => {
                                      setLoader(true);
                                      button.onClick(values, () => setLoader(false), params);
                                    }}
                                  >
                                    <Tooltip placement="topLeft" title={button.hoverText}>
                                      <div>
                                        {button.icon ?? <DownloadOutlined style={{ color: '#013369', marginRight: "8px" }} />}
                                        {button.title}
                                      </div>
                                    </Tooltip>
                                  </Menu.Item>)
                              })}
                            </Menu>}
                            trigger={['click']}
                          >
                            <Button loading={loader} className="icon-load" size="small" style={{ marginRight: "16px" }}>
                              {!loader && <DownOutlined style={{ color: '#013369' }} />}
                              {downloadButtons?.title}
                            </Button>
                            
                          </Dropdown>
                        )
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
        {multiCheckSection && <Row className="header-info-assign">
          <Col>
            <div className="bg-assign">
              <div className="bg-assign-team" style={{display:'flex', alignItems: 'center'}}>
              <div style={{ marginRight: '15px', display: 'inline-flex'}}>({multiCheckSection.count})</div>
                {multiCheckSection.actions.map((element, index) => 
                  <Tooltip title={element.title} key={index}>
                    <Button
                      icon={element.icon}
                      size="small"
                      id={element.id}
                      style={{border: '0px', marginRight: '12px' }}
                      onClick={() => {
                        if(element.onClick) {
                          element.onClick();
                        }
                      }}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          </Col>
        </Row>}
        <div
          className="layout_back" onScroll={handlingTableLimits}
          style={{
            height: height ?? (multiCheckSection ? 'calc(100Vh - 288px)': 'calc(100Vh - 230px)'),
          }}
          ref={refTable}
        >
          <Table
            columns={values}
            dataSource={dataSource}
            onColumnChoice={onColumnChoice}
            loading={tableLoader}
            sortParams={tableFilter?.sort?.params || ['', '']}
            noDataClassname={noDataClassName}
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

