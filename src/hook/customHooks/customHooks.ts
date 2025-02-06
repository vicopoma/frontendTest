import { useCallback, useEffect, useState } from 'react';
import { EquipmentModelVM, FilterState } from '../../store/types';
import { useFilterDispatch, useFilterStates } from '../hooks/filters';
import { useAccountState } from '../hooks/account';
import { generateModelWithModelYear, paramBuilder, sortObject } from '../../helpers/Utils';
import { useBodyFilterDispatch, useBodyFilterState } from '../hooks/bodyFilter';
import { ReleaseNotes } from '../../Types/Types';
import { ASC, DESC, YEAR } from '../../constants/constants';

export const useOnClickOutSideHandler = (ref: any, callBack: Function) => {
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callBack, ref]);
};

interface ColumnStorageFormat {
  values: Array<any>,
  totalData: Array<any>
}

export const useColumnsSorter = ({initialValues, component, defaultChecked}: {
  initialValues: Array<any>
  component: string
  defaultChecked?: Array<any>
}) => {
  
  const {account} = useAccountState();
  const [storage, setStorage] = useState<{ [key: string]: ColumnStorageFormat }>(() => {
    return JSON.parse(localStorage.getItem(account.id + '') || '{}');
  });
  
  const [values, setValues] = useState<Array<any>>([]);
  const [totalData, setTotalData] = useState<Array<any>>([]);

  useEffect(() => {
    setValues(() => {
      if (storage[component]?.values) {
        const copy: Array<any> = [];
        storage[component].values.forEach(data => {
          const currentData = initialValues.filter(column => column?.key === data?.key);
          if (currentData.length > 0) {
            copy.push(currentData[0]);
          }
        });
        return copy;
      } else {
        return defaultChecked ? defaultChecked : initialValues;
      }
    });
    
    setTotalData(() => {
      if (storage[component]?.totalData) {
        const copy: Array<any> = [];
        const notInColumnList: Array<any> = [];
        storage[component]?.totalData.forEach(data => {
          const currentData = initialValues.filter(column => column?.key === data?.key);
          if (currentData.length > 0) {
            copy.push(currentData[0]);
          }
        });
        initialValues.forEach(data => {
          const currentData = copy.filter(column => column?.key === data?.key);
          if (currentData.length === 0) {
            notInColumnList.push(data);
          }
        });
        notInColumnList.forEach(data => {
          copy.push(data);
        });
        return copy;
      } else {
        return initialValues;
      }
    });
  }, [component, defaultChecked, initialValues, storage]);
  
  const resetStorage = useCallback(() => {
    setValues(() => {
      return defaultChecked ? defaultChecked : initialValues;
    });
    setTotalData(() => {
      return initialValues;
    });
  }, [defaultChecked, initialValues]);
  
  useEffect(() => {
    localStorage.setItem(account.id, JSON.stringify(storage, (key, value) => {
      if(key === 'subTitle') {
        return null;
      }
      return value;
    }));
  }, [storage, account.id]);
  
  return {
    values,
    setValues: setValues,
    totalData,
    resetStorage,
    filterArray: useCallback((cond1: Array<any>, cond2: Array<any>, key: string, callBack?: (currentValues: Array<any>) => void) => {
      setTotalData((prevState: any[]) => {
        const total: Array<any> = [];
        cond1.forEach(data => {
          const values = prevState.filter(prev => prev?.[key] === data?.[key]);
          if (values.length > 0) {
            total.push(values[0]);
          }
        });
        
        setValues(() => {
          const newValues = total.filter(data => {
            return cond2.includes(data?.[key], 0);
          });
          
          setStorage(prevState => ({
            ...prevState,
            [component]: {
              values: newValues,
              totalData: total
            }
          }));
          
          callBack?.(newValues);
          
          return newValues;
        });
        return total;
      });
    }, [component]),
  };
};

export const useFilterTODOREPLACE = ({initialValue, component, fetchFunction}: {
  initialValue: FilterState,
  component: string,
  fetchFunction?: Function
}) => {
  
  const storeFilter = useFilterStates(component);
  const [filter, setFilter] = useState<FilterState>(storeFilter);
  const [params, setParams] = useState<string>(paramBuilder(initialValue));
  const {updateFilters} = useFilterDispatch();
  
  useEffect(() => {
    updateFilters(component, filter);
    setParams(paramBuilder(filter));
  }, [updateFilters, filter, component, fetchFunction]);
  
  return {
    filter,
    setFilter,
    params
  };
};

export const useFilterParams = (component: string, initialValues?: FilterState) => {
  const storeFilters = useFilterStates(component);
  const {updateFilters} = useFilterDispatch();
  const [filter, setFilter] = useState<FilterState>(() => {
    if (Object.keys(storeFilters).length > 0) {
      return storeFilters;
    }
    if(initialValues) {
      updateFilters(component, initialValues ?? {});
    }
    return initialValues ?? {};
  });
  
  const [params, setParams] = useState<string>(() => {
    if (Object.keys(storeFilters).length > 0) {
      return paramBuilder(storeFilters);
    }
    return paramBuilder(initialValues ?? {});
  });
  
  useEffect(() => {
    if (Object.keys(storeFilters).length > 0) {
      setFilter(storeFilters);
      setParams(paramBuilder(storeFilters));
    }
  }, [storeFilters]);
  
  return {
    filter,
    params,
    setFilter,
    addFilter: useCallback((currentFilter: FilterState) => {
      setFilter(prevState => {
        const copy = {...prevState, ...currentFilter};
        setParams(paramBuilder(copy));
        updateFilters(component, copy);
        return copy;
      });
    }, [component, updateFilters])
  };
};

export const useBodyFilterParams = (component: string, initialValues?: object) => {
  
  const [curComponent, setCurComponent] = useState(component);
  
  const storeBodyParams = useBodyFilterState(curComponent);
  const {updateBodyFilter} = useBodyFilterDispatch();
  
  const [bodyFilter, setBodyFilter] = useState<any>(() => {
    if (Object.keys(storeBodyParams).length > 0) {
      return storeBodyParams;
    }
    if(initialValues) {
      updateBodyFilter(component, initialValues ?? {});
    }
    return initialValues ?? {};
  });
  
  useEffect(() => {
    setCurComponent(component);
  }, [component]);
  
  useEffect(() => {
    if (Object.keys(storeBodyParams).length > 0) {
      setBodyFilter(storeBodyParams);
    }
  }, [curComponent, storeBodyParams]);
  
  return {
    bodyFilter,
    setBodyFilter,
    addBodyFilter: useCallback((currentBodyFilter: any) => {
      setBodyFilter((prevState: any) => {
        const copy = {...prevState, ...currentBodyFilter};
        updateBodyFilter(curComponent, copy);
        return copy;
      });
    }, [curComponent, updateBodyFilter]),
  };
};

export const useArraySelector = ({initialValues, totalDefaultValues, nonErasableValues}: {
  initialValues: Array<string>,
  totalDefaultValues: Array<string>,
  nonErasableValues?: Array<string>,
}) => {
  
  const [totalValues, setTotalValues] = useState<Set<string>>(new Set<string>());
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set<string>());
  const [filters, setFilters] = useState<Set<string>>(new Set<string>());
  
  useEffect(() => {
    const build = (values: Array<string>) => {
      const copy: Set<string> = new Set();
      for (let value of values) {
        copy.add(value);
      }
      return copy;
    };
    setSelectedValues(build(initialValues));
    setTotalValues(build(totalDefaultValues));
    setFilters(build(nonErasableValues ?? []));
  }, [initialValues, nonErasableValues, setTotalValues, totalDefaultValues]);
  
  return {
    value: Array.from(selectedValues),
    erase: (id: string, callBack?: (values: Array<string>) => void) => setSelectedValues(prevState => {
      const copy = new Set<string>();
      if(prevState.size !== filters.size + 1) {
        prevState.forEach(data => {
          copy.add(data);
        });
        if(!filters.has(id)) {
          copy.delete(id);
        }
      }
      if (callBack) {
        callBack(Array.from(copy));
      }
      return copy;
    }),
    add: (id: string, callBack?: (values: Array<string>) => void) => setSelectedValues(prevState => {
      const copy = new Set<string>();
      prevState.forEach(data => {
        copy.add(data);
      });
      copy.add(id);
      filters.forEach(data => copy.add(data));
      if (callBack) {
        callBack(Array.from(copy));
      }
      return copy;
    }),
    size: selectedValues.size,
    has: (id: string) => selectedValues.has(id),
    hasAll: selectedValues.size === totalValues.size,
    addAll: (callBack?: (values: Array<string>) => void) => setSelectedValues(prevState => {
      if (callBack) {
        callBack(Array.from(totalValues));
      }
      return totalValues;
    }),
    eraseAll: useCallback((callBack?: (values: Array<string>) => void) => {
      setSelectedValues(() => new Set<string>());
      if (callBack) {
        callBack([]);
      }
    }, [setSelectedValues]),
  };
};


export const useModelSelect = (equipmentModelVMs: EquipmentModelVM[]) => {
  const [values, setValues] = useState<{ [key: string]: { id: string, models: EquipmentModelVM[] } }>({});
  useEffect(() => {
    setValues(generateModelWithModelYear(equipmentModelVMs));
  }, [equipmentModelVMs]);
  return {
    values,
    models: Object.keys(values).sort(),
    years: (modelName: string) => {
      const years: { id: string, year: string, status: string }[] = [];
      values[modelName.toLowerCase()]?.models.forEach(modelYear => {
        years.push({id: modelYear.id, year: modelYear.modelYear, status: modelYear.statusDescription});
      });
      return sortObject(years, YEAR).reverse();
    }
  };
};

export const useReleaseNotes = () => {
  const [notes, setNotes] = useState<Array<ReleaseNotes>>([]);
  useEffect(() => {
    const data = require('../../constants/ReleaseNotes.json');
    setNotes(data);
  }, []);
  return {notes};
};

export const useSorterColumnSelector = () => {
  
  const [chosenColumn, setChosenColumn] = useState<string> ('');
  const [orderType, setOrderType] = useState<string> (ASC);
  
  return {
    chosenColumn,
    changeChosenColumn: useCallback((newColumn: string, callback?: (column: string, orderType: string) => void) => {
      let column = chosenColumn;
      let order: string;
      if(chosenColumn === newColumn) {
        if(orderType === ASC) {
          order = DESC;
          setOrderType(DESC)
        } else {
          order = ASC;
          setOrderType(ASC);
        }
      } else {
        setChosenColumn(newColumn);
        setOrderType(ASC)
        column = newColumn;
        order = ASC;
      }
      callback?.(column, order);
    }, [chosenColumn, orderType])
  }
}

export const useInterval = (callback: Function, delay: number, immediate: boolean = false) => {
  useEffect(() => {
    let intervalId: any;
    if (immediate && !intervalId) {
      callback();
    }
    intervalId = setInterval(() => {
      callback();
    }, delay)
    return () => {
      clearInterval(intervalId);
    }
  }, [callback, delay, immediate]);
}