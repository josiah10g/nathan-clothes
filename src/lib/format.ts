export function formatPrice(cents: number) {
  const amount = Math.round((cents ?? 0) / 100);
  return `₦${new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
