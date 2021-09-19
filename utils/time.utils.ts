export const leadingZeros = (value: number, length = 2) =>
  `${"0".repeat(length - value.toString().length)}${value}`.slice(-length);
