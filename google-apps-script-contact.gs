/**
 * NIWASA Interior — Consultation Form Handler
 * ---------------------------------------------------------------------------
 * The website (static/js/pages/contact.js) sends the lead as a JSON string
 * in the raw POST body, with Content-Type: text/plain, e.g.:
 *
 *   fetch(GOOGLE_SCRIPT_URL, {
 *     method: "POST",
 *     mode: "no-cors",
 *     headers: { "Content-Type": "text/plain;charset=utf-8" },
 *     body: JSON.stringify({ name, phone, email, project_type, message, source, submitted_at })
 *   });
 *
 * Because the body is text/plain (not application/x-www-form-urlencoded),
 * Apps Script does NOT populate e.parameter — the data arrives in
 * e.postData.contents as a JSON string instead. It must be parsed with
 * JSON.parse(), not read via e.parameter.*.
 *
 * IMPORTANT — read this if the site shows "success" but nothing shows up:
 * The website uses `mode: "no-cors"`, which means the browser can NEVER see
 * whether this script actually succeeded or threw an error — it only knows
 * the request was sent. So a "Thank you" message on the site does NOT prove
 * the sheet/email step worked. If rows/emails aren't showing up, the failure
 * is happening here on the server side, silently. Check:
 *   Apps Script editor > Executions (left sidebar) — every form submission
 *   should show a run of doPost. Click into a failed one to see the real
 *   error message.
 */

// If this script is NOT bound to your Sheet (i.e. you created it directly at
// script.google.com instead of via Extensions > Apps Script inside the
// Sheet), SpreadsheetApp.getActiveSpreadsheet() returns null and every
// submission fails silently. Paste your Sheet ID below to make this bullet-
// proof either way. Find it in the sheet's URL:
// https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
var SPREADSHEET_ID = ""; // <-- paste your Google Sheet ID here

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = JSON.parse(raw);

    var sheet = getLeadsSheet_();

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd-MMM-yyyy hh:mm a"
    );

    sheet.appendRow([
      timestamp,
      data.name || "",
      data.phone || "",
      data.email || "",
      data.project_type || "",
      data.message || "",
      data.source || "NIWASA Website"
    ]);

    sendNotificationEmail_(timestamp, data);

    Logger.log("Lead saved and email sent for: " + (data.name || "unknown"));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("doPost FAILED: " + err);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Returns the "Leads" sheet, creating it with a header row if it doesn't
 * exist yet. Uses SPREADSHEET_ID if set (works for standalone scripts);
 * falls back to the active spreadsheet if the script is container-bound.
 */
function getLeadsSheet_() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      "No spreadsheet found. Either bind this script to your Sheet " +
      "(Extensions > Apps Script from inside the Sheet), or set " +
      "SPREADSHEET_ID at the top of this file."
    );
  }

  var sheet = ss.getSheetByName("Leads");

  if (!sheet) {
    sheet = ss.insertSheet("Leads");
    sheet.appendRow(["Date", "Name", "Phone", "Email", "Project Type", "Message", "Source"]);
  }

  return sheet;
}

function sendNotificationEmail_(timestamp, data) {
  MailApp.sendEmail({
    to: "interiorsniwasa@gmail.com",
    subject: "🔔 New Consultation Request - NIWASA Interior",
    htmlBody:
      "<h2>New Consultation Request</h2>" +
      "<b>Date:</b> " + timestamp + "<br><br>" +
      "<b>Name:</b> " + (data.name || "-") + "<br>" +
      "<b>Phone:</b> " + (data.phone || "-") + "<br>" +
      "<b>Email:</b> " + (data.email || "-") + "<br>" +
      "<b>Project Type:</b> " + (data.project_type || "-") + "<br><br>" +
      "<b>Message:</b><br>" +
      (data.message || "-")
  });
}

/**
 * Open the deployment URL in a browser to confirm the web app is live.
 * Does not touch the sheet or send email.
 */
function doGet(e) {
  return ContentService
    .createTextOutput("NIWASA consultation endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * MANUAL TEST — run this once from the Apps Script editor (select
 * testDoPost from the function dropdown, click Run). It simulates a real
 * form submission without needing the website. If this fails, the error
 * message tells you exactly what's broken (auth, sheet, spreadsheet id).
 * The first run will prompt you to authorize Gmail + Sheets access —
 * approve it, or every real submission will fail the same way.
 */
function testDoPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test Lead",
        phone: "9999999999",
        email: "test@example.com",
        project_type: "Full Home Interior",
        message: "This is a manual test submission.",
        source: "Manual Test",
        submitted_at: new Date().toISOString()
      })
    }
  };

  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
