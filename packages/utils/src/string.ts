export const cn = (...texts: (string | boolean | undefined)[]) => {
  return texts.filter(Boolean).join(" ");
};
