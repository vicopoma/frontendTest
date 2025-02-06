import React, { useCallback, useEffect, useState } from "react";
import { useAccountState } from "../../../hook/hooks/account";
import { OnChangeType } from "../../../Types/Types"
import { SelectorTree } from "../TreeFormComponents/SelectorTree/SelectorTree"
import { TreeNode } from "../TreeFormComponents/TreeFormTypes";
import { Form } from 'antd';
import { Season } from "../../../store/types";

interface SeasonWeekSelectorProps {
  name: string,
  onChange?: OnChangeType,
  onApply?: OnChangeType,
  reset?: number,
}

export const SeasonWeekSelector = ({ name, onChange, onApply, reset}: SeasonWeekSelectorProps) => {

  const {account} = useAccountState();
  const {seasonList} = account;

  const [subMenuTree, setSubMenuTree] = useState<Array<TreeNode>>([]);
  const [curSeasonList, setCurSeasonList] = useState<Array<Season>>(seasonList);
  
  useEffect(() => {
    setCurSeasonList(() => 
      seasonList.sort((a: Season, b: Season) => {
        if(a.active) return -1;
        if(b.active) return 1;
        return b.id.localeCompare(a.id);
      }).map((season, id) => {
          if(id === 0) {
            return { ...season, active: true }
          }
          return season;
        }
      )
    )
  }, [seasonList, setCurSeasonList]);

  const buildSubTreeNodeFromSeasonWeek = useCallback((): TreeNode => {
    return {
      name: 'Season-Week',
      id: '5',
      value: 'season/week',
      display: 'Season-Week',
      shown: true,
      unique: true,
      className: 'filter-menu-select-first',
      selectAll: true,
      showSelectAll: false,
      children: curSeasonList?.map((season, index) => ({
        name: season.id + '',
        id: season.id + '',
        value: season.id + '',
        display: season.title + '',
        shown: true,
        className: 'filter-menu-select-second',
        selectAll: true,
        showSelectAll: true,
        active: season.active,
        children: season.weekList.map((week, index) => ({
          name: `${week.id}|${season.id}`,
          id: `${week.id}|${season.id}`,
          value: `${week.id}|${season.id}`,
          display: `${week.title}`,
          shown: true,
          checkbox: {
            checked: false
          }
        }))
      })),
    }
  }, [curSeasonList]);

  useEffect(() => {
    setSubMenuTree([buildSubTreeNodeFromSeasonWeek()]);
  }, [buildSubTreeNodeFromSeasonWeek]);

  return (
    <Form.Item className='select-label-up'>
      <label className='label-select'>Season/weeks</label>
      <SelectorTree
        selectorTreeName={name}
        placeholder='Season - Week'
        nodes={subMenuTree}
        icon={<img className="img-h anticon" src="/images/activity/calendar-week.svg" alt="" width="15px" height="14px"/>}
        onChange={onChange}
        isApply={onApply}
        reset={reset}
      />
    </Form.Item>
  )
}