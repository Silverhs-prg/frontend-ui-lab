export const formatOdds = (rawOdd: string | number | null | undefined): string => {
  if (rawOdd === null || rawOdd === undefined || String(rawOdd).trim() === "") return "";
  const odd = Number(rawOdd);
  if (!Number.isFinite(odd)) return "";
  return (odd + 1).toFixed(2);
};
