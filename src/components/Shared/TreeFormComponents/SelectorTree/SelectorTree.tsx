import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, Button, Radio, Divider } from 'antd';
import './SelectorTree.scss';
import { DownOutlined } from '@ant-design/icons';
import { TreeNode } from '../TreeFormTypes';
import { useOnClickOutSideHandler } from '../../../../hook/customHooks/customHooks';
import { OnChangeType } from '../../../../Types/Types';

//this will only works for two levels

export interface SelectorTreeStorage {
  selectedValuesPerLevel: Array<Array<string>>,
  selectedValuePerNode: {[key: string]: Array<string>}
}
export interface Node {
  display: React.ReactNode,
  value: string,
  shown: boolean,
  check?: boolean
  className: string,
  children?: Array<Node>,
  unique?: boolean,
  selectAll?: boolean
}

interface SelectorTreeProps {
  disabled?: boolean,
  hideUniqueValue?: boolean,
  icon?: React.ReactNode,
  idSelector?: string,
  isApply?: OnChangeType,
  menuClassName?: string,
  nodes: Array<TreeNode>,
  onChange?: OnChangeType
  placeholder: string,
  reset?: number,
  selectorTreeName: string,
  selectAll?: boolean,
  style?: React.CSSProperties,
}

export const SelectorTree = ({ nodes, placeholder, icon, idSelector, onChange, isApply,  selectorTreeName, selectAll, reset, style, hideUniqueValue, menuClassName, disabled }: SelectorTreeProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [chosenOptionRenderPerLevel, setChoseOptionRenderPerLevel] = useState<Array<string>>([]);
  const [totalDataPerNode, setTotalDataPerNode] = useState<Array<{ [key: string]: { className?: string, data: Array<TreeNode> } }>>([]);
  const [totalDataPerLevel, setTotalDataPerLevel] = useState<Array<Set<string>>>([])
  const [parentNode, setParentNode] = useState<{ [key: string]: string }>({});
  const [parentNodeValue, setParentValue] = useState<{[key: string]: TreeNode}>({});
  const [nodeMapped, setNodeMapped] = useState<{[key: string]: TreeNode}> ({});
  const [uniqueLevel, setUniqueLevel] = useState< Set<number> > (new Set<number>());
  
  const [selectedValuesPerLevel, setSelectedValuesPerLevel] = useState<Array<Set<string>>>([])
  const [selectedValuePerNode, setSelectedValuePerNode] = useState<{ [key: string]: Set<string> }>({});
  
  const [root, setRoot] = useState<TreeNode>(nodes[0]);
  
  const build = useCallback((initial: TreeNode, callBack?: () => void) => {
    let q: Array<{ node: TreeNode, depth: number }> = []
    q.push({ node: initial, depth: 0 });
    let currentData: Array<{ [key: string]: { className?: string, data: Array<TreeNode> } }> = [];
    const setCopyData = (fun: Function) => {
      currentData = fun(currentData.map(data => data));
    }
    let pos = 0;
    while (pos < q.length) {
      const { node, depth } = q[pos++];
      
      let toRender: Array<TreeNode> = [];
      setNodeMapped(prevState => {
        return {
          ...prevState,
          [node.value]: node
        }
      });
      
      setTotalDataPerLevel(prevState => {
        const copy = [...prevState];
        if(!copy[depth]) {
          copy[depth] = new Set<string>();
        }
        copy[depth].add(node.value);
        return copy;
      })
      
      node?.children?.forEach(child => {
        setParentNode(prevState => {
          return {
            ...prevState,
            [child.value]: node.value
          }
        });
        
        setParentValue(prevState => {
          return {
            ...prevState,
            [child.value]: node,
          }
        });
        
        toRender.push(child);
        q.push({
          node: child,
          depth: depth + 1
        })
      });
      
      if (toRender.length > 0) {
        setCopyData((prevState: any) => {
          let copy = prevState;
          copy[depth] = {
            ...copy[depth],
            [node.value]: {
              data: toRender,
              className: node.className
            }
          }
          return copy;
        });
        
        setUniqueLevel(prevState => {
          const copy = prevState;
          if(node.unique) {
            copy.add(depth);
          }
          return copy;
        });
        
        setChoseOptionRenderPerLevel(prevState => {
          let copy = JSON.parse(JSON.stringify(prevState));
          if (!copy[depth]) {
            copy[depth] = node.value
          }
          return copy;
        });
        setSelectedValuesPerLevel(prevState => {
          let copy = prevState.map(data => data);
          if (!copy[depth]) {
            copy[depth] = new Set<string>();
          }
          if(depth === 0 || copy[depth - 1].has(node.value)) {
            if (node.unique) {
              copy[depth].add(toRender?.[0]?.value);
            } else {
              toRender.forEach(child => {
                copy[depth]?.add(child.value);
              });
            }
          }
          setSelectedValuePerNode(prevState => {
            let copyValuePerNode = { ...prevState }
            if (!copyValuePerNode[node.value]) {
              copyValuePerNode[node.value] = new Set<string>();
            }
            if(depth === 0 || copy[depth - 1].has(node.value)) {
              if (node.unique) {
                copyValuePerNode[node.value].add(toRender?.[0]?.value);
              } else {
                toRender.forEach(child => {
                  copyValuePerNode[node.value].add(child.value);
                });
              }
            }
            return copyValuePerNode;
          });
          return copy;
        });
    
      }
    }
    setTotalDataPerNode(currentData);
    callBack?.();
  }, []);
  
  
  const updateDownData = useCallback((node: TreeNode, checked: boolean, depth: number) => {
    let q: Array<{ node: TreeNode, depth: number }> = []
    q.push({ node, depth });
    
    let pos = 0;
    let copy: Set<string>[] = [];
    
    selectedValuesPerLevel.forEach((data, index) => {
      copy[index] = data;
    });
    let copyPerNode: { [key: string]: Set<string> } = {};
    Object.keys(selectedValuePerNode).forEach((key: string) => {
      copyPerNode[key] = selectedValuePerNode[key];
    });
    const perLevel = copy;
    while (pos < q.length) {
      const { node, depth } = q[pos++];
      
      if (checked) {
        if (depth >= 0 && depth < perLevel.length) {
          perLevel[depth]?.add(node?.value);
        }
        copyPerNode[parentNodeValue[node?.value]?.value]?.add(node?.value);
      } else {
        if (depth >= 0 && depth < perLevel.length) {
          perLevel[depth]?.delete(node?.value);
        }
        copyPerNode[parentNodeValue[node?.value]?.value]?.delete(node?.value);
      }
      if(!copy[depth - 1]) {
        copy[depth - 1] = new Set();
      }
      if(depth === 0 || copy[depth - 1].has(node.value)) {
        if (node.unique) {
          const child = node.children?.[0];
          if(child) {
            if (checked) {
              copyPerNode[node.value].add(child.value)
            } else {
              copyPerNode[node.value].delete(child.value);
            }
            q.push({
              node: child,
              depth: depth + 1
            })
          }
        } else {
          node?.children?.forEach(child => {
            if(!copyPerNode[node.value]) {
              copyPerNode[node.value] = new Set();
            }
            if (checked) {
              copyPerNode[node.value].add(child.value)
            } else {
              copyPerNode[node.value].delete(child.value);
            }
            q.push({
              node: child,
              depth: depth + 1
            })
          });
        }
      }
      
      node?.children?.forEach(child => {
        if(!copyPerNode[node.value]) {
          copyPerNode[node.value] = new Set();
        }
        if (checked) {
          copyPerNode[node.value].add(child.value)
        } else {
          copyPerNode[node.value].delete(child.value);
        }
        q.push({
          node: child,
          depth: depth + 1
        })
      });
    }
    setSelectedValuePerNode(copyPerNode);
    setSelectedValuesPerLevel(perLevel);
  } , [parentNodeValue, selectedValuePerNode, selectedValuesPerLevel]);
  
  const updateUpData = (node: TreeNode, checked: boolean, depth: number) => {
    let q: Array<{ node: string, depth: number }> = []
    q.push({ node: node.value, depth: depth })
    let pos = 0;
    let copy: Set<string>[] = [];
    selectedValuesPerLevel.forEach((data, index) => {
      copy[index] = data;
    });
    
    let copyPerNode: { [key: string]: Set<string> } = {};
    Object.keys(selectedValuePerNode).forEach((key: string) => {
      copyPerNode[key] = selectedValuePerNode[key];
    });
    
    while (pos < q.length) {
      const { node, depth } = q[pos++];
      const parent = parentNode[node];
      if(uniqueLevel.has(depth)) {
        updateRadioButton(nodeMapped[node], depth, checked);
      }
      if(!copy[depth]) {
        copy[depth] = new Set();
      }
      if(!copyPerNode[parent]) {
        copyPerNode[parent] = new Set();
      }
      if (checked) {
        copy[depth].add(node);
        if (parent !== undefined && depth - 1 >= 0) {
          copyPerNode[parent].add(node);
          copy[depth - 1].add(parent);
          q.push({ node: parent, depth: depth - 1 });
        }
      } else {
        copy[depth].delete(node);
        if (parent !== undefined) {
          copyPerNode[parent].delete(node);
          if (copyPerNode[parent].size === 0 && depth - 1 >= 0) {
            copy[depth - 1].delete(parent);
            q.push({ node: parent, depth: depth - 1 });
          }
        }
        
      }
    }
    setSelectedValuePerNode(copyPerNode);
    setSelectedValuesPerLevel(copy);
  }
  
  const updateRadioButton = (currentNode: TreeNode, depth: number, check: boolean) => {
    if(check) {
      parentNodeValue[currentNode.value]?.children?.forEach(child => {
        if(child.value !== currentNode.value) {
          updateDownData(child, false, depth)
        }
      });
    }
  };
  
  const defaultSelectPerLevel = useCallback(() => {
    const selectorTreeStorage: SelectorTreeStorage = JSON.parse(sessionStorage.getItem(selectorTreeName) || "{}");
    if (selectorTreeName) {
      if (selectorTreeStorage && Object.keys(selectorTreeStorage).length > 0) {
        setSelectedValuePerNode((prevState) => {
          const newState: any = {};
          for (const values in selectorTreeStorage.selectedValuePerNode) {
            newState[values] = new Set<string> (selectorTreeStorage.selectedValuePerNode[values])
          }
          return newState;
        });
        setSelectedValuesPerLevel(() => {
          const newState: Array<Set<string>> = [];
          for (const level in selectorTreeStorage.selectedValuesPerLevel) {
            newState[level] = new Set<string>(selectorTreeStorage.selectedValuesPerLevel[level]);
          }
          return newState;
        });
      }
    }
    if(reset && reset > 0 && root && Object.keys(selectorTreeStorage).length === 0) {
      root.children?.forEach((node) => {
        updateDownData(node, false, 0)
      })
    }
  }, [selectorTreeName]);
  
  const saveSelectedValues = useCallback(() => {
    let selectedLevelPerStorage: Array<Array<string>> = [];
    for (const level in selectedValuesPerLevel) {
      selectedLevelPerStorage[level] = Array.from(selectedValuesPerLevel[level]);
    }
    let selectedPerNodeStorage: {[key: string]: Array<string>} = {};
    for (const values in selectedValuePerNode) {
      selectedPerNodeStorage[values] = Array.from(selectedValuePerNode[values])
    }
    if(selectorTreeName) {
      sessionStorage.setItem(selectorTreeName, JSON.stringify({
        selectedValuesPerLevel: selectedLevelPerStorage,
        selectedValuePerNode: selectedPerNodeStorage
      }));
    }
  }, [selectedValuePerNode, selectedValuesPerLevel, selectorTreeName]);
  
  useEffect(() => {
    setSelectedValuesPerLevel([]);
    setSelectedValuePerNode({});
    setTotalDataPerNode([]);
    setChoseOptionRenderPerLevel([]);
    setRoot(nodes[0]);
  }, [nodes]);
  
  const [trigger, setTrigger] = useState(0);
  
  useEffect(() => {
    if (root) {
      build(root, () => {
        setTrigger(trigger => trigger + 1);
      });
    }
  }, [build, root]);
  
  useEffect(() => {
    if (root && trigger > 0) {
      defaultSelectPerLevel()
    }
  }, [root, defaultSelectPerLevel, trigger]);
  
  const dropDown = useRef(null);
  useOnClickOutSideHandler(dropDown, () => {
    setShowOptions(false);
  });

  useEffect(() => {
    if(reset && root && trigger > 0) {
      if(reset > 0) {
        root.children?.forEach((node) => {
          updateDownData(node, false, 0);
        })
      } else {
        if(root.unique) {
          const child = root.children?.filter(node => node.active)[0];
          if(child) {
            setChoseOptionRenderPerLevel(prevState => {
              let copy = JSON.parse(JSON.stringify(prevState));
              if(copy[1]) {
                copy[1] = child.value
              }
              return copy;
            });
            updateDownData(child, true, 0);
          }
        } else {
          root.children?.forEach((node) => {
            updateDownData(node, true, 0);
          })
        }
        
      }
    }
  }, [reset, trigger, root]);
  
  const lastLevel = selectedValuesPerLevel[selectedValuesPerLevel.length - 1];
  
  return (
    <div
      ref={showOptions ? dropDown : null}
      className="dropdown-menu-container"
      style={style}>
      <Button
        id={idSelector}
        icon={
          !!icon ? <div className="navigation-icon">
            {icon}
          </div> : <></>
        }
        className="dropdown-button"
        onClick={() => {
          setShowOptions(prevState => !!disabled ? prevState : !prevState);
        }}>
        <div className="navigation-text">
          {lastLevel?.size <= 1 && lastLevel?.size !== totalDataPerLevel[totalDataPerLevel?.length - 1]?.size && ((lastLevel?.size === 1 && hideUniqueValue) ? `Multiple (${lastLevel.size})` : Array.from(lastLevel).map(value => nodeMapped[value]?.display ?? <div />))}
          {lastLevel?.size === totalDataPerLevel[totalDataPerLevel?.length - 1]?.size && `All (${lastLevel?.size})`}
          {lastLevel?.size > 1 && lastLevel.size < totalDataPerLevel[totalDataPerLevel?.length - 1]?.size && `Multiple (${lastLevel.size})`}
          {lastLevel?.size === 0 && `${placeholder} (None)` }
          {/* <img className="button-arrow" src="/images/down-arrow.png" alt="" width="20px"/> */}
          <DownOutlined style={{ color: 'var(--blue-dark)' }} />
        </div>
      </Button>
      {
        showOptions && (
          <div
            className={`${menuClassName ?? 'filter-menu'}`}
          >
            {
              (selectAll || !!isApply) && (
                <div key="menuHead" className="filter-menu-head">
                  {
                    selectAll && <Checkbox
                        key={selectedValuePerNode[root?.value]?.size + '' + totalDataPerNode[0]?.[root.value]?.data.length}
                        checked={selectedValuesPerLevel[0]?.size === totalDataPerNode[0]?.[root.value].data.length}
                        onChange={async (e) => {
                          root.children?.forEach(data => {
                            updateDownData(data, e.target.checked, 0)
                          })
                          onChange?.(selectedValuesPerLevel, selectedValuePerNode);
                          saveSelectedValues();
                        }}>
                        All
                    </Checkbox>
                  }
                  {
                    !!isApply && <div
                        className="btn-green button-apply"
                        id="SelectTreeApply"
                        onClick={() => {
                          isApply?.(selectedValuesPerLevel, selectedValuePerNode);
                          setShowOptions(prevState => !prevState);
                          saveSelectedValues();
                        }}>
                        Apply
                    </div>
                  }
                </div>
              )
            }
            <div key="menuBody" className="filter-menu-body">
              {
                totalDataPerNode.map((data, index) => {
                  return Object.keys(data).map((key: string, keyIndex) => {
                    const currentData = data[key];
                    const currentNode = nodeMapped[key];
                    if (key === chosenOptionRenderPerLevel[index]) {
                      return (
                        <div key={index} className={currentData.className + ' blue-scroll'}>
                          {
                            !uniqueLevel.has(index) && index > 0 && (
                              <>
                                <Checkbox
                                  id={currentNode.value + '-select-all'}
                                  indeterminate={selectedValuePerNode[currentNode.value]?.size > 0 && selectedValuePerNode[currentNode.value]?.size < totalDataPerNode[index]?.[currentNode.value]?.data?.length}
                                  checked={selectedValuePerNode[currentNode.value]?.size > 0 || selectedValuesPerLevel[index]?.has(currentNode.value)}
                                  onChange={async (e) => {
                                    updateDownData(currentNode, e.target.checked, index - 1);
                                    updateUpData(currentNode, e.target.checked, index - 1);
                                    onChange?.(selectedValuesPerLevel, selectedValuePerNode);
                                    saveSelectedValues();
                                  }}>
                                  All
                                </Checkbox>
                                <Divider style={{background: 'grey', height: '2px', margin: '5px 0'}}/>
                              </>
                            )
                          }
                          {
                            currentData.data.map((values, index2) => {
                              return (
                                values.shown && (
                                  <div
                                    key={index2}
                                    className={`check-filter ${values.value === chosenOptionRenderPerLevel[index + 1] ? 'selected' : ''}`}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row'
                                    }}
                                  >
                                    {
                                      !uniqueLevel.has(index) ?
                                        <Checkbox
                                          id={values.id}
                                          indeterminate={selectedValuePerNode[values.value]?.size > 0 && selectedValuePerNode[values.value]?.size < totalDataPerNode[index + 1]?.[values.value]?.data?.length}
                                          checked={selectedValuePerNode[values.value]?.size > 0 || selectedValuesPerLevel[index]?.has(values.value)}
                                          onChange={(e) => {
                                            updateDownData(values, e.target.checked, index);
                                            updateUpData(values, e.target.checked, index);
                                            onChange?.(selectedValuesPerLevel, selectedValuePerNode);
                                            saveSelectedValues();
                                          }}
                                        /> : (
                                          <Radio
                                            id={values.id}
                                            checked={selectedValuePerNode[values.value]?.size > 0 || selectedValuesPerLevel[index]?.has(values.value)}
                                            onChange={(e) => {
                                              updateDownData(values, e.target.checked, index);
                                              updateUpData(values, e.target.checked, index);
                                              onChange?.(selectedValuesPerLevel, selectedValuePerNode);
                                              saveSelectedValues();
                                              let copy = JSON.parse(JSON.stringify(chosenOptionRenderPerLevel));
                                              copy[index + 1] = values.value;
                                              setChoseOptionRenderPerLevel(copy);
                                            }}
                                          />
                                        )
                                    }
                                    <div
                                      key={values.id + selectedValuesPerLevel[index]?.has(values.value) + index2}
                                      className={`check-filter ${values.value === chosenOptionRenderPerLevel[index + 1] ? 'selected' : ''}`}
                                      onClick={() => {
                                        let copy = JSON.parse(JSON.stringify(chosenOptionRenderPerLevel));
                                        copy[index + 1] = values.value;
                                        setChoseOptionRenderPerLevel(copy);
                                      }}
                                    >
                                      <div className="check-filter-item">
                                        <span>
                                          {values?.display}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            })
                          }
              
                        </div>
                      )
                    }
                    return <div key={keyIndex + index} />
                  });
                })
              }
            </div>
          </div>
        )
      }
    </div>
  )
}
