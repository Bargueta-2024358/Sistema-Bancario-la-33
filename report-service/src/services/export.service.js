const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const buildRowsFromMovements = (movements) =>
  movements.map((m) => [
    new Date(m.createdAt).toISOString(),
    m.type,
    m.amount,
    m.signedAmount ?? m.amount,
    m.runningBalance ?? '-',
    m.description || '',
    m.targetAccountNumber || '',
  ]);

const exportExcel = async (title, headers, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte');
  sheet.addRow([title]);
  sheet.addRow([]);
  sheet.addRow(headers);
  rows.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(3).font = { bold: true };
  return workbook.xlsx.writeBuffer();
};

const exportPdf = (title, headers, rows) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(9);

    const colWidths = [90, 70, 50, 50, 60, 120, 70];
    let y = doc.y;
    headers.forEach((h, i) => {
      doc.text(h, 40 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
        width: colWidths[i],
        continued: false,
      });
    });
    y += 14;
    doc.moveTo(40, y).lineTo(555, y).stroke();
    y += 6;

    rows.slice(0, 80).forEach((row) => {
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
      row.forEach((cell, i) => {
        doc.text(String(cell ?? ''), 40 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: colWidths[i],
        });
      });
      y += 14;
    });

    doc.end();
  });

const exportAccountStatement = async (statement, format) => {
  const headers = ['Fecha', 'Tipo', 'Monto', 'Signo', 'Saldo', 'Descripción', 'Cuenta ref.'];
  const rows = buildRowsFromMovements(statement.movements);
  const title = `Estado de cuenta ${statement.accountNumber}`;

  if (format === 'xlsx') {
    return { buffer: await exportExcel(title, headers, rows), mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename: `estado-cuenta-${statement.accountNumber}.xlsx` };
  }
  const buffer = await exportPdf(title, headers, rows);
  return { buffer, mime: 'application/pdf', filename: `estado-cuenta-${statement.accountNumber}.pdf` };
};

const exportHistory = async (history, format, userId) => {
  const headers = ['Fecha', 'Cuenta', 'Tipo', 'Monto', 'Descripción', 'Cuenta ref.'];
  const rows = history.transactions.map((t) => [
    new Date(t.createdAt).toISOString(),
    t.accountNumber,
    t.type,
    t.amount,
    t.description || '',
    t.targetAccountNumber || '',
  ]);
  const title = `Historial bancario - ${userId}`;

  if (format === 'xlsx') {
    return { buffer: await exportExcel(title, headers, rows), mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename: `historial-${userId}.xlsx` };
  }
  const buffer = await exportPdf(title, headers, rows);
  return { buffer, mime: 'application/pdf', filename: `historial-${userId}.pdf` };
};

module.exports = { exportAccountStatement, exportHistory };
