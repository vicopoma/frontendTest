import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createSelector, ParametricSelector } from 'reselect';
import { RootState } from '../../store/reducers';
import { DEFAULT_TEAM, RelatedUser, TeamState } from '../../store/types';
import { useListFetch, useObjectCrudFetch } from '../customHooks/fetchs';
import { API } from '../../settings/server.config';


const selectTeamState: ParametricSelector<RootState, undefined, {
  teams: Array<TeamState>,
  team: TeamState,
  relatedUsers: Array<RelatedUser>
  userTeams: Array<TeamState>,
  initialTeamId: string
}> =
  createSelector<RootState, Array<RelatedUser>, Array<TeamState>, TeamState, Array<TeamState>, string,
    {
      relatedUsers: Array<RelatedUser>
      teams: Array<TeamState>,
      team: TeamState
      userTeams: Array<TeamState>,
      initialTeamId: string,
    }>
  (
    state => state.teams.teamRelatedUsers,
    state => state.teams.teams,
    state => state.teams.team,
    state => state.teams.userTeams,
    state => state.teams.initialTeamId,
    (relatedUsers, teams, team, userTeams, initialTeamId) => ({
      relatedUsers, teams, team, userTeams, initialTeamId
    })
  );

export const useTeamState = () => {
  return useSelector((state: RootState) => selectTeamState(state, undefined));
};


export const useTeam = (teamId: string) => {
  const {value} = useObjectCrudFetch<TeamState>({
    id: teamId,
    defaultValue: DEFAULT_TEAM,
    url: API.TEAM.TEAMS()
  });
  return {
    team: value
  };
};

export const useTeamList = () => {
  const {loadList, values} = useListFetch<TeamState>({url: API.TEAM.TEAMS()});
  useEffect(() => {
    loadList();
  }, [loadList]);
  return {
    teams: values,
    loadTeams: loadList
  };
};
