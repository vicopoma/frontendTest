import React from 'react';
import { Col, DatePicker, Form, Input, Row, Select, Switch } from 'antd';
import { usePlayersState } from '../../../hook/hooks/players';
import { PlayerState } from '../../../store/types/players';
import { useAccountState } from '../../../hook/hooks/account';
import Image from '../../Shared/Image/Image';
import { FormikErrors } from 'formik';
import { dateFormat, datePickerFormat } from '../../../constants/constants';
import moment from 'moment';

type Props = {
  values: PlayerState,
  handleChange: any,
  errors: FormikErrors<PlayerState>,
  setFieldValue: Function,
  handleBlur: any,
  touched: any,
}

export const PlayerProfile = ({values, handleChange, errors, setFieldValue, handleBlur, touched,}: Props) => {
  
  const {player} = usePlayersState();
  const {account} = useAccountState();
  const {teamList} = account;
  
  const teamsSelect: JSX.Element[] = [];
  teamList.forEach((team, index: number) => {
    // teamsSelect.push(<Option key={index} value={team.teamId}> {team.fullName}</Option>)
    let path = `/images/teams/logos/${team.abbr}.svg`;
    teamsSelect.push(<Select.Option
      id={`cPlayerTeam-${team.fullName}`}
      key={index}
      value={team.teamId}
    >
      <Row>
        <Col span={6}>{team.fullName}</Col>
        <Col span={6}><Image key={team.teamId} src={path} srcDefault={'/images/team-icon.svg'} alt="logo" width="25px"
                             style={{marginLeft: '10%'}}/></Col>
      </Row>
    </Select.Option>);
  });
  
  return <div className="header_drawer" style={{width: 'auto'}}>
    <div>
      <div className="header_drawer_title_equip">
        <label>General</label>
      </div>
      
      {/* <div className="drawer_body_config"> */}
      <Row align={'middle'} gutter={[16, 16]}>
        <Col span={4}>
          <div className="card-player">
            <img alt="" width={100}/>
          </div>
        </Col>
        <Col offset={2} span={18}>
          <Form layout="vertical">
            <Row align={'middle'} gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label={<span className="required-item">First Name</span>} help={!!errors.firstName && ''}>
                  <Input disabled={player.imported} value={values.firstName} name="firstName" onChange={handleChange}
                         placeholder="first name"/>
                  {touched.firstName && errors.firstName && <span className="form-feedback"> {errors.firstName}</span>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Last Name</span>} help={!!errors.lastName && ''}>
                  <Input disabled={player.imported} value={values.lastName} name="lastName" onChange={handleChange}
                         placeholder="last name"/>
                  {touched.lastName && errors.lastName && <span className="form-feedback"> {errors.lastName}</span>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Team" help={!!errors.currentTeamId && ''}>
                  <Select
                    
                    value={values.currentTeamId ? values.currentTeamId : undefined}
                    showSearch
                    style={{marginRight: '8px'}}
                    placeholder="Select"
                    optionFilterProp="children"
                    disabled={true}
                    onChange={(data) => setFieldValue('currentTeamId', data)}
                  >
                    {teamsSelect}
                  </Select>
                  {errors.currentTeamId &&
                  <label style={{color: 'red', fontSize: '12px'}}> {errors.currentTeamId}</label>}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={<span className="required-item">Birthdate</span>} help={!!errors.birthDate && ''}>
                  <DatePicker
                    id="cInputDateProfile"
                    value={values.birthDate ? moment(values.birthDate) : undefined}
                    format={datePickerFormat}
                    disabledDate={(date: any) => {
                      return (new Date(date.format(dateFormat)) > new Date());
                    }}
                    onChange={(e: any) => {
                      setFieldValue('birthDate', e?.format(dateFormat));
                    }}
                  />
                  {touched.birthDate && errors.birthDate && <span className="form-feedback"> {errors.birthDate}</span>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Form layout="vertical">
        <Row align={'middle'} gutter={[16, 16]}>
          <Col offset={1} span={3}>
            <Form.Item label="Status">
              <Switch disabled={player.imported} checked={values.status === 'ACT'} onChange={data => {
                if (data) {
                  setFieldValue('status', 'ACT');
                } else {
                  setFieldValue('status', 'DES');
                }
              }}/>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Weight">
              <Input disabled={player.imported} value={values.weight} name="weight" onChange={handleChange}/>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Height">
              <Input disabled={player.imported} value={values.height} name="height" onChange={handleChange}/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Jersey #">
              <Input disabled={player.imported} value={values.jerseyNumber} name="jerseyNumber"
                     onChange={handleChange}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
    
    {/* <div className="header_drawer_title_equip">
        <label>Assigned equipment</label>
      </div>
      <div className="card-container padding-table-player">
        <div className="drawer_body_config">
          <Table
            pagination={false}
            dataSource={player.equipmentVMList}
            columns={columns}
            locale={{ emptyText: <Empty description="" /> }} />
        </div>
      </div> */}
  </div>;
  // </div>;
};
