export function formatShortDate(date: string | Date): string {
  const dateObject = new Date(date);
  const day = dateObject.getDate().toString().padStart(2, "0");
  const month = dateObject.toLocaleString("es-ES", { month: "short" });
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${day} ${formattedMonth}`;
}
