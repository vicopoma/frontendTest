import { useCallback, useEffect, useState } from 'react';
import { CUSTOM_FIELD_DEFAULT, CustomField } from '../../store/types';
import { OKListResponse } from '../../settings/Backend/Responses';
import { useFetch } from '../customHooks/useFetch';
import { API } from '../../settings/server.config';
import { warningAndError } from '../../settings/httpClients';

export const useCustomFieldList = (equipmentModelId: string) => {
  const [customField, setCustomField] = useState<CustomField>(CUSTOM_FIELD_DEFAULT);
  const [values, setValues] = useState<CustomField[]>([]);
  const url = API.EQUIPMENT_MODEL.CUSTOM_FIELD();
  const {get, post, put, deleteRest, setHandleFetch} = useFetch<CustomField>({_url: url});
  const [trigger, setTrigger] = useState<number>(0);
  
  const getCustomFields = useCallback(async () => {
    setHandleFetch({
      onSucceed: (data) => {
        const values = data as OKListResponse<CustomField>;
        setValues(values?.body);
      },
      onFailure: () => {
        setValues([]);
      }
    });
    await get('', true, `/list/${equipmentModelId}`);
  }, [get, setHandleFetch, equipmentModelId]);
  useEffect(() => {
    if (!!equipmentModelId && equipmentModelId !== 'new') {
      getCustomFields();
    }
  }, [getCustomFields, trigger, equipmentModelId]);
  
  const postCustomField = useCallback(async (body: CustomField, setResponse: any, resetForm: Function) => {
    setHandleFetch({
      onSucceed: () => {
        setResponse({
          title: 'Created',
          type: 'success',
          description: 'Created Successfully'
        });
        setCustomField({...CUSTOM_FIELD_DEFAULT});
        resetForm();
        setTrigger((trigger) => trigger + 1);
      },
      onFailure: (res) => {
        setResponse && warningAndError(res, setResponse);
      }
    });
    await post('', body, true);
  }, [post, setHandleFetch]);
  
  const putCustomField = useCallback(async (body: CustomField, setResponse: any, resetForm: Function) => {
    setHandleFetch({
      onSucceed: () => {
        setResponse({
          title: 'Updated',
          type: 'success',
          description: 'Updated Successfully'
        });
        setCustomField({...CUSTOM_FIELD_DEFAULT});
        resetForm();
        setTrigger((trigger) => trigger + 1);
      },
      onFailure: (res) => {
        setResponse && warningAndError(res, setResponse);
      }
    });
    await put('', body, true);
  }, [put, setHandleFetch]);
  
  const deleteCustomField = useCallback(async (customFieldId: string, setResponse?: any) => {
    setHandleFetch({
      onSucceed: () => {
        setResponse && setResponse({
          title: 'Deleted',
          type: 'success',
          description: 'Deleted Successfully'
        });
        setTrigger((trigger) => trigger + 1);
      },
      onFailure: (res) => {
        setResponse && warningAndError(res, setResponse);
      }
    });
    await deleteRest('', true, `/${customFieldId}`);
  }, [deleteRest, setHandleFetch]);
  
  const replaceCustomField = useCallback((customField: CustomField) => {
    setCustomField({...customField});
  }, [setCustomField]);
  return {
    customFieldList: values,
    customField,
    postCustomField,
    putCustomField,
    deleteCustomField,
    replaceCustomField,
    getCustomFields,
  };
};