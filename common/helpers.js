export const isToday = (date) => {
  const inputDate = new Date(date);
  // const today = new Date('2019-06-30 20:45:25');
  const today = new Date();
  return inputDate.getDate() == today.getDate() &&
    inputDate.getMonth() == today.getMonth() &&
    inputDate.getFullYear() == today.getFullYear()
}

export const getAgeByBirthYear = (year) => {
  const birthYear = parseInt(year);
  const currentYear = new Date().getFullYear();
  if (!birthYear || birthYear > currentYear) {
    return undefined;
  }

  return currentYear - parseInt(year);
}