import moment from "moment";

export const DATE_FORMAT = "DD-MM-YYYY";
export const DateRanges = () => ({
  Today: [moment().startOf("day"), moment()],
  Yesterday: [
    moment().subtract(1, "days").startOf("day"),
    moment().subtract(1, "days").endOf("day"),
  ],
  "This Week": [moment().startOf("week"), moment().endOf("week")],
  "This Month": [moment().startOf("month"), moment().endOf("month")],
  "Last Week": [
    moment().subtract(1, "weeks").startOf("week"),
    moment().subtract(1, "weeks").endOf("week"),
  ],
  "Last Month": [
    moment().subtract(1, "months").startOf("month"),
    moment().subtract(1, "months").endOf("month"),
  ],
  "All Time": [moment("01-01-2000"), moment()],
});
