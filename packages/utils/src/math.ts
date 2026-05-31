export const centsToDouble = (cents: number): number => {
  return cents / 100;
};

export const doubleToCents = (double: number): number => {
  return Math.round(double * 100);
};
