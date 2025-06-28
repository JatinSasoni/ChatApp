export const convertToLocaleFormat = (inputDate) => {
  const date = new Date(inputDate);
  return date.toLocaleTimeString("en-US", {
    hour12: true,
  });
};
