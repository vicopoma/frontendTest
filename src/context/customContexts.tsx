import React from 'react';

type UseStateType<T> = {
  values: T,
  setState: React.Dispatch<React.SetStateAction<T>>
}

const UseStateContext = React.createContext<UseStateType<any>>({
  values: undefined,
  setState: () => {
  }
});

export function UseStateProvider<T>({values, setState, children}: {
  values: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  children: React.ReactNode
}) {
  return (
    <UseStateContext.Provider
      value={{
        values,
        setState
      }}
    >
      {children}
    </UseStateContext.Provider>
  );
}


export const useStateContext = () => React.useContext(UseStateContext);