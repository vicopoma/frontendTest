import { REPLACE_AGE, REPLACE_NAME, SampleActionTypes } from '../types';


export const replaceSampleName = (name: string): SampleActionTypes => {
  return {
    type: REPLACE_NAME,
    name
  };
};

export const replaceSampleAge = (age: number): SampleActionTypes => {
  return {
    type: REPLACE_AGE,
    age
  };
};
