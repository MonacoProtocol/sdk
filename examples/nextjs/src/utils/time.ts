export function hasElapsed(isoString: string, minutes: number): boolean {
  const originalDate = new Date(isoString);
  const elapsedMinutes = (new Date().getTime() - originalDate.getTime()) / (1000 * 60);
  return elapsedMinutes > minutes;
}

export function convertTimestampToDateString(timestampInSeconds: number) {
  const dateObject = new Date(timestampInSeconds * 1000);
  return dateObject.toUTCString();
}

export function nowTimestamp(): number {
  return Date.now() / 1000;
}
