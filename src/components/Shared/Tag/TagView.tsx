import { Input, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';
import Icon from '@ant-design/icons';

const TagView = () => {
  const [state, setState] = useState<any>({
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  });
  
  
  const handleClose = (removedTag: any) => {
    const tags = state.tags.filter((tag: any) => tag !== removedTag);
    setState({...state, tags: tags});
  };
  
  const showInput = () => {
    setState({...state, inputVisible: true});
  };
  
  const handleInputChange = (e: any) => {
    setState({...state, inputValue: e.target.value});
  };
  
  
  const handleInputConfirm = () => {
    const stateAuxiliar = state;
    const inputValue = stateAuxiliar.inputValue;
    let tags = stateAuxiliar.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  const saveInputRef = (input: any) => input;
  const {tags, inputVisible, inputValue} = state;
  return (
    <div>
      {tags?.map((tag: any, index: any) => {
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={index}
            closable
            onClose={() => handleClose(tag)}
          >
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        );
        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        
      })};
      
      {inputVisible && (
        <Input
          id="tagInput3"
          ref={saveInputRef}
          type="text"
          size="small"
          style={{width: 78}}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{background: '#fff', borderStyle: 'dashed'}}
        >
          <Icon type="plus"/> New Tag
        </Tag>
      )}
    </div>
  );
  
};

export default TagView;
