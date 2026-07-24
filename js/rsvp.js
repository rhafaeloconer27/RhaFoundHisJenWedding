/* =========================================================
   RSVP FORM — SPA COMPATIBLE
========================================================= */

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxuNkbTqIPVvLEB18qxM2noodhW05r4sD6rkV6ZLhWypjX8r9TsAlfucVwJDIrIIao/exec";

const SUBMISSION_TIMEOUT_MS = 15000;

/*
  Called by app.js after pages/rsvp.html
  is inserted inside #app.
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

  if (
    form.dataset.initialized ===
    "true"
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

  clearFormButton?.addEventListener(
    "click",
    clearRsvpForm
  );
};

window.cleanupRsvpPage = function () {
  window.clearTimeout(
    window.rsvpSubmissionTimer
  );

  window.rsvpSubmissionPending = false;

  hideRsvpSubmitLoader();
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

  /*
    The form submits to Google Apps Script
    using the hidden iframe.
  */
  form.action =
    GOOGLE_APPS_SCRIPT_URL;

  window.rsvpSubmissionPending = true;

  setSubmittingState(true);

  showRsvpSubmitLoader();

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
  if (
    !window.rsvpSubmissionPending
  ) {
    return;
  }

  window.rsvpSubmissionPending = false;

  window.clearTimeout(
    window.rsvpSubmissionTimer
  );

  setSubmittingState(false);

  hideRsvpSubmitLoader();

  const form =
    document.getElementById(
      "rsvpForm"
    );

  form?.reset();

  showFormResponse(
    "Thank you! Your RSVP has been submitted successfully.",
    "success"
  );
}

function handleSubmissionTimeout() {
  if (
    !window.rsvpSubmissionPending
  ) {
    return;
  }

  window.rsvpSubmissionPending = false;

  setSubmittingState(false);

  hideRsvpSubmitLoader();

  showFormResponse(
    "The submission is taking longer than expected. Please check your connection and try again.",
    "error"
  );
}

function clearRsvpForm() {
  const form =
    document.getElementById(
      "rsvpForm"
    );

  if (!form) {
    return;
  }

  form.reset();

  clearFormResponse();

  hideRsvpSubmitLoader();

  document
    .getElementById("guestName")
    ?.focus();
}

function showRsvpSubmitLoader() {
  const loader =
    document.getElementById(
      "rsvpSubmitLoader"
    );

  const animation =
    document.getElementById(
      "rsvpSubmitAnimation"
    );

  if (!loader) {
    return;
  }

  loader.classList.add(
    "is-visible"
  );

  loader.setAttribute(
    "aria-hidden",
    "false"
  );

  animation?.play();
}

function hideRsvpSubmitLoader() {
  const loader =
    document.getElementById(
      "rsvpSubmitLoader"
    );

  const animation =
    document.getElementById(
      "rsvpSubmitAnimation"
    );

  if (!loader) {
    return;
  }

  loader.classList.remove(
    "is-visible"
  );

  loader.setAttribute(
    "aria-hidden",
    "true"
  );

  window.setTimeout(function () {
    animation?.pause();
  }, 350);
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
    document.getElementById(
      "website"
    );

  return Boolean(
    websiteField?.value.trim()
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