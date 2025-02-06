const URL = process.env.REACT_APP_API_URI;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const DEVICE_DS = process.env.REACT_APP_API_DEVICE_DS;
const SOCKET_VL = process.env.REACT_APP_API_SOCKET;


export const URL_BASE = {
  BASE: URL,
  BASE_DEVICE: DEVICE_DS,
  BASE_SOCKET: SOCKET_VL
};

export const API = {
  CLIENT_ID: CLIENT_ID,
  URL_BASE: URL_BASE.BASE,
  USER: {
    LOGIN: () => {
      return `${URL_BASE.BASE}/auth/login`;
    },
    ME: () => {
      return `${URL_BASE.BASE}/users/me`;
    },
    GOOGLE: () => {
      return `${URL_BASE.BASE}/auth/google-oauth2`;
    },
    BASE: () => {
      return `${URL_BASE.BASE}/users`;
    },
    PAGE: () => {
      return `${URL_BASE.BASE}/users/page`;
    },
    USERS: (id?: string) => {
      return `${URL_BASE.BASE}/users${id ? '/' + id : ''}`;
    },
    SEARCH_USER: () => {
      return `${URL_BASE.BASE}/users/search`;
    },
    AUTHORIZATION_REQUEST: () => {
      return `${URL_BASE.BASE}/authtorization-request`;
    },
    AUTHORIZATION_RESPONSE: () => {
      return `${URL_BASE.BASE}/users/approve-or-revoke`;
    },
    SYNCHRONIZED: () => {
      return `${URL_BASE.BASE}/users/synchronized`;
    },
    ROLE_AND_TEAM: () => {
      return `${URL_BASE.BASE}/users/assigned-role-and-team`;
    },
    CHANGE_PASSWORD: () => {
      return `${URL_BASE.BASE}/users/changePassword`;
    },
    ENABLE_DS_DEVICE: (status: string) => {
      return `${URL_BASE.BASE}/users/ds9908r?status=${status}`;
    },
    GET_INFO_APK: () => {
      return `${URL_BASE.BASE}/mobile/info`;
    },
    DOWLOAD_APK: () => {
      return `${URL_BASE.BASE}/mobile/download-apk`;
    },
    OKTA_AUTH_REDIRECT: () => {
      return `${URL_BASE.BASE}/auth/redirect`;
    },
    OKTA_LOGOUT_REDIRECT: () => {
      return `${URL_BASE.BASE}/auth/logout`;
    }
  },
  PARTITION: {
    BASE: () => {
      return `${URL_BASE.BASE}/partition`;
    },
    PAGE: () => {
      return `${URL_BASE.BASE}/partition/page`;
    },
    FORCE_ARCHIVE: () => {
      return '/force-archive';
    },
    FORCE_RESTORE: () => {
      return '/force-restore';
    }
  },
  ROLES: {
    ROLES: () => {
      return `${URL_BASE.BASE}/roles`;
    },
    ROLES_LOGIN: () => {
      return `${URL_BASE.BASE}/roles/login`;
    }
  },
  SEASON: {
    BASE: () => {
      return `${URL_BASE.BASE}/season`;
    },
    LIST: () => {
      return `${URL_BASE.BASE}/season/list`;
    }
  },
  MESSAGE_ALERT: {
    BASE: () => {
      return `${URL_BASE.BASE}/notification`;
    },
    LIST: () => {
      return `${URL_BASE.BASE}/notification/page`;
    },
    USER: (userId: string) => {
      return `/user?userId=${userId}`;
    },
    DISMISS: (userId: string, notificationId: string) => {
      return `/dismiss?userId=${userId}&notificationId=${notificationId}`;
    }
  },
  EQUIPMENT_TEMPLATE: {
    BASE: () => {
      return `${URL_BASE.BASE}/equipment-template`
    },
    EQUIPMENT_TEMPLATE: (id: string) => {
      return `/${id}`;
    },
  },
  MANUFACTURER: {
    BASE: () => {
      return `${URL_BASE.BASE}/manufacturer`;
    },
    GET_MANUFACTURER_WITH_MODELS: (equipmentTypeId: string) => {
      return `/models?equipmentTypeId=${equipmentTypeId}`;
    },
    GET_BY_EQUIPMENT_TYPE: (equipmentTypeId: string) => {
      return `/list?equipmentTypeId=${equipmentTypeId}`;
    },
    GET_MANUFACTURER_LIST: () => {
      return `${URL_BASE.BASE}/manufacturer`;
    },
    GET_MANUFACTURER: (id: string) => {
      return `${URL_BASE.BASE}/manufacturer/${id}`;
    },
    POST_MANUFACTURER: () => {
      return `${URL_BASE.BASE}/manufacturer`;
    },
    PUT_MANUFACTURER: () => {
      return `${URL_BASE.BASE}/manufacturer`;
    },
    GET_MANUFACTURER_WITH_MODEL: (equipmentTypeId: string) => {
      return `${URL_BASE.BASE}/manufacturer/models?equipmentTypeId=${equipmentTypeId}`;
    }
  },
  TEAM: {
    TEAMS: () => {
      return `${URL_BASE.BASE}/team`;
    },
    TEAM: (id: string) => {
      return `${URL_BASE.BASE}/team/${id}`;
    },
    TEAM_RELATED_USERS: (teamId: string) => {
      return `${URL_BASE.BASE}/team/list/related/user/${teamId}`;
    },
    CREATE_RELATED_USER: () => {
      return `${URL_BASE.BASE}/team/related/user`;
    },
    DELETE_DELETED_USER: (id: string) => {
      return `${URL_BASE.BASE}/team/delete/user/${id}`;
    },
    USER_TEAMS: () => {
      return `${URL_BASE.BASE}/team/list-by-role`;
    }
  },
  EQUIPMENT_TYPE: {
    GET_EQUIPMENT_TYPE_LIST: () => {
      return `${URL_BASE.BASE}/equipment-type`;
    },
    GET_EQUIPMENT_TYPE: (id: string) => {
      return `${URL_BASE.BASE}/equipment-type/${id}`;
    },
    POST_EQUIPMENT_TYPE: () => {
      return `${URL_BASE.BASE}/equipment-type`;
    },
    PUT_EQUIPMENT_TYPE: () => {
      return `${URL_BASE.BASE}/equipment-type`;
    }
  },
  SCANNER: {
    SCANNER_DEVICE_SEARCH: () => {
      return `${URL_BASE.BASE}/scan-device`;
    },
    DEVICE_REPORT: (startDate: string, endDate: string) => {
      return `/device-report?startDate=${startDate}&endDate=${endDate}`;
    },
    DEVICE_REPORT_BY_SITE: (startDate: string, endDate: string, siteName: string, interval: number) => {
      return `/device-report-by-site-name?startDate=${startDate}&endDate=${endDate}&siteName=${siteName}&hours=${interval}`;
    },
    SCANS_BY_ACTIVITY: (id?: string) => {
      return `${URL_BASE.BASE}/scan/list${id ? '/' + id : ''}`;
    },
    SCANS_EQUIPMENTS_BY_PLAYER: (sessionId: string, playerId: string) => {
      return `${URL_BASE.BASE}/scan/equipment-scanned?sessionId=${sessionId}&playerId=${playerId}`;
    },
    SCANS_DOWNLOAD_REPORT: () => {
      return `${URL_BASE.BASE}/download/activityreport`;
    },
    SCAN_BASE: () => {
      return `${URL_BASE.BASE}/scan`;
    },
    SCANS_LIST_TAG_TIME: (sessionId: string, isNoisy?: string, tagId?: string) => {
      const hasTagId = !!tagId ? `&tag=${tagId}` : '';
      return `/list-tag-time?sessionId=${sessionId}&isNoisy=${!!isNoisy ? isNoisy : 'false'}${hasTagId}`;
    },
    SESSION_HISTORY: () => {
      return `/session-history`;
    },
    SCAN_DISTRIBUTION: () => {
      return `/count-scan-by-date`;
    },
    SCAN_BY_SESSION: () => {
      return `/scan-by-session`;
    },
    SCAN_BY_VENUE: () => {
      return `/count-scan-by-venue`;
    },
    SCAN_SEARCH_KEY: () => {
      return `/search-keys`;
    },
    EXTRA_CLEAT: (sessionId: string) => {
      return `/extra-cleat?sessionId=${sessionId}`
    }
  },
  EQUIPMENT_MODEL: {
    BASE: () => {
      return `${URL_BASE.BASE}/equipment-model`;
    },
    GET_EQUIPMENT_MODEL_LIST: () => {
      return `${URL_BASE.BASE}/equipment-model/page`;
    },
    GET_EQUIPMENT_MODEL: (id: string) => {
      return `${URL_BASE.BASE}/equipment-model/${id}`;
    },
    EQUIPMENT_MODEL: () => {
      return `${URL_BASE.BASE}/equipment-model`;
    },
    POST_EQUIPMENT_MODEL: () => {
      return `${URL_BASE.BASE}/equipment-model`;
    },
    PUT_EQUIPMENT_MODEL: () => {
      return `${URL_BASE.BASE}/equipment-model`;
    },
    POST_CUSTOM_FIELD: () => {
      return `${URL_BASE.BASE}/custom/field`;
    },
    PUT_CUSTOM_FIELD: () => {
      return `${URL_BASE.BASE}/custom/field`;
    },
    CUSTOM_FIELD: () => {
      return `${URL_BASE.BASE}/custom/field`;
    },
    DELETE_CUSTOM_FIELD: (id: string) => {
      return `${URL_BASE.BASE}/custom/field/${id}`;
    },
    GET_CUSTOM_FIELD_LIST: (id: string) => {
      return `${URL_BASE.BASE}/custom/field/list/${id}`;
    },
    GET_BY_EQUIPMENT_TYPE: (equipmentTypeId: string) => {
      return `${URL_BASE.BASE}/equipment-model/list?equipmentTypeId=${equipmentTypeId}`;
    },
    GET_BY_EQUIPMENT_TYPE_MANUFACTURER_TYPE: (equipmentId: string, manufacturerId: string) => {
      return `${URL_BASE.BASE}/equipment-model/list-by-manufacturer-and-equipment-type?equipmentTypeId=${equipmentId}&manufacturerId=${manufacturerId}`;
    },
    GET_EQUIPMENT_REQUEST: () => {
      return `/get-equipment-request`;
    }
  },
  PLAYER: {
    BASE: () => {
      return `${URL_BASE.BASE}/player`;
    },
    ASSIGNED_PLAYER_TO_EQUIPMENT: (name: string, playerId: string, teamId?: string, sessionId?: string) => {
      return `/search?name=${name}&playerId=${playerId}&teamId=${teamId}${sessionId ? '&sessionId=' + sessionId : ''}`;
    },
    SEARCH_KEYS: () => {
      return `/search-keys`;
    },
    PLAYER_HISTORY: () => {
      return `/player-history`;
    },
    PLAYERS: () => {
      return `${URL_BASE.BASE}/player`;
    },
    PLAYER_ID_AND_SESSION: (id: string, sessionId?: string) => {
      return `player-detail?playerId=${id}${sessionId ? '&sessionId=' + sessionId : ''}`;
    },
    PLAYER_BY_ID: (id: string) => {
      return `${URL_BASE.BASE}/player/${id}`;
    },
    PLAYER_BY_ID_AND_SESSION: (id: string, sessionId?: string) => {
      return `${URL_BASE.BASE}/player/player-detail?playerId=${id}${sessionId ? '&sessionId=' + sessionId : ''}`;
    },
    PLAYER_BARCODE: () => {
      return `${URL_BASE.BASE}/player/barcode`;
    },
    ASSIGNED_PLAYER_LIST: (name: string, playerId: string, teamId?: string) => {
      return `${URL_BASE.BASE}/player/search?name=${name}&playerId=${playerId}&teamId=${teamId}`;
    },
    PLAYER_EQUIPMENT_EXPORT: () => {
      return `${URL_BASE.BASE}/player/equipment/export/csv`;
    },
    TEAM_WITH_PLAYERS: (teamId?: string, equipmentTypeId?: string) => {
      if (teamId) {
        if (equipmentTypeId) {
          return `${URL_BASE.BASE}/player/list/team-player?teamId=${teamId}&equipmentTypeId=${equipmentTypeId}`;
        } else {
          return `${URL_BASE.BASE}/player/list/team-player?teamId=${teamId}`;
        }
      } else {
        return `${URL_BASE.BASE}/player/list/team-player`;
      }
    },
    PLAYERS_PAGE: () => {
      return `${URL_BASE.BASE}/player/page`
    },
    EQUIPMENT_COUNT: (teamId?: string, sessionId?: string, keyword?: string, status?: string) => {
      return `/count-equipment?sessionId=${sessionId ?? ''}&teamId=${teamId ?? ''}&keyword=${keyword ?? ''}&status=${status ?? ''}`;
    }
  },
  EQUIPMENT: {
    BASE: () => {
      return `${URL_BASE.BASE}/equipment`;
    },
    DASHBOARD_INFORMATION: () => {
      return `${URL_BASE.BASE}/equipment/dashboard-information`;
    },
    ASSIGNED_EQUIPMENT_TO_PLAYER: () => {
      return `/relation-equipment-player`;
    },
    TAG_VALIDATOR: (tag: string, teamId: string, equipmentTypeId: string, equipmentId?: string, isReclaim?: boolean) => {
      return `/validate-tag?tag=${tag}&teamId=${teamId}&equipmentTypeId=${equipmentTypeId}&equipmentId=${equipmentId ?? ''}&isReclaim=${!!isReclaim}`;
    },
    ARCHIVE_EQUIPMENT: (equipmentId: string, archive: boolean) => {
      return `/archived?equipmentId=${equipmentId}&archived=${archive}`;
    },
    ARCHIVE_EQUIPMENT_LIST: () => {
      return `/archived-list`;
    },
    DELETE_EQUIPMENT_LIST: () => {
      return `/delete-list`;
    },
    RECONDITION_STATUS_LIST: () => {
      return `/recondition-status-list`;
    },
    UNASSIGN_PLAYER_EQ_LIST: () => {
      return `/unassigned-player-list`;
    },
    MULTICHECK_OPTION: () => {
      return '/multi-check-option-list';
    },
    SEARCH_KEYS: () => {
      return `/search-keys`;
    },
    SEARCH_NOCSAE_TAG: (tag: string) => {
      return `/search-by-tag-in-nocsae?tag=${tag}`;
    },
    SEARCH_TAG: (tag: string) => {
      return `/search-by-tag?tag=${tag}`;
    },
    EQUIPMENTS: () => {
      return `${URL_BASE.BASE}/equipment/search`;
    },
    IMPORT: () => {
      return `${URL_BASE.BASE}/equipment/import/csv`;
    },
    DELETE_RELATED_EQUIPMENT: (playerId: string, equipmentId: string, sessionId?: string) => {
      return `/unassign-player?playerId=${playerId}&equipmentId=${equipmentId}${sessionId ? '&sessionId=' + sessionId : ''}`;
    },
    EQUIPMENT_BY_CODE: (code: string, playerId: string, archived: boolean) => {
      return `search-by-equipment-code?keyword=${code}&playerId=${playerId}&archived=${archived+''}`;
    },
    EQUIPMENT_BY_ID: (id: string) => {
      return `${URL_BASE.BASE}/equipment/${id}`;
    },
    EQUIPMENT_MODEL_BY_EQUIPMENT_TYPE_ID: (id: string) => {
      return `${URL_BASE.BASE}/equipment-model/list?equipmentTypeId=${id}`;
    },
    EQUIPMENT: () => {
      return `${URL_BASE.BASE}/equipment`;
    },
    EQUIPMENT_CODE_GENERATOR: (equipmentTypeId: string) => {
      return `/code?equipmentTypeId=${equipmentTypeId}`;
    },
    FIND_EQUIPMENT_BY_TAG_OR_CODE: (code: string, playerId: string, sessionId?: string) => {
      return `${URL_BASE.BASE}/equipment/get-by-scan?tag=${code}&playerId=${playerId}&sessionId=${sessionId}`; // asdfasdf
    },
    SEARCH_EQUIPMENT_BY_CODE: (code: string, playerId: string) => {
      return `${URL_BASE.BASE}/equipment/search-by-equipment-code?keyword=${code}&playerId=${playerId}`;
    },
    EQUIPMENT_ASSIGNED_BY_PLAYER: (playerId: string) => {
      return `${URL_BASE.BASE}/equipment/get-by-player?playerId=${playerId}`;
    },
    UNASSIGNED_EQUIPMENT: (playerId: string, equipmentId: string, sessionId?: string) => {
      return `${URL_BASE.BASE}/equipment/unassign-player?playerId=${playerId}&equipmentId=${equipmentId}${sessionId ? '&sessionId=' + sessionId : ''}`;
    },
    ASSIGN_EQUIPMENT: () => {
      return `${URL_BASE.BASE}/equipment/relation-equipment-player`;
    },
    ASSIGN_EQUIPMENTS: () => {
      return `${URL_BASE.BASE}/equipment/relation-equipment-player-group`;
    },
    SYNCHRONIZED_HELMET_MODELS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-helmet-models`;
    },
    SYNCHRONIZED_SHOULDER_PADS_MODELS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-shoulder-pad-models`;
    },
    SYNCHRONIZED_CLEATS_MODELS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-cleats-models`;
    },
    SYNCHRONIZED_PARTS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-parts`;
    },
    SYNCHRONIZED_HELMET_PARTS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-helmet-parts`;
    },
    SYNCHRONIZED_SHOULDER_PADS_PARTS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-shoulder-pads-parts`;
    },
    SYNCHRONIZED_CLEAT_PARTS: () => {
      return `${URL_BASE.BASE}/equipment/synchronized-cleat-parts`;
    },
    EXPORT_CSV: () => {
      return `${URL_BASE.BASE}/equipment/downloadcsv`;
    },
    EXPORT_EQUIPMENT_CSV: (teamId: string, equipmentTypeId: string) => {
      return `${URL_BASE.BASE}/equipment/download-csv?teamId=${teamId}&equipmentTypeId=${equipmentTypeId}`;
    },
    EXPORT_ALL_EQUIPMENT_CSV: (equipmentTypeId: string) => {
      return `${URL_BASE.BASE}/equipment/download-all-csv?equipmentTypeId=${equipmentTypeId}`;
    },
    RECLAIM_EQUIPMENT: (tag: string) => {
      return `/reclaim?tag=${tag.toUpperCase()}`;
    },
    REDIRECT: (equipmentCode: string) => {
      return `/redirect?equipmentCode=${equipmentCode}`;
    },
    REDIRECT_TAG: (tag: string) => {
      return `/redirect?tag=${tag}`;
    },
  },
  TAG: {
    RELATE_TAG_EQUIPMENT: () => {
      return `${URL_BASE.BASE}/equipment-tag/relate-tag-equipment`;
    },
    EQUIPMENT_TAG: (equipmentId?: string) => {
      return `${URL_BASE.BASE}/equipment-tag/list${equipmentId ? '?equipmentId=' + equipmentId : ''}`;
    },
    LIST_TAG: () => {
      return `${URL_BASE.BASE}/equipment-tag/list-tag`;
    },
    TAG_HISTORICAL: (tag: string) => {
      return `${URL_BASE.BASE}/equipment-tag/tag-historical/${tag}`;
    },
    ADD_COACH_TO_PLAYER: () => {
      return `${URL_BASE.BASE}/equipment-tag/add-coach-to-player`;
    },
    SCANS_HISTORY: () => {
      return `${URL_BASE.BASE}/scan/scan-by-date-range`;
    },
    BLINKS_HISTORY: () => {
      return `${URL_BASE.BASE}/raw-blink/by-date-range`;
    },
    RAW_BLINKS_SYNC: (startDate: string, endDate: string) => {
      return `${URL_BASE.BASE}/raw-blink/synchronized?startDateString=${startDate}&endDateString=${endDate}`;
    },
  },
  RAW_BLINK: {
    BASE: () => {
      return `${URL_BASE.BASE}/raw-blink`;
    },
    SYNCHRONIZE: (startDate: string, endDate: string) => {
      return `/synchronized?startDateString=${startDate}&endDateString=${endDate}`;
    },
  },
  CUSTOM_FIELD: {
    BASE: () => {
      return `${URL_BASE.BASE}/custom/field`;
    },
    BY_EQUIPMENT_MODEL_AND_ID: (equipmentModelId: string, equipmentId: string) => {
      return `/list?equipmentModelId=${equipmentModelId}&equipmentId=${equipmentId}`;
    },
    
    LIST: (equipmentModelId: string, equipmentId: string) => {
      return `${URL_BASE.BASE}/custom/field/list?equipmentModelId=${equipmentModelId}&equipmentId=${equipmentId}`;
    }
  },
  HISTORY: {
    HISTORY_BY_ID: (id?: string) => {
      return `${URL_BASE.BASE}/equipment-history?equipmentId=${id}`;
    }
  },
  SITE_MAP: {
    SITE_MWE_ALL: () => {
      return `${URL_BASE.BASE}/site/mwe/all`;
    },
    RELATE_SITE: () => {
      return `${URL_BASE.BASE}/site`;
    },
    SITE_BY_TEAM: (teamId: string) => {
      return `${URL_BASE.BASE}/site/by-team/${teamId}`;
    },
    SITE_BY_TEAM_AND_TYPE: (teamId: string, type: string) => {
      return `${URL_BASE.BASE}/site/by-team?teamId=${teamId}&type=${type}`;
    },
    DELETE_SITE: (id: string) => {
      return `${URL_BASE.BASE}/site/${id}`;
    },
    SITES_RELATED_TEAM: (teamId: string) => {
      return `${URL_BASE.BASE}/site/site-related-team?teamId=${teamId}`;
    },
    ZONE: (id?: string) => {
      return `${URL_BASE.BASE}/site/zone${id ? '/' + id : ''}`;
    },
    ZONES_BY_SITE_ID: (siteId: string) => {
      return `${URL_BASE.BASE}/site/zones/${siteId}`;
    },
    ZONES_BY_TEAM_ID: (teamId: string) => {
      return `${URL_BASE.BASE}/site/zone/list/${teamId}`;
    }
  },
  SITE: {
    BASE: () => {
      return `${URL_BASE.BASE}/site`;
    },
    LIST: (siteId: string) => {
      return `/list/${siteId}`;
    },
    SITES: () => {
      return `${URL_BASE.BASE}/site`;
    },
    ZONE_BY_SITE_ID: (siteId: string) => {
      return `${URL_BASE.BASE}/site/zone/${siteId}`;
    },
    ZONE_LIST_BY_SITE_ID: (siteId: string) => {
      return `${URL_BASE.BASE}/site/zone/list/${siteId}`;
    },
    ZONE: () => {
      return `${URL_BASE.BASE}/site/zone`;
    },
    ZONE_WITH_ID: (zoneId: string) => {
      return `${URL_BASE.BASE}/site/zone/${zoneId}`;
    },
    SYNCHRONIZED: () => {
      return `${URL_BASE.BASE}/site/synchronized`;
    },
    IMPORT_SITES: () => {
      return `${URL_BASE.BASE}/import/sites`;
    }
  },
  SITE_LOCATION: {
    SITE_LOCATION_BY_SITE: (siteId: string) => {
      return `${URL_BASE.BASE}/site-location/list?siteId=${siteId}`;
    },
    SITE_LOCATION: () => {
      return `${URL_BASE.BASE}/site-location`;
    },
    SITE_LOCATION_BY_ID: (siteLocationId: string) => {
      return `${URL_BASE.BASE}/site-location/${siteLocationId}`;
    }
  },
  DEVICES: {
    BASE: () => {
      return `${URL_BASE.BASE}/scan-device`;
    },
    FX9600: {
      FX9600: (id?: string) => {
        return `${URL_BASE.BASE}/scan-device/fx9600${id ? '/' + id : ''}`;
      },
      FX9600_LIST: () => {
        return `${URL_BASE.BASE}/scan-device/fx9600/search`;
      },
      FX9600_DETAIL: (id: string) => {
        return `/${id}`;
      },
      FX9600_BY_ID: (id: string) => {
        return `${URL_BASE.BASE}/scan-device/fx9600?deviceFx9600Id=${id}`;
      },
      FX9600_LIST_MWE: () => {
        return `${URL_BASE.BASE}/scan-device/fx9600-mwe`;
      }
    },
    DS9908R: {
      BEEP: (beeps: string) => {
        return `${URL_BASE.BASE_DEVICE}/configure/beep?numberBeeps=${beeps}`;
      },
      INSTALLERS: () => {
        return `${URL_BASE.BASE}/scan-device/list-installers`;
      },
      DOWNLOAD_INSTALLER: (fileName: string) => {
        return `${URL_BASE.BASE}/scan-device/download-installer?fileName=${fileName}`;
      },
      CHANGE_STATUS: (status: string) => {
        return `${URL_BASE.BASE_DEVICE}/configure/turn-on-and-off?option=${status}`;
      },
      CHANGE_LIGHT_COLOR: (color: string, status: string) => {
        return `${URL_BASE.BASE_DEVICE}/configure/light?kindColour=${color}&option=${status}`;
      },
      SOCKET_CONNECTION: () => {
        return `${URL_BASE.BASE_DEVICE}/hubs/chat`;
      },
      REBOOT: () => {
        return `${URL_BASE.BASE_DEVICE}/configure/reboot`;
      },
      VOLUME: (volume: number) => {
        return `${URL_BASE.BASE_DEVICE}/configure/volume?volume=${volume}`;
      },
      STATUS_DEVICE: () => {
        return `${URL_BASE.BASE_DEVICE}/configure/status`;
      }
    }
  },
  PART_TYPE: {
    BASE: () => {
      return `${URL_BASE.BASE}/part-type`;
    },
    PART_TYPES_AND_PARTS_BY_EQUIPMENT: (equipmentTypeId: string, equipmentModelId: string, equipmentId: string) => {
      return `/parts?equipmentTypeId=${equipmentTypeId}&equipmentModelId=${equipmentModelId}&equipmentId=${equipmentId}`;
    },
    PART_TYPE: (id?: string) => {
      return `${URL_BASE.BASE}/part-type${id ? '/' + id : ''}`;
    },
    PART_TYPE_BY_MODEL_ID: (id: string) => {
      return `${URL_BASE.BASE}/part-type/equipment-model?equipmentModelId=${id}`;
    },
    PART_TYPE_BY_EQUIPMENT_TYPE_AND_EQUIPMENT_MODEL_ID: (equipmentTypeId: string, equipmentModelId?: string) => {
      return `${URL_BASE.BASE}/part-type/equipment-type-and-model?equipmentTypeId=${equipmentTypeId}&equipmentModelId=${equipmentModelId ? equipmentModelId : ''}`;
    },
    PAGE: () => {
      return `${URL_BASE.BASE}/part-type/page`;
    },
    PARTS: (equipmentTypeId: string, equipmentModelId: string, equipmentId: string) => {
      return `${URL_BASE.BASE}/part-type/parts?equipmentTypeId=${equipmentTypeId}&equipmentModelId=${equipmentModelId}&equipmentId=${equipmentId}`;
    }
  },
  PART: {
    BASE: () => {
      return `${URL_BASE.BASE}/part`;
    },
    BY_STYLE_NUMBER: () => {
      return '/style-number';
    },
    PART: (id?: string) => {
      return `${URL_BASE.BASE}/part${id ? '/' + id : ''}`;
    }
  },
  MANAGEMENT: {
    MWE_INTEGRATION: () => {
      return `${URL_BASE.BASE}/integration`;
    },
    MWE_INTEGRATION_TEST: () => {
      return `${URL_BASE.BASE}/integration/test`;
    }
  },
  LOGIN_TYPE: {
    LOGIN: () => {
      return `${URL_BASE.BASE}/info/version`;
    }
  },
  SCHEDULE: {
    BASE: () => {
      return `${URL_BASE.BASE}/schedule`;
    },
    SCHEDULE: ({id, isNote}: {id?: string, isNote?: boolean}) => {
      return `${URL_BASE.BASE}/schedule${id ? '/' + id : ''}${isNote ? '?isNote=true' : ''}`;
    },
    SCHEDULE_SEARCH: (id?: string) => {
      return `${URL_BASE.BASE}/schedule/search${id ? '/' + id : ''}`;
    },
    SCHEDULE_BY_CALENDAR: () => {
      return `${URL_BASE.BASE}/schedule/calendar`;
    },
    SEASON: () => {
      return `${URL_BASE.BASE}/schedule/season`;
    },
    SEARCH_KEYS: () => {
      return `/search-keys`;

    },
    SYNCHRONIZED_PRACTICES: () => {
      return `${URL_BASE.BASE}/schedule/sync/practiceschedule`;
    },
    SYNCHRONIZED_GAMES: () => {
      return `${URL_BASE.BASE}/schedule/sync/gameschedule`;
    },
    REBUILD: (sessionId: string, allZones: string) => {
      return `/rebuild-practice?sessionId=${sessionId}&allZones=${allZones}`;
    },
    EQUIPMENT_COUNT: (teamId?: string, sessionId?: string, keyword?: string, status?: string) => {
      return `/count-equipment?sessionId=${sessionId ?? ''}&teamId=${teamId ?? ''}&keyword=${keyword ?? ''}&status=${status ?? ''}`;
    },
    REDIRECT: (gameKey: string, sessionId: string, playerId: string) => {
      return `/redirect?gameKey=${gameKey}&sessionId=${sessionId}&playerId=${playerId}`;
    },
  },
  IMPORT: {
    BASE: () => {
      return `${URL_BASE.BASE}/import`;
    },
    DEVICES: () => {
      return `${URL_BASE.BASE}/import/devices`;
    },
    SITES: () => {
      return `${URL_BASE.BASE}/import/sites`;
    },
    ZONES: () => {
      return `${URL_BASE.BASE}/import/zones`;
    },
    LOGS: () => {
      return `${URL_BASE.BASE}/import/logs`;
    },
    GET_LOGS: (key: string) => {
      return `/getlogs?key=${key}`;
    },
    CLEATS: () => {
      return `${URL_BASE.BASE}/import/cleats`;
    },
    HELMETS: () => {
      return `${URL_BASE.BASE}/import/helmets`;
    },
    SHOULDER_PADS: () => {
      return `${URL_BASE.BASE}/import/shoulder-pads`;
    },
    GET_CSV: (id: string) => {
      return `${URL_BASE.BASE}/import/getfile?id=${id}`;
    },
    UPLOAD: (type: string, forced: boolean, teamId: string, manufacturerId: string) => {
      return `${URL_BASE.BASE}/import/upload?type=${type}&forced=${forced}&teamId=${teamId}&manufacturerId=${manufacturerId}`;
    },
    GET_STATUS: (key: string) => {
      return `${URL_BASE.BASE}/import/getstatus?key=${key}`;
    },
    GET_STATUS_LOGS: (key: string) => {
      return `${URL_BASE.BASE}/import/getstatuslogs?key=${key}`;
    },
    CONFIRM_UPLOAD: (key: string) => {
      return `${URL_BASE.BASE}/import/confirmupload?key=${key}`;
    },
    GET_CVS_SUMMARY: (key: string) => {
      return `${URL_BASE.BASE}/import/getcsvsummary?key=${key}`;
    },
  },
  LOGS: {
    GET_BACKEND_LOGS: () => {
      return `${URL_BASE.BASE}/getbackendlogs`;
    }
  },
  PROGRESS_BAR: {
    BASE: () => {
      return `${URL_BASE.BASE}/progress-bar`;
    },
    PROCESS: () => {
      return `/process`;
    }
  },
  DOWNLOAD: {
    BASE: () => {
      return `${URL_BASE.BASE}/download`;
    },
    ALL_SCANS: () => {
      return `/all-scans-report`;
    },
    ALL_SCANS_FILE: () => {
      return '/file';
    },
    SCANS_BY_TEAM: () => {
      return `/all-scans-report-by-team`;
    },
    SCANS_BY_VENUE: () => {
      return `/all-scans-report-by-venue`;
    },
    GENERATE_TEMPLATE: (id: string, team: string) => {
      return `${URL_BASE.BASE}/download/generate-template?equipmentTypeId=${id}&team=${team}`
    },
    DETAILED_SCAN_DISTRIBUTION: () => {
      return `/generate-scan-distribution-report`;
    },
    TAG_HISTORY_REPORT: () => {
      return `/generate-equipment-tag-history-report`;
    },
    USER_LIST: (params: string) => {
      return `/users${params}`;
    },
  },
  MAINTENANCE: {
    BASE: () => {
      return `${URL_BASE.BASE}/maintenance`;
    },
    LIST_LOG_FILES: () => {
      return `/list-log-files`;
    },
    DOWNLOAD_LOG_FILES: (fileName: string) => {
      return `/download-log-file?file=${fileName}`;
    }
  },
  SEARCH: {
    BASE: () => {
      return `${URL_BASE.BASE}/search-filter`;
    },
    SAVED_LIST: (view: string) => {
      return `?viewName=${view}_view`;
    }
  },
  APPAREL: {
    BASE: () => {
      return `${URL_BASE.BASE}/apparel`;
    },
    PLAYER: (playerId: string) => {
      return `/player?playerId=${playerId}`;
    },
    EXPORT_CSV: (teamId: string) => {
      return `${URL_BASE.BASE}/apparel/download-csv?teamId=${teamId}`;
    },
    EXPORT_PLAYER_CSV: (teamId: string, playerId: string) => {
      return `${URL_BASE.BASE}/apparel/download-csv?teamId=${teamId}&playerId=${playerId}`;
    },
    EXPORT_PLAYER_ALL_EQUIPMENT_CSV: (playerId: string) => {
      return `${URL_BASE.BASE}/equipment/download-csv-by-player?playerId=${playerId}`;
    },
    IMPORT_CSV: (teamId: string) => {
      return `${URL_BASE.BASE}/import/apparel?teamId=${teamId}`;
    }
  },
  EQUIPMENT_PARTS: {
    BASE: () => {
      return `${URL_BASE.BASE}/part-type`
    },
    LIST: (equipmentType: string) => {
      return `/${equipmentType}`;
    },
  },
};
