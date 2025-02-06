import React, { useCallback, useEffect, useState } from 'react';
import { SelectorTree } from '../TreeFormComponents/SelectorTree/SelectorTree';
import { TreeNode } from '../TreeFormComponents/TreeFormTypes';
import { useAccountState } from '../../../hook/hooks/account';
import { Form } from 'antd';

interface TeamsSelectorProps {
  selectorKey?: string, 
  name: string
  onChange?: (teams: Array<string>) => void,
  visible?: boolean
}

export const TeamsSelector = ({selectorKey = '', onChange, name, visible = true} : TeamsSelectorProps) => {
  const {account} = useAccountState();
  const {teamList} = account;
  const [teamFilterSelector, setTeamFilterSelector] = useState<Array<TreeNode>>([]);
  const buildTeamsFilterSelectorNode = useCallback((): TreeNode => {
    return {
      value: '0',
      name: 'Teams',
      display: 'Teams',
      icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
      className: 'filter-menu-select-first',
      children: teamList.map((team, index) => ({
        value: team.teamId,
        name: team.fullName,
        display: team.fullName,
        icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
        className: 'filter-menu-select-second',
        shown: true,
        id: team.abbr,
      })),
      shown: visible,
      id: 'teamMenu'
    };
  }, [teamList, visible]);
  
  useEffect(() => {
    setTeamFilterSelector([buildTeamsFilterSelectorNode()]);
  }, [buildTeamsFilterSelectorNode]);
  
  return (
    <Form.Item className='select-label-up'>
      <label className='label-select'>Teams</label>
      <SelectorTree
        placeholder="Teams"
        selectorTreeName={name}
        nodes={teamFilterSelector}
        icon={<img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="15px"/>}
        onChange={(dataPerLevel) => {
          onChange?.(Array.from(dataPerLevel[0]));
        }}
        selectAll={true}
      />
    </Form.Item>
  )
}