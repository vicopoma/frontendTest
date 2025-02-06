import React, { useCallback, useEffect, useState } from "react";
import { SocketDS } from "../components/Shared/DeviceSocketDS/DeviceSocketDs";
import { FetchResponse } from "../components/Shared/Drawer/Drawer";

type SocketDSContextType = {
  connectionResponse: FetchResponse,
  setHandleSuscribe: Function,
  setOptionalHandleSuscribe: Function,
  setEnableOptionalSuscribe: Function,
  warning: boolean,
};

const SocketDSContext = React.createContext<SocketDSContextType>({
  connectionResponse: {
    title: '',
    type: undefined
  },
  setHandleSuscribe: () => {},
  setOptionalHandleSuscribe: () => {},
  setEnableOptionalSuscribe: () => {},
  warning: false,
});

export const SocketDSProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<string>('');
  const [handleSuscribe, setHandleSuscribe] = useState<(message:string) => {} | undefined>();
  const [enableOptionalSuscribe, setEnableOptionalSuscribe] = useState<boolean>(false);
  const [optionalHandleSuscribe, setOptionalHandleSuscribe] = useState<(message:string) => {} | undefined>();
  const [connectionResponse, setConnectionResponse] = useState<FetchResponse>({
    type: undefined, title: '', description: <></>,
  });
  const [warning, setWarning] = useState<boolean>(true);

  const suscribeFunction = useCallback((message: string) => {
    setMessage(message);
  }, [setMessage]);

  useEffect(() => {
    if (message !== '') {
      if (enableOptionalSuscribe) {
        optionalHandleSuscribe?.(message);
      } else {
        handleSuscribe?.(message);
      }
      setMessage('');
    }
  }, [optionalHandleSuscribe, handleSuscribe, message, enableOptionalSuscribe]);

  useEffect(() => {
    setWarning(() => (!connectionResponse.type || connectionResponse.type === 'warning' || connectionResponse.type === 'info'));
  }, [connectionResponse]);

  return (
    <SocketDSContext.Provider value={{ setHandleSuscribe, setOptionalHandleSuscribe, setEnableOptionalSuscribe, warning, connectionResponse }}>
      <SocketDS 
        methodName="ReceiveMessage"
        suscribeFunction={suscribeFunction}
        setConnectionResponse={setConnectionResponse}
        suscribeDisabled={false}
      />
      <div>{children}</div>
    </SocketDSContext.Provider>
  )
}

export const useSocketDSProvider = () => React.useContext(SocketDSContext);