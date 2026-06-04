const SPREADSHEET_ID = '1aGIqlyM9CmJzyG59-HmiJCegZ-EONqqA3_QTZ3Vloro';
const SHEET_NAME = 'Sheet1';
const PIN = '123456';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Portofolio Reksadana')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setResponseCode(204)
    .setHeaders(headers);
}

function doPost(e) {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const body = JSON.parse(e.postData.contents);
    const { action, pin, payload } = body;

    if (action !== 'read' && pin !== PIN) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'PIN salah' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    const headersRow = lastRow > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    const sheetRows = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, lastCol).getValues() : [];

    let result = {};

    if (action === 'read') {
      result = { success: true, headers: headersRow, rows: sheetRows };
    } else if (action === 'add') {
      const nama = String(payload?.nama_reksadana ?? '').trim();
      const nav = String(payload?.nav_reksadana ?? '').trim();
      if (!nama) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Nama reksadana kosong' }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeaders(headers);
      }
      sheet.appendRow([nama, nav]);
      result = { success: true, message: 'Data ditambahkan' };
    } else {
      result = { success: false, message: 'Action tidak dikenali' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (err) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}
