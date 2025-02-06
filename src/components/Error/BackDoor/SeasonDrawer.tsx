import React, { useEffect, useState } from 'react';
import { Col, DatePicker, Form, InputNumber, Row } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment-timezone';

import { Drawer } from '../../Shared/Drawer/Drawer';
import { DATE_FORMATS, SEASON } from '../../../constants/constants';
import { SeasonBackTool, useSeasonFunctions } from '../../../hook/customHooks/backdoor';
import { ConfirmationModal } from '../../Shared/Modals/Modals';
import { seasonDrawerValidators } from '../../../constants/validators';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';

export const SeasonDrawer = ({showDrawer, seasonId, setSeasonId, closeDrawer, filterName}: {
  showDrawer: boolean,
  closeDrawer: Function,
  filterName?: string,
  seasonId: string,
  setSeasonId: any,
}) => {

  const { season, createSeason, loadSeason, updateSeason } = useSeasonFunctions(seasonId);
  const curYear = moment().year() + '';

  useEffect(() => {
    if(seasonId) {
      loadSeason();
    }
  }, [seasonId, loadSeason]);
  
  const {values, setFieldValue, validateForm, resetForm, errors} = useFormik({
    initialValues: {
      active: season.active ?? true,
      createBy: season.createBy ?? '', 
      endDate: season.endDate ? moment(season.endDate).utc().toISOString(): '',
      id: season.id ?? '', 
      season: season.season ?? curYear,
      startDate: season.startDate ? moment(season.startDate).utc().toISOString(): '',
    },
    validationSchema: seasonDrawerValidators,
    enableReinitialize: true,
    onSubmit(values: SeasonBackTool) {
      //intentionally empty
    }
  });
  
  const { bodyFilter: seasonBodyFilter, addBodyFilter } = useBodyFilterParams(SEASON);
  const [checkSubmitValidator, setCheckSubmitValidator] = useState<boolean>(false);
  const [, setTrigger] = useState<number>(seasonBodyFilter?.trigger ?? 0);

  
  
  return (
    <Drawer
      title={`${seasonId ? 'EDIT' : 'CREATE'} SEASON`}
      onClose={() => {
        resetForm();
        closeDrawer();
        setCheckSubmitValidator(false);
        setSeasonId('');
      }}
      canModify={true}
      enableSaveButton={(seasonId && !season.active) || !seasonId}
      width="30%"
      visible={showDrawer}
      onChange={() => {
        setCheckSubmitValidator(true);
        validateForm(values).then((result) => {
          if(Object.keys(result).length === 0) {
            if(seasonId) {
              ConfirmationModal('Update Season', 
                <div>
                  Are you sure to update the season <b>{`${values.season}`}</b>?
                </div>
              , () => {
                setCheckSubmitValidator(false);
                updateSeason(values, () => {
                  setTrigger(prevState => {
                    addBodyFilter({
                      trigger: prevState + 1,
                    })
                    return prevState + 1;
                  })
                  closeDrawer();
                });
              });
            } else {
              ConfirmationModal('Create Season', 
                <div>
                  Are you sure to create a new season <b>{`${values.season}`}</b>?
                </div>
              , () => {
                setCheckSubmitValidator(false);
                createSeason(values, () => {
                  setTrigger(prevState => {
                    addBodyFilter({
                      trigger: prevState + 1,
                    });
                    return prevState + 1;
                  });
                  closeDrawer();
                });
              })
            }
          }
        });
      }}
      // alertResponse={rebuildResponse}
      extraButton={
        <></>
      }
      enableExtraButton={false}
    >
      <Form layout="vertical" className="modal-activity" onSubmitCapture={() => {}/*handleSubmit*/}>
        <div className="drawer_config">
          <h5>Information</h5>
          <div className="">
            <div className="drawer_body_config">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Season Name">
                    <InputNumber 
                      disabled={!!seasonId}
                      onChange={value => setFieldValue('season', value)}
                      placeholder='Enter a season'
                      style={{ width: '100%'}}
                      value={values.season ?? curYear}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.season && <span className="form-feedback">{errors.season}</span>}
                </Col>
                <Col span={24}>
                  <Form.Item label="Start Date">
                    <DatePicker
                      disabled={(!seasonId || season.active) && !!seasonId}
                      format={DATE_FORMATS.monthDayYearHourMin}
                      onChange={(value) => {
                        setFieldValue('startDate', value ? value : '');
                      }}
                      picker='date'
                      showTime
                      style={{width: '100%'}}
                      value={values.startDate ? moment(values.startDate) : undefined}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.startDate && <span className="form-feedback">{errors.startDate}</span>}
                </Col>
                <Col span={24}>
                  <Form.Item label="End Date">
                    <DatePicker
                      disabled={(!seasonId || season.active) && !!seasonId}
                      format={DATE_FORMATS.monthDayYearHourMin}
                      onChange={(value) => {
                        setFieldValue('endDate', value ? value : '');
                      }}
                      picker='date'
                      showTime
                      style={{width: '100%'}}
                      value={values.endDate ? moment(values.endDate): undefined}
                    />
                  </Form.Item>
                  {checkSubmitValidator && errors.endDate && <span className="form-feedback">{errors.endDate}</span>}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};
