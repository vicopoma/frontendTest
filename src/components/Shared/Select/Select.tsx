import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef, useState,
} from 'react';
import { Select as AntdSelect, Tooltip } from 'antd';
import './Select.scss'

export interface SelectOptions {
  value: string,
  display: ReactNode,
  className?: string
}

type SizeType = "small" | "middle" | "large" | undefined

export interface SelectProps {
  name?: string
  id?: string,
  style?: CSSProperties,
  showSearch?: boolean,
  placeholder?: string,
  value?: string,
  onChange?: (value: any, option?: any) => void,
  onSelect?: (value: any, option?: any) => void,
  allowClear?: boolean,
  options: Array<SelectOptions>,
  className?: string,
  validateValue?: boolean
  size?: SizeType,
  selectAllValue?: string,
  disabled?: boolean,
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void,
  popup?: boolean,
  check?: boolean,
  onSearch?: (value: string) => void,
  notFoundContent?: React.ReactNode,
  virtual?: boolean,
}

export const Select = ({ id, showSearch, onChange, onSelect, placeholder, style, value, options, className, validateValue, size, selectAllValue, name, disabled, onBlur, popup, check, onSearch, notFoundContent, virtual = false, allowClear} : SelectProps) => {
  
  const selectOptionsRef = useRef<any[]>(new Array(options.length));
  const [needPopUp, setNeedPopUp] = useState<Set<number>> (new Set<number>());
  selectOptionsRef.current = [];
  
  const addToRef = ((el: any, index: number) => {
    selectOptionsRef.current[index] = el;
  });
  
  const onScrollOrClickVerify = () => {
    setNeedPopUp((prevState => {
      const copy: Set<number> = new Set<number>();
      prevState.forEach(key => {
        copy.add(key);
      });
      
      selectOptionsRef.current.forEach((value, index) => {
        if (value?.offsetWidth > value?.parentElement?.offsetWidth) {
          copy.add(index);
        }
      });
      return copy;
    }))
  }
  
  useEffect(() => {
    if(!!value && !options.find(selectOption => selectOption.value === value) && validateValue) {
      onChange?.(undefined );
    }
  }, [value, options, onChange, validateValue]);
  
  return (
    <div className="select-layout">
      <AntdSelect
        disabled={disabled}
        size={size}
        id={id}
        optionFilterProp="children"
        showSearch={showSearch}
        onChange={onChange}
        onSelect={onSelect}
        value={!!check? (!!(options.filter(option => option.value === value).length)? value: undefined) : value}
        placeholder={placeholder}
        style={style}
        onBlur={onBlur}
        className={className}
        onPopupScroll={onScrollOrClickVerify}
        onClick={onScrollOrClickVerify}
        onSearch={onSearch}
        filterOption={((inputValue, option) => (option?.title as string)?.toLowerCase().includes(inputValue.toLowerCase()) || (option?.value as string).toLowerCase()?.includes(inputValue.toLowerCase()))}
        notFoundContent={notFoundContent}
        virtual={virtual}
        allowClear={!!allowClear}
      >
        { selectAllValue !== undefined && options.length > 0 && <AntdSelect.Option key="all" value={selectAllValue}> All </AntdSelect.Option> }
        {
          options.map((selectOption, index) => (
            <AntdSelect.Option key={index} title={selectOption.display + ''} value={selectOption.value} className={selectOption.className}>
              {
                popup && needPopUp.has(index) ? (
                  <Tooltip title={selectOption.display+""}>
                    <span ref={(e) => {addToRef(e, index)}} key={index}>
                      {selectOption.display }
                    </span>
                  </Tooltip>
                ) : (
                  <span ref={(e) => {addToRef(e, index)}} key={index}>
                    {selectOption.display }
                  </span>
                )
              }
            </AntdSelect.Option>
          ))
        }
      </AntdSelect>
    </div>
  )
}