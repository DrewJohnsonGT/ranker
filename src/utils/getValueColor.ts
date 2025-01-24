export function getValueColor(value: number) {
  if (value <= 3) return 'text-rank-low';
  if (value <= 6) return 'text-rank-medium';
  return 'text-rank-high';
}
