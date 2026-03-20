export function getSemesterKey(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  if (m >= 9) return `${y}-S1`;
  if (m <= 2) return `${y - 1}-S1`;
  return `${y}-S2`;
}

export function getSemesterLabel(key: string): string {
  const [year, sem] = key.split('-');
  return sem === 'S1'
    ? `${year}/${Number(year) + 1} S1 (Sep–Feb)`
    : `${year} S2 (Mar–Aug)`;
}

export function extractSemesters(dates: string[]): string[] {
  const keys = new Set(dates.map(getSemesterKey));
  return Array.from(keys).sort((a, b) => {
    const [ay, as_] = a.split('-');
    const [by, bs]  = b.split('-');
    if (ay !== by) return Number(by) - Number(ay);
    return as_ === 'S1' ? -1 : 1;
  });
}
