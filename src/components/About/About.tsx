import React from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { Layout } from 'antd/es';
import { LinkOutlined } from '@ant-design/icons';

import './About.scss';
import { useReleaseNotes } from '../../hook/customHooks/customHooks';

export const About = () => {
  
  const {notes} = useReleaseNotes();
  
  return (
    <Layout>
      <div className="card-container-about scan-device-ds9908">
        <div>
          <Row gutter={[16, 16]}>
            <Col>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={20} md={14} lg={16} xl={18}>
                  <div className="about-description">
                    <p>
                      This page will house release notes, information about new feature release,
                      links to documents for reference, reports and general announcements. Please
                      check this page periodically for updates.
                    </p>
                    <Divider/>
                    <div className="about-list">
                      <h3>New Features and Updates</h3>
                      {
                        notes.map(note => (
                          <div key={note.version}>
                            <h4> {note.version} - {note.description}</h4>
                            <ul>
                              {
                                note.features.map((feature, index) => (
                                  <li key={`${note.version}-${index}`}> {feature}</li>
                                ))
                              }
                            </ul>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={10} lg={8} xl={6} style={{backgroundColor: 'var(--blue-light)'}}>
                  <div className="drawer_config about-body">
                    <div className="drawer_body_config">
                      <h5 style={{marginBottom: '15px'}}>Important Documents Links</h5>
                      <div className="info_body_back">
                        <Button
                          className="btn-blue-link"
                          icon={<LinkOutlined/>}
                          href="/files/Player Health and Safety Tagging Guide 2024.pdf"
                        >
                          <div className="text-link">Health and Safety Tagging Guide</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/Virtual Locker Mobile App 2024.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Virtual Locker Mobile App</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/Virtual Locker Web Portal 2024.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Virtual Locker Web App</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/OEM Virtual Locker 2024.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Virtual Locker OEM Web App</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/Virtual Locker Helmet Guide 2024.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Virtual Locker Helmet Guide</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/Zebra Handheld Scanners 2024.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Zebra Handheld Scanners</div>
                        </Button>
                        <Button
                          className="btn-blue-link"
                          href="/files/Zebra Virtual Locker Release Kickoff.pdf"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Zebra Virtual Locker Release Kickoff</div>
                        </Button>
                        {/*<Button
                          className="btn-blue-link"
                          href="https://zebra-my.sharepoint.com/:f:/p/kjoachim/EhlTVKaoxk9MsJo1dYoqS7kBqSKVsXJNEyNinW5Jl-26HQ?e=6DOC02"
                          icon={<LinkOutlined/>}
                        >
                          <div className="text-link">Player Health and Safety Training Videos</div>
                        </Button>*/}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <div className="about-footer">
        <Divider/>
        <div className="footer">
          <img src="images/logo-zebra-black.svg" alt=""/> <span> © Zebra Technologies</span>
        </div>
      </div>
    </Layout>
  );
};
