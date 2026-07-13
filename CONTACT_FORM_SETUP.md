# Contact Form Setup

## 1. Google Sheet

Create a Google Sheet and add a sheet tab named `Leads`.

Add this header row:

```text
Date | Name | Phone | Email | Project Type | Message | Source
```

## 2. Apps Script

Open `Extensions > Apps Script`, paste the code from:

```text
google-apps-script-contact.gs
```

Deploy it as a Web App:

```text
Deploy > New deployment > Web app
Execute as: Me
Who has access: Anyone
```

Copy the Web App URL.

## 3. Website Config

Put your values in:

```text
static/js/core/site-config.js
```

Example:

```js
window.NIWASA_CONFIG = {
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  WHATSAPP_NUMBER: "919304687036"
};
```

The `.env.example` file is only for keeping the same values noted locally. A static Hostinger HTML site cannot read `.env` directly in the browser.
