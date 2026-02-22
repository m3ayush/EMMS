export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function daysUntil(date) {
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function daysSince(date) {
  const diff = new Date() - new Date(date);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function toInputDate(date) {
  return new Date(date).toISOString().split('T')[0];
}
