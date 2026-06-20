// Matches numeric(20,8): optional leading '-', up to 20 digits before
// the decimal point, optional '.' followed by up to 8 digits.
export const DECIMAL_20_8_REGEX = /^-?\d{1,20}(\.\d{1,8})?$/;
export const DECIMAL_20_8_MESSAGE =
  "must be a decimal string with up to 8 fractional digits (numeric(20,8))";
 
