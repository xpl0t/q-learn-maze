export function printTable(data: any[][]): void {
  if (data.length === 0) {
    console.log("emtpy.");
    return;
  }

  const colWidths = data[0].map((_, colIndex) =>
    Math.max(...data.map(row => String(row[colIndex]).length))
  );

  const separator = '+' + colWidths.map(width => "-".repeat(width + 2)).join("+") + '+';

  const formatRow = (row: any[]) =>
    "| " +
    row.map((val, i) => String(val).padEnd(colWidths[i])).join(" | ") +
    " |";

  console.log(separator);
  data.forEach(row => {
    console.log(formatRow(row));
    console.log(separator);
  });
}
