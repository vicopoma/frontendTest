export const MONTHS: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const YEARS = () => {
  let years: Array<number> = [];
  for (let i = 2010; i <= 2050; ++i) {
    years.push(i);
  }
  return years;
};
