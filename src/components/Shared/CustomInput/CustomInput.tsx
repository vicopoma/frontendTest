import React from 'react';
import { Input as AntdInput } from 'antd';

export const Input = ({placeholder, value, name, onChange, isInput, size, onBlur, id, style, disabled}: {
  placeholder?: string,
  value?: string,
  name?: string,
  onChange?: (e: any) => void,
  isInput: boolean,
  size?: any,
  onBlur?: any
  id?: any
  style?: React.CSSProperties,
  disabled?: boolean
}) => {
  return isInput ?
    <AntdInput
      disabled={disabled}
      id={id}
      onBlur={onBlur}
      size={size}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      style={style}
    />
    : <label style={style ? style : { fontWeight: 400, color: '#4A4A4A'}}> {value} </label>;
};

export const TextArea = ({placeholder, value, name, onChange, isInput, size, id}: {
  placeholder?: string,
  value: string,
  name?: string,
  onChange?: any,
  isInput: boolean,
  size?: any,
  id?: any
}) => {
  return isInput ? <AntdInput.TextArea id={id} placeholder={placeholder} value={value} name={name} onChange={onChange}/>
    : <label style={{color: '#4A4A4A'}}> {value} </label>;
};
