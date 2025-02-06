import React from 'react';

export interface TreeNode {
  active?: boolean
  name: string,
  display: React.ReactNode,
  value: string,
  id: string,
  children?: Array<TreeNode>,
  shown: boolean,
  icon?: React.ReactNode,
  className?: string,
  unique?: boolean,
  selectAll?: boolean,
  showSelectAll?: boolean,
  checkbox?: {
    checked: boolean
  }
}