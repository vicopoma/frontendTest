import React from 'react';
import { DEFAULT_EQUIPMENT_INFORMATION, EquipmentInformation } from '../store/types';
import { FormikErrors } from 'formik';
import { PartTypeRelatedEquipmentModel } from '../store/types/partType';

type EquipmentContextType = {
  setFieldValue: Function,
  errors: FormikErrors<EquipmentInformation>,
  values: EquipmentInformation,
  handleChange: any,
  handleBlur: any,
  touched: any,
  setStyleNumberPartType?: React.Dispatch<React.SetStateAction<PartTypeRelatedEquipmentModel>>
  setSave: React.Dispatch<React.SetStateAction<boolean>>
}
const EquipmentContext = React.createContext<EquipmentContextType>({
  values: DEFAULT_EQUIPMENT_INFORMATION,
  setFieldValue: () => {
  },
  errors: {},
  handleBlur: null,
  touched: null,
  handleChange: null,
  setSave: () => {
  }
});

export const EquipmentProvider: React.FC<EquipmentContextType> = ({
                                                                    setFieldValue,
                                                                    values,
                                                                    handleChange,
                                                                    errors,
                                                                    handleBlur,
                                                                    touched,
                                                                    setStyleNumberPartType,
                                                                    setSave,
                                                                    children
                                                                  }) => {
  return (
    <EquipmentContext.Provider value={{
      setFieldValue: setFieldValue,
      values: values,
      handleChange: handleChange,
      touched: touched,
      handleBlur: handleBlur,
      errors: errors,
      setStyleNumberPartType,
      setSave
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipmentContext = () => React.useContext(EquipmentContext);

