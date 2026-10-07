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

   ACCEPT:
   Contact Details
       ↓
   Google Apps Script
       ↓
   Google Sheet
       ↓
   Success

   DECLINE:
   Confirmation 1
       ↓
   Confirmation 2
       ↓
   Confirmation 3
       ↓
   Close Modal
       ↓
   Submit Name + Attendance Only
       ↓
   Success
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const SUBMISSION_TIMEOUT_MS =
      20000;

    const MINIMUM_LOADER_TIME_MS =
      1400;

    const SUCCESS_CELEBRATION_TIME_MS =
      6500;


    /* =====================================================
       GUEST ROLES
    ===================================================== */

    const guestRoles = {

      /* ===================================================
         BEST MAN / MAID OF HONOR
      =================================================== */

      "JUAN MIGUEL VILLANUEVA":
        "Best Man",

      "BIANCA JOY SAMILLANO":
        "Maid of Honor",


      /* ===================================================
         PRINCIPAL SPONSORS
      =================================================== */

      "PS. MANRIC TAN PASCUAL":
        "Principal Sponsor",

      "PS. ROSANNA TAN PASCUAL":
        "Principal Sponsor",

      "MR. JOSEPH EDSEL BONILLA":
        "Principal Sponsor",

      "PS. DIVINA GRACE BONILLA":
        "Principal Sponsor",

      "MR. RONALD CORTES":
        "Principal Sponsor",

      "PS. MILDRED CORTES":
        "Principal Sponsor",

      "PS. CRISALDO LEONA":
        "Principal Sponsor",

      "MRS. TESS LEONA":
        "Principal Sponsor",

      "PS. BENJAMIN CHICO":
        "Principal Sponsor",

      "PS. CHERIERINE CHICO":
        "Principal Sponsor",

      "MR. KELVIS ARCILLA":
        "Principal Sponsor",

      "MRS. LEAH ARCILLA":
        "Principal Sponsor",

      "MR. RODEL FULGENCIO":
        "Principal Sponsor",

      "MRS. SHERYL FULGENCIO":
        "Principal Sponsor",


      /* ===================================================
         SECONDARY SPONSORS
      =================================================== */

      "ELAR CAMPANANO":
        "Sand Sponsor",

      "HANNAH CAMPANANO":
        "Sand Sponsor",

      "WINSEL INGLESIAS":
        "Veil Sponsor",

      "JOSEPHINE LACERNA":
        "Veil Sponsor",

      "EDNARVIN DONAIRE":
        "Cord Sponsor",

      "HAZEL ENGUITO":
        "Cord Sponsor",


      /* ===================================================
         GROOMSMEN
      =================================================== */

      "KURT AXL OCONER":
        "Groomsman",

      "EMMANUEL JESUS ORIAS":
        "Groomsman",

      "ZILDJIAN FULGENCIO":
        "Groomsman",


      /* ===================================================
         BRIDESMAIDS
      =================================================== */

      "TK AQUINO":
        "Bridesmaid",

      "MAE NEY ROSH BAYAGNA":
        "Bridesmaid",

      "MAE ARCY CONSTANTINO":
        "Bridesmaid",


      /* ===================================================
         FLOWER GIRLS
      =================================================== */

      "EMBER VILLANUEVA":
        "Flower Girl",

      "PRINCESS BONILLA":
        "Flower Girl",

      "CASSY OCONER":
        "Flower Girl",

      "SUMMER DAWN ENGUITO":
        "Flower Girl",

      "WINTER ENGUITO (3YRS OLD)":
        "Flower Girl",


      /* ===================================================
         BEARERS
      =================================================== */

      "JEDEDIAH BONILLA":
        "Coin Bearer",

      "EZEKIEL ARCILLA":
        "Bible Bearer",

      "ISAIAH PILLAS (3YRS OLD)":
        "Ring Bearer",

    };


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
      "ZILDJIAN FULGENCIO",

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
      "PRINCESS BONILLA",

      "WINTER ENGUITO (3YRS OLD)",
      "ISAIAH PILLAS (3YRS OLD)",

    ].map(
      function (name) {

        return {
          name: name,

          role:
            guestRoles[name] ||
            "Guest",
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

    const responseTitle =
      document.getElementById(
        "introRsvpResponseTitle"
      );

    const roleMessage =
      document.getElementById(
        "introRsvpRoleMessage"
      );

    const backLabel =
      document.getElementById(
        "introRsvpBackLabel"
      );

    const continueButton =
      document.getElementById(
        "introRsvpContinueButton"
      );


    /* =====================================================
       DECLINE CONFIRMATION ELEMENTS
    ===================================================== */

    const declineConfirmation =
      document.getElementById(
        "introRsvpDeclineConfirmation"
      );

    const declineConfirmationCard =
      document.getElementById(
        "introRsvpDeclineConfirmationCard"
      );

    const declineTitle =
      document.getElementById(
        "introRsvpDeclineTitle"
      );

    const declineMessage =
      document.getElementById(
        "introRsvpDeclineMessage"
      );

    const declineConfirmButton =
      document.getElementById(
        "introRsvpDeclineConfirm"
      );

    const declineCancelButton =
      document.getElementById(
        "introRsvpDeclineCancel"
      );

      const declineReasonWrap =
  document.getElementById(
    "introRsvpDeclineReasonWrap"
  );

const declineReasonInput =
  document.getElementById(
    "introRsvpDeclineReason"
  );

const declineReasonError =
  document.getElementById(
    "introRsvpDeclineReasonError"
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

    let selectedGuest =
      null;

    let selectedResponse =
      null;

    let declineConfirmationStep =
      0;

    let submissionPending =
      false;

    let submissionStartedAt =
      0;

    let submissionTimeout =
      null;

    let successCelebrationTimeout =
      null;

    /*
     * "full"
     *     Accept flow with contact details.
     *
     * "decline-only"
     *     Decline flow with Name + Attendance only.
     */

    let submissionMode =
      null;


    /* =====================================================
       NORMALIZE SPACES
    ===================================================== */

    function normalizeSpaces(
      value
    ) {

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

    function normalizeForSearch(
      value
    ) {

      return normalizeSpaces(
        value
      )
        .normalize(
          "NFD"
        )
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

    function formatDisplayName(
      value
    ) {

      const words =
        normalizeSpaces(
          value
        )
          .toLowerCase()
          .split(
            " "
          );


      return words
        .map(
          function (word) {

            if (
              !word
            ) {

              return "";

            }


            return (
              word
                .charAt(0)
                .toUpperCase() +

              word
                .slice(1)
            );

          }
        )
        .join(
          " "
        )
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
          .split(
            " "
          )[0] ||
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
       GET ROLE RESPONSE MESSAGE
    ===================================================== */

    function getRoleResponseMessage(
      guest
    ) {

      const firstName =
        getFirstName(
          guest.name
        );

      const role =
        guest.role ||
        "Guest";


      switch (
        role
      ) {

        /* ===============================================
           PRINCIPAL SPONSOR
        =============================================== */

        case "Principal Sponsor":

          return {
            title:
              "We’re Truly Honored",

            message:
              "It would mean so much to us to have you stand with us as one of our Principal Sponsors.",
          };


        /* ===============================================
           BEST MAN
        =============================================== */

        case "Best Man":

          return {
            title:
              `Well, ${firstName}...`,

            message:
              "Looks like you’re not just a guest — you’re officially the Best Man. No pressure at all.",
          };


        /* ===============================================
           MAID OF HONOR
        =============================================== */

        case "Maid of Honor":

          return {
            title:
              `Well, ${firstName}...`,

            message:
              "Looks like you’re not just a guest — you’re officially the Maid of Honor. Consider this your reminder that you have responsibilities.",
          };


        /* ===============================================
           GROOMSMAN
        =============================================== */

        case "Groomsman":

          return {
            title:
              `Well, ${firstName}...`,

            message:
              "Looks like you’re not just a guest — you’re officially one of the Groomsmen.",
          };


        /* ===============================================
           BRIDESMAID
        =============================================== */

        case "Bridesmaid":

          return {
            title:
              `Well, ${firstName}...`,

            message:
              "Looks like you’re not just a guest — you’re officially one of the Bridesmaids.",
          };


        /* ===============================================
           SAND SPONSOR
        =============================================== */

        case "Sand Sponsor":

          return {
            title:
              `A Special Role, ${firstName}`,

            message:
              "We’re grateful to have you share in our ceremony as one of our Sand Sponsors.",
          };


        /* ===============================================
           VEIL SPONSOR
        =============================================== */

        case "Veil Sponsor":

          return {
            title:
              `A Special Role, ${firstName}`,

            message:
              "We’re grateful to have you share in our ceremony as one of our Veil Sponsors.",
          };


        /* ===============================================
           CORD SPONSOR
        =============================================== */

        case "Cord Sponsor":

          return {
            title:
              `A Special Role, ${firstName}`,

            message:
              "We’re grateful to have you share in our ceremony as one of our Cord Sponsors.",
          };


        /* ===============================================
           FLOWER GIRL
        =============================================== */

        case "Flower Girl":

          return {
            title:
              `Guess What, ${firstName}?`,

            message:
              "You have one of the cutest jobs of the day — you’re officially one of our Flower Girls.",
          };


        /* ===============================================
           COIN BEARER
        =============================================== */

        case "Coin Bearer":

          return {
            title:
              `Mission Accepted, ${firstName}?`,

            message:
              "You’ve got an important job on our big day — you’re officially our Coin Bearer.",
          };


        /* ===============================================
           BIBLE BEARER
        =============================================== */

        case "Bible Bearer":

          return {
            title:
              `Mission Accepted, ${firstName}?`,

            message:
              "You’ve got an important job on our big day — you’re officially our Bible Bearer.",
          };


        /* ===============================================
           RING BEARER
        =============================================== */

        case "Ring Bearer":

          return {
            title:
              `Big Mission, ${firstName}!`,

            message:
              "You’ll be carrying something very important — you’re officially our Ring Bearer. No pressure.",
          };


        /* ===============================================
           NORMAL GUEST
        =============================================== */

        default:

          return {
            title:
              `Well, ${firstName}...`,

            message:
              "You made the guest list. Now comes the part where you pretend you have a choice.",
          };

      }

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

    function showStep(
      step
    ) {

      [
        guestStep,
        responseStep,
        detailsStep,
        successStep,
      ]
        .filter(
          Boolean
        )
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

      if (
        !modal
      ) {

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
       HIDE MODAL WITHOUT RESETTING STATE

       Used when Decline is submitted.
    ===================================================== */

    function hideModalWithoutReset() {

      if (
        !modal
      ) {

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

    }


    /* =====================================================
       CLOSE RSVP MODAL
    ===================================================== */

    function closeModal() {

      if (
        !modal
      ) {

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
       DECLINE-ONLY FORM MODE

       When enabled, ONLY these form fields are submitted:

       guestName
       attendance
    ===================================================== */

    function setDeclineOnlyFormMode(
      enabled
    ) {

      if (
        !submissionForm
      ) {

        return;

      }


      const allowedFields = [
        "guestName",
        "attendance",
      ];


      Array
        .from(
          submissionForm.elements
        )
        .forEach(
          function (element) {

            if (
              !element.name
            ) {

              return;

            }


            if (
              enabled
            ) {

              /*
               * Remember the element's
               * previous disabled state.
               */

              element.dataset.rsvpPreviousDisabled =
                element.disabled
                  ? "true"
                  : "false";


              element.disabled =
                !allowedFields.includes(
                  element.name
                );


              return;

            }


            /*
             * Restore original state.
             */

            if (
              Object.prototype.hasOwnProperty.call(
                element.dataset,
                "rsvpPreviousDisabled"
              )
            ) {

              element.disabled =
                element.dataset.rsvpPreviousDisabled ===
                "true";


              delete element.dataset
                .rsvpPreviousDisabled;

            }

          }
        );

    }


    /* =====================================================
       RESET RSVP STATE
    ===================================================== */

    function resetRsvpState() {

      selectedGuest =
        null;

      selectedResponse =
        null;

      declineConfirmationStep =
        0;

      submissionMode =
        null;

      submissionPending =
        false;


      window.clearTimeout(
        submissionTimeout
      );


      setDeclineOnlyFormMode(
        false
      );


      hideDeclineConfirmation();


      hideSubmitLoader();


      setSubmittingState(
        false
      );


      if (
        backLabel
      ) {

        backLabel.textContent =
          "Wrong Turn?";

      }


      if (
        responseTitle
      ) {

        responseTitle.textContent =
          "Well, Guest...";

      }


      if (
        roleMessage
      ) {

        roleMessage.textContent =
          "You made the guest list. Now comes the part where you pretend you have a choice.";

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


      if (
        selectedGuestNameDisplay
      ) {

        selectedGuestNameDisplay.textContent =
          "Guest Name";

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


      if (
        hiddenGuestName
      ) {

        hiddenGuestName.value =
          "";

      }


      if (
        hiddenContactNumber
      ) {

        hiddenContactNumber.value =
          "";

      }


      if (
        hiddenMessengerName
      ) {

        hiddenMessengerName.value =
          "";

      }


      if (
        hiddenMessage
      ) {

        hiddenMessage.value =
          "";

      }


      if (
        hiddenAttendance
      ) {

        hiddenAttendance.value =
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


            return searchableName.includes(
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
       RENDER GUEST RESULTS
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


          /* ===============================================
             NAME
          =============================================== */

          const nameElement =
            document.createElement(
              "strong"
            );


          nameElement.textContent =
            formatDisplayName(
              guest.name
            );


          /* ===============================================
             ROLE
          =============================================== */

          const roleElement =
            document.createElement(
              "span"
            );


          roleElement.textContent =
            guest.role ||
            "Guest";


          button.append(
            nameElement,
            roleElement
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


      hideDeclineConfirmation();


      /* ===============================================
         DYNAMIC BACK BUTTON
      =============================================== */

      if (
        backLabel
      ) {

        backLabel.textContent =
          guest.role ===
          "Principal Sponsor"
            ? "Back"
            : "Wrong Turn?";

      }


      /* ===============================================
         DYNAMIC RESPONSE MESSAGE
      =============================================== */

      const response =
        getRoleResponseMessage(
          guest
        );


      if (
        responseTitle
      ) {

        responseTitle.textContent =
          response.title;

      }


      if (
        roleMessage
      ) {

        roleMessage.textContent =
          response.message;

      }


      /* ===============================================
         SELECTED GUEST DISPLAY
      =============================================== */

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
       FUNNY DECLINE CONFIRMATIONS
    ===================================================== */

    const funnyDeclineConfirmations = [

      /* ===============================================
         1
      =============================================== */

      {
        title:
          "Okay, Okay... Last Chance?",

        message:
          "You clicked decline. We’re giving you one free chance to blame it on your finger.",

        cancelButton:
          "I Changed My Mind",

        confirmButton:
          "Yes, I Can't Make It",
      },


      /* ===============================================
         2
      =============================================== */

      {
        title:
          "Oh... You Really Mean It?",

        message:
          "We checked. The button works perfectly. So apparently this decision is actually yours.",

        cancelButton:
          "Fine, Count Me In",

        confirmButton:
          "Sadly, Yes",
      },


      /* ===============================================
         3
      =============================================== */

      {
        title:
          "You Win. We Give Up.",

        message:
          "We tried guilt, persistence, and emotional damage. Nothing worked.",

        cancelButton:
          "Okay, I’ll Go",

        confirmButton:
          "Yes, I’m Sure",
      },

    ];


    /* =====================================================
       PRINCIPAL SPONSOR DECLINE CONFIRMATIONS

       Respectful version.
    ===================================================== */

    const principalSponsorDeclineConfirmations = [

      /* ===============================================
         1
      =============================================== */

      {
        title:
          "Please Confirm",

        message:
          "May we confirm that you will not be able to join us on our special day?",

        cancelButton:
          "I’ll Be There",

        confirmButton:
          "Unable to Attend",
      },


      /* ===============================================
         2
      =============================================== */

      {
        title:
          "Just to Be Certain",

        message:
          "We completely understand. We simply want to make sure we record your response correctly.",

        cancelButton:
          "I’ll Be There",

        confirmButton:
          "Yes, That Is Correct",
      },


      /* ===============================================
         3
      =============================================== */

      {
        title:
          "Final Confirmation",

        message:
          "Would you like us to record your RSVP as unable to attend?",

        cancelButton:
          "I’ll Be There",

        confirmButton:
          "Yes, Please Confirm",
      },

    ];


    /* =====================================================
       GET DECLINE CONFIRMATIONS
    ===================================================== */

    function getDeclineConfirmations() {

      if (
        selectedGuest?.role ===
        "Principal Sponsor"
      ) {

        return (
          principalSponsorDeclineConfirmations
        );

      }


      return (
        funnyDeclineConfirmations
      );

    }


    /* =====================================================
       SET RSVP RESPONSE
    ===================================================== */

    function setRsvpResponse(
      response
    ) {

      selectedResponse =
        response;


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


      const selectedButton =
        document.querySelector(
          `.intro-rsvp-response-option[data-response="${response}"]`
        );


      selectedButton
        ?.classList
        .add(
          "is-selected"
        );


      if (
        continueButton
      ) {

        continueButton.disabled =
          false;

      }

    }


    /* =====================================================
       CLEAR RESPONSE SELECTION
    ===================================================== */

    function clearResponseSelection() {

      selectedResponse =
        null;


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


      if (
        continueButton
      ) {

        continueButton.disabled =
          true;

      }

    }


    /* =====================================================
       SHOW DECLINE CONFIRMATION
    ===================================================== */

    function showDeclineConfirmation() {

      if (
        !declineConfirmation
      ) {

        return;

      }


      const confirmations =
        getDeclineConfirmations();


      const current =
        confirmations[
          declineConfirmationStep
        ];


      if (
        !current
      ) {

        return;

      }


      if (
        declineTitle
      ) {

        declineTitle.textContent =
          current.title;

      }


      if (
        declineMessage
      ) {

        declineMessage.textContent =
          current.message;

      }


      if (
        declineCancelButton
      ) {

        declineCancelButton.textContent =
          current.cancelButton;

      }


      if (
        declineConfirmButton
      ) {

        declineConfirmButton.textContent =
          current.confirmButton;

      }

      const isFinalConfirmation =
  declineConfirmationStep ===
  confirmations.length - 1;


if (
  declineReasonWrap
) {

  declineReasonWrap.hidden =
    !isFinalConfirmation;

}


if (
  declineReasonError
) {

  declineReasonError.textContent =
    "";

}


if (
  isFinalConfirmation
) {

  window.setTimeout(
    function () {

      declineReasonInput
        ?.focus();

    },
    150
  );

}


      declineConfirmation.hidden =
        false;


      /* ===============================================
         RESTART POPUP ANIMATION
      =============================================== */

      if (
        declineConfirmationCard
      ) {

        declineConfirmationCard.style.animation =
          "none";


        void declineConfirmationCard.offsetWidth;


        declineConfirmationCard.style.animation =
          "";

      }

    }


    /* =====================================================
       START DECLINE CONFIRMATION
    ===================================================== */

 function startDeclineConfirmation() {

  declineConfirmationStep =
    0;


  if (
    declineReasonInput
  ) {

    declineReasonInput.value =
      "";

  }


  if (
    declineReasonError
  ) {

    declineReasonError.textContent =
      "";

  }


  showDeclineConfirmation();

}


    /* =====================================================
       HIDE DECLINE CONFIRMATION
    ===================================================== */

    function hideDeclineConfirmation() {

      if (
        declineConfirmation
      ) {

        declineConfirmation.hidden =
          true;

      }


      declineConfirmationStep =
        0;

    }


    /* =====================================================
       SUBMIT DECLINE RSVP

       IMPORTANT:
       Sends ONLY:

       guestName
       attendance
    ===================================================== */

    /* =====================================================
   SUBMIT DECLINED RSVP

   Declined guest does not need to enter details.

   Static values are submitted so the existing
   Google Apps Script validation still succeeds.
===================================================== */

function submitDeclinedRsvp(
  declineReason
) {

  if (
    submissionPending
  ) {

    return;

  }


  if (
    !selectedGuest
  ) {

    return;

  }


  if (
    !submissionForm ||
    !submissionFrame ||
    !hiddenGuestName ||
    !hiddenContactNumber ||
    !hiddenMessengerName ||
    !hiddenMessage ||
    !hiddenAttendance
  ) {

    console.error(
      "[INDEX RSVP] Decline submission form is incomplete."
    );

    return;

  }


  selectedResponse =
    "decline";


  /* =================================================
     DECLINED RSVP VALUES
  ================================================= */

  hiddenGuestName.value =
    selectedGuest.name;


  hiddenContactNumber.value =
    "09999999999";


  hiddenMessengerName.value =
    "N/A";


  /*
   * STORE THE ACTUAL DECLINE REASON HERE.
   */

  hiddenMessage.value =
    declineReason;


  /*
   * MUST stay NO.
   *
   * Your backend only allows YES / NO
   * for attendance.
   */

  hiddenAttendance.value =
    "NO";


  console.log(
    "[INDEX RSVP] Submitting declined RSVP:",
    {
      guestName:
        hiddenGuestName.value,

      reason:
        hiddenMessage.value,

      attendance:
        hiddenAttendance.value,
    }
  );


  submissionPending =
    true;


  submissionStartedAt =
    Date.now();


  hideDeclineConfirmation();


  hideModalWithoutReset();


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
      "[INDEX RSVP] Decline submission error:",
      error
    );


    submissionPending =
      false;


    window.clearTimeout(
      submissionTimeout
    );


    hideSubmitLoader();


    showStep(
      responseStep
    );


    if (
      responseTitle
    ) {

      responseTitle.textContent =
        "One More Try?";

    }


    if (
      roleMessage
    ) {

      roleMessage.textContent =
        "We couldn't save your RSVP. Please check your connection and try again.";

    }


    openModal();

  }

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

              const response =
                button.dataset.response;


              /* ===========================================
                 DECLINE
              =========================================== */

              if (
                response ===
                "decline"
              ) {

                startDeclineConfirmation();

                return;

              }


              /* ===========================================
                 ACCEPT
              =========================================== */

              hideDeclineConfirmation();


              setRsvpResponse(
                "accept"
              );

            }
          );

        }
      );


    /* =====================================================
       DECLINE CONFIRM — YES
    ===================================================== */

    declineConfirmButton
  ?.addEventListener(
    "click",
    function () {

      const confirmations =
        getDeclineConfirmations();


      const isFinalConfirmation =
        declineConfirmationStep ===
        confirmations.length - 1;


      /* ===============================================
         CONFIRMATION 1 → 2 → 3
      =============================================== */

      if (
        !isFinalConfirmation
      ) {

        declineConfirmationStep +=
          1;


        showDeclineConfirmation();


        return;

      }


      /* ===============================================
         FINAL CONFIRMATION

         Reason is required.
      =============================================== */

      const declineReason =
        declineReasonInput
          ?.value
          .trim() ||
        "";


      if (
        !declineReason
      ) {

        if (
          declineReasonError
        ) {

          declineReasonError.textContent =
            "Give us a little reason before you disappear on us. 😄";

        }


        declineReasonInput
          ?.focus();


        return;

      }


      /* ===============================================
         SUBMIT DECLINE
      =============================================== */

      submitDeclinedRsvp(
        declineReason
      );

    }
  );


    /* =====================================================
       DECLINE — CHANGE OF MIND

       Every left button means:
       "Actually, I'm coming."
    ===================================================== */

    declineCancelButton
      ?.addEventListener(
        "click",
        function () {

          hideDeclineConfirmation();


          setRsvpResponse(
            "accept"
          );

        }
      );


    /* =====================================================
       CONTINUE TO DETAILS

       Accept flow only.
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


          /*
           * Decline never reaches this point
           * because decline automatically
           * submits after confirmation #3.
           */

          if (
            selectedResponse !==
            "accept"
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
                target ===
                "guest"
              ) {

                showStep(
                  guestStep
                );

              }


              if (
                target ===
                "response"
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
       VALIDATE ACCEPT DETAILS
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
        selectedResponse !==
        "accept"
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
       SHOW SUBMIT LOADER
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
       HIDE SUBMIT LOADER
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

   /* =====================================================
   SHOW RSVP SUCCESS
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


  const isAttending =
    attendance ===
    "YES";



  /* =================================================
     SUCCESS MESSAGE
  ================================================= */

  if (
    successGuestMessage
  ) {

    if (
      isAttending
    ) {

      successGuestMessage.textContent =
        "Thank you, " +
        firstName +
        "! We can't wait to celebrate with you.";

    } else {

      successGuestMessage.textContent =
        "Thank you, " +
        firstName +
        ". We appreciate you letting us know. We'll miss you on our special day.";

    }

  }


  /* =================================================
     FALLING ROSES

     YES = show/play
     NO  = completely hide
  ================================================= */

  if (
    fallingRosesAnimation
  ) {

    if (
      isAttending
    ) {

      fallingRosesAnimation.style.display =
        "block";


      try {

        if (
          typeof fallingRosesAnimation.stop ===
          "function"
        ) {

          fallingRosesAnimation.stop();

        }


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

    } else {

      /*
       * DECLINED:
       * no falling roses.
       */

      fallingRosesAnimation.style.display =
        "none";


      try {

        if (
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

  }


  /* =================================================
     SHOW SUCCESS MESSAGE
  ================================================= */

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


  /* =================================================
     AUTO HIDE
  ================================================= */

  /* =================================================
   AUTO HIDE
   THEN SHOW FINAL INVITATION
================================================= */

successCelebrationTimeout =
  window.setTimeout(
    function () {

      /*
       * Close RSVP Received message.
       */
      hideRsvpSuccessCelebration();


      /*
       * Give the overlay a moment to close
       * before scrolling.
       */
      window.setTimeout(
        function () {

          scrollToInvitationCard();

        },
        250
      );

    },
    SUCCESS_CELEBRATION_TIME_MS
  );

}

/* =====================================================
   SCROLL TO FINAL INVITATION
===================================================== */

function scrollToInvitationCard() {

  const invitationCover =
    document.getElementById(
      "invitationCover"
    );


  if (
    !invitationCover
  ) {

    return;

  }


  invitationCover.scrollIntoView({
    behavior:
      "smooth",

    block:
      "center",
  });

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
       POPULATE ACCEPT FORM

       Used only when attendance = YES.
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


      /*
       * Make sure all normal fields
       * are enabled for Accept.
       */

      setDeclineOnlyFormMode(
        false
      );


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
        "YES";


      return true;

    }


    /* =====================================================
       SUBMIT ACCEPT RSVP
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


      submissionMode =
        "full";


      console.log(
        "[INDEX RSVP] Submitting accepted RSVP:",
        {
          guestName:
            hiddenGuestName.value,

          role:
            selectedGuest?.role ||
            "Guest",

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


        submissionMode =
          null;


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


      const failedMode =
        submissionMode;


      submissionPending =
        false;


      submissionMode =
        null;


      setDeclineOnlyFormMode(
        false
      );


      hideSubmitLoader();


      setSubmittingState(
        false
      );


      /* ===============================================
         DECLINE FAILED
      =============================================== */

      if (
        failedMode ===
        "decline-only"
      ) {

        showStep(
          responseStep
        );


        if (
          responseTitle
        ) {

          responseTitle.textContent =
            "One More Try?";

        }


        if (
          roleMessage
        ) {

          roleMessage.textContent =
            "We couldn't send your RSVP. Please check your connection and try again.";

        }


        openModal();


        console.warn(
          "[INDEX RSVP] Declined RSVP timed out."
        );


        return;

      }


      /* ===============================================
         ACCEPT FAILED
      =============================================== */

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
        origin ===
        "null"
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


        const completedMode =
          submissionMode;


        submissionPending =
          false;


        window.clearTimeout(
          submissionTimeout
        );


        /* ===============================================
           MINIMUM LOADER DURATION
        =============================================== */

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


        /*
         * Restore all form fields after
         * decline submission has completed.
         */

        setDeclineOnlyFormMode(
          false
        );


        /* =================================================
           BACKEND ERROR
        ================================================= */

        if (
          data.success !==
          true
        ) {

          console.error(
            "[INDEX RSVP] Apps Script error:",
            data.message
          );


          submissionMode =
            null;


          /* =============================================
             DECLINE ERROR
          ============================================= */

          if (
            completedMode ===
            "decline-only"
          ) {

            showStep(
              responseStep
            );


            if (
              responseTitle
            ) {

              responseTitle.textContent =
                "One More Try?";

            }


            if (
              roleMessage
            ) {

              roleMessage.textContent =
                data.message ||
                "We couldn't save your RSVP. Please try again.";

            }


            openModal();


            return;

          }


          /* =============================================
             ACCEPT ERROR
          ============================================= */

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

            role:
              selectedGuest?.role ||
              "Guest",

            attendance:
              submittedAttendance,

            submissionMode:
              completedMode,

            backendMessage:
              data.message,
          }
        );


        submissionMode =
          null;


        /* ===============================================
           CLEAR SEARCH
        =============================================== */

        if (
          searchInput
        ) {

          searchInput.value =
            "";

        }


        if (
          searchMessage
        ) {

          searchMessage.textContent =
            "";

        }


        /*
         * This also resets all temporary
         * RSVP state.
         */

        closeModal();


        /* ===============================================
           SUCCESS CELEBRATION
        =============================================== */

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
       SEND ACCEPT RSVP
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

       Contact number still required.
       Only the optional message is skipped.
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


        /* ===============================================
           CLOSE SUCCESS FIRST
        =============================================== */

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


        /* ===============================================
           CLOSE DECLINE CONFIRMATION FIRST
        =============================================== */

        if (
          declineConfirmation &&
          !declineConfirmation.hidden
        ) {

          hideDeclineConfirmation();


          return;

        }


        /* ===============================================
           THEN RSVP MODAL
        =============================================== */

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