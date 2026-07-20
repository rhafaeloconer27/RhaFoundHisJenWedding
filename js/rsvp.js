/* =========================================================
   RSVP SCRIPT — SPA COMPATIBLE

   CHANGES:
   - Tinanggal ang DOMContentLoaded initialization.
   - Ginawang window.initializeRsvpPage().
   - May duplicate-listener protection.
   - Reset ang submission state tuwing nire-reload ang RSVP.
========================================================= */

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxuNkbTqIPVvLEB18qxM2noodhW05r4sD6rkV6ZLhWypjX8r9TsAlfucVwJDIrIIao/exec";

const SUBMISSION_TIMEOUT_MS = 15000;

/*
  Tatawagin ng app.js pagkatapos ma-load
  ang pages/rsvp.html.
*/
window.initializeRsvpPage = function () {
  const form =
    document.getElementById("rsvpForm");

  const submissionFrame =
    document.getElementById(
      "rsvpSubmissionFrame"
    );

  const clearFormButton =
    document.getElementById(
      "clearFormButton"
    );

  if (!form || !submissionFrame) {
    return;
  }

  /*
    Prevent duplicate initialization.
  */
  if (
    form.dataset.initialized === "true"
  ) {
    return;
  }

  form.dataset.initialized = "true";

  window.rsvpSubmissionPending = false;

  form.addEventListener(
    "submit",
    handleRsvpSubmission
  );

  submissionFrame.addEventListener(
    "load",
    handleSubmissionFrameLoad
  );

  if (clearFormButton) {
    clearFormButton.addEventListener(
      "click",
      clearRsvpForm
    );
  }
};

/*
  Cleanup before leaving RSVP.
*/
window.cleanupRsvpPage = function () {
  window.clearTimeout(
    window.rsvpSubmissionTimer
  );

  window.rsvpSubmissionPending = false;
};

function handleRsvpSubmission(event) {
  const form = event.currentTarget;

  clearFormResponse();

  if (!isWebAppUrlConfigured()) {
    event.preventDefault();

    showFormResponse(
      "Please configure the Google Apps Script Web App URL.",
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

  form.action = GOOGLE_APPS_SCRIPT_URL;

  window.rsvpSubmissionPending = true;

  setSubmittingState(true);

  showFormResponse(
    "Submitting your RSVP. Please wait...",
    "loading"
  );

  window.clearTimeout(
    window.rsvpSubmissionTimer
  );

  window.rsvpSubmissionTimer =
    window.setTimeout(
      handleSubmissionTimeout,
      SUBMISSION_TIMEOUT_MS
    );
}

function handleSubmissionFrameLoad() {
  if (!window.rsvpSubmissionPending) {
    return;
  }

  window.rsvpSubmissionPending = false;

  window.clearTimeout(
    window.rsvpSubmissionTimer
  );

  setSubmittingState(false);

  const form =
    document.getElementById("rsvpForm");

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

function clearRsvpForm() {
  const form =
    document.getElementById("rsvpForm");

  if (!form) {
    return;
  }

  form.reset();
  clearFormResponse();

  const firstField =
    document.getElementById("guestName");

  if (firstField) {
    firstField.focus();
  }
}

function isWebAppUrlConfigured() {
  return (
    GOOGLE_APPS_SCRIPT_URL.startsWith(
      "https://script.google.com/macros/s/"
    ) &&
    GOOGLE_APPS_SCRIPT_URL.endsWith(
      "/exec"
    )
  );
}

function isHoneypotFilled() {
  const websiteField =
    document.getElementById("website");

  return Boolean(
    websiteField &&
    websiteField.value.trim()
  );
}

function setSubmittingState(
  isSubmitting
) {
  const submitButton =
    document.getElementById(
      "submitButton"
    );

  const clearFormButton =
    document.getElementById(
      "clearFormButton"
    );

  if (submitButton) {
    submitButton.disabled =
      isSubmitting;

    submitButton.textContent =
      isSubmitting
        ? "Submitting..."
        : "Submit";
  }

  if (clearFormButton) {
    clearFormButton.disabled =
      isSubmitting;
  }
}

function showFormResponse(
  message,
  type
) {
  const formResponse =
    document.getElementById(
      "formResponse"
    );

  if (!formResponse) {
    return;
  }

  formResponse.textContent = message;

  formResponse.className =
    `form-response ${type}`;
}

function clearFormResponse() {
  const formResponse =
    document.getElementById(
      "formResponse"
    );

  if (!formResponse) {
    return;
  }

  formResponse.textContent = "";

  formResponse.className =
    "form-response";
}