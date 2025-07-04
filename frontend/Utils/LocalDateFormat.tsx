export const convertToLocaleFormat = (inputDate: string): string => {
  const date = new Date(inputDate);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
