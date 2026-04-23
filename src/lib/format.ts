export function formatDate(input: string) {
  const date = new Date(input);

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}
