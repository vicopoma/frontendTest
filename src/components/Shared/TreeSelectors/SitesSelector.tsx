import React, { useCallback, useEffect, useState } from 'react';
import { SelectorTree } from '../TreeFormComponents/SelectorTree/SelectorTree';
import { TreeNode } from '../TreeFormComponents/TreeFormTypes';
import { Form } from 'antd';
import { OnChangeType } from '../../../Types/Types';
import { useAccountState } from '../../../hook/hooks/account';

interface SitesSelectorProps {
  key?: string, 
  name: string
  onChange?: (sites: Array<string>) => void,
  visible?: boolean,
  onApply?: OnChangeType, 
}

export const SitesSelector = ({key = '', onChange, onApply, name, visible = true} : SitesSelectorProps) => {
  const { account } = useAccountState();
  const { siteLocationList } = account;
  const [siteFilterSelector, setSiteFilterSelector] = useState<Array<TreeNode>>([]);
  const buildSitesFilterSelectorNode = useCallback((): TreeNode => {
    return {
      value: '0',
      name: 'Sites',
      display: 'Sites',
      icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
      className: 'filter-menu-select-first',
      children: siteLocationList.map((site, index) => ({
        value: site.name,
        name: site.name,
        display: site.name,
        icon: <img className="img-h anticon" src="/images/team-icon-02.svg" alt="" width="18px"/>,
        className: 'filter-menu-select-second',
        shown: true,
        id: site.name,
        children: site.zoneName.map(zone => ({
          value: zone,
          name: zone,
          display: zone,
          shown: true,
          id: zone,
        })),
      })),
      shown: visible,
      id: 'siteMenu'
    };
  }, [siteLocationList, visible]);
  
  useEffect(() => {
    setSiteFilterSelector([buildSitesFilterSelectorNode()]);
  }, [buildSitesFilterSelectorNode]);
  
  return (
    <Form.Item className='select-label-up'>
      <label className='label-select'>Sites</label>
      <SelectorTree
        placeholder="Sites"
        selectorTreeName={name}
        nodes={siteFilterSelector}
        icon={<img className="img-h anticon" src="/images/team-site-icon.svg" alt="" width="15px"/>}
        onChange={(dataPerLevel) => {
          onChange?.(Array.from(dataPerLevel[0]));
        }}
        isApply={onApply}
        selectAll={true}
        hideUniqueValue={true}
      />
    </Form.Item>
  )
}