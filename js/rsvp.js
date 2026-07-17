/*
  Replace the value below with your deployed Google Apps Script Web App URL.

  Correct format:
  https://script.google.com/macros/s/DEPLOYMENT_ID/exec

  Important:
  Use the URL ending in /exec, not the /dev test URL.
*/
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyNSYDb_2XmlIC6AlwdrUclue_CNxOyrQvEcPOPoBBXLbqx_fYI15XeF2_aYaLjMcCt/exec";

const SUBMISSION_TIMEOUT_MS = 15000;

document.addEventListener("DOMContentLoaded", initializeRsvpForm);

function initializeRsvpForm() {
  const form = document.getElementById("rsvpForm");
  const attendance = document.getElementById("attendance");
  const submissionFrame = document.getElementById("rsvpSubmissionFrame");

  if (!form || !attendance || !submissionFrame) {
    return;
  }

  form.addEventListener("submit", handleRsvpSubmission);
  attendance.addEventListener("change", updateGuestCountFromAttendance);
  submissionFrame.addEventListener("load", handleSubmissionFrameLoad);
}

function handleRsvpSubmission(event) {
  const form = event.currentTarget;
  const formResponse = document.getElementById("formResponse");

  clearFormResponse();

  if (!isWebAppUrlConfigured()) {
    event.preventDefault();

    showFormResponse(
      "Please configure the Google Apps Script Web App URL in js/rsvp.js.",
      "error"
    );

    return;
  }

  if (!form.checkValidity()) {
    event.preventDefault();
    form.reportValidity();
    return;
  }

  if (isHoneypotFilled()) {
    event.preventDefault();
    form.reset();

    showFormResponse(
      "Thank you. Your response has been received.",
      "success"
    );

    return;
  }

  if (!isGuestCountValid()) {
    event.preventDefault();

    showFormResponse(
      "Please check the number of attending guests.",
      "error"
    );

    return;
  }

  form.action = GOOGLE_APPS_SCRIPT_URL;

  window.rsvpSubmissionPending = true;
  window.rsvpSubmissionStartedAt = Date.now();

  setSubmittingState(true);

  showFormResponse(
    "Submitting your RSVP. Please wait...",
    "loading"
  );

  window.clearTimeout(window.rsvpSubmissionTimer);

  window.rsvpSubmissionTimer = window.setTimeout(
    handleSubmissionTimeout,
    SUBMISSION_TIMEOUT_MS
  );
}

function handleSubmissionFrameLoad() {
  if (!window.rsvpSubmissionPending) {
    return;
  }

  /*
    Because Google Apps Script is on another domain, the browser does not
    allow this page to read the iframe response body. A completed iframe
    load indicates that the POST request finished.
  */
  window.rsvpSubmissionPending = false;
  window.clearTimeout(window.rsvpSubmissionTimer);

  setSubmittingState(false);

  const form = document.getElementById("rsvpForm");

  if (form) {
    form.reset();
  }

  showFormResponse(
    "Thank you! Your RSVP has been submitted successfully.",
    "success"
  );
}

function handleSubmissionTimeout() {
  if (!window.rsvpSubmissionPending) {
    return;
  }

  window.rsvpSubmissionPending = false;
  setSubmittingState(false);

  showFormResponse(
    "The submission is taking longer than expected. Please check your connection and try again.",
    "error"
  );
}

function updateGuestCountFromAttendance() {
  const attendance = document.getElementById("attendance").value;
  const guestCount = document.getElementById("guestCount");

  if (!guestCount) {
    return;
  }

  if (attendance === "Regretfully declines") {
    guestCount.value = "0";
    return;
  }

  if (attendance === "Joyfully accepts" && Number(guestCount.value) < 1) {
    guestCount.value = "1";
  }
}

function isGuestCountValid() {
  const attendance = document.getElementById("attendance").value;
  const guestCount = Number(
    document.getElementById("guestCount").value
  );

  if (attendance === "Joyfully accepts") {
    return guestCount >= 1 && guestCount <= 10;
  }

  if (attendance === "Regretfully declines") {
    return guestCount === 0;
  }

  return false;
}

function isWebAppUrlConfigured() {
  return (
    GOOGLE_APPS_SCRIPT_URL.startsWith(
      "https://script.google.com/macros/s/"
    ) &&
    GOOGLE_APPS_SCRIPT_URL.endsWith("/exec")
  );
}

function isHoneypotFilled() {
  const websiteField = document.getElementById("website");

  return Boolean(websiteField && websiteField.value.trim());
}

function setSubmittingState(isSubmitting) {
  const submitButton = document.getElementById("submitButton");

  if (!submitButton) {
    return;
  }

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting
    ? "Submitting..."
    : "Submit RSVP";
}

function showFormResponse(message, type) {
  const formResponse = document.getElementById("formResponse");

  if (!formResponse) {
    return;
  }

  formResponse.textContent = message;
  formResponse.className = `form-response ${type}`;
}

function clearFormResponse() {
  const formResponse = document.getElementById("formResponse");

  if (!formResponse) {
    return;
  }

  formResponse.textContent = "";
  formResponse.className = "form-response";
}
