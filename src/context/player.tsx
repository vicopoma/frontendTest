import React from 'react';
import { DEFAULT_PLAYER, PlayerState } from '../store/types/players';
import { ResponseObjectType } from '../hook/customHooks/fetchs';

type PlayerContextType = {
  values: PlayerState,
  deleteRelatedEquipment: (playerId: string, equipmentId: string, sessionId?: string, onSucceed?: ResponseObjectType<any>) => Promise<void>,
  loadPlayer: () => any
}
const PlayerContext = React.createContext<PlayerContextType>({
  values: DEFAULT_PLAYER,
  deleteRelatedEquipment: () => new Promise<void>(() => {
  }),
  loadPlayer: () => {
  }
});

export const PlayerProvider: React.FC<PlayerContextType> = ({
                                                              deleteRelatedEquipment,
                                                              loadPlayer,
                                                              values,
                                                              children
                                                            }) => {
  return (
    <PlayerContext.Provider value={{
      deleteRelatedEquipment: deleteRelatedEquipment,
      loadPlayer,
      values: values
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => React.useContext(PlayerContext);