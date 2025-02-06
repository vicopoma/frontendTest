import React, { useEffect, useState } from 'react';
import { PartTypeRelatedEquipmentModel } from '../../../../../store/types/partType';
import { Col, Form } from 'antd';
import { useEquipmentContext } from '../../../../../context/equipment';
import { FormikErrors } from 'formik';
import { 
  CLEAT_SIZE, 
  DELETED, 
  NECK_RESTRAINT, 
  PART_STATUS_DESC, 
  KNEE_BRACE_SIDE, MODEL_CONFIG, 
  VICIS_MODEL_CODES, 
  VICIS_MODEL_CONFIG 
} from '../../../../../constants/constants';
import { Select } from '../../../../Shared/Select/Select';
import { EQ_INFORMATION_VAR } from '../../../../../store/types';
import { Input } from '../../../../Shared/CustomInput/CustomInput';

export const PartSelector = ({ partType, index, note }: { partType: PartTypeRelatedEquipmentModel, index: number, note?: boolean }) => {
  const { handleChange, values, setFieldValue, errors } = useEquipmentContext();
  const namePartType = partType.namePartType;
  const [enableNeckRestraint, setEnableNeckRestraint] = useState<boolean>(partType?.parts?.filter(part => part.id === partType.partIdSelected)?.[0]?.namePart === 'Yes');
  const hasNoneOption = partType?.parts?.filter(part => part.namePart === 'None').length > 0;

  useEffect(() => {
    if (partType.namePartType === MODEL_CONFIG) {
      if (values.nameModel.includes(VICIS_MODEL_CODES.TRENCH)) {
        setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, partType.parts.filter((part) => {
          return part.namePart === VICIS_MODEL_CONFIG.TRENCH;
        })[0].id);
      } else if (values.nameModel.includes(VICIS_MODEL_CODES.TRENCH_LP)) {
        setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, partType.parts.filter((part) => {
          return part.namePart === VICIS_MODEL_CONFIG.TRENCH_LP;
        })[0].id);
      } else if (values.nameModel.includes(VICIS_MODEL_CODES.TRENCH_MATRIX)) {
        setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, partType.parts.filter((part) => {
          return part.namePart === VICIS_MODEL_CONFIG.TRENCH_MATRIX;
        })[0].id);
      } else if (values.nameModel.includes(VICIS_MODEL_CODES.TRENCH_LP_MATRIX)) {
        setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, partType.parts.filter((part) => {
          return part.namePart === VICIS_MODEL_CONFIG.TRENCH_LP_MATRIX;
        })[0].id);
      }
    }
  }, [index, partType.namePartType, setFieldValue, values.nameModel]);

  useEffect(() => {
    if((namePartType + '').toLowerCase() === KNEE_BRACE_SIDE && !values.partTypeWithPartDTOList[index].partIdSelected) {
      const part = values.partTypeWithPartDTOList[index].parts?.filter(part => part.namePart === 'LEFT')?.[0];
      const value = part?.id ?? values.partTypeWithPartDTOList[index].parts?.[0]?.id;
      setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, value);
    }
  }, [index, partType, setFieldValue]);

  useEffect(() => {
    if(!enableNeckRestraint && partType.namePartType === NECK_RESTRAINT) {
      setFieldValue(EQ_INFORMATION_VAR.NECK_RESTRAINT_DESC, '');
    }
  }, [enableNeckRestraint, partType?.namePartType, setFieldValue]);

  const hasActiveParts = partType?.parts?.filter(part => part.statusDescription === PART_STATUS_DESC.ACTIVE).length > 0;
  const hasOneActivePart = partType?.parts?.filter(part => part.statusDescription === PART_STATUS_DESC.ACTIVE).length === 1;
  
  useEffect(() => {
    const activePartsList = partType?.parts?.filter(part => part.statusDescription === PART_STATUS_DESC.ACTIVE);
    if (activePartsList?.length === 1) {
      setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, activePartsList[0]?.id);
    }
  }, [index, partType, setFieldValue])

  return (
    <>
    {hasActiveParts && <Col key={index} span={note ? 8 : 12}>
      <Form.Item label={<span
        className={(partType.namePartType.toLowerCase() === CLEAT_SIZE || partType.namePartType.toLowerCase() === KNEE_BRACE_SIDE) ? 'required-item' : ''}>{partType.namePartType}</span>}>
        {partType.namePartType === 'Shoe Option' && <span className="form-feedback-note">
          Only needed if wearing a different cleat on each foot.   
        </span>}
        <Select
          id={`eIPartElements_${partType.namePartType}`}
          size="small"
          showSearch
          disabled={hasOneActivePart && !!partType.partIdSelected}
          className={`${(!!partType.partIdSelected &&
            !!(partType.parts.filter(part => part.id === partType.partIdSelected && part.statusDescription.toUpperCase() === DELETED).length)) ?
            "underline" : ""} ${hasOneActivePart ? 'one-active-part' : ''}`}
          placeholder={"Select"}
          value={partType.partIdSelected ? partType.partIdSelected : undefined}
          onChange={(value: any, b: any) => {
            setFieldValue(`partTypeWithPartDTOList[${index}].partIdSelected`, value);
            if(partType.namePartType === MODEL_CONFIG) {
              setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, b?.title);
            }
            if(partType.namePartType === NECK_RESTRAINT) {
              setEnableNeckRestraint(b.title === 'Yes');
            }
          }}
          allowClear={partType.namePartType !== MODEL_CONFIG}
          options={
            (namePartType === MODEL_CONFIG || partType.namePartType.toLowerCase() === KNEE_BRACE_SIDE || hasNoneOption) ? [
              ...partType.parts.map(part => (
                {
                  value: part.id,
                  display: part.namePart,
                  className: (part.statusDescription !== 'ACTIVE') ? 'none' : undefined
                }))
            ] :
            [
              {
                value: '',
                display: 'None'
              }, ...partType.parts
              .filter(part => (partType.partIdSelected === part.id || part.statusDescription === 'ACTIVE'))
              .map(part => (
                {
                  value: part.id,
                  display: part.namePart,
                  className: (part.statusDescription !== 'ACTIVE') ? 'none' : undefined
                }))
            ]

          }
        />
        {!!errors &&
          !!errors.partTypeWithPartDTOList &&
          !!errors.partTypeWithPartDTOList[index] &&
          <span className="form-feedback">
            {(errors.partTypeWithPartDTOList[index] as FormikErrors<PartTypeRelatedEquipmentModel>).partIdSelected}
          </span>
        }
      </Form.Item>
    </Col>}
    {note && <Col key={index} span={note ? 16 : 12}>
      <Form.Item label={<span>{`Note (${namePartType})`}</span>}>
        <Input
          disabled={!enableNeckRestraint}
          id={`eIPartElements_${partType.namePartType}Desc`}
          isInput
          size='small'
          onChange={handleChange}
          name={EQ_INFORMATION_VAR.NECK_RESTRAINT_DESC}
          value={values?.neckRestraintDesc}
        />
      </Form.Item>
    </Col>}
    {hasActiveParts && partType.namePartType === MODEL_CONFIG && <Col span={12}/>}
    </>
  );
};