import { DEFAULT_TEAMS, TEAM_ACTIONS, teamActionTypes, TeamsState } from '../types';

export const teams = (state: TeamsState = DEFAULT_TEAMS, action: teamActionTypes): TeamsState => {
  switch (action.type) {
    case TEAM_ACTIONS.REPLACE_TEAMS:
      return {...state, teams: action.teams};
    case TEAM_ACTIONS.REPLACE_TEAM:
      return {...state, team: action.team};
    case TEAM_ACTIONS.REPLACE_RELATED_USERS:
      return {...state, teamRelatedUsers: action.users};
    case TEAM_ACTIONS.REPLACE_USER_TEAMS:
      return {...state, userTeams: action.userTeams};
    case TEAM_ACTIONS.REPLACE_INITIAL_TEAM_ID:
      return {...state, initialTeamId: action.teamId};
    default:
      return state;
  }
};
