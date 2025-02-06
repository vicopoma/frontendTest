import React, { useEffect } from 'react';
import { ActivityRedirect, EquipmentRedirect, useActivityRedirect, useEquipmentRedirect } from '../../hook/customHooks/redirect';
import { useLocation } from 'react-router'; 
import { ROUTES } from '../../settings/routes';
import { ACTIVITY_TYPE } from '../../constants/constants';
import { history } from '../../store/reducers';

export const RedirectEquipment = () => {
  const { getEquipmentInfo } = useEquipmentRedirect();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const equipmentCode = searchParams.get('equipmentCode');
  
  useEffect(() => {
    getEquipmentInfo(equipmentCode ?? '', (values: EquipmentRedirect) => {
      history.push(ROUTES.EQUIPMENT.DETAIL(values.equipmentTypeId, values.equipmentId));
    }, () => {
      history.push(ROUTES.ERROR.ERROR404());
    });
  }, [equipmentCode, getEquipmentInfo]);

  return <></>
}

export const RedirectActivity = () => {
  const { getActivityInfo } = useActivityRedirect();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const playerId = searchParams.get('playerId') || '';
  const gameKey = searchParams.get('gameKey') || '';
  const sessionId = searchParams.get('sessionId') || '';

  useEffect(() => {
    getActivityInfo(gameKey, sessionId, playerId, (values: ActivityRedirect) => {
      history.push(ROUTES.ACTIVITY.PLAYER_DETAIL(
        !!gameKey ? ACTIVITY_TYPE.GAME : ACTIVITY_TYPE.PRACTICE,
        !!gameKey ? values.gameId : values.sessionId, 
        values.playerId
      ));
    }, () => {
      history.push(ROUTES.ERROR.ERROR404());
    });
  }, [playerId, gameKey, sessionId, getActivityInfo]);

  return <></>;
}