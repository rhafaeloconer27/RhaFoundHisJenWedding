/* =========================================================
   RHAF & JEN
   INDEX RSVP

   FLOW:

   Static Guest List
       ↓
   Search Guest
       ↓
   Select Guest
       ↓
   Accept / Decline
       ↓
   Contact Details
       ↓
   Google Apps Script
       ↓
   Google Sheet
       ↓
   Success
       ↓
   Falling Roses Celebration
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const SUBMISSION_TIMEOUT_MS = 20000;

    const MINIMUM_LOADER_TIME_MS = 1400;

    const SUCCESS_CELEBRATION_TIME_MS = 6500;


    /* =====================================================
       STATIC GUEST LIST
    ===================================================== */

    const guestList = [

      "ALBERTO NAVARRO",
      "TERESA G. APAREJADO",
      "RHAFAEL EMMANUEL OCONER",
      "JENNY VILLARUEL",
      "JUAN MIGUEL VILLANUEVA",
      "BIANCA JOY SAMILLANO",
      "PS. MANRIC TAN PASCUAL",
      "PS. ROSANNA TAN PASCUAL",
      "MR. JOSEPH EDSEL BONILLA",
      "PS. DIVINA GRACE BONILLA",
      "MR. RONALD CORTES",
      "PS. MILDRED CORTES",
      "PS. CRISALDO LEONA",
      "MRS. TESS LEONA",
      "PS. BENJAMIN CHICO",
      "PS. CHERIERINE CHICO",
      "MR. KELVIS ARCILLA",
      "MRS. LEAH ARCILLA",
      "MR. RODEL FULGENCIO",
      "MRS. SHERYL FULGENCIO",
      "MR. ARTHUR SORIANO",
      "MRS. RODA SORIANO",
      "ELAR CAMPANANO",
      "WINSEL INGLESIAS",
      "EDNARVIN DONAIRE",
      "JOSEPHINE LACERNA",
      "HAZEL ENGUITO",
      "KURT AXL OCONER",
      "EMMANUEL JESUS ORIAS",
      "ZILDIAN FULGENCIO",
      "TK AQUINO",
      "MAE NEY ROSH BAYAGNA",
      "MAE ARCY CONSTANTINO",
      "CASSY OCONER",
      "SUMMER DAWN ENGUITO",
      "JEDEDIAH BONILLA",
      "EZEKIEL ARCILLA",
      "SHERYL VILLARUEL",
      "JOSHUA BORNALES",
      "BRYAN BORNALES",
      "JOSHUA AQUINO",
      "MARINEL CUARESMA",
      "LOURDES OCONER",
      "JEFF ENGUITO",
      "RIEGENE MARMETO",
      "NICOLE SOLERO",
      "KRIZZA DAYON",
      "HANNAH CAMPANANO",
      "GARAE BELANO",
      "CARLA LEONA",
      "CARLO LEONA",
      "INAH REY RAMOS",
      "DRA. JC VEL JUMAWAN",
      "DR. CARL CHANNEL AGUILAR",
      "DRA. JANE TABUCO",
      "DR. JOHN ROGER TABUCO",
      "NORA BATAN",
      "PAUL KENSHEE BRIES",
      "KYALE DIDO ORGA",
      "LLOYD LAURRELA",
      "VINCE REYES",
      "MELAI CLORES TAGAPUEN",
      "MARIA CASELYN BALMORES",
      "BERNARD SOLERO",
      "JOHN ROBERT DAYON",
      "TERRENCE AXL OCONER",
      "DANNY NAVARRO",
      "MAT BLANCO",
      "EMBER VILLANUEVA",
      "WINTER ENGUITO (3YRS OLD)",
      "ISAIAH PILLAS (3YRS OLD)",

    ].map(
      function (name) {

        return {
          name: name,
          reservedSeats: 1,
        };

      }
    );


    /* =====================================================
       SEARCH ELEMENTS
    ===================================================== */

    const searchInput =
      document.getElementById(
        "introRsvpSearch"
      );

    const searchButton =
      document.getElementById(
        "introRsvpSearchButton"
      );

    const searchMessage =
      document.getElementById(
        "introRsvpSearchMessage"
      );


    /* =====================================================
       RSVP MODAL
    ===================================================== */

    const modal =
      document.getElementById(
        "introRsvpModal"
      );

    const resultsContainer =
      document.getElementById(
        "introRsvpResults"
      );


    /* =====================================================
       MODAL STEPS
    ===================================================== */

    const guestStep =
      document.getElementById(
        "introRsvpGuestStep"
      );

    const responseStep =
      document.getElementById(
        "introRsvpResponseStep"
      );

    const detailsStep =
      document.getElementById(
        "introRsvpWishStep"
      );

    const successStep =
      document.getElementById(
        "introRsvpSuccessStep"
      );


    /* =====================================================
       RESPONSE ELEMENTS
    ===================================================== */

    const guestFirstName =
      document.getElementById(
        "introRsvpGuestFirstName"
      );

    const seatCount =
      document.getElementById(
        "introRsvpSeatCount"
      );

    const seatWord =
      document.getElementById(
        "introRsvpSeatWord"
      );

    const continueButton =
      document.getElementById(
        "introRsvpContinueButton"
      );


    /* =====================================================
       DETAILS ELEMENTS
    ===================================================== */

    const selectedGuestNameDisplay =
      document.getElementById(
        "introRsvpSelectedGuestName"
      );

    const contactInput =
      document.getElementById(
        "introRsvpContactNumber"
      );

    const messengerInput =
      document.getElementById(
        "introRsvpMessengerName"
      );

    const wishInput =
      document.getElementById(
        "introRsvpWish"
      );

    const detailsMessage =
      document.getElementById(
        "introRsvpDetailsMessage"
      );

    const submitButton =
      document.getElementById(
        "introRsvpSubmitButton"
      );

    const skipButton =
      document.getElementById(
        "introRsvpSkipButton"
      );


    /* =====================================================
       HIDDEN GOOGLE APPS SCRIPT FORM
    ===================================================== */

    const submissionForm =
      document.getElementById(
        "introRsvpSubmissionForm"
      );

    const submissionFrame =
      document.getElementById(
        "introRsvpSubmissionFrame"
      );

    const hiddenGuestName =
      document.getElementById(
        "introRsvpHiddenGuestName"
      );

    const hiddenContactNumber =
      document.getElementById(
        "introRsvpHiddenContactNumber"
      );

    const hiddenMessengerName =
      document.getElementById(
        "introRsvpHiddenMessengerName"
      );

    const hiddenMessage =
      document.getElementById(
        "introRsvpHiddenMessage"
      );

    const hiddenAttendance =
      document.getElementById(
        "introRsvpHiddenAttendance"
      );


    /* =====================================================
       SUBMISSION LOTTIE
    ===================================================== */

    const submitLoader =
      document.getElementById(
        "introRsvpSubmitLoader"
      );

    const submitAnimation =
      document.getElementById(
        "introRsvpSubmitAnimation"
      );


    /* =====================================================
       SUCCESS FALLING ROSES
    ===================================================== */

    const successCelebration =
      document.getElementById(
        "rsvpSuccessCelebration"
      );

    const fallingRosesAnimation =
      document.getElementById(
        "rsvpFallingRoses"
      );

    const successGuestMessage =
      document.getElementById(
        "rsvpSuccessGuestMessage"
      );


    /* =====================================================
       STATE
    ===================================================== */

    let selectedGuest = null;

    let selectedResponse = null;

    let submissionPending = false;

    let submissionStartedAt = 0;

    let submissionTimeout = null;

    let successCelebrationTimeout = null;


    /* =====================================================
       NORMALIZE SPACES
    ===================================================== */

    function normalizeSpaces(value) {

      return String(
        value || ""
      )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    }


    /* =====================================================
       NORMALIZE NAME FOR SEARCH
    ===================================================== */

    function normalizeForSearch(value) {

      return normalizeSpaces(
        value
      )
        .normalize("NFD")

        .replace(
          /[\u0300-\u036f]/g,
          ""
        )

        .toUpperCase()

        .replace(
          /\b(MR|MRS|MS|DR|DRA|PS)\.?\b/g,
          " "
        )

        .replace(
          /[^A-Z0-9]+/g,
          " "
        )

        .replace(
          /\s+/g,
          " "
        )

        .trim();

    }


    /* =====================================================
       FORMAT DISPLAY NAME
    ===================================================== */

    function formatDisplayName(value) {

      const words =
        normalizeSpaces(
          value
        )
          .toLowerCase()
          .split(" ");


      return words
        .map(
          function (word) {

            if (!word) {
              return "";
            }

            return (
              word.charAt(0).toUpperCase() +
              word.slice(1)
            );

          }
        )
        .join(" ")

        .replace(
          /^Mr\s+/,
          "Mr. "
        )

        .replace(
          /^Mrs\s+/,
          "Mrs. "
        )

        .replace(
          /^Dr\s+/,
          "Dr. "
        )

        .replace(
          /^Dra\s+/,
          "Dra. "
        )

        .replace(
          /^Ps\s+/,
          "Ps. "
        );

    }


    /* =====================================================
       GET FIRST NAME
    ===================================================== */

    function getFirstName(
      guestName
    ) {

      const withoutTitle =
        normalizeSpaces(
          guestName
        )
          .replace(
            /^(MR\.?|MRS\.?|MS\.?|DR\.?|DRA\.?|PS\.?)\s+/i,
            ""
          );


      const firstName =
        withoutTitle
          .split(" ")[0] ||
        "Guest";


      return (
        firstName
          .charAt(0)
          .toUpperCase() +

        firstName
          .slice(1)
          .toLowerCase()
      );

    }


    /* =====================================================
       DELAY
    ===================================================== */

    function delay(
      milliseconds
    ) {

      return new Promise(
        function (resolve) {

          window.setTimeout(
            resolve,
            milliseconds
          );

        }
      );

    }


    /* =====================================================
       SHOW MODAL STEP
    ===================================================== */

    function showStep(step) {

      [
        guestStep,
        responseStep,
        detailsStep,
        successStep,
      ]
        .filter(Boolean)

        .forEach(
          function (element) {

            element.hidden =
              element !== step;

          }
        );

    }


    /* =====================================================
       OPEN RSVP MODAL
    ===================================================== */

    function openModal() {

      if (!modal) {
        return;
      }


      modal.classList.add(
        "is-visible"
      );


      modal.setAttribute(
        "aria-hidden",
        "false"
      );


      document.body.style.overflow =
        "hidden";

    }


    /* =====================================================
       CLOSE RSVP MODAL
    ===================================================== */

    function closeModal() {

      if (!modal) {
        return;
      }


      modal.classList.remove(
        "is-visible"
      );


      modal.setAttribute(
        "aria-hidden",
        "true"
      );


      document.body.style.overflow =
        "";


      resetRsvpState();

    }


    /* =====================================================
       RESET RSVP STATE
    ===================================================== */

    function resetRsvpState() {

      selectedGuest =
        null;


      selectedResponse =
        null;


      submissionPending =
        false;


      window.clearTimeout(
        submissionTimeout
      );


      hideSubmitLoader();


      setSubmittingState(
        false
      );


      if (
        continueButton
      ) {

        continueButton.disabled =
          true;

      }


      document
        .querySelectorAll(
          ".intro-rsvp-response-option"
        )

        .forEach(
          function (button) {

            button.classList.remove(
              "is-selected"
            );

          }
        );


      if (
        selectedGuestNameDisplay
      ) {

        selectedGuestNameDisplay.textContent =
          "Guest Name";

      }


      if (
        guestFirstName
      ) {

        guestFirstName.textContent =
          "Guest";

      }


      if (
        seatCount
      ) {

        seatCount.textContent =
          "1";

      }


      if (
        seatWord
      ) {

        seatWord.textContent =
          "seat";

      }


      if (
        contactInput
      ) {

        contactInput.value =
          "";

      }


      if (
        messengerInput
      ) {

        messengerInput.value =
          "";

      }


      if (
        wishInput
      ) {

        wishInput.value =
          "";

      }


      clearDetailsMessage();


      showStep(
        guestStep
      );

    }


    /* =====================================================
       SEARCH GUEST
    ===================================================== */

    function searchGuests() {

      if (
        !searchInput ||
        !searchMessage
      ) {

        return;

      }


      const query =
        normalizeForSearch(
          searchInput.value
        );


      if (
        query.length < 2
      ) {

        searchMessage.textContent =
          "Please enter at least 2 characters of your name.";

        return;

      }


      const matches =
        guestList.filter(
          function (guest) {

            const searchableName =
              normalizeForSearch(
                guest.name
              );


            return searchableName
              .includes(
                query
              );

          }
        );


      if (
        matches.length === 0
      ) {

        searchMessage.textContent =
          "We could not find that name. Please check the spelling and try again.";

        return;

      }


      searchMessage.textContent =
        "";


      renderGuestResults(
        matches.slice(
          0,
          10
        )
      );


      showStep(
        guestStep
      );


      openModal();

    }


    /* =====================================================
       RENDER SEARCH RESULTS
    ===================================================== */

    function renderGuestResults(
      guests
    ) {

      if (
        !resultsContainer
      ) {

        return;

      }


      resultsContainer.innerHTML =
        "";


      guests.forEach(
        function (guest) {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "intro-rsvp-guest-result";


          const nameElement =
            document.createElement(
              "strong"
            );


          nameElement.textContent =
            formatDisplayName(
              guest.name
            );


          const seatsElement =
            document.createElement(
              "span"
            );


          seatsElement.textContent =
            guest.reservedSeats +
            " Reserved " +
            (
              guest.reservedSeats === 1
                ? "Seat"
                : "Seats"
            );


          button.append(
            nameElement,
            seatsElement
          );


          button.addEventListener(
            "click",
            function () {

              selectGuest(
                guest
              );

            }
          );


          resultsContainer.appendChild(
            button
          );

        }
      );

    }


    /* =====================================================
       SELECT GUEST
    ===================================================== */

    function selectGuest(
      guest
    ) {

      selectedGuest =
        guest;


      selectedResponse =
        null;


      if (
        guestFirstName
      ) {

        guestFirstName.textContent =
          getFirstName(
            guest.name
          );

      }


      if (
        seatCount
      ) {

        seatCount.textContent =
          String(
            guest.reservedSeats
          );

      }


      if (
        seatWord
      ) {

        seatWord.textContent =
          guest.reservedSeats === 1
            ? "seat"
            : "seats";

      }


      if (
        selectedGuestNameDisplay
      ) {

        selectedGuestNameDisplay.textContent =
          formatDisplayName(
            guest.name
          );

      }


      if (
        continueButton
      ) {

        continueButton.disabled =
          true;

      }


      document
        .querySelectorAll(
          ".intro-rsvp-response-option"
        )

        .forEach(
          function (button) {

            button.classList.remove(
              "is-selected"
            );

          }
        );


      clearDetailsMessage();


      showStep(
        responseStep
      );

    }


    /* =====================================================
       ACCEPT / DECLINE
    ===================================================== */

    document
      .querySelectorAll(
        ".intro-rsvp-response-option"
      )

      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              selectedResponse =
                button.dataset.response;


              document
                .querySelectorAll(
                  ".intro-rsvp-response-option"
                )

                .forEach(
                  function (option) {

                    option.classList.remove(
                      "is-selected"
                    );

                  }
                );


              button.classList.add(
                "is-selected"
              );


              if (
                continueButton
              ) {

                continueButton.disabled =
                  false;

              }

            }
          );

        }
      );


    /* =====================================================
       CONTINUE TO DETAILS
    ===================================================== */

    continueButton
      ?.addEventListener(
        "click",
        function () {

          if (
            !selectedGuest ||
            !selectedResponse
          ) {

            return;

          }


          clearDetailsMessage();


          showStep(
            detailsStep
          );


          window.setTimeout(
            function () {

              contactInput
                ?.focus();

            },
            150
          );

        }
      );


    /* =====================================================
       BACK BUTTONS
    ===================================================== */

    document
      .querySelectorAll(
        "[data-rsvp-back]"
      )

      .forEach(
        function (button) {

          button.addEventListener(
            "click",
            function () {

              const target =
                button.dataset.rsvpBack;


              clearDetailsMessage();


              if (
                target === "guest"
              ) {

                showStep(
                  guestStep
                );

              }


              if (
                target === "response"
              ) {

                showStep(
                  responseStep
                );

              }

            }
          );

        }
      );


    /* =====================================================
       DETAIL MESSAGE
    ===================================================== */

    function showDetailsMessage(
      message
    ) {

      if (
        !detailsMessage
      ) {

        return;

      }


      detailsMessage.textContent =
        message;

    }


    function clearDetailsMessage() {

      if (
        !detailsMessage
      ) {

        return;

      }


      detailsMessage.textContent =
        "";

    }


    /* =====================================================
       CONTACT NUMBER
    ===================================================== */

    function normalizeContactNumber(
      value
    ) {

      return String(
        value || ""
      ).trim();

    }


    /* =====================================================
       VALIDATE DETAILS
    ===================================================== */

    function validateGuestDetails() {

      clearDetailsMessage();


      if (
        !selectedGuest
      ) {

        showDetailsMessage(
          "Please select your invited name first."
        );

        return false;

      }


      if (
        !selectedResponse
      ) {

        showDetailsMessage(
          "Please select whether you can attend."
        );

        return false;

      }


      const contactNumber =
        normalizeContactNumber(
          contactInput?.value
        );


      if (
        !contactNumber
      ) {

        showDetailsMessage(
          "Please enter your contact number."
        );


        contactInput
          ?.focus();


        return false;

      }


      if (
        !/^[0-9+\-\s()]{7,30}$/.test(
          contactNumber
        )
      ) {

        showDetailsMessage(
          "Please enter a valid contact number."
        );


        contactInput
          ?.focus();


        return false;

      }


      return true;

    }


    /* =====================================================
       SET SUBMITTING STATE
    ===================================================== */

    function setSubmittingState(
      isSubmitting
    ) {

      if (
        submitButton
      ) {

        submitButton.disabled =
          isSubmitting;


        submitButton.textContent =
          isSubmitting
            ? "Sending..."
            : "Send RSVP";

      }


      if (
        skipButton
      ) {

        skipButton.disabled =
          isSubmitting;

      }


      if (
        contactInput
      ) {

        contactInput.disabled =
          isSubmitting;

      }


      if (
        messengerInput
      ) {

        messengerInput.disabled =
          isSubmitting;

      }


      if (
        wishInput
      ) {

        wishInput.disabled =
          isSubmitting;

      }

    }


    /* =====================================================
       SHOW SUBMISSION LOTTIE
    ===================================================== */

    function showSubmitLoader() {

      if (
        !submitLoader
      ) {

        return;

      }


      submitLoader.classList.add(
        "is-visible"
      );


      submitLoader.setAttribute(
        "aria-hidden",
        "false"
      );


      if (
        submitAnimation &&
        typeof submitAnimation.play ===
          "function"
      ) {

        try {

          submitAnimation.play();

        } catch (error) {

          console.warn(
            "[INDEX RSVP] Unable to play submission Lottie:",
            error
          );

        }

      }

    }


    /* =====================================================
       HIDE SUBMISSION LOTTIE
    ===================================================== */

    function hideSubmitLoader() {

      if (
        !submitLoader
      ) {

        return;

      }


      submitLoader.classList.remove(
        "is-visible"
      );


      submitLoader.setAttribute(
        "aria-hidden",
        "true"
      );


      if (
        submitAnimation &&
        typeof submitAnimation.pause ===
          "function"
      ) {

        try {

          submitAnimation.pause();

        } catch (error) {

          console.warn(
            "[INDEX RSVP] Unable to pause submission Lottie:",
            error
          );

        }

      }

    }


    /* =====================================================
       SHOW SUCCESS FALLING ROSES
    ===================================================== */

    function showRsvpSuccessCelebration(
      guestName,
      attendance
    ) {

      if (
        !successCelebration
      ) {

        console.warn(
          "[INDEX RSVP] Success celebration element not found."
        );

        return;

      }


      window.clearTimeout(
        successCelebrationTimeout
      );


      const firstName =
        guestName
          ? getFirstName(
              guestName
            )
          : "Guest";


      /*
       * Different message depending
       * on Accept / Decline.
       */

      if (
        successGuestMessage
      ) {

        if (
          attendance === "YES"
        ) {

          successGuestMessage.textContent =
            "Thank you, " +
            firstName +
            "! We can't wait to celebrate with you.";

        } else {

          successGuestMessage.textContent =
            "Thank you, " +
            firstName +
            "! We appreciate you letting us know.";

        }

      }


      successCelebration
        .classList
        .add(
          "is-visible"
        );


      successCelebration
        .setAttribute(
          "aria-hidden",
          "false"
        );


      document.body.style.overflow =
        "hidden";


      /*
       * Restart falling roses.
       */

      if (
        fallingRosesAnimation
      ) {

        try {

          if (
            typeof fallingRosesAnimation.stop ===
            "function"
          ) {

            fallingRosesAnimation.stop();

          }


          /*
           * Small timeout helps ensure
           * the player resets before play.
           */

          window.setTimeout(
            function () {

              try {

                if (
                  typeof fallingRosesAnimation.play ===
                    "function"
                ) {

                  fallingRosesAnimation.play();

                }

              } catch (error) {

                console.warn(
                  "[INDEX RSVP] Unable to play falling roses:",
                  error
                );

              }

            },
            50
          );

        } catch (error) {

          console.warn(
            "[INDEX RSVP] Falling roses initialization error:",
            error
          );

        }

      }


      /*
       * Automatically hide after animation.
       */

      successCelebrationTimeout =
        window.setTimeout(
          function () {

            hideRsvpSuccessCelebration();

          },
          SUCCESS_CELEBRATION_TIME_MS
        );

    }


    /* =====================================================
       HIDE SUCCESS CELEBRATION
    ===================================================== */

    function hideRsvpSuccessCelebration() {

      if (
        !successCelebration
      ) {

        return;

      }


      successCelebration
        .classList
        .remove(
          "is-visible"
        );


      successCelebration
        .setAttribute(
          "aria-hidden",
          "true"
        );


      document.body.style.overflow =
        "";


      try {

        if (
          fallingRosesAnimation &&
          typeof fallingRosesAnimation.stop ===
            "function"
        ) {

          fallingRosesAnimation.stop();

        }

      } catch (error) {

        console.warn(
          "[INDEX RSVP] Unable to stop falling roses:",
          error
        );

      }

    }


    /* =====================================================
       POPULATE GOOGLE FORM
    ===================================================== */

    function populateSubmissionForm() {

      if (
        !selectedGuest
      ) {

        return false;

      }


      if (
        !hiddenGuestName ||
        !hiddenContactNumber ||
        !hiddenMessengerName ||
        !hiddenMessage ||
        !hiddenAttendance
      ) {

        console.error(
          "[INDEX RSVP] Hidden RSVP fields are missing."
        );


        return false;

      }


      hiddenGuestName.value =
        selectedGuest.name;


      hiddenContactNumber.value =
        normalizeContactNumber(
          contactInput?.value
        );


      hiddenMessengerName.value =
        messengerInput
          ?.value
          .trim() ||
        "";


      hiddenMessage.value =
        wishInput
          ?.value
          .trim() ||
        "";


      hiddenAttendance.value =
        selectedResponse ===
        "accept"
          ? "YES"
          : "NO";


      return true;

    }


    /* =====================================================
       SUBMIT RSVP
    ===================================================== */

    function submitRsvp() {

      if (
        submissionPending
      ) {

        return;

      }


      if (
        !validateGuestDetails()
      ) {

        return;

      }


      if (
        !submissionForm ||
        !submissionFrame
      ) {

        console.error(
          "[INDEX RSVP] Submission form or iframe not found."
        );


        showDetailsMessage(
          "Unable to submit RSVP. Please refresh the page and try again."
        );


        return;

      }


      if (
        !populateSubmissionForm()
      ) {

        showDetailsMessage(
          "Unable to prepare your RSVP. Please refresh the page and try again."
        );


        return;

      }


      console.log(
        "[INDEX RSVP] Submitting:",
        {
          guestName:
            hiddenGuestName.value,

          contactNumber:
            hiddenContactNumber.value,

          messengerName:
            hiddenMessengerName.value,

          message:
            hiddenMessage.value,

          attendance:
            hiddenAttendance.value,
        }
      );


      clearDetailsMessage();


      submissionPending =
        true;


      submissionStartedAt =
        Date.now();


      setSubmittingState(
        true
      );


      showSubmitLoader();


      window.clearTimeout(
        submissionTimeout
      );


      submissionTimeout =
        window.setTimeout(
          handleSubmissionTimeout,
          SUBMISSION_TIMEOUT_MS
        );


      try {

        submissionForm.submit();

      } catch (error) {

        console.error(
          "[INDEX RSVP] Submission error:",
          error
        );


        submissionPending =
          false;


        window.clearTimeout(
          submissionTimeout
        );


        hideSubmitLoader();


        setSubmittingState(
          false
        );


        showDetailsMessage(
          "Unable to send your RSVP. Please try again."
        );

      }

    }


    /* =====================================================
       SUBMISSION TIMEOUT
    ===================================================== */

    function handleSubmissionTimeout() {

      if (
        !submissionPending
      ) {

        return;

      }


      submissionPending =
        false;


      hideSubmitLoader();


      setSubmittingState(
        false
      );


      showStep(
        detailsStep
      );


      showDetailsMessage(
        "The RSVP is taking longer than expected. Please check your connection and try again."
      );


      console.warn(
        "[INDEX RSVP] No success response received from Google Apps Script."
      );

    }


    /* =====================================================
       VALID GOOGLE MESSAGE ORIGIN
    ===================================================== */

    function isAllowedGoogleOrigin(
      origin
    ) {

      if (
        !origin ||
        origin === "null"
      ) {

        return true;

      }


      try {

        const url =
          new URL(
            origin
          );


        if (
          url.protocol !==
          "https:"
        ) {

          return false;

        }


        return (
          url.hostname ===
            "script.google.com" ||

          url.hostname ===
            "script.googleusercontent.com" ||

          url.hostname.endsWith(
            ".googleusercontent.com"
          ) ||

          url.hostname.endsWith(
            ".google.com"
          )
        );

      } catch (error) {

        return false;

      }

    }


    /* =====================================================
       GOOGLE APPS SCRIPT RESPONSE
    ===================================================== */

    window.addEventListener(
      "message",
      async function (event) {

        console.log(
          "[INDEX RSVP] Message received:",
          {
            origin:
              event.origin,

            data:
              event.data,
          }
        );


        const data =
          event.data;


        if (
          !data ||
          typeof data !==
            "object"
        ) {

          return;

        }


        if (
          data.type !==
          "RHAF_JEN_RSVP_RESPONSE"
        ) {

          return;

        }


        if (
          !isAllowedGoogleOrigin(
            event.origin
          )
        ) {

          console.warn(
            "[INDEX RSVP] Ignored response from origin:",
            event.origin
          );


          return;

        }


        if (
          !submissionPending
        ) {

          return;

        }


        submissionPending =
          false;


        window.clearTimeout(
          submissionTimeout
        );


        /*
         * Keep submission loader visible
         * for minimum duration.
         */

        const elapsed =
          Date.now() -
          submissionStartedAt;


        if (
          elapsed <
          MINIMUM_LOADER_TIME_MS
        ) {

          await delay(
            MINIMUM_LOADER_TIME_MS -
              elapsed
          );

        }


        hideSubmitLoader();


        setSubmittingState(
          false
        );


        /* =================================================
           BACKEND ERROR
        ================================================= */

        if (
          data.success !== true
        ) {

          console.error(
            "[INDEX RSVP] Apps Script error:",
            data.message
          );


          showStep(
            detailsStep
          );


          showDetailsMessage(
            data.message ||
              "Unable to submit your RSVP. Please try again."
          );


          return;

        }


        /* =================================================
           SUCCESS

           IMPORTANT:
           Store values BEFORE closeModal()
           because closeModal() resets state.
        ================================================= */

        const submittedGuestName =
          selectedGuest?.name ||
          "";


        const submittedAttendance =
          selectedResponse ===
          "accept"
            ? "YES"
            : "NO";


        console.log(
          "[INDEX RSVP] RSVP saved successfully:",
          {
            guestName:
              submittedGuestName,

            attendance:
              submittedAttendance,

            backendMessage:
              data.message,
          }
        );


        /*
         * Clear search field.
         */

        if (
          searchInput
        ) {

          searchInput.value =
            "";

        }


        /*
         * Remove old text messages.
         */

        if (
          searchMessage
        ) {

          searchMessage.textContent =
            "";

        }


        /*
         * Close RSVP modal first.
         */

        closeModal();


        /*
         * Play falling roses after
         * modal is closed.
         */

        window.setTimeout(
          function () {

            showRsvpSuccessCelebration(
              submittedGuestName,
              submittedAttendance
            );

          },
          250
        );

      }
    );


    /* =====================================================
       SEND RSVP BUTTON
    ===================================================== */

    submitButton
      ?.addEventListener(
        "click",
        function () {

          submitRsvp();

        }
      );


    /* =====================================================
       SKIP MESSAGE & SEND
    ===================================================== */

    skipButton
      ?.addEventListener(
        "click",
        function () {

          if (
            wishInput
          ) {

            wishInput.value =
              "";

          }


          submitRsvp();

        }
      );


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    searchButton
      ?.addEventListener(
        "click",
        function () {

          searchGuests();

        }
      );


    /* =====================================================
       ENTER TO SEARCH
    ===================================================== */

    searchInput
      ?.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key ===
            "Enter"
          ) {

            event.preventDefault();


            searchGuests();

          }

        }
      );


    /* =====================================================
       CLEAR SEARCH MESSAGE
    ===================================================== */

    searchInput
      ?.addEventListener(
        "input",
        function () {

          if (
            searchMessage
          ) {

            searchMessage.textContent =
              "";

          }

        }
      );


    /* =====================================================
       CLEAR DETAIL ERROR
    ===================================================== */

    contactInput
      ?.addEventListener(
        "input",
        clearDetailsMessage
      );


    messengerInput
      ?.addEventListener(
        "input",
        clearDetailsMessage
      );


    wishInput
      ?.addEventListener(
        "input",
        clearDetailsMessage
      );


    /* =====================================================
       CLOSE RSVP MODAL
    ===================================================== */

    document
      .querySelectorAll(
        "[data-rsvp-close]"
      )

      .forEach(
        function (element) {

          element.addEventListener(
            "click",
            function () {

              if (
                submissionPending
              ) {

                return;

              }


              closeModal();

            }
          );

        }
      );


    document
      .getElementById(
        "introRsvpClose"
      )
      ?.addEventListener(
        "click",
        function () {

          if (
            submissionPending
          ) {

            return;

          }


          closeModal();

        }
      );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key !==
          "Escape"
        ) {

          return;

        }


        /*
         * Close success celebration first.
         */

        if (
          successCelebration
            ?.classList
            .contains(
              "is-visible"
            )
        ) {

          window.clearTimeout(
            successCelebrationTimeout
          );


          hideRsvpSuccessCelebration();


          return;

        }


        /*
         * Then RSVP modal.
         */

        if (
          !modal
            ?.classList
            .contains(
              "is-visible"
            )
        ) {

          return;

        }


        if (
          submissionPending
        ) {

          return;

        }


        closeModal();

      }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.log(
      "[INDEX RSVP] Initialized."
    );

  }
);