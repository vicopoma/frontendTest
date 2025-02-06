export const TAB = ':tab';
export const TEAM =':team';
export const KEY = ':key';
export const KEY2 = ':key2';
export const KEY3 = ':key3';
export const KEY4 = ':key4';
export const KEY5 = ':key5';

export enum ConfigurationKeys {
  EQUIPMENT_TYPE = 'equipment-type',
  EQUIPMENT_MODEL = 'equipment-model',
  MANUFACTURER = 'manufacturer',
  USERS = 'users',
  TEAMS = 'teams',
  PLAYERS = 'players',
  SCANNER = 'scanner',
  TEAM_SITE_SITE = 'team-site-site',
  TEAM_SITE_LOCATION = 'team-site-location',
  EDIT_EQUIPMENT_TYPE = 'edit-equipment-type',
  PART_TYPE = 'part-type',
  PART = 'part',
  MANAGEMENT_MWE_INTEGRATION = 'management-mwe-integration',
  MANAGEMENT_DATA_IMPORT = 'management-data-import',
  TAGS = 'tags',
  TAG_SCANS_HISTORY = 'tag-scans-history',
  TAG_BLINKS_HISTORY = 'tag-blinks-history',
  DS9908R_CONFIG = 'ds9908r-config',
  SITE = 'sites',
}

export enum BackDoorConfigKeys {
  DOWNLOAD = 'download-backtool',
  HEALTH_DEVICE = 'health-device',
  EQUIPMENT_TEMPLATE = 'equipment-template',
  MESSAGE_ALERT = 'message-alert',
  PARTITION = 'partition-backtool',
  SEASON = 'season-backtool',
  SYNCHRONIZE = 'synchronize-backtool',
  RAW_BLINK_SYNCHRONIZATION = 'raw-blink-synchronization',
}

export enum ConfigurationTabs {
  MASTER_DATA = 'master-data',
  MANAGEMENT = 'management',
  TAGS = 'tags',
  USER = 'user',
  PLAYERS = 'players',
  DEVICE = 'device',
}

export enum ActivityTabs {
  GAME = 'game',
  PRACTICE = 'practice',
  CUSTOM = 'custom'
}

export enum EquipmentTabs {
  HELMET = 'helmet',
  CLEAT = 'cleat',
  SHOULDER_PAD = 'shoulderPad'
}

export enum ScanTabs {
  GAME = 'game',
  PRACTICE = 'practice',
  CUSTOM = 'custom'
}

export const ROUTES = {
  ROOT: '/',
  PARAMS: {
    LOGIN: 'login',
    ACTIVITY: 'activity',
    CONFIGURATION: 'configuration',
    HOME: 'home',
    SCANS: 'scans',
    EQUIPMENT: 'equipment',
    GOOGLE: 'google',
    TEST: 'test',
    PLAYER: 'player',
    ERROR: 'error',
    ERROR404: '404',
    ERROR502: '502',
    OKTA_AUTH: 'okta',
    ADDITIONAL_TOOLS: 'additional-tools',
    ABOUT: 'about',
    NFL: 'login/nfl',
    SCAN_DISTRIBUTION: 'scan-distribution',
    REDIRECT: 'redirect',
  },
  BACKDOOR: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.ADDITIONAL_TOOLS, tab].join('/');
    },
    DETAIL(tab: string, key: string) {
      return ['', ROUTES.PARAMS.ADDITIONAL_TOOLS, tab, key].join('/');
    },
  },
  LOGIN: {
    PAGE() {
      return '/' + ROUTES.PARAMS.LOGIN;
    }
  },
  ACTIVITY: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.ACTIVITY, tab].join('/');
    },
    SELECTOR(tab: string, key: string) {
      return ['', ROUTES.PARAMS.ACTIVITY, tab, key].join('/');
    },
    PLAYER_DETAIL(tab: string, key: string, key2: string) {
      return ['', ROUTES.PARAMS.ACTIVITY, tab, key, key2].join('/');
    },
    PLAYER_EDIT_EQUIPMENT(tab: string, key: string, key2: string, key3: string, key4: string) {
      return ['', ROUTES.PARAMS.ACTIVITY, tab, key, key2, key3, key4].join('/');
    }
  },
  CONFIGURATION: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.CONFIGURATION, tab].join('/');
    },
    DETAIL(tab: string, key: string) {
      return ['', ROUTES.PARAMS.CONFIGURATION, tab, key].join('/');
    },
    CONFIG() {
      return '/' + ROUTES.PARAMS.CONFIGURATION;
    }
  },
  SCAN_DISTRIBUTION: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.SCAN_DISTRIBUTION, tab].join('/');
    }
  },
  HOME: {
    PAGE() {
      return '/' + ROUTES.PARAMS.HOME;
    }
  },
  ERROR: {
    ERROR404() {
      return ['', ROUTES.PARAMS.ERROR, ROUTES.PARAMS.ERROR404].join('/');
    },
    ERROR502() {
      return ['', ROUTES.PARAMS.ERROR, ROUTES.PARAMS.ERROR502].join('/');
    }
  },
  SCANS: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.SCANS, tab].join('/');
    }
  },
  EQUIPMENT: {
    PAGE(tab: string) {
      return ['', ROUTES.PARAMS.EQUIPMENT, tab].join('/');
    },
    DETAIL(tab: string, key: string) {
      return ['', ROUTES.PARAMS.EQUIPMENT, tab, key].join('/');
    },
    DETAIL_OEM(tab: string, team:string, key: string) {
      return ['', ROUTES.PARAMS.EQUIPMENT, tab, team, key].join('/');
    },
  },
  REDIRECT: {
    EQUIPMENT() {
      return ['', ROUTES.PARAMS.REDIRECT, ROUTES.PARAMS.EQUIPMENT].join('/');
    },
    ACTIVITY() {
      return ['', ROUTES.PARAMS.REDIRECT, ROUTES.PARAMS.ACTIVITY].join('/');
    },
  },
  PLAYER: {
    PAGE() {
      return ['', ROUTES.PARAMS.PLAYER].join('/');
    },
    DETAIL(key: string) {
      return ['', ROUTES.PARAMS.PLAYER, key].join('/');
    },
    EDIT_EQUIPMENT(tab: string, key: string, key2: string) {
      return ['', ROUTES.PARAMS.PLAYER, tab, key, key2].join('/');
    }
  },
  GOOGLE: {
    PAGE() {
      return '/' + ROUTES.PARAMS.GOOGLE;
    }
  },
  TEST: {
    PAGE() {
      return '/' + ROUTES.PARAMS.TEST;
    }
  },
  OKTA: {
    PAGE() {
      return '/' + ROUTES.PARAMS.OKTA_AUTH;
    }
  },
  ABOUT: {
    PAGE() {
      return '/' + ROUTES.PARAMS.ABOUT;
    }
  },
  NFL: {
    PAGE() {
      return '/' + ROUTES.PARAMS.NFL;
    }
  }
};
