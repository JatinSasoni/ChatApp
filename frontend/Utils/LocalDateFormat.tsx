export const convertToLocaleFormat = (inputDate: string): string => {
  const date = new Date(inputDate);
  return date.toLocaleTimeString("en-US", {
    hour12: true,
  });
};
