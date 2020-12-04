
export const toDateUI = (date: Date) => {
  if (!date) return ''
  return date.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const toDateUIMin = (date: Date) =>
  toDateUI(date).split(",")[0];

export default toDateUI