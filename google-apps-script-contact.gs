function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
    sheet.appendRow(["Date", "Name", "Phone", "Email", "Project Type", "Message", "Source"]);
  }

  var data = JSON.parse(e.postData.contents || "{}");

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.project_type || "",
    data.message || "",
    data.source || "NIWASA Website"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
