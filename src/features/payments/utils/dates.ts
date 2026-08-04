export const getLocalDateString = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

export const getIsoWithLocalMidday = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const d = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    return d.toISOString();
};

export const getTodayLocalString = () => {
  const today = new Date();
  return new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};
