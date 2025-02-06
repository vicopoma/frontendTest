import { ActivityState, EquipmentState, ScanState } from '../store/types';
import { UserState } from '../store/types/users';

export interface Column {
  className?: string,
  dataIndex: string,
  sorter?: boolean,
  title: string,
  width: number,
  render?: Function
}

export type DataSource = EquipmentState | ScanState | ActivityState | UserState | any;

export interface VirtualElementTable {
  dataSource: Array<DataSource>,
  loading: boolean,
  columns: Array<Column>,
  y: number,
  onRow?: Function,
  onChange?: Function,
  handleFetch?: Function
}
