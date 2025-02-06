import React, { useCallback, useEffect, useState } from 'react';
import { SelectorTree } from '../TreeFormComponents/SelectorTree/SelectorTree';
import { TreeNode } from '../TreeFormComponents/TreeFormTypes';
import { useRolesList } from '../../../hook/hooks/roles';

interface RoleSelectorProps {
  disabled: boolean,
  selectorKey?: string, 
  name: string
  onChange?: (teams: Array<string>) => void,
  visible?: boolean,
  selectedValues: { roleId: string }[],
}

export const RoleSelector = ({
  disabled,
  selectorKey = '', 
  onChange, 
  name, 
  selectedValues, 
  visible = true
} : RoleSelectorProps) => {
  const { roles } = useRolesList();
  const [teamFilterSelector, setTeamFilterSelector] = useState<Array<TreeNode>>([]);
  const buildTeamsFilterSelectorNode = useCallback((): TreeNode => {
    return {
      value: '0',
      name: 'Roles',
      display: 'Roles',
      className: 'filter-menu-select-first',
      children: roles.map((role, index) => ({
        value: role.id,
        name: role.name,
        display: role.name,
        icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
        className: 'filter-menu-select-second',
        shown: true,
        id: role.name,
        checkbox: {
          checked: selectedValues.filter(value => value.roleId === role.id).length > 0,
        },
      })),
      shown: visible,
      id: 'roleMenu',
      
    };
  }, [roles, visible]);
  
  useEffect(() => {
    setTeamFilterSelector([buildTeamsFilterSelectorNode()]);
  }, [buildTeamsFilterSelectorNode]);
  
  return (
    <SelectorTree
      disabled={disabled}
      placeholder="Roles"
      selectorTreeName={name}
      nodes={teamFilterSelector}
      onChange={(dataPerLevel) => {
        onChange?.(Array.from(dataPerLevel[0]));
      }}
      selectAll={true}
      menuClassName="roles-filter-menu"
    />
  )
}