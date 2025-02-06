import { CheckboxObject, ScannerDeviceState } from '../store/types';
import { ConfigurationKeys, ConfigurationTabs } from '../settings/routes';
import { API } from '../settings/server.config';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';
export const TOKEN = 'et-token';

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export const PROGRESS_BAR_STATUS = {
  INIT: 'INIT',
  PROCESS: 'PROCESS',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  WARN: 'WARN'
};

export const PROGRESS_BAR_TYPES = {
  EXPORT_SCAN_ALL: 'EXPORT_SCAN_ALL',
  EXPORT_SCAN_BY_TEAM: 'EXPORT_SCAN_BY_TEAM',
  EXPORT_SCAN_BY_VENUE: 'EXPORT_SCAN_BY_VENUE',
  EXPORT_EQUIPMENT_TAG_HISTORY: 'EXPORT_EQUIPMENT_TAG_HISTORY',
  EXPORT_USER: 'EXPORT_USER',
  MANUAL_IMPORT: 'MANUAL_IMPORT',
  OEM_IMPORT: 'OEM_IMPORT',
  REBUILD_GAME_DATA: 'REBUILD_GAME_DATA',
  REGENERATION_PRACTICE_DATA: 'REBUILD_PRACTICE_DATA',
  RESTORING_PARTITION: 'RESTORING_PARTITION',
  SYNCHRONIZED_RAW_BLINK: 'SYNCHRONIZED_RAW_BLINK'
};

export const TAG_VALIDATOR_TYPES = {
  OK: 'OK',
  BELONG_TEAM: 'BELONG_TEAM',
  BELONG_DIFF_TEAM: 'BELONG_DIFF_TEAM',
  INVALID_FORMAT: 'INVALID_FORMAT'
};

export const PROGRESS_BAR_DETAILS = {
  [PROGRESS_BAR_STATUS.INIT]: {
    color: 'gray',
    status: 'normal' as 'normal'
  },
  [PROGRESS_BAR_STATUS.PROCESS]: {
    color: '',
    status: 'active' as 'active'
  },
  [PROGRESS_BAR_STATUS.ERROR]: {
    color: 'red',
    status: 'exception' as 'exception'
  },
  [PROGRESS_BAR_STATUS.WARN]: {
    color: '#FFCC00',
    status: 'normal' as 'normal'
  },
  [PROGRESS_BAR_STATUS.COMPLETE]: {
    color: undefined,
    status: 'success' as 'success'
  }
};

export const PRACTICE_REGENERATION_STATUS = {
  GENERATED: 'GENERATED',
  IN_COMING: 'IN_COMING',
  RUNNING: 'RUNNING',
  WARNING: 'WARNING',
  POPULATED: 'POPULATED',
  EMPTY: 'EMPTY'
};

export const REGENERATION_DETAILS = {
  [PRACTICE_REGENERATION_STATUS.GENERATED]: {
    type: 'success',
    img: '/images/practice-status/reg-ico-green.svg',
    value: 'Generated'
  },
  [PRACTICE_REGENERATION_STATUS.IN_COMING]: {
    type: 'more',
    img: '/images/practice-status/reg-ico-incoming.svg',
    value: 'Future'
  },
  [PRACTICE_REGENERATION_STATUS.RUNNING]: {
    type: 'info',
    img: '/images/practice-status/reg-ico-running.svg',
    value: 'Running'
  },
  [PRACTICE_REGENERATION_STATUS.WARNING]: {
    type: 'reset',
    img: '/images/practice-status/reg-ico-warning.svg',
    value: 'Warning'
  },
  [PRACTICE_REGENERATION_STATUS.EMPTY]: {
    type: 'reset',
    img: '/images/practice-status/reg-ico-warning.svg',
    value: 'Warning'
  },
  [PRACTICE_REGENERATION_STATUS.POPULATED]: {
    type: 'success',
    img: '/images/practice-status/reg-ico-green.svg',
    value: 'Generated'
  }
};

export enum FETCH_STATUS {
  NONE,
  LOADING,
  FAILED,
  FINISHED
}

export const DASHBOARD_IDS = {
  HELMET: '#helmet',
  SHOULDER_PAD: '#shoulderpad',
  CLEAT: '#cleat'
}
export const EQUIPMENT_DASBOARD_IDS = [
  DASHBOARD_IDS.HELMET,
  DASHBOARD_IDS.SHOULDER_PAD,
  DASHBOARD_IDS.CLEAT
]

export const ADMIN = 'admin';
export const USER = 'user';

export const OK = 'OK';
export const CREATED = 'CREATED';
export const NEW = 'new';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_EQUIPMENT_TYPE = 'create-equipment-type';
export const NEW_EQUIPMENT_TYPE = 'New Equipment Type';

export const FILTER = 'Filter';
export const BODY_FILTER = 'BodyFilter';
export const CALENDAR = 'Calendar';

export const ACTIVITY = 'Activity';
export const SCAN = 'Scan';

export const ACTIVITY_CALENDAR = 'ActivityCalendar';
export const ACTIVITY_FILTER = 'ActivityFilter';
export const ACTIVITY_BODY_FILTER = 'ActivityBodyFilter';
export const SCAN_FILTER = 'ScanFilter';
export const SCAN_BODY_FILTER = 'ScanBodyFilter';
export const MANUFACTURER_FILTER = 'Manufacturer';
export const USER_FILTER = 'User';
export const PARTITION = 'Partition';
export const TEAM_FILTER = 'Team';
export const RELATED_USER_FILTER = 'RelatedUser';
export const PLAYERS_FILTER = 'Player';
export const EQUIPMENT_ASSIGNED_BY_PLAYER = 'Equipment-Assigned-by-player';
export const EQUIPMENT_TYPE_FILTER = 'EquipmentType';
export const EQUIPMENT_MODEL_FILTER = 'EquipmentModel';
export const NOCSAE = 'Nocsae';
export const RECLAIM = 'Reclaim';
export const REDIRECT = 'Redirect';
export const TAGS_FILTER = 'TagsFilter';
export const TAG_SCANS_HISTORY_FILTER = 'TagScansHistoryFilter';
export const BLINKS_HISTORY_FILTER = 'RawBlinksHistoryFilter';
export const BLINKS_SYNC_FILTER = 'RawBlinksSyncFilter';
export const TAGS_FILTER_DETAILS = 'TagsFilterDetails';
export const EQUIPMENT = 'EQUIPMENT';
export const SITE_FILTER = 'Site';
export const SITE_LOCATION_FILTER = 'SiteLocation';
export const SCANNER_DEVICE_FX9600_FILTER = 'DeviceFX9600';
export const PART_FILTER = 'Part';
export const TAG_FILTER = 'Tag';
export const PART_TYPE_FILTER = 'PartType';
export const SCAN_DETAIL_FILTER = 'ScanDetail';
export const SCAN_DETAIL_PLAYER_FILTER = 'ScanDetailPlayer';
export const SCAN_DISTRIBUTION_BODY_FILTER = 'ScanDistributionBodyFilter';
export const SCAN_DISTRIBUTION_BODY_FILTER_VENUE = 'ScanDistributionBodyFilterVenue';
export const SCAN_BY_SESSION_BODY_FILTER = 'ScanBySessionBodyFilter';
export const SEASON = 'Season';
export const HEALTH_DEVICE = 'HealthDeviceBodyFilter';
export const MESSAGE_ALERT = 'MessageAlert';
export const EQUIPMENT_TEMPLATE = 'EquipmentTemplate'

export const CONFIGURATION_SIDER = 'configuration-sider';
export const EQUIPMENT_SIDER = 'Equipment-sider';
export const ACTIVITY_SIDER = 'Activity-sider';
export const BACKDOOR_SIDER = 'backdoor-sider';

export const LIST_EQUIPMENT_TYPE = 'Equipment Type List';
export const LIST_EQUIPMENT_MODEL = 'Equipment Model List';
export const LIST_PART_TYPE = 'Part Type List';
export const LIST_PARTS = 'Parts List';
export const LIST_MANUFACTURER = 'Manufacturer List';
export const TAGS_LIST = 'Tags';
export const TAGS_SCANS_HISTORY = 'Tag Scans History';
export const RAW_BLINKS_HISTORY = 'Raw Blinks History';

export const ASCEND = 'ascend';
export const DESCEND = 'descend';
export const ASC = 'asc';
export const DESC = 'desc';

export const dateFormat = 'YYYY-MM-DD';
export const dateFormatSec = 'YYYY-MM-DD HH:mm:ss';
export const dateFormatMinute = 'YYYY-MM-DD HH:mm';
export const datePickerFormat = 'MM-DD-YYYY';
export const dateFormatTable = 'MM-DD-YYYY HH:mm';
export const dateFormatTableSec = 'MM-DD-YYYY HH:mm:ss';
export const isoFormat = 'MM/DD/YYYY';
export const midDayUtc = 'T12:00:00.000Z';
export const TAG_TREE_TEAM = 'tag-tree-team';
export const TAG_HISTORY_TREE_TEAM = 'tag-history-tree-team';
export const TAG_HISTORY_TREE_SITE = 'tag-history-tree-site';
export const TAG_BLINK_HISTORY_TREE_SITE = 'tag-blink-history-tree-site';

export const worldDateFormat = 'YYYY-MM-DD HH:mm';
export const hoursFormat = 'HH:mm';
export const YEAR = 'year';
export const CLEAT_SIZE = 'cleat size';
export const KNEE_BRACE_SIDE = 'knee brace side';
export const DELETED = 'DELETED';
export const DEVICE_TYPE = 'MANUAL';

export enum STORAGE_NAMES {
  VERSION = 'VERSION',
  FRONTEND_DATE_VERSION = 'FRONTEND_DATE_VERSION' 
}

export enum MESSAGE_TYPE {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info'
}

export enum TABLE_EDIT_NAME {
  ACTIVITY_COLUMN = 'ACTIVITY_COLUMN',
  EQUIPMENT_COLUMN = 'EQUIPMENT_COLUMN',
  EQUIPMENT_MODEL_COLUMN = 'EQUIPMENT_MODEL_COLUMN',
  EQUIPMENT_TEMPLATE = 'EQUIPMENT_TEMPLATE',
  EQUIPMENT_TYPE_COLUMN = 'EQUIPMENT_TYPE_COLUMN',
  FX_9600_COLUMN = 'FX_9600_COLUMN',
  IMPORT_DATA_COLUMN = 'IMPORT_DATA_COLUMN',
  MANUFACTURER_COLUMN = 'MANUFACTURER_COLUMN',
  MESSAGE_ALERT = 'MESSAGE_ALERT',
  PART_TYPE_COLUMNS = 'PART_TYPE_COLUMNS',
  PARTITION = 'PARTITION',
  PARTS_COLUMN = 'PARTS_COLUMN',
  PLAYER_COLUMN = 'PLAYER_COLUMN',
  PLAYER_COLUMNS = 'PLAYER_COLUMNS',
  SCAN_REPORT_PLAYER_COLUMN = 'SCAN_REPORT_PLAYER_COLUMN',
  SCAN_REPORT_LIST_COLUMN = 'SCAN_REPORT_LIST_COLUMN',
  SEASON = 'SEASON',
  SITE_COLUMN = 'SITE_COLUMN',
  SITE_LOCATION_COLUMN = 'SITE_LOCATION_COLUMN',
  TAG_HISTORY_COLUMNS = 'TAG_HISTORY_COLUMNS',
  TAGS_COLUMNS = 'TAG_COLUMNS',
  TAGS_DETAILS = 'TAGS_DETAILS',
  TEAM_COLUMNS = 'TEAM_COLUMNS',
  USER_COLUMNS = 'USER_COLUMNS',
}

export enum DATE_FORMATS {
  yearMonthDay = 'YYYY-MM-DD',
  yearMonthDayHourMinSec = 'YYYY-MM-DD HH:mm:ss',
  yearMonthDayHourMin = 'YYYY-MM-DD HH:mm',
  monthDayYear = 'MM-DD-YYYY',
  monthDayYearHourMin = 'MM-DD-YYYY HH:mm',
  monthDayYearHourMinSec = 'MM-DD-YYYY HH:mm:ss',
  monthDayYearHourMinSecUtc = 'MM-DD-YYYY HH:mm:ss Z',
  monthDayYearIsoFormat = 'MM/DD/YYYY',
  hourMin = 'HH:mm',
  hourMinA = 'hh:mm A',
}

export enum FILTERS {
  IMPORT_RESULT = 'ImportResultFilter'
}

export enum IMPORT_DATA {
  IMPORT = 'import',
  RESULT = 'result'
}

export enum EQUIPMENT_TYPES {
  HELMET = 'Helmet',
  SHOULDER_PAD = 'Shoulder Pads',
  CLEAT = 'Cleats',
  KNEE_BRACE = 'Knee Brace',
  SUPPLEMENTAL_HEADGEAR = 'Supplemental Headgear',
}

export type EquipmentTypesType = EQUIPMENT_TYPES | undefined;

export const EQUIPMENT_TYPE_DISPLAY = {
  [EQUIPMENT_TYPES.HELMET]: 'Helmets',
  [EQUIPMENT_TYPES.SHOULDER_PAD]: EQUIPMENT_TYPES.SHOULDER_PAD,
  [EQUIPMENT_TYPES.CLEAT]: EQUIPMENT_TYPES.CLEAT
};

export const EQUIPMENT_TYPE_SETTER = {
  [EQUIPMENT_TYPES.HELMET]: {
    sort: 'helmet',
    display: 'Helmets'
  },
  [EQUIPMENT_TYPES.SHOULDER_PAD]: {
    sort: 'shoulder_pads',
    display: EQUIPMENT_TYPES.SHOULDER_PAD
  },
  [EQUIPMENT_TYPES.CLEAT]: {
    sort: 'cleat',
    display: EQUIPMENT_TYPES.CLEAT
  },
  [EQUIPMENT_TYPES.KNEE_BRACE]: {
    sort: 'knee_brace',
    display: 'Knee braces'
  },
  [EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR]: {
    sort: 'supplemental_headgear',
    display: EQUIPMENT_TYPES.SUPPLEMENTAL_HEADGEAR
  },
}

export enum KNEE_BRACES_SIDE {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export type KneeBraceSideType = KNEE_BRACES_SIDE.RIGHT | KNEE_BRACES_SIDE.LEFT | undefined;

export enum HELMETS_PARTS {
  MODEL_CODE = 'modelCode',
  SIZE = 'size',
  FACE_MASK = 'facemask',
  JAW_PAD = 'jawpad',
  CHIN_STRAP = 'chinStrap',
  SHIELD = 'shield',
  CROWN_LINER = 'crownLiner',
  CHINSTRAP_HOOKUP = 'chinstrapHookup',
  RIDGE_PAD = 'ridgePad',
  FRONT_BACK_LINER = 'frontBackLiner',
  SIDE_LINER = 'sideLiner',
}

export enum SHOULDER_PAD_PARTS {
  SIZE = 'size',
  CUPS = 'cups',
  EPAULETS = 'epaulets',
  TOP_OF_SHOULDER = 'top of shoulder',
  TOP_REDUNDANT = 'top redundant',
  ACCESSORY_NOTE = 'accessory note',
  PADDED_SHIRT = 'padded shirt',
}

export enum CLEATS_PARTS {
  SIZE = 'size'
}

export const EQUIPMENT_TYPE_DETAILS = {
  [EQUIPMENT_TYPES.HELMET]: {
    name: EQUIPMENT_TYPES.HELMET,
    camel: 'helmet',
    parts: HELMETS_PARTS,
  },
  [EQUIPMENT_TYPES.CLEAT]: {
    name: EQUIPMENT_TYPES.CLEAT,
    camel: 'cleat',
    parts: CLEATS_PARTS
  },
  [EQUIPMENT_TYPES.SHOULDER_PAD]: {
    name: EQUIPMENT_TYPES.SHOULDER_PAD,
    camel: 'shoulderPad',
    parts: SHOULDER_PAD_PARTS
  }
};

export enum ROLES_STATUS {
  INIT = 'INIT',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  REVOKED = 'REVOKED',
}

export enum ACCOUNT_ROLES {
  ZEBRA_ADMIN = 'zebra-admin',
  TEAM_MAINTAINER = 'team-maintainer',
  ADMIN_USER = 'admin-user',
  USER_TEAM = 'team-user',
  OEM_ADMIN = 'OEM-admin',
  OEM_TEAM_USER = 'OEM-team-user',
}

export enum ACTIVITY_TYPE {
  GAME = 'game',
  PRACTICE = 'practice',
  CUSTOM = 'custom'
}

export type ActivityType = ACTIVITY_TYPE.CUSTOM | ACTIVITY_TYPE.GAME | ACTIVITY_TYPE.PRACTICE;

export const ROLE_HIERARCHY = {
  [ACCOUNT_ROLES.ZEBRA_ADMIN]: 10,
  [ACCOUNT_ROLES.TEAM_MAINTAINER]: 7,
  [ACCOUNT_ROLES.ADMIN_USER]: 5,
  [ACCOUNT_ROLES.USER_TEAM]: 1,
  [ACCOUNT_ROLES.OEM_ADMIN]: 0,
  [ACCOUNT_ROLES.OEM_TEAM_USER]: -1,
};

export enum FILE_TYPES {
  CSV = 'text/csv',
  ZIP = 'application/zip',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

export enum FILE_EXTENSIONS {
  CSV = '.csv',
  ZIP = '.zip',
  XLSX = '.xlsx'
}

export enum MASTER_DATA {
  SHOULDER = 'Shoulders',
  CLEAT = 'Cleats',
  HELMET = 'Helmets',
  SITE = 'Sites',
  DEVICE = 'Devices',
  ZONES = 'Zones',
  USERS = 'Users',
  HELMET_TEMPLATE = 'HelmetTemplate',
  OEM_SHOULDER = 'OEMSHOULDERS',
  OEM_HELMET = 'OEMHELMETS',
}

export enum EXPORT_FILES {
  MASTER_FTP = 'Masterftpexport',
  SCAN_FTP = 'Scanftpexport',
  MASTER_FTP_EXPORT = 'Master ftp export',
  SCAN_FTP_EXPORT = 'Activity Equipment Scans',
  CLUB_TAG_INVENTORY_ENUM = 'Clubtaginventory',
  CLUB_INVENTORY_ENUM = 'Clubinventory',
  CLUB_TAG_INVENTORY = 'Club tag inventory',
  CLUB_INVENTORY = 'Club inventory',
  OEM_SHOULDER_PADS = 'OEM Shoulder Pads',
  OEM_SHOULDER_PADS_ENUM = 'OEMShoulders'
}

export enum IMPORT_TYPES {
  USER = 'User',
  EQUIPMENT_TYPE = 'Equipment type',
  SITE_CONFIG = 'Site configuration',
  EXPORT_IMPORT = 'Export and Import',
  TEMPLATE = 'Template',
  OEM_EQUIPMENT_TYPE = 'OEM Equipment type'
}

export const IMPORT_TYPE_FILES = {
  [MASTER_DATA.SHOULDER]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.CLEAT]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.HELMET]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.SITE]: [[FILE_EXTENSIONS.CSV], [FILE_EXTENSIONS.ZIP]],
  [MASTER_DATA.DEVICE]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.ZONES]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.USERS]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.HELMET_TEMPLATE]: [[FILE_EXTENSIONS.CSV]],
  [MASTER_DATA.OEM_SHOULDER]: [[FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLSX]],
  [MASTER_DATA.OEM_HELMET]: [[FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLSX]]
};

export const IMPORT_TYPE_APIS = {
  [MASTER_DATA.SHOULDER]: API.IMPORT.SHOULDER_PADS(),
  [MASTER_DATA.CLEAT]: API.IMPORT.CLEATS(),
  [MASTER_DATA.HELMET]: API.IMPORT.HELMETS(),
  [MASTER_DATA.SITE]: API.IMPORT.SITES(),
  [MASTER_DATA.DEVICE]: API.IMPORT.DEVICES(),
  [MASTER_DATA.ZONES]: API.IMPORT.ZONES()
};

export enum PROGRESS_STATUS {
  SUCCESS = 'success',
  EXCEPTION = 'exception',
  NORMAL = 'normal',
  ACTIVE = 'active'
}

export enum IMPORT_STATUS {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export enum SESSION_STORAGE {
  ACTIVITY_DOWNLOAD = 'activity-download',
  FILTERS = 'filters',
  FILTERS_BODY_PARAMS = 'filters-body-param',
  NOCSAE_EQUIPMENT = 'nocsae-equipment',
  NOTIFICATIONS = 'notifications',
  TEAM_SELECTED = 'team-selected',
}

export interface ActivityDownloadStorage {
  activityDownload: Array<string>
}

export interface SessionStorageController {
  subMenu?: Array<string>,
  menuItem?: string,
  collapsed?: boolean
  params?: string
}

export const SCAN_DEVICE = {
  DS9908R: {
    id: 'ds9908r',
    devType: 'DS9908R'
  },
  FX9600: {
    id: 'fx9600',
    devType: 'FX9600'
  },
  MC33: {
    id: 'mc33',
    devType: 'MC33'
  }
};

export const DEFAULT_TAB_CONTROLLER: SessionStorageController = {
  collapsed: false,
  subMenu: [ConfigurationTabs.DEVICE],
  menuItem: `${ConfigurationKeys.SCANNER}-${SCAN_DEVICE.DS9908R.id}`,
  params: ''
};

export enum ACTIVITY_STATUS {
  ACTIVE = 'ACTIVE',
  POSTPONED = 'POSTPONED',
  CANCELED = 'CANCELED',
  RESCHEDULED = 'RESCHEDULED'
}

export const ActivityStatus = {
  [ACTIVITY_STATUS.ACTIVE]: 'A',
  [ACTIVITY_STATUS.POSTPONED]: 'P',
  [ACTIVITY_STATUS.CANCELED]: 'C',
  [ACTIVITY_STATUS.RESCHEDULED]: 'R',
};

export enum ACTIVITY_ACT {
  INIT = 'INIT',
  RUN = 'RUN',
}

export const TYPE_FIELDS = [
  {
    value: 'text',
    title: 'Text-alphanumeric'
  },
  {
    value: 'number',
    title: 'Numeric'
  },
  {
    value: 'checkbox',
    title: 'Boolean'
  }
];

export const ScanDevTypes: Array<ScannerDeviceState> = [
  {
    devType: 'DS9908R',
    id: 'ds9908r',
    largeName: '',
    shortName: ''
  },
  {
    devType: 'FX9600',
    id: 'fx9600',
    largeName: '',
    shortName: ''
  },
  {
    devType: 'MC33',
    id: 'mc33',
    largeName: '',
    shortName: ''
  },
];


export enum ERROR_DS9908R_STATUS {
  SUCCESS = 0,
  STATUS_LOCKED = 10,
  ERROR_INVALID_APPHANDLE = 100,
  ERROR_COMMLIB_UNAVAILABLE = 101,
  ERROR_NULL_BUFFER_POINTER = 102,
  ERROR_INVALID_BUFFER_POINTER = 103,
  ERROR_INCORRECT_BUFFER_SIZE = 104,
  ERROR_DUPLICATE_TYPES = 105,
  ERROR_INCORRECT_NUMBER_OF_TYPES = 106,
  ERROR_INVALID_ARG = 107,
  ERROR_INVALID_SCANNERID = 108,
  ERROR_INCORRECT_NUMBER_OF_EVENTS = 109,
  ERROR_DUPLICATE_EVENTID = 110,
  ERROR_INVALID_EVENTID = 111,
  ERROR_DEVICE_UNAVAILABLE = 112,
  ERROR_INVALID_OPCODE = 113,
  ERROR_INVALID_TYPE = 114,
  ERROR_ASYNC_NOT_SUPPORTED = 115,
  ERROR_OPCODE_NOT_SUPPORTED = 116,
  ERROR_OPERATION_FAILED = 117,
  ERROR_REQUEST_FAILED = 118,
  ERROR_OPERATION_NOT_SUPPORTED_FOR_AUXILIARY_SCANNERS = 119,
  ERROR_DEVICE_BUSY = 120,
  ERROR_ALREADY_OPENED = 200,
  ERROR_ALREADY_CLOSED = 201,
  ERROR_CLOSED = 202,
  ERROR_INVALID_INXML = 300,
  ERROR_XMLREADER_NOT_CREATED = 301,
  ERROR_XMLREADER_INPUT_NOT_SET = 302,
  ERROR_XMLREADER_PROPERTY_NOT_SET = 303,
  ERROR_XMLWRITER_NOT_CREATED = 304,
  ERROR_XMLWRITER_OUTPUT_NOT_SET = 305,
  ERROR_XMLWRITER_PROPERTY_NOT_SET = 306,
  ERROR_XML_ELEMENT_CANT_READ = 307,
  ERROR_XML_INVALID_ARG = 308,
  ERROR_XML_WRITE_FAIL = 309,
  ERROR_XML_INXML_EXCEED_LENGTH = 310,
  ERROR_XML_EXCEED_BUFFER_LENGTH = 311,
  ERROR_NULL_POINTER = 400,
  ERROR_DUPLICATE_CLIENT = 401,
  ERROR_FW_INVALID_DATFILE = 500,
  ERROR_FW_UPDATE_FAILED_IN_SCN = 501,
  ERROR_FW_READ_FAILED_DATFILE = 502,
  ERROR_FW_UPDATE_INPROGRESS = 503,
  ERROR_FW_UPDATE_ALREADY_ABORTED = 504,
  ERROR_FW_UPDATE_ABORTED = 505,
  ERROR_FW_SCN_DETTACHED = 506,
  STATUS_FW_SWCOMP_RESIDENT = 600,
}

export const ERROR_DS9908R_STATUS_RESPONSE = {
  [ERROR_DS9908R_STATUS.SUCCESS]: 'Generic success ',
  [ERROR_DS9908R_STATUS.STATUS_LOCKED]: 'Device is locked by another application ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_APPHANDLE]: 'Invalid application handle. Reserved parameter.Value is zero. ',
  [ERROR_DS9908R_STATUS.ERROR_COMMLIB_UNAVAILABLE]: 'Required Comm Lib is unavailable to support the requested Type ',
  [ERROR_DS9908R_STATUS.ERROR_NULL_BUFFER_POINTER]: 'Null buffer pointer ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_BUFFER_POINTER]: 'Invalid buffer pointer ',
  [ERROR_DS9908R_STATUS.ERROR_INCORRECT_BUFFER_SIZE]: 'Incorrect buffer size ',
  [ERROR_DS9908R_STATUS.ERROR_DUPLICATE_TYPES]: 'Requested Type IDs are duplicated ',
  [ERROR_DS9908R_STATUS.ERROR_INCORRECT_NUMBER_OF_TYPES]: 'Incorrect value for number of Types ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_ARG]: 'Invalid argument ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_SCANNERID]: 'Invalid scanner ID ',
  [ERROR_DS9908R_STATUS.ERROR_INCORRECT_NUMBER_OF_EVENTS]: 'Incorrect value for number of Event IDs ',
  [ERROR_DS9908R_STATUS.ERROR_DUPLICATE_EVENTID]: 'Event IDs are duplicated ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_EVENTID]: 'Invalid value for Event ID ',
  [ERROR_DS9908R_STATUS.ERROR_DEVICE_UNAVAILABLE]: 'Required device is unavailable ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_OPCODE]: 'Opcode is invalid ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_TYPE]: 'Invalid value for Type ',
  [ERROR_DS9908R_STATUS.ERROR_ASYNC_NOT_SUPPORTED]: 'Opcode does not support asynchronous method ',
  [ERROR_DS9908R_STATUS.ERROR_OPCODE_NOT_SUPPORTED]: 'Device does not support the Opcode ',
  [ERROR_DS9908R_STATUS.ERROR_OPERATION_FAILED]: 'Operation failed in device ',
  [ERROR_DS9908R_STATUS.ERROR_REQUEST_FAILED]: 'Request failed in CoreScanner ',
  [ERROR_DS9908R_STATUS.ERROR_OPERATION_NOT_SUPPORTED_FOR_AUXILIARY_SCANNERS]: 'Operation not supported for auxiliary scanners ',
  [ERROR_DS9908R_STATUS.ERROR_DEVICE_BUSY]: 'Device busy. Applications should retry command. ',
  [ERROR_DS9908R_STATUS.ERROR_ALREADY_OPENED]: 'CoreScanner is already opened ',
  [ERROR_DS9908R_STATUS.ERROR_ALREADY_CLOSED]: 'CoreScanner is already closed ',
  [ERROR_DS9908R_STATUS.ERROR_CLOSED]: 'CoreScanner is closed ',
  [ERROR_DS9908R_STATUS.ERROR_INVALID_INXML]: 'Malformed inXML ',
  [ERROR_DS9908R_STATUS.ERROR_XMLREADER_NOT_CREATED]: 'XML Reader could not be instantiated ',
  [ERROR_DS9908R_STATUS.ERROR_XMLREADER_INPUT_NOT_SET]: 'Input for XML Reader could not be set ',
  [ERROR_DS9908R_STATUS.ERROR_XMLREADER_PROPERTY_NOT_SET]: 'XML Reader property could not be set ',
  [ERROR_DS9908R_STATUS.ERROR_XMLWRITER_NOT_CREATED]: 'XML Writer could not be instantiated ',
  [ERROR_DS9908R_STATUS.ERROR_XMLWRITER_OUTPUT_NOT_SET]: 'Output for XML Writer could not be set ',
  [ERROR_DS9908R_STATUS.ERROR_XMLWRITER_PROPERTY_NOT_SET]: 'XML Writer property could not be set ',
  [ERROR_DS9908R_STATUS.ERROR_XML_ELEMENT_CANT_READ]: 'Cannot read element from XML input ',
  [ERROR_DS9908R_STATUS.ERROR_XML_INVALID_ARG]: 'Arguments in inXML are not valid ',
  [ERROR_DS9908R_STATUS.ERROR_XML_WRITE_FAIL]: 'Write to XML output string failed ',
  [ERROR_DS9908R_STATUS.ERROR_XML_INXML_EXCEED_LENGTH]: 'InXML exceed length ',
  [ERROR_DS9908R_STATUS.ERROR_XML_EXCEED_BUFFER_LENGTH]: 'buffer length for type exceeded ',
  [ERROR_DS9908R_STATUS.ERROR_NULL_POINTER]: 'Null pointer ',
  [ERROR_DS9908R_STATUS.ERROR_DUPLICATE_CLIENT]: 'Cannot add a duplicate client ',
  [ERROR_DS9908R_STATUS.ERROR_FW_INVALID_DATFILE]: 'Invalid firmware file ',
  [ERROR_DS9908R_STATUS.ERROR_FW_UPDATE_FAILED_IN_SCN]: 'FW Update failed in scanner ',
  [ERROR_DS9908R_STATUS.ERROR_FW_READ_FAILED_DATFILE]: 'Failed to read DAT file ',
  [ERROR_DS9908R_STATUS.ERROR_FW_UPDATE_INPROGRESS]: 'Firmware Update is in progress (cannot proceed another FW Update or another command) ',
  [ERROR_DS9908R_STATUS.ERROR_FW_UPDATE_ALREADY_ABORTED]: 'Firmware update is already aborted ',
  [ERROR_DS9908R_STATUS.ERROR_FW_UPDATE_ABORTED]: 'FW Update aborted ',
  [ERROR_DS9908R_STATUS.ERROR_FW_SCN_DETTACHED]: 'Devices is disconnected while updating firmware ',
  [ERROR_DS9908R_STATUS.STATUS_FW_SWCOMP_RESIDENT]: 'The software component is already resident in the scanner ',
};


export const pageSize = '50';
export const MAX_TAG_SIZE = 14;
export const DAY_IN_HOURS = 24;
export const WEEK_IN_HOURS = 168;

export const ACTION_CHECKBOX_ACTIVITY = [
  {
    key: 'RUN',
    value: 'RUNNING'
  },
  {
    key: 'INIT',
    value: 'INITIALIZED'
  },
  {
    key: 'STOP',
    value: 'STOP'
  }
];

export const ACTION_CHECKBOX_SCAN = [
  {
    key: 'RUN',
    value: 'RUNNING'
  },
  {
    key: 'STOP',
    value: 'STOP'
  }
];
export const STATUS_CHECKBOX = [
  {
    key: 'A',
    value: 'ACTIVE'
  },
  {
    key: 'C',
    value: 'CANCELED'
  },
  {
    key: 'P',
    value: 'POSTPONED'
  },
  {
    key: 'R',
    value: 'RESCHEDULED'
  }
];

export const SEASONS: CheckboxObject[] = [];
for (let year = 2020; year <= (new Date()).getFullYear(); year++) {
  const element: CheckboxObject = {
    key: '' + year,
    value: '' + year
  };
  SEASONS.push(element);
}

export const MODEL_YEAR: string[] = [];
for (let year = 1998; year <= (new Date()).getFullYear() + 1; year++) {
  const element: string = '' + year;
  MODEL_YEAR.push(element);
}

export enum GAMES_TEAMS_CHOSEN_TYPES {
  BOTH = 'BOTH',
  NONE = 'NONE',
  VISIT = 'VISIT',
  HOME = 'HOME'
}

export enum PART_STATUS_DESC {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETE = 'DELETE',
}

export const VALID_TAG_PREFIXES: Array<string> = ['4E43', '485445', '5A4354', '5A4854', '5A5350','5A4B42', '5A4E43', '5A5443'];
export const CLEAT_AUTO_GENERATED_TAG = '5A43543939';

export const NECK_RESTRAINT = 'Neck Restraint';

export const EMPTY_ARRAY = [];
export const EMPTY_OBJECT = {};

export const COMMON_ERRRORS = {
  WRONG_TAG_FORMAT: {
    TITLE: 'Wrong tag format',
    DESCRIPTION: 'Tag Scanned format is invalid'
  }
};

export const MODEL_CONFIG = 'Model Config';

export enum VICIS_MODEL_CODES {
  TRENCH = '19500',
  TRENCH_LP = '19501',
  TRENCH_MATRIX = '19017',
  TRENCH_LP_MATRIX = '19018'
} 

export enum VICIS_MODEL_CONFIG {
  TRENCH = 'Standard TRENCH',
  TRENCH_LP = 'Standard No Bumper',
  TRENCH_MATRIX = 'MATRIX ID TRENCH',
  TRENCH_LP_MATRIX = 'MATRIX ID No Bumper'
}

export const APP_DATE_VERSION = '202501271800';
