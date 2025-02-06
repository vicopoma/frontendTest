import { ActivitiesState, ACTIVITY_ACTIONS, ActivityActionTypes, ActivityState, DEFAULT_ACTIVITIES } from '../types';
import { mergeLists } from '../../helpers/Utils';

export const activity = (state: ActivitiesState = DEFAULT_ACTIVITIES, action: ActivityActionTypes) => {
  switch (action.type) {
    case ACTIVITY_ACTIONS.REPLACE_ACTIVITIES:
      const activities: Array<ActivityState> = mergeLists(state.activities, action.activities.activities, action.activities.forward);
      return {
        ...state,
        activities: [...activities]
      };
    
    case ACTIVITY_ACTIONS.REPLACE_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };
    
    case ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_PAGES:
      return {
        ...state,
        totalElements: action.data.totalElements,
        totalPages: action.data.totalPages,
        numberOfElements: action.data.numberOfElements,
        number: action.data.number,
      };
    
    case ACTIVITY_ACTIONS.REPLACE_ACTIVITY_ACTION_STATUS:
      
      const newState: ActivitiesState = JSON.parse(JSON.stringify(state));
      state.activities.forEach((activity, index) => {
        if (activity.id === action.status.id) {
          newState.activities[index].action = action.status.action;
        }
      });
      
      return newState;
    
    case ACTIVITY_ACTIONS.REPLACE_ACTIVITIES_AS_CALENDAR:
      return {
        ...state,
        activities: action.activities
      };
    
    default:
      return state;
  }
};
