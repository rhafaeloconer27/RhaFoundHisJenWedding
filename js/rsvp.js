/* =========================================================
   RHAF & JEN WEDDING RSVP
   RSVP FRONTEND

   Submission:
   Website
      ↓
   fetch()
      ↓
   Google Apps Script
      ↓
   Google Sheet
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyhLrnhWh6utzC7UrCcyQiUjvPjKGiV8PcfA-8lY9ZsST5Z1iUH114JkNeOLAtmCkMU9A/exec";


/* =========================================================
   INITIALIZE RSVP PAGE
========================================================= */

window.initializeRsvpPage =
function () {

  const form =
    document.getElementById(
      "rsvpForm"
    );


  const clearFormButton =
    document.getElementById(
      "clearFormButton"
    );


  if (!form) {

    console.error(
      "[RSVP] RSVP form not found."
    );

    return;

  }


  /*
    Prevent duplicate initialization.
  */

  if (
    form.dataset.initialized ===
    "true"
  ) {

    return;

  }


  form.dataset.initialized =
    "true";


  /*
    Submit listener.
  */

  form.addEventListener(
    "submit",
    handleRsvpSubmission
  );


  /*
    Clear form listener.
  */

  clearFormButton
    ?.addEventListener(
      "click",
      clearRsvpForm
    );


  console.log(
    "[RSVP] RSVP page initialized."
  );

};


/* =========================================================
   CLEANUP
========================================================= */

window.cleanupRsvpPage =
function () {

  hideRsvpSubmitLoader();

};


/* =========================================================
   SUBMIT RSVP
========================================================= */

async function handleRsvpSubmission(
  event
) {

  /*
    IMPORTANT:

    Prevent normal browser form submission.
  */

  event.preventDefault();


  const form =
    event.currentTarget;


  clearFormResponse();


  /*
    Validate form.
  */

  if (
    !form.checkValidity()
  ) {

    form.reportValidity();

    return;

  }


  /*
    Honeypot.
  */

  if (
    isHoneypotFilled()
  ) {

    form.reset();


    showFormResponse(
      "Thank you. Your response has been received.",
      "success"
    );


    return;

  }


  /*
    Check endpoint.
  */

  if (
    !isWebAppUrlConfigured()
  ) {

    console.error(
      "[RSVP] Invalid Google Apps Script URL."
    );


    showFormResponse(
      "RSVP service is currently unavailable.",
      "error"
    );


    return;

  }


  /*
    Prevent duplicate clicking.
  */

  setSubmittingState(
    true
  );


  showRsvpSubmitLoader();


  showFormResponse(
    "Submitting your RSVP. Please wait...",
    "loading"
  );


  try {

    /*
      Build form data.

      Google Apps Script will receive these
      through e.parameter.
    */

    const formData =
      new FormData(
        form
      );


    console.log(
      "[RSVP] Submitting RSVP:"
    );


    console.log(
      Object.fromEntries(
        formData.entries()
      )
    );


    /*
      Submit to Google Apps Script.

      no-cors is intentional.

      Google Apps Script redirects its Web App
      response to googleusercontent.com.

      We don't need to read the response here.
      We only need to send the POST request.
    */

    await fetch(
      GOOGLE_APPS_SCRIPT_URL,
      {

        method:
          "POST",

        mode:
          "no-cors",

        body:
          formData

      }
    );


    /*
      If fetch completed without throwing,
      the request was sent to Apps Script.

      The Apps Script backend is responsible
      for validating and saving the RSVP.
    */

    console.log(
      "[RSVP] Request sent successfully."
    );


    /*
      Reset form after successful request.
    */

    form.reset();


    /*
      Show success.
    */

    showFormResponse(
      "Thank you! Your RSVP has been submitted successfully.",
      "success"
    );


  } catch (error) {

    console.error(
      "[RSVP] Submission error:",
      error
    );


    showFormResponse(
      "Unable to submit your RSVP. Please check your internet connection and try again.",
      "error"
    );

  } finally {

    setSubmittingState(
      false
    );


    hideRsvpSubmitLoader();

  }

}


/* =========================================================
   CLEAR RSVP FORM
========================================================= */

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


  setSubmittingState(
    false
  );


  document
    .getElementById(
      "guestName"
    )
    ?.focus();

}


/* =========================================================
   HONEYPOT
========================================================= */

function isHoneypotFilled() {

  const websiteField =
    document.getElementById(
      "website"
    );


  return Boolean(
    websiteField
      ?.value
      .trim()
  );

}


/* =========================================================
   CHECK GOOGLE APPS SCRIPT URL
========================================================= */

function isWebAppUrlConfigured() {

  return (

    typeof GOOGLE_APPS_SCRIPT_URL ===
      "string" &&


    GOOGLE_APPS_SCRIPT_URL
      .startsWith(
        "https://script.google.com/macros/s/"
      ) &&


    GOOGLE_APPS_SCRIPT_URL
      .endsWith(
        "/exec"
      )

  );

}


/* =========================================================
   BUTTON STATE
========================================================= */

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


  if (
    submitButton
  ) {

    submitButton.disabled =
      isSubmitting;


    submitButton.textContent =
      isSubmitting
        ? "Submitting..."
        : "Submit";

  }


  if (
    clearFormButton
  ) {

    clearFormButton.disabled =
      isSubmitting;

  }

}


/* =========================================================
   SHOW LOADER
========================================================= */

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


  if (
    animation &&
    typeof animation.play ===
      "function"
  ) {

    try {

      animation.play();

    } catch (error) {

      console.warn(
        "[RSVP] Unable to start animation:",
        error
      );

    }

  }

}


/* =========================================================
   HIDE LOADER
========================================================= */

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


  window.setTimeout(
    function () {

      if (
        animation &&
        typeof animation.pause ===
          "function"
      ) {

        try {

          animation.pause();

        } catch (error) {

          console.warn(
            "[RSVP] Unable to pause animation:",
            error
          );

        }

      }

    },
    350
  );

}


/* =========================================================
   SHOW RESPONSE
========================================================= */

function showFormResponse(
  message,
  type
) {

  const response =
    document.getElementById(
      "formResponse"
    );


  if (!response) {

    return;

  }


  response.textContent =
    message;


  response.className =
    "form-response " +
    type;

}


/* =========================================================
   CLEAR RESPONSE
========================================================= */

function clearFormResponse() {

  const response =
    document.getElementById(
      "formResponse"
    );


  if (!response) {

    return;

  }


  response.textContent =
    "";


  response.className =
    "form-response";

}