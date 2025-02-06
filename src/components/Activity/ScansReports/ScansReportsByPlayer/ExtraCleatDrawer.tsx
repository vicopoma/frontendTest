import React from 'react';
import { Checkbox, Form, } from 'antd';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import { Drawer } from '../../../Shared/Drawer/Drawer';
import { DATE_FORMATS, } from '../../../../constants/constants';
import { messageAlertDrawerValidators } from '../../../../constants/validators';
import { EquipmentInformation } from '../../../../store/types';
import { PlayerState } from '../../../../store/types/players';
import '../ScanReport.scss';
import { Columns, Table } from '../../../Shared/Table/CustomTable/Table';
import { hexToAscii } from '../../../../helpers/ConvertUtils';
import { useExtraCleatFunctions } from '../../../../hook/customHooks/scan';
import { useLocation } from 'react-router';
import { SuccessMessage } from '../../../Shared/Messages/Messages';

export const ExtraCleatDrawer = ({ showDrawer, playerInfo, closeDrawer, onSave }: {
  showDrawer: boolean,
  closeDrawer: Function,
  playerInfo: Partial<PlayerState>,
  onSave: Function,
}) => {

  const { values, setFieldValue } = useFormik({
    initialValues: playerInfo.equipmentVMList || [],
    validationSchema: messageAlertDrawerValidators,
    enableReinitialize: true,
    onSubmit(values: EquipmentInformation[]) {
      //intentionally empty
    }
  });
  
  const columns: Columns[] = [
    {
      title: 'Manufacturer',
      dataIndex: 'nameManufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Model',
      dataIndex: 'nameModel',
      key: 'model',
    },
    {
      title: 'Tag ID',
      dataIndex: 'tag',
      key: 'tag',
      render: (a) => {
        return hexToAscii(a);
      }

    },
    {
      title: 'Last seen',
      dataIndex: 'lastSessionScan',
      key: 'last_session_scan',
      render: (a) => {
        if(a) {
          return moment(a).format(DATE_FORMATS.monthDayYearHourMin);
        }
        return '';
      }
    },
    {
      title: 'Device Type',
      dataIndex: 'deviceType',
      key: 'device_type',
    },
    {
      title: '',
      dataIndex: 'extraCleat',
      key: 'extra_cleat',
      render: (a, b, idx) => {
        return (
          <Checkbox 
            checked={!a} 
            onChange={(e) => {
              setFieldValue(`${idx}.extraCleat`, !e.target.checked);
            }}
          />
        )
      }
    },
  ];

  const paths = useLocation().pathname.split('/');
  const sessionId = paths[paths.length - 1];
  const { updateExtraCleats } = useExtraCleatFunctions();

  return (
    <Drawer
      title="Choose Game Worn Cleat"
      onClose={() => {
        closeDrawer();
      }}
      canModify={true}
      width="54%"
      visible={showDrawer}
      onChange={() => {
        updateExtraCleats(sessionId, values, () => {
          SuccessMessage({
            description: 'Cleat selection was saved.',
          });
          onSave();
        });
      }}
      extraButton={
        <></>
      }
      enableExtraButton={false}
    >
      <Form layout="vertical" className="modal-activity" onSubmitCapture={() => {}/*handleSubmit*/}>
        <div className="drawer_config">
          <div className="extra-cleat-header">
            <div className="extra-cleat-player-info">
              <h5>{playerInfo.displayName}</h5> 
              <h5>Jersey # {playerInfo.jerseyNumber}</h5>
            </div>
            <h5>{playerInfo.status?.toLocaleUpperCase()}</h5>
          </div>   
          <div className="">
            <div className="drawer_body_config">
              <Table 
                columns={columns}
                dataSource={values}
                sortParams={[]}
              />
            </div>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};
