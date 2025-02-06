import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  putRequest,
  warningAndError,
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import {
  OKListResponse,
  OKObjectResponse,
  OkPagedListResponse,
} from '../../settings/Backend/Responses';
import { DEFAULT_USER, RoleAndTeam, USER_ACTIONS, UserState, UserTeamRelation } from '../types/users';
import { CREATED, OK, RELATED_USER_FILTER, USER_FILTER } from '../../constants/constants';
import store from '../index';
import { paramBuilder } from '../../helpers/Utils';
import { FilterState } from '../types';
import { SuccessMessage } from '../../components/Shared/Messages/Messages';
import { updateLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

export const replaceUsers = (userList: Array<UserState>, forward: number) => {
  return {
    type: USER_ACTIONS.REPLACE_USERS,
    users: {
      userList,
      forward
    },
  };
};

export const addNewUserToList = (user: UserState) => {
  return {
    type: USER_ACTIONS.ADD_USER_TO_LIST,
    user
  };
};

export const replaceUser = (user: UserState) => {
  return {
    type: USER_ACTIONS.REPLACE_USER,
    user
  };
};

export const replaceUsersNumberOfElements = (totalPages: number, numberOfElements: number, totalElements: number, number: number) => {
  return {
    type: USER_ACTIONS.REPLACE_USERS_NUMBER_OF_ELEMENTS,
    data: {
      totalPages,
      numberOfElements,
      totalElements,
      number,
    }
  };
};

export const replaceAutoCompleteUsers = (autoCompleteUsers: Array<UserState>) => {
  return {
    type: USER_ACTIONS.REPLACE_AUTOCOMPLETE_USERS,
    autoCompleteUsers
  };
};

export const replaceUsersPages = (pages: number) => {
  return {
    type: USER_ACTIONS.REPLACE_USERS_PAGES,
    pages
  };
};

export const replaceUserTeamsRelated = (teamsList: {
  relatedTeam: Array<UserTeamRelation>,
  unRelatedTeam: Array<UserTeamRelation>
}) => {
  return {
    type: USER_ACTIONS.REPLACE_USER_RELATED_TEAMS,
    teamsList
  };
};


export const authorizationRequestResponse = (authReq: { userId: string, authorizationStatus: string }) => {
  return async (dispatch: Function) => {
    const res: OKObjectResponse<any> = await postRequest(API.USER.AUTHORIZATION_RESPONSE(), authReq, getToken());
    if (res.httpStatus === OK) {
      SuccessMessage({description: 'The request has been answered'});
      dispatch(loadAllUsers(() => {
      }, 3));
    }
  };
};

export const loadAllUsers = (setLoader: Function, forward: number) => {
  return async (dispatch: Function, getState: Function) => {
    dispatch(updateLoader(true));
    const params: FilterState = getState().filters[USER_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    setLoader(true);
    const data: OkPagedListResponse<UserState> = await getRequest(API.USER.USERS() + query, getToken());
    setLoader(false);
    if (data?.httpStatus === OK) {
      dispatch(replaceUsers(data?.body?.content, forward));
      dispatch(replaceUsersPages(data?.body?.totalPages));
      dispatch(replaceUsersNumberOfElements(data?.body?.totalPages, data?.body?.numberOfElements, data?.body?.totalElements, data?.body?.number));
    }
    dispatch(updateLoader(false));
  };
};

export const createUser = (user: UserState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<UserState> = await postRequest(API.USER.USERS(), user, getToken());
    if (data?.httpStatus === CREATED) {
      dispatch(loadAllUsers(() => {
      }, 3));
      const newUser = {
        ...data?.body,
        roleName: user.roleName
      };
      dispatch(replaceUser(newUser));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'User created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const updateUser = (user: UserState, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<UserState> = await putRequest(API.USER.USERS(), user, getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadAllUsers(() => {
      }, 3));
      const newUser = {
        ...data?.body,
        roleName: user.roleName
      };
      dispatch(replaceUser(newUser));
      setResponse({
        title: 'Updated',
        type: 'success',
        description: 'User updated Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};

export const deleteUser = (id: string, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>, closeDrawer: Function) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await deleteRequest(API.USER.USERS(id), getToken());
    if (data?.httpStatus === OK) {
      dispatch(loadAllUsers(() => {
      }, 3));
      SuccessMessage({description: 'User deleted successfully'});
      closeDrawer();
    } else {
      warningAndError(data, setResponse);
    }
  };
};
export const findUserByName = () => {
  return async (dispatch: Function) => {
    const params: FilterState = store.getState().filters[RELATED_USER_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    const data: OKListResponse<UserState> = await getRequest(API.USER.SEARCH_USER() + query, getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceAutoCompleteUsers(data?.body));
    }
  };
};

export const loadUserById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<UserState> = await getRequest(API.USER.USERS() + '/' + id, getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceUser({...data?.body, isNew: false}));
      } else {
        dispatch(replaceUser(DEFAULT_USER));
      }
      dispatch(updateLoader(false));
    } else {
      dispatch(replaceUser(DEFAULT_USER));
    }
  };
};

export const synchronizedUsers = (setLoader: Function) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await getRequest(API.USER.SYNCHRONIZED(), getToken());
    if (data?.httpStatus === OK) {
      SuccessMessage({description: 'User synchronization was a success'});
      dispatch(loadAllUsers(setLoader, 3));
    }
  };
};

export const updateRoleAndTeam = (roleAndTeam: RoleAndTeam) => {
  return async (dispatch: Function) => {
    const data: OKObjectResponse<any> = await postRequest(API.USER.ROLE_AND_TEAM(), roleAndTeam, getToken());
    if (data?.httpStatus === OK) {
      SuccessMessage({description: 'Role and team updated'});
      dispatch(loadAllUsers(updateLoader, 3));
    }
  };
};


