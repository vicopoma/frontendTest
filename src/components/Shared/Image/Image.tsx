import React from 'react';
import { Img } from 'react-image';

const Image = ({src, srcDefault, alt, width, style, className, height, ...rest}:
                 {
                   src: string,
                   srcDefault: string
                   alt?: string
                   width?: string
                   style?: any
                   className?: any
                   height?: any
                 }) => {
  return (
    <Img
      id={alt}
      src={[src, srcDefault]}
      style={style ? {...style, zIndex: 1} : {zIndex: 1}}
      height={height}
      alt={alt}
      width={width}
      className={className}
      {...rest}
    />
  );
};

export default Image;
