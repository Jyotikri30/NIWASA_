# Contact Form Setup

> **Updated 15 Jul 2026:** WhatsApp auto-open on submit has been removed.
> The consultation form now does exactly two things on submit: append a row
> to the `Leads` sheet, and email `interiorsniwasa@gmail.com`. UI/UX is
> otherwise unchanged.

## 1. Google Sheet

Create a Google Sheet and add a sheet tab named `Leads`.

Add this header row:

```text
Date | Name | Phone | Email | Project Type | Message | Source
```

Copy the Sheet ID from its URL — the part between `/d/` and `/edit`:

```text
https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
```

## 2. Apps Script

Open `Extensions > Apps Script` **from inside that Sheet** (this matters —
see troubleshooting below), and paste the code from
`google-apps-script-contact.gs`.

At the top of the file, paste your Sheet ID into `SPREADSHEET_ID`:

```js
var SPREADSHEET_ID = "your-sheet-id-here";
```

**Before deploying, run the built-in test once:**
select `testDoPost` from the function dropdown at the top of the editor and
click **Run**. The first run will ask you to authorize Gmail + Sheets
access — approve it. Then check:
- The `Leads` sheet — a "Test Lead" row should appear.
- `interiorsniwasa@gmail.com` — a test email should arrive.

If either doesn't happen, fix it here first — don't move on to deploying,
since the website can't tell you what went wrong (see note below).

Deploy it as a Web App:

```text
Deploy > New deployment > Web app
Execute as: Me
Who has access: Anyone
```

Copy the Web App URL.

**Already have a deployment (e.g. the existing URL in `site-config.js`)?**
Pasting new code into the script editor does **not** update a live `/exec`
URL by itself. Use `Deploy > Manage deployments > (pencil/edit icon) >
Version: New version > Deploy` on the existing deployment so the current
URL starts running the fixed code.

## 3. Website Config

Put your values in `static/js/core/site-config.js`:

```js
window.NIWASA_CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  WHATSAPP_NUMBER: "917366923109"
};
```

The `.env.example` file is only for keeping the same values noted locally. A
static Hostinger HTML site cannot read `.env` directly in the browser.

## Why "success" can show even when nothing happens

The site submits with `fetch(..., { mode: "no-cors" })`. This is required
for a static HTML site with no server to talk to a Google Apps Script
endpoint without hitting a CORS error — but it means **the browser can
never read whether the script actually succeeded**. The site shows its
"Thank you" message as soon as the request is sent, not once it's confirmed
saved. So a success message with no sheet row / no email means the script
itself is failing silently server-side, not the website.

To see the real error:

1. In the Apps Script editor, open **Executions** (left sidebar).
2. Find the run that corresponds to your test submission.
3. Click it — the actual error (e.g. permissions not granted, wrong/missing
   spreadsheet) will be shown there.

The most common causes, in order of likelihood:
- **Never authorized** — run `testDoPost` once manually and approve the
  Gmail/Sheets permission prompt.
- **Standalone script with no `SPREADSHEET_ID` set** — if you created the
  script at script.google.com instead of via `Extensions > Apps Script`
  inside the Sheet, `getActiveSpreadsheet()` returns nothing. Set
  `SPREADSHEET_ID` at the top of the file.
- **Deployed URL is stale** — you edited the code but deployed a *new
  version* to the *existing* deployment (see step 2 above).
