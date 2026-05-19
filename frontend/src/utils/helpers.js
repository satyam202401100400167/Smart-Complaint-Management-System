export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? `${str.slice(0, len)}...` : str;
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
};
