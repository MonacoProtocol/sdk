export function truncateString(stringToTruncate: string) {
  const stringLength = stringToTruncate.length;
  return `${stringToTruncate.substring(0, 5)}...${stringToTruncate.substring(
    stringLength - 5,
    stringLength,
  )}`;
}

export function sentenceCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatNumberForDisplay(number: number, solana = false) {
  try {
    const formatted = `${number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    if (solana) {
      return `◎ ${formatted}`;
    }
    return `$ ${formatted}`;
  } catch (e) {
    console.log(e);
    return number;
  }
}
