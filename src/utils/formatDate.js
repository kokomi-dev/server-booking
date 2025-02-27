function formatDateToDDMMYYYY(inputDate) {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
function dateConvertToISO(dateString) {
  const [year, month, day] = dateString.split("/").map(Number);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  ) {
    return date.toISOString();
  } else {
    return "Invalid date";
  }
}

export { formatDateToDDMMYYYY, dateConvertToISO };
