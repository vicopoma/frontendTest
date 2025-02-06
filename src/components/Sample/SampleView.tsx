import React from 'react';

import { Sample } from '../../store/types';

type Props = {
  sample: Sample,
  replaceSampleName: Function,
  replaceSampleAge: Function
}
export default ({sample, replaceSampleName, replaceSampleAge}: Props) => {
  return (
    <div>age: {sample.age}
      <h1> name: {sample.name}</h1>
      <button onClick={() => replaceSampleName('Gauss')}>
        Replace Name
      </button>
      <button onClick={() => replaceSampleAge(sample.age + 1)}>
        Replace Age
      </button>
    </div>
  );
}