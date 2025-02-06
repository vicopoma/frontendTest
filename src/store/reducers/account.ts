import { ACCOUNT_ACTIONS, AccountState, DEFAULT_ACCOUNTS, UserActionTypes } from '../types/account';
import { TOKEN } from '../../constants/constants';

export const account = (state: AccountState = DEFAULT_ACCOUNTS, action: UserActionTypes) => {
  switch (action.type) {
    case ACCOUNT_ACTIONS.REPLACE_TOKEN: {
      localStorage.setItem(TOKEN, action.token);
      return {
        ...state,
        token: action.token
      };
    }
    case ACCOUNT_ACTIONS.REPLACE_ACCOUNT_INFORMATION: {
      return {
        ...state,
        account: action.account
      };
    }
    case ACCOUNT_ACTIONS.REPLACE_MOBILE_INFORMATION: {
      return {
        ...state,
        mobile: action.mobile
      };
    }
    case ACCOUNT_ACTIONS.RESET_USER_INFORMATION: {
      return {
        ...state,
        account: DEFAULT_ACCOUNTS,
        token: ''
      };
    }
    
    case ACCOUNT_ACTIONS.REPLACE_LOGIN_TYPE: {
      return {
        ...state,
        loginType: action.loginType
      };
    }
    
    case ACCOUNT_ACTIONS.REPLACE_SELECTED_TEAM:
      return {
        ...state,
        teamSelected: action.team
      };
    
    case ACCOUNT_ACTIONS.REPLACE_IMPORT_ID:
      return {
        ...state,
        account: {
          ...state.account,
          importId: action.importId
        }
      };
    case ACCOUNT_ACTIONS.REPLACE_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications
      };
    default:
      return state;
  }
};
