export const convertFirestoreDate = obj => {
  if (!obj || !obj._seconds) return new Date(obj);
  const millisec = obj._seconds * 1e3 + (obj._nanoseconds || 0) / 1e6;
  return new Date(millisec);
};

const today = () => new Date();

const endOfDay = () => today().setHours(23, 59, 59, 999);

const tomorrow = () => today().setDate(today().getDate() + 1);

export const isDueTomorrow = assignedDate => {
  return assignedDate >= endOfDay() && assignedDate <= tomorrow();
};

export const isDueToday = assignedDate => {
  return assignedDate >= today() && assignedDate <= endOfDay();
};

export const isOverDue = assignedDate => {
  return assignedDate < today();
};
