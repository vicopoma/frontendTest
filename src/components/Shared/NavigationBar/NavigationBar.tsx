import React, { CSSProperties, ReactNode } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import './NavigationBar.scss';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

export interface NavigationBarState {
  leftBar?: Array<React.ReactNode>
  navTitle: ReactNode
  navigationRoute?: Route[]
  rightBar?: Array<React.ReactNode>
  style?: CSSProperties
  itemRender?: (route: Route, params: any, routes: Route[], paths: string[]) => JSX.Element
}

export const NavigationBar = ({navTitle, leftBar, rightBar, navigationRoute, style, itemRender}: NavigationBarState) => {
  
  return (
    <div className="bar-container">
      <Row gutter={[4, 4]} justify="space-between" align="middle">
        <Col>
          <Row gutter={[16, 0]} align="middle" style={style ?? {height: '41px'}}>
            <Col>
              {navTitle}
            </Col>
            <Col>
              {
                leftBar?.map((obj, index) => {
                  return <span key={index}> {obj}</span>
                })
              }
              <Breadcrumb
                separator={<RightOutlined style={{color: '#013369', width: '35px'}}/>}
                routes={navigationRoute}
                itemRender={itemRender ?? ((route, params, routes, paths) => {
                  const last = routes.indexOf(route) === routes.length - 1;
                  return last ? (
                    <span className={`navigation-bar${routes.length > 1 ? '-last' : ''}`}>{route.breadcrumbName}</span>
                  ) : (
                    <Link className="navigation-bar" to={route.path}>{route.breadcrumbName}</Link>
                  );
                })}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row align="middle" justify="center">
            {
              rightBar?.map((obj, index) => <div style={{display: 'flex'}} key={index}> {obj}</div>)
            }
          </Row>
        </Col>
      </Row>
    </div>
  );
};
