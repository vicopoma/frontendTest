import {
  deleteRequest,
  getRequest,
  getToken,
  postRequest,
  warningAndError
} from '../../settings/httpClients';
import { API } from '../../settings/server.config';
import { DEFAULT_TEAM, FilterState, RelatedUser, TEAM_ACTIONS, TeamState } from '../types';
import { OKListResponse, OKObjectResponse } from '../../settings/Backend/Responses';
import { CREATED, OK, TEAM_FILTER } from '../../constants/constants';
import { paramBuilder } from '../../helpers/Utils';
import { updateLoader } from './loader';
import { FetchResponse } from '../../components/Shared/Drawer/Drawer';

export const replaceTeams = (teams: Array<TeamState>) => {
  return {
    type: TEAM_ACTIONS.REPLACE_TEAMS,
    teams
  };
};

export const replaceTeam = (team: TeamState) => {
  return {
    type: TEAM_ACTIONS.REPLACE_TEAM,
    team
  };
};

export const replaceRelatedUsers = (users: Array<RelatedUser>) => {
  return {
    type: TEAM_ACTIONS.REPLACE_RELATED_USERS,
    users
  };
};

export const replaceUserTeams = (userTeams: Array<TeamState>) => {
  return {
    type: TEAM_ACTIONS.REPLACE_USER_TEAMS,
    userTeams
  };
};

export const replaceInitialTeamId = (teamId: string) => {
  return {
    type: TEAM_ACTIONS.REPLACE_INITIAL_TEAM_ID,
    teamId
  };
};

export const loadTeamById = (id: string) => {
  return async (dispatch: Function) => {
    if (!!id) {
      dispatch(updateLoader(true));
      const data: OKObjectResponse<TeamState> = await getRequest(API.TEAM.TEAM(id), getToken());
      if (data?.httpStatus === OK) {
        dispatch(replaceTeam(data.body));
      }
      dispatch(updateLoader(false));
    } else {
      dispatch(replaceTeam(DEFAULT_TEAM));
    }
  };
};

export const loadTeams = () => {
  return async (dispatch: Function, getState: Function) => {
    const params: FilterState = getState().filters[TEAM_FILTER];
    let query = '';
    if (params) query = paramBuilder(params);
    dispatch(updateLoader(true));
    const data: OKListResponse<TeamState> = await getRequest(API.TEAM.TEAMS() + query, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      const teams: Array<TeamState> = [];
      data?.body.forEach(team => {
        teams.push(team);
      });
      dispatch(replaceInitialTeamId(data?.body.filter(data => data.players > 0)[0]?.teamId));
      dispatch(replaceTeams(teams));
    }
  };
};

export const loadTeamRelatedUsers = (teamId: string) => {
  return async (dispatch: Function) => {
    const data: OKListResponse<RelatedUser> = await getRequest(API.TEAM.TEAM_RELATED_USERS(teamId), getToken());
    if (data?.httpStatus === OK) {
      dispatch(replaceRelatedUsers(data?.body));
    }
  };
};

export const createTeamRelatedUser = (user: RelatedUser, setResponse: React.Dispatch<React.SetStateAction<FetchResponse>>) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<RelatedUser> = await postRequest(API.TEAM.CREATE_RELATED_USER(), user, getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === CREATED) {
      dispatch(loadTeamRelatedUsers(user.teamId));
      setResponse({
        title: 'Created',
        type: 'success',
        description: 'Created Successfully'
      });
    } else {
      warningAndError(data, setResponse);
    }
  };
};


export const deleteTeamRelatedUser = (user: RelatedUser) => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKObjectResponse<any> = await deleteRequest(API.TEAM.DELETE_DELETED_USER(user.userTeamid), getToken());
    dispatch(updateLoader(false));
    if (data?.httpStatus === OK) {
      dispatch(loadTeamRelatedUsers(user.teamId));
    }
  };
};

export const updateTeam = (team: TeamState) => {
  return (dispatch: Function) => {
    dispatch(replaceTeam(team));
  };
};

export const loadUserTeams = () => {
  return async (dispatch: Function) => {
    dispatch(updateLoader(true));
    const data: OKListResponse<TeamState> = await getRequest(API.TEAM.USER_TEAMS(), getToken());
    if (data?.httpStatus === OK) {
      const teams = data?.body.filter(data => data.players > 0);
      dispatch(replaceInitialTeamId(teams[0]?.teamId));
      dispatch(replaceUserTeams(data?.body));
      dispatch(updateLoader(false));
    }
  };
};
