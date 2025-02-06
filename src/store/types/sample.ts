export const REPLACE_AGE = 'REPLACE_AGE';
export const REPLACE_NAME = 'REPLACE_NAME';

export interface Sample {
  name: string,
  age: number
}

interface ReplaceAgeAction {
  type: typeof REPLACE_AGE,
  age: number
}

interface ReplaceNameAction {
  type: typeof REPLACE_NAME,
  name: string
}

export type SampleActionTypes = ReplaceAgeAction | ReplaceNameAction;