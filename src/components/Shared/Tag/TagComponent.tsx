import React, { useCallback, useEffect, useState } from 'react';
import { Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './TagComponents.scss';

import { DEFAULT_TAG_STATE, EQ_INFORMATION_VAR, TagState } from '../../../store/types';
import { asciiToHex, hexToAscii } from '../../../helpers/ConvertUtils';
import { tagValidator, verifyScannerInput } from '../../../helpers/Utils';
import { FetchResponse } from '../Drawer/Drawer';
import { useEquipmentFunctions, useTagValidator } from '../../../hook/customHooks/equipment';
import {
  COMMON_ERRRORS,
  EQUIPMENT_TYPES,
  MAX_TAG_SIZE,
  NEW,
  NOCSAE,
  RECLAIM,
  TAG_VALIDATOR_TYPES
} from '../../../constants/constants';
import { TagStatus } from '../../../Types/Types';
import Icon from '../CommomIcons/Icons';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { useLocation } from 'react-router';
import { useEquipmentContext } from '../../../context/equipment';
import { useEquipmentTypeState } from '../../../hook/hooks/equipmentType';
import { useSocketDSProvider } from '../../../context/socketDS';

export const TAG_VALIDATOR_DETAILS = {
  [TAG_VALIDATOR_TYPES.OK]: {
    className: 'tag-input-warning',
    icon: <Icon.Success width="15px" />
  },
  [TAG_VALIDATOR_TYPES.BELONG_TEAM]: {
    className: 'tag-input-warning',
    icon: <Icon.Warning width="15px" />
  },
  [TAG_VALIDATOR_TYPES.INVALID_FORMAT]: {
    className: 'tag-input-error',
    icon: <Icon.Error width="15px" />
  },
  [TAG_VALIDATOR_TYPES.BELONG_DIFF_TEAM]: {
    className: 'tag-input-error',
    icon: <Icon.Error width="15px" />
  },
};

export const TagComponent = ({ initialValues, fetchResponse, onError, equipmentId, onChange, onReclaim, setFlag, flag, teamId, isNocsaeOpen, reclaimChanges }: {
  initialValues?: Array<string>,
  equipmentId?: string,
  onChange?: (tags: Array<string>) => void,
  onError?: (tagStatus: Array<TagStatus>, codes: Array<string>) => void,
  onReclaim?: (value: boolean, tag: string) => void,
  fetchResponse: React.Dispatch<React.SetStateAction<FetchResponse>>
  setFlag?: Function,
  flag?: number,
  teamId?: string,
  isNocsaeOpen: boolean,
  reclaimChanges: number,
}) => {

  const { tagValidator: { validateTag } } = useEquipmentFunctions();

  const [filled, setFilled] = useState<boolean>(false);
  const [tagArray, setTagArray] = useState<TagState>(DEFAULT_TAG_STATE);
  const [message, setMessage] = useState<string>('');
  const [trigger, setTrigger] = useState<number>(0);
  const [tagTrigger, setTagTrigger] = useState<number>(0);
  const [scannedTag, setScannedTag] = useState<string>('');
  const [tagInputError, setTagInputError] = useState<string>(TAG_VALIDATOR_TYPES.OK);
  const [invalidInput, setInvalidInput] = useState<string>('');
  const [nocsaeTrigger, setNocsaeTrigger] = useState<number>(0);
  const [reclaimable, setReclaimable] = useState<boolean>(false);
  const [isCleatTypeSelected, setIsCleatTypeSelected] = useState<boolean>(false);
  const { addBodyFilter, bodyFilter: nocsaeTagBody } = useBodyFilterParams(NOCSAE);
  const { bodyFilter: reclaimBodyFilter } = useBodyFilterParams(RECLAIM);
  const paths = useLocation().pathname.split('/');
  const { setFieldValue, values } = useEquipmentContext();
  const {equipmentTypeList} = useEquipmentTypeState();
  const isCleatType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.CLEAT && data.id === paths[paths.length - 2]).length > 0;

  useEffect(() => {
    setIsCleatTypeSelected(equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.CLEAT && values?.equipmentTypeId === data.id).length > 0);
  }, [equipmentTypeList, values?.equipmentTypeId]);

  const { errors, codes } = useTagValidator(tagArray.tags, values?.equipmentTypeId ?? paths[paths.length - 2], equipmentId, teamId, paths[paths.length - 1] === NEW);

  useEffect(() => {
    setNocsaeTrigger(prevState => prevState + 1);
  }, [initialValues, setNocsaeTrigger])

  useEffect(() => {
    if (initialValues && initialValues?.length > 0 && nocsaeTrigger > 0) {
      setFilled(true);
      setTagTrigger(prevState => prevState + 1);
      setTagArray(prevState => ({
        ...prevState,
        tags: initialValues
      }));
    }
  }, [initialValues, filled, nocsaeTrigger]);

  useEffect(() => {
    if (!!flag) {
      setTagArray(() => ({
        ...DEFAULT_TAG_STATE
      }));
    }
  }, [flag])

  const handleClose = (removedTag: string) => {
    const tags = tagArray.tags.filter((tag: string) => tag !== removedTag);
    if(hexToAscii(removedTag) === nocsaeTagBody?.tag) {
      addBodyFilter({
        validNocsae: false,
        tag: '',
      })
    }
    setTagTrigger(prevState => prevState + 1);
    setTagArray({ ...tagArray, tags });
  };

  const showInput = () => {
    setTagArray({ ...tagArray, inputVisible: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.trim().toUpperCase();
    let currentTag = asciiToHex(value.toUpperCase());
    if ((value.length <= MAX_TAG_SIZE && tagValidator(currentTag.toUpperCase())) || value.length === 0) {
      setTagInputError(TAG_VALIDATOR_TYPES.OK);
      setInvalidInput('');
    } else {
      setTagInputError(TAG_VALIDATOR_TYPES.INVALID_FORMAT);
      setInvalidInput('*Invalid Tag ID');
    }
    setTagArray({ ...tagArray, inputValue: e.target.value.toUpperCase() });
  };

  const handleInputConfirm = () => {
    const { inputValue } = tagArray;
    let { tags } = tagArray;
    let currentTag = asciiToHex(inputValue?.trim().toUpperCase());
    if ((inputValue.length <= MAX_TAG_SIZE && tagValidator(currentTag.toUpperCase())) || inputValue.length === 0) {
      if (inputValue && tags.indexOf(currentTag) === -1) {
        tags = [...tags, currentTag];
      }
      setTagTrigger(prevState => prevState + 1);
      setTagArray({
        ...tagArray,
        tags,
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagArray({ ...tagArray, editInputValue: e.target?.value.toUpperCase() });
  };

  const handleEditInputConfirm = () => {
    setTagArray(({
      tags,
      editInputIndex,
      editInputValue
    }: { tags: string[], editInputIndex: number, editInputValue: string }) => {
      const newTags = [...tags];
      const updateTag = asciiToHex(editInputValue?.trim().toUpperCase());
      if (!newTags.includes(updateTag)) {
        newTags[editInputIndex] = asciiToHex(editInputValue?.trim().toUpperCase());
      }
      if (!!newTags[editInputIndex]) {
        return {
          ...tagArray,
          tags: newTags,
          editInputIndex: -1,
          editInputValue: '',
        };
      }
      newTags.splice(editInputIndex, 1);
      return {
        ...tagArray,
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
    setTagTrigger(prevState => prevState + 1);
  };

  const handleNocsaeTagConfirm = (tag: string) => {
    let { tags } = tagArray;
    let currentTag = asciiToHex(tag?.trim().toUpperCase());
    if ((tag.length <= MAX_TAG_SIZE && tagValidator(currentTag.toUpperCase())) || tag.length === 0) {
      if (tag && tags.indexOf(currentTag) === -1) {
        tags = [...tags, currentTag];
      }
      setTagTrigger(prevState => prevState + 1);
      setTagArray({
        ...tagArray,
        tags,
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  const { tags, inputVisible, inputValue, editInputIndex, editInputValue } = tagArray;

  useEffect(() => {
    onError?.(errors, codes);
  }, [errors, codes, onError]);

  useEffect(() => {
    if(tagTrigger > 0) {
      onChange?.(tagArray.tags);  
    }
  }, [onChange, tagArray.tags, tagTrigger]);

  useEffect(() => {
    if (scannedTag === '') setScannedTag(message);
  }, [message, trigger]);

  useEffect(() => {
    if (scannedTag) {
      setTagArray(prevState => {
        const exitsTag = prevState.tags.filter(tag => tag === scannedTag);
        if (!exitsTag.length) {
          return {
            ...prevState,
            tags: [...prevState.tags, scannedTag]
          };
        }
        return prevState;
      });
      setScannedTag('');
    }
  }, [scannedTag, teamId, trigger, validateTag]);

  useEffect(() => {
    setTimeout(() => {
      if(nocsaeTagBody?.tag) {
        if(nocsaeTagBody?.validNocsae) {
          handleNocsaeTagConfirm(nocsaeTagBody?.tag);
        } else {
          handleClose(nocsaeTagBody?.tag)
        }
      }
    }, 200);
    // eslint-disable-next-line
  }, [nocsaeTagBody]);

  useEffect(() => {
    setReclaimable(() => {
      return errors.filter(error => error?.message.includes('RECLAIM')).length > 0;
    })
  }, [errors]);

  useEffect(() => {
    if (reclaimChanges > 0 && reclaimBodyFilter?.closeReclaimTag) {
      handleClose(reclaimBodyFilter?.reclaimableTag)
    }
  }, [reclaimChanges, handleClose]);

  const suscribeFunction = useCallback((message: string) => {
    setTimeout(() => {
      const value = verifyScannerInput(message);
      if (tagValidator(value)) {
        setMessage(value);
        setTrigger(trigger => trigger + 1);
        setTagTrigger(prevState => prevState + 1);
      } else {
        if (isCleatType || isCleatTypeSelected) {
          setFieldValue(EQ_INFORMATION_VAR.ADIDAS_BARCODE, hexToAscii(value));
        } else {
          fetchResponse({
            title: COMMON_ERRRORS.WRONG_TAG_FORMAT.TITLE,
            type: 'warning',
            description: COMMON_ERRRORS.WRONG_TAG_FORMAT.DESCRIPTION
          });
        }
      }
    }, 0);
  }, [isCleatType, isCleatTypeSelected]);

  const { setHandleSuscribe } = useSocketDSProvider();

  useEffect(() => {
    if (!isNocsaeOpen) {
      setHandleSuscribe(() => suscribeFunction);
    }
  }, [setHandleSuscribe, suscribeFunction, isNocsaeOpen]);

  return (
    <>
      <div>
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                id="tagInput"
                ref={input => input && input.focus()}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={handleEditInputChange}
                onBlur={handleEditInputConfirm}
                onPressEnter={handleEditInputConfirm}
              />
            );
          }
          const canEdit = true;
          return (
            <span className="edit-tag">
              <Tag
                key={tag}
                closable={canEdit}
                onClose={() => handleClose(tag)}
              >
                <span
                  onDoubleClick={e => {
                    if (canEdit) {
                      setTagArray({ ...tagArray, editInputIndex: index, editInputValue: hexToAscii(tag).toUpperCase() });
                      e.preventDefault();
                    }
                  }}
                >
                  {hexToAscii(tag)}
                </span>
              </Tag>
            </span>
          );
        })}
        {inputVisible && (
          <>
            <Input
              id="tagInput2"
              ref={input => input && input.focus()}
              type="text"
              size="small"
              className="tag-input"
              value={inputValue}
              style={tagInputError !== TAG_VALIDATOR_TYPES.OK ? {
                borderColor: 'red',
                boxShadow: '0 0 0 2px rgb(255 24 24 / 20%)',
                width: '120px',
              } : { width: '120px', }}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
            {
              !!invalidInput && (
                <label className="tag-input-error">
                  {invalidInput}
                </label>
              )
            }
          </>
        )}
        {!inputVisible && !reclaimable && (
          <span className="add-tag">
            <Tag className="site-tag-plus" onClick={showInput} style={{ width: '120px', }}>
              <PlusOutlined /> ADD TAG
            </Tag>
          </span>
        )}
        {reclaimable && (
          <span className="add-tag">
            <Tag className="site-tag-plus" onClick={() => onReclaim?.(true, tagArray.tags?.[tagArray.tags.length - 1])} style={{ width: '120px', }}>
              RECLAIM
            </Tag>
          </span>
        )}
      </div>
      <div style={{ paddingTop: '8px' }}>
        <ul>
          {
            errors.map((tagStatus, index) => (
              <div key={index}>
                <span style={{ marginRight: '8px' }}>
                  {TAG_VALIDATOR_DETAILS[tagStatus.status].icon}
                </span>
                <label className={TAG_VALIDATOR_DETAILS[tagStatus.status].className}>
                  {tagStatus.message}
                </label>
              </div>
            ))
          }
        </ul>
      </div>
    </>
  );
};

