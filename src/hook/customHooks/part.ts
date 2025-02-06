import { useCallback, useState } from 'react';
import { API } from '../../settings/server.config';
import { PartState } from '../../store/types/part';
import { useListFetch } from './fetchs';

const url = API.PART.BASE();

export const usePartFunctions = () => {
  const {loadList: loadPartsStyleNumber, values: partsStyleNumber} = useListFetch<PartState>({url});
  const [styleNumberId, setStyleNumberId] = useState<string>('');
  
  return {
    PartsStyleNumber: {
      loadPartsStyleNumber: useCallback(() => {
        loadPartsStyleNumber(API.PART.BY_STYLE_NUMBER());
      }, [loadPartsStyleNumber]),
      
      partsStyleNumber
    },
    partStyleByManufacturerAndModel: {
      getStyleNumberByManufacturerAndModel: useCallback((manufacturerId: string, modelName: string, styleNumberParts: Array<PartState>) => {
        if (manufacturerId && modelName) {
          const parts = styleNumberParts.filter(currentPart => currentPart.nameModel === modelName && currentPart.manufacturerId === manufacturerId);
          if (parts.length === 1) {
            setStyleNumberId(parts[0].id);
            return;
          }
        }
        if (manufacturerId) {
          const parts = styleNumberParts.filter(currentPart => currentPart.manufacturerId === manufacturerId);
          if (parts.length === 1) {
            setStyleNumberId(parts[0].id);
            return;
          }
        }
      }, []),
      styleNumberId
    }
  };
};