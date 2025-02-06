import moment from 'moment';

export const asciiToHex = (str: string) => {
  const arr = [];
  str = str?.trim();
  for (let i = 0, l = str.length; i < l; i ++) {
    const hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
};

export const hexToAscii = (hexx: string) : string => {
  let hex = hexx.toString();//force conversion
  let str = '';
  let nonZeroChar: number = hex.length - 1;
  while (nonZeroChar >= 0 && hex.charAt(nonZeroChar) === '0') {
    nonZeroChar--;
  }
  for (let i = 0; (i < hex.length && hex.substring(i, i + 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  return str;
};

export const convertListHexToListAscii = (listHex: string[]) => {
  const listAscii: string[] = [];
  listHex.forEach(hex => {
    listAscii.push(hexToAscii(hex));
  });
  return listAscii;
};

export const convertListAsciiToListHex = (listAscii: string[]) => {
  const listHex: string[] = [];
  listAscii.forEach(ascii => {
    listHex.push(asciiToHex(ascii));
  });
  return listHex;
};

export const isHexadecimal = (input: string) => {
  const re = /[0-9A-Fa-f]{6}/g;
  return re.test(input);
};

export const stringDateToMilliSeconds = (stringDate: string, format: string) => {
  return moment(stringDate, format).valueOf();
};

export const stringOrUndefined = (value: string | undefined) => {
  return !!value ? value : undefined;
}
