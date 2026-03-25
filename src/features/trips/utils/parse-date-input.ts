/**
 * Parses a German-format date string "DD.MM.YYYY" into an ISO "YYYY-MM-DD" string.
 * Returns null if the input is blank or invalid.
 */
export function parseGermanDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parts = trimmed.split('.');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 2020 || year > 2100) return null;

  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() + 1 !== month || d.getDate() !== day) {
    return null;
  }

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function defaultStartDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return toIso(d);
}

export function defaultEndDate(startIso: string): string {
  const d = new Date(startIso);
  d.setDate(d.getDate() + 3);
  return toIso(d);
}

function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
