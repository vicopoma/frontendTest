import React, {useEffect, useState} from 'react';
import { useEquipmentContext } from '../../../../../context/equipment';
import { EQ_INFORMATION_VAR } from '../../../../../store/types';
import { GenericParts } from './GenericParts/GenericParts';
import { SpecificParts } from './SpecificParts/SpecificParts';

export const PartSection = ({style}: {
  style?: React.CSSProperties
}) => {

  const { values, setFieldValue } = useEquipmentContext();
  const [chosenCard, setChosenCard] = useState<string> ('specific');
  const chooseGeneric = () => setChosenCard('generic');
  const chooseSpecific = () => setChosenCard(prev => prev === 'generic' ? 'specific' : 'generic');
  const generic = chosenCard === 'generic';

  useEffect(() => {
    if(values?.specificPartsList?.length && values?.specificPartsList?.length > 0) {
      const partType = values.partTypeWithPartDTOList
        .filter(partType => partType.namePartType === 'Model Config')?.[0];
      if (partType) {
        const partName = partType.parts.filter(part => part.id === partType.partIdSelected)?.[0]?.namePart;
        if (partName) setFieldValue(EQ_INFORMATION_VAR.SUBMODEL, partName);
      }
    }
  }, [setFieldValue, values?.specificPartsList]);

  useEffect(() => {
    if(values?.partTypeWithPartDTOList && values?.partTypeWithPartDTOList.length) {
      const modelConfig = values?.partTypeWithPartDTOList?.filter(part => part.namePartType === 'Model Config');
      const notModelConfig = values?.partTypeWithPartDTOList?.filter(part => part.namePartType !== 'Model Config');
      setFieldValue([EQ_INFORMATION_VAR.PART_TYPE_WITH_PART_DTO_LIST], [...modelConfig, ...notModelConfig]);
    }
  }, [setFieldValue, values?.guiNameList]);

  return (
    <>
      <GenericParts chooseCard={chooseGeneric} chosenCard={generic} style={{height: values?.guiNameList?.length > 0 ? '295px' : '460px', overflowY: 'auto'}}/>
      <SpecificParts chooseCard={chooseSpecific} chosenCard={!generic} style={{height: !generic ? '240px' : '60px'}}/>
    </>
  );
};
