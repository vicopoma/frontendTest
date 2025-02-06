import * as Yup from 'yup';
import { ACCOUNT_ROLES, CLEAT_SIZE, PART_STATUS_DESC } from './constants';
import { PartFromEquipment } from '../store/types/partType';

export const loginFields = {
  username: '',
  password: ''
};

const emailRgex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const macAddressRegex: any = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
const ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9]*[A-Za-z0-9])$/;

const validatorMessages = {
  min: (param: string) => {
    return `${param} length must be at least 2 characters`;
  },
  max: (param: string) => {
    return `${param} text is too long`;
  },
  required: (param: string) => {
    return `${param} is a required field`;
  },
  number: (param: string) => {
    return `${param} must me a number`;
  },
  invalid: (param: string) => {
    return `${param} is invalid format`;
  }
  
};

export const loginValidators = Yup.object().shape({
  username: Yup.string()
  .min(2, validatorMessages.min('User name'))
  .max(255, validatorMessages.max('User Name'))
  .required(validatorMessages.required('User name')),
  password: Yup.string()
  .min(2, validatorMessages.min('Password'))
  .max(255, validatorMessages.max('Password'))
  .required(validatorMessages.required('Password'))
});


export const manufacturerValidators = Yup.object().shape({
  nameManufacturer: Yup.string()
  .min(2, validatorMessages.min('Manufacturer Name'))
  .max(255, validatorMessages.max('Manufacturer Name'))
  .required(validatorMessages.required('Manufacturer Name')),
  // description: Yup.string()
  //   .min(2, validatorMessages.min('Description'))
  //   .max(255, validatorMessages.max('Description'))
  //   .required(validatorMessages.required('Description')),
});

export const equipmentTypeValidators = Yup.object().shape({
  nameEquipmentType: Yup.string()
  .min(2, validatorMessages.min('Equipment Type name'))
  .max(255, validatorMessages.max('Equipment Type name'))
  .required(validatorMessages.required('Equipment Type name')),
  // description: Yup.string()
  //   .min(2, validatorMessages.min('Description'))
  //   .max(255, validatorMessages.max('Description'))
  //   .required(validatorMessages.required('Description')),
});
export const activityDrawerValidators = Yup.object().shape({
  // title: Yup.string()
  //   .min(2, validatorMessages.min('Name'))
  //   .max(255, validatorMessages.max('Name'))
  //   .required(validatorMessages.required('Name'))
  //   .nullable(true),
  homeTeamId: Yup.mixed()
  .when('roleName', {
    is: (roleName) => {
      if (roleName === ACCOUNT_ROLES.ZEBRA_ADMIN || roleName === 'undefined') {
        return true;
      } else {
        return false;
      }
    },
    then: Yup.string()
    .required(validatorMessages.required('Team'))
    .nullable(true),
  }),
  startGameDate: Yup.string().required(validatorMessages.required('Start time')),
  endGameDate: Yup.string().required(validatorMessages.required('End time'))
});

export const equipmentModelValidators = Yup.object().shape({
  nameModel: Yup.string()
  .min(2, validatorMessages.min('Model Name'))
  .max(255, validatorMessages.max('Model Name'))
  .required(validatorMessages.required('Model Name')),
  // description: Yup.string()
  //   .min(2, validatorMessages.min('Description'))
  //   .max(255, validatorMessages.max('Description'))
  //   .required(validatorMessages.required('Description')),
  modelYear: Yup.string()
  .nullable(true)
  .required(validatorMessages.required('Model Year')),
  equipmentTypeId: Yup.string()
  .required(validatorMessages.required('Equipment Type')),
  manufacturerId: Yup.string()
  .required(validatorMessages.required('Manufacturer')),
  // customFields: Yup.array()
  //   .required('Required')
  //   .min(1, 'Required')
});

const customFieldValidator = (required: boolean, typeField: string, nameField: string, schema: any) => {
  switch (typeField) {
    case 'text':
      if (required) {
        schema = Yup.string().required(validatorMessages.required(nameField)).nullable(true).min(2, validatorMessages.min(nameField)).nullable(true);
      } else {
        schema = Yup.string().nullable(true).label(nameField);
      }
      break;
    case 'number':
      if (required) {
        schema = Yup.number().required(validatorMessages.required(nameField)).label(nameField);
      } else {
        schema = Yup.number().label(validatorMessages.number(nameField));
      }
      break;
    case 'checkbox':
      if (required) {
        schema = Yup.boolean().required(validatorMessages.required(nameField));
      } else {
        schema = Yup.boolean();
      }
      break;
  }
  return schema;
};

export const customFieldValidators = Yup.object().shape({
  nameField: Yup.string()
  .min(2, validatorMessages.min('Name'))
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name')),
  typeField: Yup.string()
  .max(255, validatorMessages.max('Field'))
  .required(validatorMessages.required('Field')),
  defaultValue: Yup.mixed().when(['required', 'typeField', 'nameField'], customFieldValidator)
});

export const equipmentValidators = Yup.object().shape({
  note: Yup.string()
  .max(255, validatorMessages.max('Note'))
  .nullable(true),
  description: Yup.string()
  .max(255, validatorMessages.max('Description'))
  .nullable(true),
  equipmentCode: Yup.string()
  .nullable(true)
  .required(validatorMessages.required('Equipment Code')),
  nameModel: Yup.string()
  .nullable(true)
  .required(validatorMessages.required('Equipment Model')),
  equipmentModelId: Yup.string()
  .nullable(true)
  .required(validatorMessages.required('Model Year')),
  manufacturerId: Yup.string()
  .max(255, validatorMessages.required('Manufacturer'))
  .nullable(true)
  .required(validatorMessages.required('Manufacturer')),
  equipmentTypeId: Yup.string()
  .nullable(true)
  .required(validatorMessages.required('Equipment Type')),
  partTypeWithPartDTOList: Yup.array().of(
    Yup.object().shape({
      namePartType: Yup.string(),
      partIdSelected: Yup.mixed().when(['namePartType', 'parts'], {
        is: (namePartType: string, parts: Array<PartFromEquipment>) => {
          if (!!namePartType) {
            const hasActiveParts = parts.some(part => part.statusDescription === PART_STATUS_DESC.ACTIVE)
            return namePartType.toLowerCase() === CLEAT_SIZE && hasActiveParts;
          }
          return false;
        },
        then: Yup.string()
        .max(255, validatorMessages.max('Cleat Size'))
        .required(validatorMessages.required('Cleat Size'))
        .nullable(true),
      })
    })
  ),
  customfield: Yup.array().of(
    Yup.object().shape({
      nameField: Yup.string(),
      typeField: Yup.string(),
      customFieldId: Yup.string(),
      required: Yup.boolean(),
      value: Yup.mixed().when(['required', 'typeField', 'nameField'], (required: boolean, typeField: string, nameField: string, schema: any) => {
        switch (typeField) {
          case 'text':
            if (required) {
              schema = Yup.string().required(validatorMessages.required(nameField)).nullable(true).min(2, validatorMessages.min(nameField)).nullable(true);
            } else {
              schema = Yup.string().nullable(true).label(nameField);
            }
            break;
          case 'number':
            if (required) {
              schema = Yup.number().required(validatorMessages.required(nameField)).label(nameField);
            } else {
              schema = Yup.number().label(validatorMessages.number(nameField));
            }
            break;
          case 'checkbox':
            if (required) {
              schema = Yup.boolean().required(validatorMessages.required(nameField));
            } else {
              schema = Yup.boolean();
            }
            break;
        }
        return schema;
      })
    })
  ),
  // teamId: Yup.string()
  //   .required(validatorMessages.required('Team'))
  //   .nullable(true)
});

export const equipmentTagValidators = Yup.object().shape({
  equipmentTags: Yup.array().of(
    Yup.object().shape({
      tag: Yup.string().required(validatorMessages.required('Value')),
      equipmentId: Yup.string().required()
    })
  ).min(1, '')
});

export const userValidators = Yup.object().shape({
  name: Yup.string()
  .min(2, validatorMessages.min('Name'))
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name'))
  .nullable(true),
  login: Yup.string()
  .min(2, validatorMessages.min('User Name'))
  .max(255, validatorMessages.max('User Name'))
  .required(validatorMessages.required('User Name'))
  .nullable(true),
  email: Yup.string()
  .min(2, validatorMessages.min('Email'))
  .max(255, validatorMessages.max('Email'))
  .matches(emailRgex, validatorMessages.invalid('Email'))
  .required(validatorMessages.required('Email'))
  .nullable(true),
  roleId: Yup.string()
  .required(validatorMessages.required('Role')),
  // .nullable(true),
  teamId: Yup.mixed()
  .when('roleName', {
    is: (roleName) => {
      if (roleName === ACCOUNT_ROLES.ZEBRA_ADMIN || roleName === ACCOUNT_ROLES.OEM_ADMIN || roleName === ACCOUNT_ROLES.OEM_TEAM_USER) {
        return false;
      } else {
        return true;
      }
    },
    then: Yup.string()
    .required(validatorMessages.required('Team'))
    .nullable(true),
  }),
  manufacturerId: Yup.mixed()
  .when('roleName', {
    is: (roleName) => {
      if (roleName === ACCOUNT_ROLES.ZEBRA_ADMIN || roleName === ACCOUNT_ROLES.ADMIN_USER || roleName === ACCOUNT_ROLES.USER_TEAM || roleName === ACCOUNT_ROLES.TEAM_MAINTAINER) {
        return false;
      } else {
        return true;
      }
    },
    then: Yup.string()
    .required(validatorMessages.required('Manufaturer'))
    .nullable(true),
  }),
});

export const playerValidators = Yup.object().shape({
  firstName: Yup.string()
  .min(2, validatorMessages.min('First Name'))
  .max(255, validatorMessages.max('First Name'))
  .required(validatorMessages.required('First Name'))
  .nullable(true),
  lastName: Yup.string()
  .min(2, validatorMessages.min('Last Name'))
  .max(255, validatorMessages.max('Last Name'))
  .required(validatorMessages.required('Last Name'))
  .nullable(true),
  currentTeamId: Yup.string()
  .required(validatorMessages.required('Team'))
  .nullable(true),
  // birthDate: Yup.string()
  //   .required(validatorMessages.required('Birthdate'))
  //   .nullable(true),
});

export const deviceFx9600Validator = Yup.object().shape({
  deviceType: Yup.string()
  .min(2, validatorMessages.min('Device Type'))
  .max(255, validatorMessages.max('Device Type'))
  .required(validatorMessages.required('Device Type'))
  .nullable(true),
  name: Yup.string()
  .min(2, validatorMessages.min('Name'))
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name'))
  .nullable(true),
  description: Yup.string()
  .min(2, validatorMessages.min('Description'))
  .max(255, validatorMessages.max('Description'))
  .required(validatorMessages.required('Description'))
  .nullable(true),
  hostName: Yup.string()
  .min(2, validatorMessages.min('Hos tName'))
  .max(255, validatorMessages.max('Host Name'))
  .nullable(true)
  .matches(ValidIpAddressRegex, 'Input a valid hostname')
  //.matches(ValidIpAddressRegex, 'Input a valid Ip Address')
  .required(validatorMessages.required('Host Name')),
  macAddress: Yup.string()
  //.min(2, validatorMessages.min('Mac Address'))
  //.max(12, validatorMessages.max('Mac Address'))
  .required(validatorMessages.required('Mac Address'))
  .matches(macAddressRegex, 'Input a valid Mac Address')
  .nullable(true),
  coordinateX: Yup.number()
  .required('Required'),
  coordinateY: Yup.number()
  .required('Required'),
  coordinateZ: Yup.number()
  .required('Required'),
  operationType: Yup.string()
  .min(2, validatorMessages.min('Operation Type'))
  .max(12, validatorMessages.max('Operation Type'))
  .required(validatorMessages.required('Operation Type'))
  .nullable(true),
  match: Yup.string()
  .min(2, validatorMessages.min('Match'))
  .max(12, validatorMessages.max('Match'))
  .required(validatorMessages.required('Match'))
  .nullable(true),
  tagId: Yup.string()
  .min(2, validatorMessages.min('Tag ID'))
  .max(12, validatorMessages.max('Tag ID'))
  .required(validatorMessages.required('Tag ID'))
  .nullable(true),
  operation: Yup.string()
  .min(2)
  .max(255)
  .nullable(true)
  .required('Required'),
});

export const siteLocationValidator = Yup.object().shape({
  largeName: Yup.string()
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name'))
  .nullable(true),
  // latitude: Yup.number()
  //   .required(),
  // longitude: Yup.number()
  //   .required(),
  // shortName: Yup.string()
  //   .min(2, validatorMessages.min('Place'))
  //   .max(255, validatorMessages.max('Place'))
  //   .required(validatorMessages.required('Place'))
  //   .nullable(true),
  siteId: Yup.string()
  // .min(2, validatorMessages.min('Site'))
  .max(255, validatorMessages.max('Site'))
  .required(validatorMessages.required('Site'))
  .nullable(true),
  siteLocationType: Yup.string()
  // .min(2, validatorMessages.min('Site Location Type'))
  .max(255, validatorMessages.max('Site Location Type'))
  .required(validatorMessages.required('Site Location Type'))
  .nullable(true),
  siteLocationCode: Yup.string()
  .min(2, validatorMessages.min('Site Location Code'))
  .max(255, validatorMessages.max('Site Location Code'))
  .required(validatorMessages.required('Site Location Code'))
  .nullable(true),
});

export const sitesValidator = Yup.object().shape({
  largeName: Yup.string()
  .max(255, validatorMessages.max('Name site'))
  .required(validatorMessages.required('Name site'))
  .nullable(true),
  // latitude: Yup.number()
  //   .required(),
  // longitude: Yup.number()
  //   .required(),
  city: Yup.string()
  .max(255, validatorMessages.max('City'))
  .required(validatorMessages.required('City'))
  .nullable(true),
  teamId: Yup.string()
  .required(validatorMessages.required('Team'))
  .nullable(true),
  siteType: Yup.string()
  .required(validatorMessages.required('Site Type'))
  .nullable(true)
});

export const partValidator = Yup.object().shape({
  equipmentTypeId: Yup.string()
  .max(255, validatorMessages.max('Equipment Type'))
  .required(validatorMessages.required('Equipment Type'))
  .nullable(true),
  // manufacturerId: Yup.string()
  //   .max(255, validatorMessages.max('Manufacturer'))
  //   .required(validatorMessages.required('Manufacturer'))
  //   .nullable(true),
  equipmentModelId: Yup.mixed()
  .when('manufacturerId', {
    is: (manufacturerId) => {
      if (manufacturerId === undefined || !manufacturerId) {
        return false;
      } else {
        return (
          manufacturerId !== 'None'
        );
      }
    },
    then: Yup.string()
    .max(255, validatorMessages.max('Equipment Model'))
    .required(validatorMessages.required('Equipment Model'))
    .nullable(true),
  }),
  partTypeId: Yup.string()
  .max(255, validatorMessages.max('Part type'))
  .required(validatorMessages.required('Part type'))
  .nullable(true),
  namePart: Yup.string()
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name'))
  .nullable(true)
});

export const partTypeValidator = Yup.object().shape({
  namePartType: Yup.string()
  .min(2, validatorMessages.min('Name'))
  .max(255, validatorMessages.max('Name'))
  .required(validatorMessages.required('Name'))
  .nullable(true),
  equipmentTypeId: Yup.string()
  .max(255, validatorMessages.max('Equipment Type'))
  .required(validatorMessages.required('Equipment Type'))
  .nullable(true),
  manufacturerId: Yup.string(),
  //   .max(255, validatorMessages.max('Manufacturer'))
  //   .required(validatorMessages.required('Manufacturer'))
  //   .nullable(true),
  equipmentModelId: Yup.mixed()
  .when('manufacturerId', {
    is: (manufacturerId) => {
      if (manufacturerId === undefined || !manufacturerId) {
        return false;
      } else {
        return (
          manufacturerId !== 'None'
        );
      }
    },
    then: Yup.string()
    .max(255, validatorMessages.max('Equipment Model'))
    .required(validatorMessages.required('Equipment Model'))
    .nullable(true),
  })
});

export const mweIntegrationDataValidator = Yup.object().shape({
  hostName: Yup.string()
  .required(validatorMessages.required('Hostname'))
  .min(2, validatorMessages.min('Hostname'))
  .max(255, validatorMessages.max('Hostname'))
  .matches(ValidIpAddressRegex, 'Input a valid hostname')
  .nullable(true),
  userName: Yup.string()
  .max(255, validatorMessages.max('Username'))
  .required(validatorMessages.required('Username'))
  .nullable(true),
  password: Yup.string()
  .min(2, validatorMessages.min('Password'))
  .max(255, validatorMessages.max('Password'))
  .required(validatorMessages.required('Password'))
});

export const welcomeValidator = Yup.object().shape({
  teamId: Yup.string()
  .required(validatorMessages.required('Team')),
  roleId: Yup.string()
  .required(validatorMessages.required('Role'))
});

export const roleAndTeamValidator = Yup.object().shape({
  id: Yup.string()
  .required(validatorMessages.required('Team')),
  teamId: Yup.string()
  .required(validatorMessages.required('Team')),
  roleId: Yup.string()
  .required(validatorMessages.required('Role'))
});


export const siteValidator = Yup.object().shape({
  id: Yup.string(),
  teamId: Yup.string(),
  name: Yup.string(),
  siteId: Yup.string()
  .required(validatorMessages.required('Site')),
  activityType: Yup.string()
  .required(validatorMessages.required('Activity type')),
});

export const zoneValidator = Yup.object().shape({
  zoneId: Yup.string()
  .required((validatorMessages.required('Zone'))),
  siteId: Yup.string()
  .required(validatorMessages.required('Site')),
  teamId: Yup.string(),
  name: Yup.string()
  .required(validatorMessages.required('Zone')),
  
});


export const scheduleValidator = Yup.object().shape({
  homeTeamId: Yup.string()
  .required(validatorMessages.required('Home Team')),
  gameSite: Yup.string()
  .required(validatorMessages.required('Location')),
  // timeZone: Yup.string()
  //   .required(validatorMessages.required('Time Zone')),
  startGameDate: Yup.string()
  .required(validatorMessages.required('Start Game Date')),
  endGameDate: Yup.string()
  .required(validatorMessages.required('End Game Date')),
  title: Yup.string()
  .required(validatorMessages.required('Name'))
  //scheduleStatus: Yup.string()
  //.required(validatorMessages.required('Schedule Status'))
});

export const ChangePasswordValidator = Yup.object().shape({
  currentPassword: Yup.string().required('Current Password'),
  newPassword: Yup.string()
  .required(validatorMessages.required('New password'))
  .min(8, 'New password must be at least 8 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?"()]{8,}$/,
    'New password must have at least one uppercase, one lowercase letter and one number'),
  newPasswordConfirm: Yup.string()
  .required('Required')
  .oneOf([Yup.ref('newPassword'), ''], 'Both passwords must match')
});

export const seasonDrawerValidators = Yup.object().shape({
  endDate: Yup.date()
    .when('startDate', (startDate: any, schema: any) => {
      if(startDate) {
        return schema.min(startDate, 'End date can\'t be before start date').required(validatorMessages.required('End date'));
      }
      return schema.required(validatorMessages.required('End date'));
    }),
  season: Yup.number()
    .required(validatorMessages.required('Season')),
  startDate: Yup.date().required(validatorMessages.required('Start date')),
});

export const messageAlertDrawerValidators = Yup.object().shape({
  description: Yup.string().required(validatorMessages.required('Message content')),
  endDate: Yup.date()
    .when('startDate', (startDate: any, schema: any) => {
      if(startDate) {
        return schema.min(startDate, 'End date can\'t be before start date').required(validatorMessages.required('End date'));
      }
      return schema.required(validatorMessages.required('End date'));
    }
  ),
  roleList: Yup.array().required(validatorMessages.required('Role list')),
  startDate: Yup.date().required(validatorMessages.required('Start date')),
  title: Yup.string().required(validatorMessages.required('Message Title')),
});

export const manufacturerEquipmentModelValidators = Yup.object().shape({
  manufacturerName: Yup.string()
  .min(2, validatorMessages.min('Manufacturer Name'))
  .max(255, validatorMessages.max('Manufacturer Name'))
  .required(validatorMessages.required('Manufacturer Name')),
  nameModel: Yup.string()
  .min(2, validatorMessages.min('Model Name'))
  .max(255, validatorMessages.max('Model Name'))
  .required(validatorMessages.required('Model Name')),
  // description: Yup.string()
  //   .min(2, validatorMessages.min('Description'))
  //   .max(255, validatorMessages.max('Description'))
  //   .required(validatorMessages.required('Description')),
  modelYear: Yup.string()
  .nullable(true),
  equipmentTypeId: Yup.string()
  .required(validatorMessages.required('Equipment Type')),
  manufacturerId: Yup.string()
  .required(validatorMessages.required('Manufacturer')),
  // customFields: Yup.array()
  //   .required('Required')
  //   .min(1, 'Required')
});