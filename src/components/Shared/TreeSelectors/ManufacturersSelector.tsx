import React, { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import { TreeNode } from '../TreeFormComponents/TreeFormTypes';
import { ManufacturerWithModel } from '../../../store/types';
import { SelectorTree } from '../TreeFormComponents/SelectorTree/SelectorTree';
import { OnChangeType } from '../../../Types/Types';
import { useManufacturerWithModelContext } from '../../../context/manufacturerAndModelContext';

interface ManufacturersSelectorProps {
  name: string,
  equipmentType: string,
  onChange?: OnChangeType,
  onApply?: OnChangeType,
  key2?: string
}

export const ManufacturersSelector = ({ equipmentType, onChange, name, onApply, key2}: ManufacturersSelectorProps) => {
  
  const [subMenuTree, setSubMenuTree] = useState<Array<TreeNode>>([]);
  const { allManufacturerObjects } = useManufacturerWithModelContext();

  const buildSubTreeNodeFromManufacturer = useCallback(
    (manufacturerWithModels: Array<ManufacturerWithModel>): TreeNode => {
      return {
        name: 'Manufacturer',
        id: '5',
        value: '0',
        display: 'Manufacturer',
        icon: <img className="img-h anticon" src="/images/manufacturer-icon.svg" width="16px" alt=""/>,
        shown: true,
        className: 'filter-menu-select-first',
        children: manufacturerWithModels.map((manufacturer, index) => {
          return {
            name: manufacturer.nameManufacturer,
            display: manufacturer.nameManufacturer,
            shown: true,
            id: manufacturer.nameManufacturer + '',
            checkbox: {
              checked: true,
            },
            className: 'filter-menu-select-second',
            children: manufacturer.models.map((models, index) => {
              return {
                name: models.nameModel,
                display: <span style={{fontSize: '12px'}}> {models.nameModel} </span>,
                value: `${models.id}|${manufacturer.id}`,
                id: models.nameModel + '',
                shown: true,
                checkbox: {
                  checked: true,
                },
              };
            }),
            value: manufacturer.id,
          };
        })
      };
    }, []);

  useEffect(() => {
    setSubMenuTree([buildSubTreeNodeFromManufacturer(allManufacturerObjects?.[equipmentType] ?? [])]);
  }, [allManufacturerObjects, buildSubTreeNodeFromManufacturer, equipmentType]);
  
  return (
    <Form.Item className='select-label-up'>
      <label className='label-select'>Manufacturers</label>
      <SelectorTree
        key={equipmentType + allManufacturerObjects?.[equipmentType]?.length + key2}
        style={{ minWidth: '185px' }}
        selectAll
        selectorTreeName={name}
        placeholder="Manufacturers"
        icon={ <img src="/images/manufacturer-icon.svg" alt="" width="16px"/> }
        nodes={subMenuTree}
        onChange={onChange}
        isApply={onApply}
      />
    </Form.Item>
  )
}