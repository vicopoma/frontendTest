import React from 'react';
import { Button, Col, Row } from 'antd';

import { ROUTES } from '../../settings/routes';
import { history } from '../../store/reducers';
import './NotFound.scss';


export const NotFound = () => {
  return (
    <div className="not-found-body">
      <div className="image-background">
        <Row>
          <Col>
            <Row>
              <Col span={24}>
                <img src="/images/error-messages/404.svg" style={{height: '50vh'}} alt="404"/>
              </Col>
            </Row>
            <Row>
              <Col>
                <p style={{textAlign: 'center', color: '#052c6e', fontSize: '25px'}}><b>Oops! Page not found</b></p>
                <p style={{fontSize: '20px'}}>The Page you are looking for doesn't exist or an other error accurred.</p>
                <Button
                  className="go-home-button"
                  onClick={() => {
                    history.push(ROUTES.HOME.PAGE());
                  }}
                >
                  Go Home
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};
