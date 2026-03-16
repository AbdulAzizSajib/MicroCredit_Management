/* STAGGING */
export const imgBase = "https://wa.acibd.com/api/mcm/storage";
// export const apiBase = "https://wa.acibd.com/api/petra/api";
export const apiBase = "https://wa.acibd.com/api/mcm/api";

export function formatNumber(number) {
  const isInteger = Number.isInteger(number);

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: isInteger ? 0 : 2,
  }).format(number);
}
