function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Reksadana Dashboard')
    .addItem('Buka Dashboard Web', 'showDashboard')
    .addToUi();
}

function showDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'Dashboard Reksadana');
}

function getSpreadsheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) {
    return { headers: [], rows: [] };
  }
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return { headers, rows };
}
