import { Button, Col, Input, Row, Switch } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import ReactShortcut from 'react-shortcut';
import { useLocation } from 'react-router';
import './ScanGraph.scss'

import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { useScanFunctions } from '../../../../hook/customHooks/scan';
import { useLoaderDispatch } from '../../../../hook/hooks/loader';
import { TagGraphics } from '../../../Shared/TagGraphicator/TagGraphicator';

export const ScanGraph = ({ goBack } : { goBack: () => void}) => {

  const { pathname } = useLocation();
  const { showLoader } = useLoaderDispatch();
  const path = pathname.split('/');
  const activityId = path[path.length - 1];

  const [isNoisy, setIsNoisy] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [loaded, setLoader] = useState<boolean> (false);
  const [tagId, setTagId] = useState<string> ('');

  const { scanTagList: { loadTagTimeList, tagTimeList } } = useScanFunctions();

  useEffect(() => {
    setLoader(false);
    setTrigger(false);
    showLoader(true);
    loadTagTimeList(activityId, isNoisy + '', tagId, () => {
      setLoader(true);
      showLoader(false);
    }, () => showLoader(false));
  }, [loadTagTimeList, showLoader, activityId, isNoisy, tagId]);

  useEffect(() => {
    if(tagTimeList.tagTimeRawBlinkList.length > 0 || loaded) {
      setTrigger(true);
    }
  }, [tagTimeList, showLoader, loaded])

  return (
    <div className="layout-graph-back">
      <Row justify="space-between">
        <Col>
          <Row gutter={[16,16]}>
            <Col>
              <Switch onChange={e => setIsNoisy(e)} /> Without noisy data
            </Col>
            <Col>
              <Input.Search size="small" placeholder="Tag ID" onSearch={value => setTagId(value)}/>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button onClick={goBack}> Go back </Button>
        </Col>
      </Row>
      {
        trigger && (
          <TagGraphics
            data={tagTimeList.tagTimeRawBlinkList.map(data => {
              return {
                x: moment(data.date).local().unix(),
                y: hexToAscii(data.tagAscii)
              }
            })}
            color={isNoisy ? 'green' : 'blue'}
          />
        )
      }
      <ReactShortcut
        keys="g r a p h v i e w"
        onKeysPressed={() => {

        }}
      />
    </div>
  )
}