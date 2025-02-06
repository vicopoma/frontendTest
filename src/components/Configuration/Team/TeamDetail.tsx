import React from 'react';
import { GeneralInformation } from './TeamDrawer/GeneralInformation';
import { DetailLayout } from '../../Shared/DetailLayout/DetailLayout';
import { useLocation } from 'react-router';
import { useTeam } from '../../../hook/hooks/team';
import { NavigationBar } from '../../Shared/NavigationBar/NavigationBar';
import { ConfigurationKeys, ROUTES } from '../../../settings/routes';

export const TeamDetail = () => {
  
  const paths = useLocation().pathname.split('/');
  const teamId = paths[paths.length - 1];
  
  const {team} = useTeam(teamId);
  
  return <>
    <DetailLayout
      width={'35%'}
      canModify={false}
      onChange={() => {
      }}
    >
      <NavigationBar
        navTitle={
          <div className="navigationbar-header-configuration">
            <span className="navigation-bar-configuration">Teams</span>
          </div>
        }
        navigationRoute={[
          {
            path: ROUTES.CONFIGURATION.PAGE(ConfigurationKeys.TEAMS),
            breadcrumbName: 'Teams List'
          },
          {
            path: '',
            breadcrumbName: team.fullName
          }
        ]}
      />
      <div>
        <GeneralInformation team={team}/>
      </div>
    </DetailLayout>
  </>;
};
