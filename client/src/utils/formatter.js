export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

export const truncateText = (value = '', max = 120) =>
  value.length > max ? `${value.slice(0, max).trim()}...` : value;

export const titleCase = (value = '') =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
