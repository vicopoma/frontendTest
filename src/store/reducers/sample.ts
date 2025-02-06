import * as types from '../types';

const init = {
  name: 'Jhon',
  age: 25
};

export const sample = (state: types.Sample = init, action: types.SampleActionTypes) => {
  switch (action.type) {
    case types.REPLACE_AGE: {
      return {
        ...state,
        age: action.age
      };
    }
    case types.REPLACE_NAME: {
      return {
        ...state,
        name: action.name
      };
    }
    default:
      return state;
  }
};
