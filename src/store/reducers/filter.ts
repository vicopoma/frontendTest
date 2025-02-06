import { FILTER_ACTIONS, filterActionType, FiltersState } from '../types/filter';


export const filters = (state: FiltersState = {}, action: filterActionType) => {
  const newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case FILTER_ACTIONS.REPLACE_FILTER:
      newState[action.filter.component] = action.filter.filters;
      return newState;
    case FILTER_ACTIONS.REPLACE_STORAGE:
      return {...action.filters};
    default:
      return newState;
  }
};
