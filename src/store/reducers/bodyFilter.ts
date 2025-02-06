import { BODY_FILTER_ACTION, bodyFilterActionTypes, BodyFiltersState } from '../types/bodyFilter';


export const bodyFilter = (state: BodyFiltersState = {}, action: bodyFilterActionTypes): BodyFiltersState => {
  switch (action.type) {
    case BODY_FILTER_ACTION.REPLACE_BODY_FILTER:
      return {
        ...state,
        [action.filter.component]: action.filter.content
      };
    case BODY_FILTER_ACTION.REPLACE_STORAGE_BODY_FILTER:
      return {...action.bodyFilters};
    default:
      return state;
  }
};
