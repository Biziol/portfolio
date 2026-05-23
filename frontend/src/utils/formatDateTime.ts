/* 
questa funzione formata una data in base alla lingua scelta o localita,
come parametri in ingresso prende una data gia come oggetto date oppure una stringa data,
prima converte il valore in date e poi controlla se e valida o no, senno restituisce "-"
se la data e valida restituidve restituisc una stringa formattata con 
data e ora in formato corto usando il paramentro locale che indica 
la lingua o localita da usare per formattare la data e ora
*/

export function formatDateTime(
  value: string | Date,
  locale: string,
  showDate = true,
  showTime = true,
  dateStyle: "short" | "full" | "long" | "medium" | undefined = "short",
  timeStyle: "short" | "full" | "long" | "medium" | undefined = "short",
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  if (!showDate && !showTime) {
    return "-";
  }

  const options: Intl.DateTimeFormatOptions = {};

  if (showDate) {
    options.dateStyle = dateStyle;
  }

  if (showTime) {
    options.timeStyle = timeStyle;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
