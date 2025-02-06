import React from 'react';
import { useProgressBarStatus } from '../hook/customHooks/progressBar';
import { ProgressBar } from '../Types/Types';

type NotificationContextType = {
  progressBarData: Array<{ [key: string]: ProgressBar }>
  updateProgressBar: Function,
  finishedStatus: Set<{ code: string, key: string }>
}


const NotificationContext = React.createContext<NotificationContextType>({
  progressBarData: [],
  updateProgressBar: () => {
  },
  finishedStatus: new Set()
});

export const NotificationProvider: React.FC<NotificationContextType> = ({ children}) => {
  
  const {progressBarArray, updateProgressBar, recentFinishedStatus} = useProgressBarStatus();
  
  return (
    <NotificationContext.Provider value={{
      progressBarData: progressBarArray,
      updateProgressBar,
      finishedStatus: recentFinishedStatus
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => React.useContext(NotificationContext);