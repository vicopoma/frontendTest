import React, { ReactNode, useRef, useState } from 'react';
import './CollapsableSubMenu.scss';

export const CollapsableSubMenu = ({children, title, icon, valueOfNode}: {
  children?: ReactNode
  title?: ReactNode,
  icon?: ReactNode,
  valueOfNode?: string,
}) => {
  
  
  const maxHeight = '200px';
  const divContentRef = useRef<any>(null);
  const [expand, setExpand] = useState<boolean>(true);
  return (
    <>
      <div>
        <table>
          <tbody>
          <tr className="row">
            <th>
              {icon}
            </th>
            <th
              className="col"
              onClick={() => {
                if (divContentRef.current) {
                  if (divContentRef.current.style.maxHeight) {
                    setExpand(true);
                    divContentRef.current.style.maxHeight = null;
                  } else {
                    setExpand(false);
                    divContentRef.current.style.maxHeight = maxHeight;
                  }
                }
              }}
            >
              <table>
                <tbody>
                <tr>
                  <th>
                    <button
                      type="button"
                      className="collapsible">
                      {title}
                    </button>
                  </th>
                  <th>
                    {
                      valueOfNode !== 'unAssigned' &&
                      <img alt="" src={`/images/${expand ? 'expand' : 'contract'}.png`} width="7px"/>
                    }
                  
                  </th>
                </tr>
                </tbody>
              </table>
            </th>
          </tr>
          </tbody>
        </table>
      </div>
      <div ref={divContentRef} className="content">
        <div className="inside">
          {children}
        </div>
      </div>
    </>
  );
};
