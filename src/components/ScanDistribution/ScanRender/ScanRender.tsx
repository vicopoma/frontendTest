import React, { useCallback } from 'react';
import { Collapse } from 'antd';

interface ScanRenderProps {
  data: Node
}

interface Node {
  className?: string
  children?: Array<Node>,
  header?: React.ReactNode,
  body?: React.ReactNode,
  headerClassName?: string,
  key: string,
  id?: string,
}

export const ScanRender = ({ data } : ScanRenderProps ) => {
  const renderNodes = useCallback((currentNode: Node) : React.ReactNode => {
    if(!currentNode.children) {
      return (
        <Collapse.Panel id={currentNode.id ? currentNode.id : ''} className={currentNode.headerClassName} key={currentNode.id ?? ''} header={currentNode.header}>
          {currentNode.body}
        </Collapse.Panel>
      )
    }
    return (
      currentNode.children?.map(value =>
        <Collapse.Panel  id={value.id ? value.id : ''} className={value.headerClassName} key={value.id ?? ''} header={value.header}>
          {value.body}
          {
            value.children && (
              <Collapse destroyInactivePanel={true}>
                { value.children?.map(child => renderNodes(child)) }
              </Collapse>
            )
          }
        </Collapse.Panel>
      )
    )
  }, []);
  
  return (
    <Collapse destroyInactivePanel={true}>
      { renderNodes(data) }
    </Collapse>
  )
}