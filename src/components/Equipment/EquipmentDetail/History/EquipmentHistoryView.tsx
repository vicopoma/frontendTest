import React, { useEffect, useState } from 'react';
import { Badge, Collapse, Table } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'antd/dist/antd.css';

import { useHistoryDispatch, useHistoryState } from '../../../../hook/hooks/history';
import { HistoryState } from '../../../../store/types/history';
import { EquipmentCustomField } from '../../../../store/types';
import { PartTypeRelatedEquipmentModel } from '../../../../store/types/partType';
import { useEquipmentContext } from '../../../../context/equipment';
import './EquipmentHistoryView.scss';
import { ACCOUNT_ROLES, DATE_FORMATS, EQUIPMENT_TYPES } from '../../../../constants/constants';
import { useEquipmentTypeState } from '../../../../hook/hooks/equipmentType';
import { useLocation } from 'react-router';
import { useAccountState } from '../../../../hook/hooks/account';
import { isBoolean } from '../../../../helpers/Utils';

type Props = {
  equipmentId: string,
}
const {Panel} = Collapse;

export const EquipmentHistory = ({equipmentId}: Props) => {
  const {values: equipmentInformation} = useEquipmentContext();

  const {history} = useHistoryState();
  const {loadHistoryById} = useHistoryDispatch();
  const [loader, setLoader] = useState<boolean>(false);

  const { account } = useAccountState();
  const isOEM = account?.role?.name === ACCOUNT_ROLES.OEM_ADMIN || account?.role?.name === ACCOUNT_ROLES.OEM_TEAM_USER;
  const paths = useLocation().pathname.split('/');
  const { equipmentTypeList } = useEquipmentTypeState();
  const equipmentTypeId = isOEM ? paths[paths.length - 3] : paths[paths.length - 2];
  const isShoulderPadType = equipmentTypeList.filter(data => data.nameEquipmentType === EQUIPMENT_TYPES.SHOULDER_PAD && data.id === equipmentTypeId).length > 0;

  useEffect(() => {
    loadHistoryById(setLoader, 3, equipmentId);
  }, [equipmentId, equipmentInformation, loadHistoryById]);

  const IsJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const IsKeyValid = (key: string) => {
    const keyArray: Array<string> = [
      'customfield', 'equipmentModelId', 'playerId', 'equipmentTypeId', 'equipmentId', 'manufacturerId', 'id',
      'description', 'x', 'y', 'tag', 'recertification', 'teamId', 'partTypeWithPartDTOList', 'tags', 'createDate', 'modifiedDate',
      'nflId', 'guiNameList', 'lastCertification', 'modelYear', 'archivedDate', 'deleted',
      'modifiedBy', 'createBy', 'jerseyNumber', 'playerIdNfl', 'manufacturerIdNfl',
      'deviceType', 'extraCleat',
    ];
    return !keyArray.includes(key);
  };

  const changeNameAttribute = (key: string) => {
    const keyArray: Array<any> = [
      {oldValue: 'nameEquipmentType', newValue: 'Equipment Type'},
      {oldValue: 'nameManufacturer', newValue: 'Manufacturer'},
      {oldValue: 'nameModel', newValue: 'Equipment Model'},
      {oldValue: 'displayName', newValue: 'Assigned Player'},
      {oldValue: 'equipmentCode', newValue: 'Equipment Code'},
      {oldValue: 'lastCertification', newValue: isShoulderPadType ? 'Last Recondition' : 'Last Certification'},
      {oldValue: 'teamName', newValue: 'Team Name'},
      {oldValue: 'reconditionStatus', newValue: 'Out for Recondition'},
      {oldValue: 'modelCode', newValue: 'Model Code'},
      {oldValue: 'archived', newValue: 'Archived'},
      {oldValue: 'season', newValue: 'Season'},
      {oldValue: 'note', newValue: 'Note'},
    ];
    let newValue = key;
    keyArray.forEach(item => {
      if (item.oldValue === key) {
        newValue = item.newValue;
      }
    });
    return newValue;
  };
  const formatValue = (value: any) => {
    const literalBoolean = value ? 'Yes' : 'No';
    return isBoolean(value) ? literalBoolean : value?.toString();
  }

  const columns = [
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      width: 20
    },
    {
      title: 'Attribute',
      dataIndex: 'type',
      key: 'type',
      width: 20
    },
    {
      title: 'Old Value',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 200,
      render: (a: any, b: any) => {
        return <div id={`old${b?.type?.split(' ').join('')}`}>{a}</div>
      }
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 200,
      render: (a: any, b: any) => {
        return <div id={`new${b?.type?.split(' ').join('')}`}>{a}</div>
      }
    }
  ];

  const expandedRowRender = (record: HistoryState) => {
    const dataSource: any = [];
    const add = (type: JSX.Element, field: string, oldValue: string, newValue: string) => ({
      newValue: newValue,
      oldValue: oldValue,
      operation: type,
      type: field,
    });

    if (IsJsonString(record.oldValue)) {
      const oldVersion = JSON.parse(record.oldValue);
      const newVersion = JSON.parse(record.newValue);
      Object.keys(oldVersion).forEach((key: string) => {
        if ((oldVersion[key] || isBoolean(oldVersion[key])) && typeof (oldVersion[key]) !== 'object' && IsKeyValid(key)) {
          if ((oldVersion[key] || isBoolean(oldVersion[key])) && (newVersion[key] || isBoolean(newVersion[key])) && oldVersion[key] !== newVersion[key]) {
            dataSource.push(add(<Badge color="#ff9200"
                                       text="changed"/>, changeNameAttribute(key.toString()), formatValue(oldVersion[key]), formatValue(newVersion[key])));
          } else if (key && oldVersion[key] && !newVersion[key] && !isBoolean(newVersion[key])) {
            dataSource.push(add(<Badge color="#ff3d00"
                                       text="delete"/>, changeNameAttribute(key.toString()), oldVersion[key].toString(), ''));
          }
        }
      });

      Object.keys(newVersion)?.forEach((key: string) => {
        if (!oldVersion[key] && typeof (newVersion[key]) !== 'object' && IsKeyValid(key)) {
          if (!!key && !oldVersion[key] && newVersion[key] && !isBoolean(oldVersion[key])) {
            dataSource.push(add(<Badge status="success"
                                       text="created"/>, changeNameAttribute(key.toString()), '', formatValue(newVersion[key])));
          }
        }
      });

      const customField = 'customfield';

      Object.keys(oldVersion[customField]).forEach(i => {
        let found: boolean = false;
        const data: EquipmentCustomField = oldVersion[customField][i];
        Object.keys(newVersion[customField]).forEach(j => {
          const data2: EquipmentCustomField = newVersion[customField][j];
          if (data?.equipmentCustomFieldId === data2?.equipmentCustomFieldId) {
            found = true;
            if (data?.value !== data2?.value) {
              dataSource.push(add(<Badge color="#ff9200"
                                         text="changed"/>, changeNameAttribute(data?.nameField), data?.value, data2?.value));
            }
          }
        });
        if (!found) {
          dataSource.push(add(<Badge color="#ff3d00"
                                     text="delete"/>, changeNameAttribute(data?.nameField), data?.value, ''));
        }
      });

      Object.keys(newVersion[customField]).forEach(j => {
        const data2: EquipmentCustomField = newVersion[customField][j];
        let found: boolean = false;
        Object.keys(oldVersion[customField]).forEach(i => {
          const data: EquipmentCustomField = oldVersion[customField][i];
          if (data?.equipmentCustomFieldId === data2?.equipmentCustomFieldId) {
            found = true;
          }
        });
        if (!found) {
          dataSource.push(add(<Badge status="success"
                                     text="created"/>, changeNameAttribute(data2.nameField), '', data2?.value));
        }
      });


      const partTypeList = 'partTypeWithPartDTOList';
      Object.keys(oldVersion[partTypeList]).forEach(i => {
        let found: boolean = false;
        const partType: any = oldVersion[partTypeList][i];
        Object.keys(newVersion[partTypeList]).forEach(j => {
          const partType2: any = newVersion[partTypeList][j];
          if (partType.equipmentRelatedId === partType2.equipmentRelatedId) {
            found = true;
            if (partType.partIdSelected !== partType2.partIdSelected) {
              dataSource.push(add(<Badge color="#ff9200"
                                         text="changed"/>, changeNameAttribute(partType.namePartType), partType?.namePart, partType2?.namePart));
            }
          }
        });
        if (!found) {
          dataSource.push(add(<Badge color="#ff3d00"
                                     text="delete"/>, changeNameAttribute(partType.namePartType), partType?.namePart, ''));
        }
      });

      Object.keys(newVersion[partTypeList]).forEach(j => {
        const data2: any = newVersion[partTypeList][j];
        let found: boolean = false;
        Object.keys(oldVersion[partTypeList]).forEach(i => {
          const data: PartTypeRelatedEquipmentModel = oldVersion[partTypeList][i];
          if (data?.equipmentRelatedId === data2?.equipmentRelatedId) {
            found = true;
          }
        });
        if (!found) {
          dataSource.push(add(<Badge status="success"
                                     text="created"/>, changeNameAttribute(data2.namePartType), '', data2?.namePart));
        }
      });

      if (newVersion?.createDate || oldVersion?.createDate) {
        if (newVersion?.createDate?.epochSecond !== oldVersion?.createDate?.epochSecond) {
          dataSource.push(add(
            <Badge color="#046bda" text="success"/>,
            changeNameAttribute('Created Date'),
            oldVersion?.createDate ? moment(1000 * oldVersion?.createDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : '',
            newVersion?.createDate ? moment(1000 * newVersion?.createDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : ''
          ));
        }
      }

      if (newVersion?.modifiedDate || oldVersion?.modifiedDate) {
        if (newVersion?.modifiedDate?.epochSecond !== oldVersion?.modifiedDate?.epochSecond) {
          dataSource.push(add(
            <Badge color="#046bda" text="assigned"/>,
            changeNameAttribute('Modified Date'),
            oldVersion?.modifiedDate ? moment.unix(oldVersion?.modifiedDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : '',
            newVersion?.modifiedDate ? moment.unix(newVersion?.modifiedDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : ''
          ));
        }
      }
      if (newVersion?.lastCertification || oldVersion?.lastCertification) {
        if (newVersion?.lastCertification?.epochSecond !== oldVersion?.lastCertification?.epochSecond) {
          dataSource.push(add(
            <Badge color="#046bda" text="assigned"/>,
            changeNameAttribute('Last certification'),
            oldVersion?.lastCertification ? moment.unix(oldVersion?.lastCertification?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : '',
            newVersion?.lastCertification ? moment.unix(newVersion?.lastCertification?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : ''
          ));
        }
      }
    } else {
      if (IsJsonString(record.newValue)) {
        const newVersion = JSON.parse(record.newValue);
        const customField = 'customfield';
        const partTypeList = 'partTypeWithPartDTOList';
        Object.keys(newVersion).forEach((key: string) => {
          if (IsKeyValid(key) && (newVersion[key] || isBoolean(newVersion[key])) && key !== 'lastCertification' && key !== 'specificPartsList' && key !== 'invalidTags' && key !== 'kneeBraceSide' && key !== 'paddedShirt' && key !== 'imported') {
            dataSource.push(add(<Badge status="success"
                                       text="created"/>, changeNameAttribute(key), '', newVersion[key]));
          }
        });
        Object.keys(newVersion[customField]).forEach(element => {
          dataSource.push(add(<Badge color="#046bda"
                                     text="assigned"/>, changeNameAttribute(newVersion[customField][element].nameField), '', newVersion[customField][element]?.value));
        });
        Object.keys(newVersion[partTypeList]).forEach(element => {
          dataSource.push(add(<Badge color="#046bda"
                                     text="assigned"/>, changeNameAttribute(newVersion[partTypeList][element]?.namePartType), '', newVersion[partTypeList][element]?.namePart));
        });
        if (newVersion?.createDate) {
          dataSource.push(add(<Badge color="#046bda"
                                     text="success"/>, changeNameAttribute('Created Date'), '', moment.unix(newVersion?.createDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin)));
        }
        if (newVersion?.modifiedDate) {
          dataSource.push(add(<Badge color="#046bda"
                                     text="assigned"/>, changeNameAttribute('Modified Date'), '', moment.unix(newVersion?.modifiedDate?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin)));
        }
        if (newVersion?.lastCertification) {
          const attrName = isShoulderPadType ? 'Last Recondition' : 'Last Certification';
          dataSource.push(add(<Badge color="#046bda"
                                     text="assigned"/>, changeNameAttribute(attrName), '', newVersion?.lastCertification ? moment.unix(newVersion?.lastCertification?.epochSecond).format(DATE_FORMATS.monthDayYearHourMin) : ''));
        }
      }
    }


    return dataSource;
  };

  return (
    <div className="drawer_body card-container collapse-table-style history-equip">
      <div className="header-info-history">
        <div className="header-01">Change Date</div>
        <div className="header-02">Time</div>
        <div className="header-03">Change by</div>
        <div className="header-04">Note</div>
      </div>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>}
      >
        {history.map((historyState, index: number) => {
          const dataSource = expandedRowRender(historyState);
          if (dataSource.length === 0) return <></>;
          return <Panel id={`eHPanel-${index}`} header={<div className="header-cont-history">
            <div className="header-01">{moment(historyState.changeDate).local().format('MM/DD/YYYY')}</div>
            <div className="header-02">{moment(historyState.changeDate).local().format('HH:mm')}</div>
            <div className="header-03">{historyState.changeByUser}</div>
            <div className="header-04">{historyState.note}</div>
          </div>} key={index}>
            <Table loading={loader} columns={columns} dataSource={dataSource} pagination={false}/>
          </Panel>;
        })}
      </Collapse>
    </div>
  );
};
