export interface OKObjectResponse<T> {
  body: T,
  httpStatus: string,
  message: string,
  status: number
}

export interface OKListResponse<T> {
  body: Array<T>,
  httpStatus: string,
  message: string,
  status: number
}

export interface OkPagedListResponse<T> {
  body: {
    content: Array<T>,
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number,
    numberOfElements: number,
    pageable: {
      offset: number,
      pageNumber: number,
      pageSize: number,
      paged: boolean,
      sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
      }
    },
    size: number,
    totalElements: number,
    totalPages: number
  },
  httpStatus: string,
  message: string,
  status: number
}

export enum RESPONSE_CODES {
  W100 = 'W100',
  W101 = 'W101', //authentication error login 401
  W102 = 'W102', //authentication error 401
  W103 = 'W103', // 404
  W104 = 'W104', // >= 500
  D101 = 'D101', // 409 Conflict
  S101 = 'S101', //200
  S102 = 'S102' //201
  
}

export const RESPONSE_VALUES = {
  [RESPONSE_CODES.W100]: 'There has been an error on syntax request',
  [RESPONSE_CODES.S101]: 'The operation has been completed successfully',
  [RESPONSE_CODES.S102]: 'The object has been created successfully',
  [RESPONSE_CODES.W101]: 'Incorrect username or password',
  [RESPONSE_CODES.W102]: 'Session invalid',
  [RESPONSE_CODES.W103]: 'Not found',
  [RESPONSE_CODES.W104]: 'There is an internal error',
  [RESPONSE_CODES.D101]: 'Conflict, can\'t complete the request'
};
