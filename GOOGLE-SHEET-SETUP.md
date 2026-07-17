# Google Sheet RSVP Setup

## 1. Create the Google Sheet

Create a new Google Sheet. You may name it:

`Rhaf and Jen Wedding RSVP`

You do not need to create the headers manually. The Apps Script creates the
`RSVP Responses` worksheet and its headers automatically after the first
successful submission.

## 2. Copy the Spreadsheet ID

A Google Sheet URL normally looks like:

```text
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit
```

The Spreadsheet ID is the text between `/d/` and `/edit`:

```text
1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

## 3. Open Apps Script

From the Google Sheet:

```text
Extensions → Apps Script
```

Delete the default code and paste the contents of:

```text
google-apps-script/Code.gs
```

Open **Project Settings**, enable the manifest file when needed, and use the
provided `appsscript.json`, or simply keep the default manifest and set the
project timezone to Asia/Manila.

## 4. Configure the Spreadsheet ID

In `Code.gs`, replace:

```javascript
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
```

with your actual Spreadsheet ID:

```javascript
const SPREADSHEET_ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890";
```

## 5. Deploy as a Web App

In Apps Script:

```text
Deploy → New deployment
```

Select:

```text
Type: Web app
Execute as: Me
Who has access: Anyone
```

Click **Deploy**, authorize the requested permissions, and copy the Web App URL.

The URL should look like:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Use the URL ending in `/exec`.

## 6. Connect the Wedding Website

Open:

```text
js/rsvp.js
```

Replace:

```javascript
const GOOGLE_APPS_SCRIPT_URL =
  "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your Web App URL:

```javascript
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/DEPLOYMENT_ID/exec";
```

## 7. Test

Run the website using VS Code Live Server or upload it to your web host.

Submit a test RSVP and check the `RSVP Responses` sheet.

## Updating Apps Script Later

After changing `Code.gs`, create or update the deployment:

```text
Deploy → Manage deployments → Edit → New version → Deploy
```

If you create a completely new deployment, update the URL in `js/rsvp.js`.

## Important Security Notes

- Never put private Google credentials in the website JavaScript.
- The Web App URL is expected to be visible to visitors.
- The Apps Script validates attendance and guest count.
- A honeypot field provides basic bot filtering.
- Cell values are protected against spreadsheet formula injection.
- This is appropriate for a small private wedding RSVP, but it is not a
  full authentication system.
