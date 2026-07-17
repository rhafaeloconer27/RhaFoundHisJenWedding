/*
  RHAF & JEN WEDDING RSVP
  Google Apps Script backend

  SETUP:
  1. Create a Google Sheet.
  2. Copy its Spreadsheet ID from the URL.
  3. Paste the ID into SPREADSHEET_ID below.
  4. Deploy this script as a Web App.
*/

const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "RSVP Responses";

const HEADERS = [
  "Timestamp",
  "Full Name",
  "Attendance",
  "Guest Count",
  "Contact Number",
  "Email Address",
  "Dietary Restrictions",
  "Message",
  "Submitted From"
];

function doGet() {
  return createTextResponse(
    "Rhaf and Jen Wedding RSVP service is running."
  );
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(30000);

    validateConfiguration();

    const data = readRequestData(e);

    if (data.website) {
      return createJsonResponse({
        success: true,
        message: "Submission accepted."
      });
    }

    validateRsvpData(data);

    const sheet = getOrCreateResponseSheet();

    sheet.appendRow([
      new Date(),
      sanitizeCellValue(data.fullName),
      sanitizeCellValue(data.attendance),
      Number(data.guestCount),
      sanitizeCellValue(data.contactNumber),
      sanitizeCellValue(data.emailAddress),
      sanitizeCellValue(data.dietaryRestrictions),
      sanitizeCellValue(data.message),
      sanitizeCellValue(data.submittedFrom)
    ]);

    return createJsonResponse({
      success: true,
      message: "RSVP saved successfully."
    });
  } catch (error) {
    console.error(error);

    return createJsonResponse({
      success: false,
      message: error.message || "Unable to save RSVP."
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (releaseError) {
      console.warn(releaseError);
    }
  }
}

function readRequestData(e) {
  if (!e || !e.parameter) {
    throw new Error("No RSVP data was received.");
  }

  return {
    fullName: normalizeText(e.parameter.fullName),
    attendance: normalizeText(e.parameter.attendance),
    guestCount: normalizeText(e.parameter.guestCount),
    contactNumber: normalizeText(e.parameter.contactNumber),
    emailAddress: normalizeText(e.parameter.emailAddress),
    dietaryRestrictions: normalizeText(
      e.parameter.dietaryRestrictions
    ),
    message: normalizeText(e.parameter.message),
    submittedFrom: normalizeText(e.parameter.submittedFrom),
    website: normalizeText(e.parameter.website)
  };
}

function validateConfiguration() {
  if (
    !SPREADSHEET_ID ||
    SPREADSHEET_ID === "PASTE_YOUR_GOOGLE_SHEET_ID_HERE"
  ) {
    throw new Error(
      "The Google Sheet ID has not been configured."
    );
  }
}

function validateRsvpData(data) {
  const allowedAttendance = [
    "Joyfully accepts",
    "Regretfully declines"
  ];

  if (!data.fullName) {
    throw new Error("Full name is required.");
  }

  if (data.fullName.length > 150) {
    throw new Error("Full name is too long.");
  }

  if (!allowedAttendance.includes(data.attendance)) {
    throw new Error("Attendance response is invalid.");
  }

  const guestCount = Number(data.guestCount);

  if (!Number.isInteger(guestCount)) {
    throw new Error("Guest count must be a whole number.");
  }

  if (
    data.attendance === "Joyfully accepts" &&
    (guestCount < 1 || guestCount > 10)
  ) {
    throw new Error(
      "Attending guests must be between 1 and 10."
    );
  }

  if (
    data.attendance === "Regretfully declines" &&
    guestCount !== 0
  ) {
    throw new Error(
      "Guest count must be 0 when declining."
    );
  }

  if (data.emailAddress && !isValidEmail(data.emailAddress)) {
    throw new Error("Email address is invalid.");
  }

  if (data.message.length > 1000) {
    throw new Error("Message is too long.");
  }
}

function getOrCreateResponseSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaderRow(sheet);

  return sheet;
}

function ensureHeaderRow(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    formatHeaderRow(sheet);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getValues()[0];

  const headersAreMissing = HEADERS.some(function (header, index) {
    return currentHeaders[index] !== header;
  });

  if (headersAreMissing) {
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS]);

    formatHeaderRow(sheet);
    sheet.setFrozenRows(1);
  }
}

function formatHeaderRow(sheet) {
  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#8c997d")
    .setFontColor("#ffffff");

  sheet.autoResizeColumns(1, HEADERS.length);
}

function sanitizeCellValue(value) {
  const text = normalizeText(value);

  /*
    Prevent spreadsheet formula injection when guest input starts with
    characters interpreted by Sheets as formulas.
  */
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function normalizeText(value) {
  return String(value || "").trim();
}

function isValidEmail(emailAddress) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
}

function createJsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function createTextResponse(message) {
  return ContentService
    .createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}
