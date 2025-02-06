import React, { useEffect } from 'react';
import { ACCOUNT_ROLES } from '../constants/constants';
import { useSiteList } from '../hook/customHooks/sites';
import { useAccountState } from '../hook/hooks/account';
import { SiteState } from '../store/types';

type ConfigurationContextType = {
  sites: Array<SiteState>
}

const ConfigurationContext = React.createContext<ConfigurationContextType>({
  sites: []
});

export const ConfigurationProvider: React.FC<ConfigurationContextType> = ({ children }) => {
  const {account} = useAccountState();
  const isOem = account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  const { siteList: { sites, getSites }} = useSiteList();

  useEffect(() => {
    if(!isOem) {
      getSites();
    }
  }, [getSites, isOem]);
  
  return (
    <ConfigurationContext.Provider value={{
      sites: sites
    }}>
      {children}
    </ConfigurationContext.Provider>
  )
};

export const useConfigurationContext = () => React.useContext(ConfigurationContext);