import { DEFAULT_USERS, USER_ACTIONS, UsersState, UserState, userTypeActions } from '../types/users';
import { mergeLists } from '../../helpers/Utils';


export const users = (state: UsersState = DEFAULT_USERS, action: userTypeActions): UsersState => {
  const newState: UsersState = JSON.parse(JSON.stringify(state));
  
  switch (action.type) {
    
    case USER_ACTIONS.REPLACE_USERS:
      const Users: Array<UserState> = mergeLists(state.users, action.users.userList, action.users.forward);
      return {...state, users: [...Users]};
    
    case USER_ACTIONS.REPLACE_USERS_PAGES:
      return {...state, pages: action.pages};
    
    case USER_ACTIONS.REPLACE_USERS_NUMBER_OF_ELEMENTS:
      return {
        ...state,
        totalPages: action.data.totalPages,
        totalElements: action.data.totalElements,
        numberOfElements: action.data.numberOfElements,
        number: action.data.number,
        
      };
    
    case USER_ACTIONS.ADD_USER_TO_LIST:
      return {...state, users: [...state.users, action.user]};
    
    case USER_ACTIONS.REPLACE_USER:
      return {...state, user: action.user};
    
    case USER_ACTIONS.REPLACE_AUTOCOMPLETE_USERS:
      return {...state, autoCompleteUsers: action.autoCompleteUsers};
    
    case USER_ACTIONS.REPLACE_USER_RELATED_TEAMS:
      return {
        ...state,
        user: {
          ...state.user,
          teamsList: {...action.teamsList}
        }
      };
    
    default:
      return newState;
  }
  
};
