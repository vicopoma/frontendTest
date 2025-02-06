import React, { useCallback, useEffect, useState } from 'react';

import { ManufacturerWithModel  } from '../store/types';
import { useManufacturerList } from '../hook/hooks/manufacturer';

type ManufacturerAndModelType = {[key: string]: Array<ManufacturerWithModel>}

type ManufacturerAndModelContextType = {
	manufacturersWithModels?: Array<ManufacturerWithModel>,
	getManufacturerWithModels?: (equipmentTypeId: string, callBack?: () => void) => void
  allManufacturerObjects?: ManufacturerAndModelType
}

const ManufacturerAndModelContext = React.createContext<ManufacturerAndModelContextType>({
	manufacturersWithModels: [],
	getManufacturerWithModels: () => {},
  allManufacturerObjects: {}
});

export const ManufacturerAndModelProvider: React.FC<ManufacturerAndModelContextType> = ({children}) => {
	
	const [ manufacturerAndModel, setManufacturerWithModel] = useState<{[key: string]: Array<ManufacturerWithModel>}>({});
	const { manufacturersWithModels: {getManufacturerWithModels }} = useManufacturerList();
	const [equipmentTypeId, setEquipmentTypeId] = useState<string> ('');
	const [ currentManufacturerWithModel, setCurrentManufacturerWithModel] = useState<Array<ManufacturerWithModel>>([]);
	const [trigger, setTrigger] = useState<boolean>(false);
	const [ chosenManufacturerWithModel, setChosenManufacturerWithModel] = useState<Array<ManufacturerWithModel>> ([]);
	
	const getManufacturerByEquipmentType = useCallback((equipmentTypeId, callBack?: () => void) => {
		if(equipmentTypeId.length > 0) {
			setManufacturerWithModel(prevState => {
				const copy = {...prevState};
				if(!copy[equipmentTypeId]) {
					getManufacturerWithModels(equipmentTypeId, (res) => {
						setCurrentManufacturerWithModel(res);
						setEquipmentTypeId(equipmentTypeId);
						setTrigger(true);
						setChosenManufacturerWithModel(res);
            callBack?.();
					});
				} else {
				  setChosenManufacturerWithModel(copy[equipmentTypeId]);
          setCurrentManufacturerWithModel(copy[equipmentTypeId]);
          callBack?.();
        }
				return copy;
			});
		}
	}, [getManufacturerWithModels]);
	
	useEffect(() => {
		if(trigger) {
			setManufacturerWithModel(prevState => ({
				...prevState,
				[equipmentTypeId]: currentManufacturerWithModel
			}));
			setTrigger(false);
		}
	}, [trigger, currentManufacturerWithModel, equipmentTypeId]);
	
	return (
		<ManufacturerAndModelContext.Provider value={{
			getManufacturerWithModels: getManufacturerByEquipmentType,
			manufacturersWithModels: chosenManufacturerWithModel,
      allManufacturerObjects: manufacturerAndModel
		}}>
			{children}
		</ManufacturerAndModelContext.Provider>
	)
}

export const useManufacturerWithModelContext = () => React.useContext(ManufacturerAndModelContext);