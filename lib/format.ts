export function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export function formatPercentage(value: number) {
  return `${value.toFixed(1)} %`;
}
