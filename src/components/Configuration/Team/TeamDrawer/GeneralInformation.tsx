import React from 'react';

import { Col, Form, Row } from 'antd';
import { Input } from '../../../Shared/CustomInput/CustomInput';
import Image from '../../../Shared/Image/Image';
import { TeamState } from '../../../../store/types';

export const GeneralInformation = ({team}: { team: TeamState }) => {
  
  let pathLogo = `/images/teams/logos/${team.abbr}.svg`;
  
  return (
    <div className="drawer_config">
      <h5>Information Team</h5>
      <div className="drawer_body_config">
        <Form layout="vertical">
          <Row align={'middle'} gutter={[16, 16]}>
            <Col span={10} offset={6}>
              <div className="card-player">
                <img src={pathLogo} alt=""
                     width="100"/>
                <Image key={team.teamId} src={pathLogo} srcDefault={'/images/team-icon.svg'} alt="logo" width="100"/>
              </div>
            </Col>
            <Col span={24}>
              <Row align={'middle'} gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Name :">
                    <Input isInput={false} value={team.fullName}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="City :">
                    <Input isInput={false} value={team.city}/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Stadium :">
                    <Input isInput={false} value={team.statium}/>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
  
};
