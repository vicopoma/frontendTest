import React from 'react';
import { ActivityView } from './ActivityView';
import { ROUTES } from '../../settings/routes';
import { ACTIVITY } from '../../constants/constants';

export const ActivityRoute = () => {
  return (
    <ActivityView
      component={ACTIVITY}
      componentRouterFunction={ROUTES.ACTIVITY.PAGE}
    />
  );
};
