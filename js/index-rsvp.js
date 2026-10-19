/* =========================================================

   RHAF & JEN — INDEX RSVP

   Guest search, attendance, Google Apps Script, success UI.

\========================================================= */



document.addEventListener("DOMContentLoaded", () => {

  const SUBMISSION_TIMEOUT_MS = 20000;

  const MINIMUM_LOADER_TIME_MS = 1400;

  const SUCCESS_CELEBRATION_TIME_MS = 6500;

  const RESPONSE_TYPE = "RHAF_JEN_RSVP_RESPONSE";



  // Names and roles are intentionally kept identical to the original guest list.

  const GUEST_ROLES = {

    "JUAN MIGUEL VILLANUEVA": "Best Man",

    "BIANCA JOY SAMILLANO": "Maid of Honor",

    "PS. MANRIC TAN PASCUAL": "Principal Sponsor",

    "PS. ROSANNA TAN PASCUAL": "Principal Sponsor",

    "MR. JOSEPH EDSEL BONILLA": "Principal Sponsor",

    "PS. DIVINA GRACE BONILLA": "Principal Sponsor",

    "MR. RONALD CORTES": "Principal Sponsor",

    "PS. MILDRED CORTES": "Principal Sponsor",

    "PS. CRISALDO LEONA": "Principal Sponsor",

    "MRS. TESS LEONA": "Principal Sponsor",

    "PS. BENJAMIN CHICO": "Principal Sponsor",

    "PS. CHERIERINE CHICO": "Principal Sponsor",

    "MR. KELVIS ARCILLA": "Principal Sponsor",

    "MRS. LEAH ARCILLA": "Principal Sponsor",

    "MR. RODEL FULGENCIO": "Principal Sponsor",

    "MRS. SHERYL FULGENCIO": "Principal Sponsor",

    "ELAR CAMPANANO": "Sand Sponsor",

    "HANNAH CAMPANANO": "Sand Sponsor",

    "WINSEL INGLESIAS": "Veil Sponsor",

    "JOSEPHINE LACERNA": "Veil Sponsor",

    "EDNARVIN DONAIRE": "Cord Sponsor",

    "HAZEL ENGUITO": "Cord Sponsor",

    "KURT AXL OCONER": "Groomsman",

    "EMMANUEL JESUS ORIAS": "Groomsman",

    "ZILDJIAN FULGENCIO": "Groomsman",

    "TK AQUINO": "Bridesmaid",

    "MAE NEY ROSH BAYAGNA": "Bridesmaid",

    "MAE ARCY CONSTANTINO": "Bridesmaid",

    "EMBER VILLANUEVA": "Flower Girl",

    "PRINCESS BONILLA": "Flower Girl",

    "CASSY OCONER": "Flower Girl",

    "SUMMER DAWN ENGUITO": "Flower Girl",

    "WINTER ENGUITO (3YRS OLD)": "Flower Girl",

    "JEDEDIAH BONILLA": "Coin Bearer",

    "EZEKIEL ARCILLA": "Bible Bearer",

    "ISAIAH PILLAS (3YRS OLD)": "Ring Bearer",

  };

  const GUEST_NAMES = [

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

  ];



  const get = (id) => document.getElementById(id);

  const ui = Object.fromEntries(

    Object.entries({

      searchInput: "introRsvpSearch",

      searchButton: "introRsvpSearchButton",

      searchMessage: "introRsvpSearchMessage",

      modal: "introRsvpModal",

      results: "introRsvpResults",

      guestStep: "introRsvpGuestStep",

      responseStep: "introRsvpResponseStep",

      detailsStep: "introRsvpWishStep",

      successStep: "introRsvpSuccessStep",

      responseTitle: "introRsvpResponseTitle",

      roleMessage: "introRsvpRoleMessage",

      backLabel: "introRsvpBackLabel",

      continueButton: "introRsvpContinueButton",

      declinePanel: "introRsvpDeclineConfirmation",

      declineCard: "introRsvpDeclineConfirmationCard",

      declineTitle: "introRsvpDeclineTitle",

      declineMessage: "introRsvpDeclineMessage",

      declineConfirm: "introRsvpDeclineConfirm",

      declineCancel: "introRsvpDeclineCancel",

      declineReasonWrap: "introRsvpDeclineReasonWrap",

      declineReason: "introRsvpDeclineReason",

      declineReasonError: "introRsvpDeclineReasonError",

      selectedName: "introRsvpSelectedGuestName",

      contactInput: "introRsvpContactNumber",

      messengerInput: "introRsvpMessengerName",

      wishInput: "introRsvpWish",

      messageTooltip: "rsvpMessageTooltip",

      detailsMessage: "introRsvpDetailsMessage",

      submitButton: "introRsvpSubmitButton",

      skipButton: "introRsvpSkipButton",

      skipTooltip: "introRsvpSkipTooltip",

      form: "introRsvpSubmissionForm",

      frame: "introRsvpSubmissionFrame",

      hiddenName: "introRsvpHiddenGuestName",

      hiddenContact: "introRsvpHiddenContactNumber",

      hiddenMessenger: "introRsvpHiddenMessengerName",

      hiddenMessage: "introRsvpHiddenMessage",

      hiddenAttendance: "introRsvpHiddenAttendance",

      submitLoader: "introRsvpSubmitLoader",

      submitAnimation: "introRsvpSubmitAnimation",

      successOverlay: "rsvpSuccessCelebration",

      fallingRoses: "rsvpFallingRoses",

      successMessage: "rsvpSuccessGuestMessage",

      invitationCover: "invitationCover",

      modalClose: "introRsvpClose",

    }).map(([name, id]) => [name, get(id)])

  );



  if (!ui.searchInput || !ui.modal || !ui.form || !ui.frame) {

    console.error("[INDEX RSVP] Required RSVP elements are missing.");

    return;

  }



  function normalizeSpaces(value) {

    return String(value || "").replace(/\s+/g, " ").trim();

  }



  function normalizeForSearch(value) {

    return normalizeSpaces(value)

      .normalize("NFD")

      .replace(/[\u0300-\u036f]/g, "")

      .toUpperCase()

      .replace(/\b(MR|MRS|MS|DR|DRA|PS)\.?\b/g, " ")

      .replace(/[^A-Z0-9]+/g, " ")

      .replace(/\s+/g, " ")

      .trim();

  }



  function formatDisplayName(name) {

    return normalizeSpaces(name).toLowerCase().split(" ")

      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

      .join(" ")

      .replace(/^Mr\s+/, "Mr. ")

      .replace(/^Mrs\s+/, "Mrs. ")

      .replace(/^Dr\s+/, "Dr. ")

      .replace(/^Dra\s+/, "Dra. ")

      .replace(/^Ps\s+/, "Ps. ");

  }



  function getFirstName(name) {

    const first = normalizeSpaces(name)

      .replace(/^(MR\.?|MRS\.?|MS\.?|DR\.?|DRA\.?|PS\.?)\s+/i, "")

      .split(" ")[0] || "Guest";

    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();

  }



  const guests = GUEST_NAMES.map((name) => ({

    name,

    role: GUEST_ROLES[name] || "Guest",

    searchName: normalizeForSearch(name),

    displayName: formatDisplayName(name),

  }));



  const responseOptions = [...document.querySelectorAll(".intro-rsvp-response-option")];

  const modalSteps = [ui.guestStep, ui.responseStep, ui.detailsStep, ui.successStep].filter(Boolean);

  let shownResults = [];

  let selectedGuest = null;

  let selectedResponse = null;

  let declineStep = 0;

  let submissionPending = false;

  let processingResponse = false;

  let submissionMode = null;

  let submissionStartedAt = 0;

  let submissionTimeout = null;

  let successTimeout = null;

  let rosesStartTimeout = null;

  let successScrollTimeout = null;



  // Exact role-specific messages from the original RSVP flow.

  function getRoleResponseMessage(guest) {

    const first = getFirstName(guest.name);

    switch (guest.role) {

      case "Principal Sponsor":

        return { title: "We’re Truly Honored", message: "It would mean so much to us to have you stand with us as one of our Principal Sponsors." };

      case "Best Man":

        return { title: `Well, ${first}...`, message: "Looks like you’re not just a guest — you’re officially the Best Man. No pressure at all." };

      case "Maid of Honor":

        return { title: `Well, ${first}...`, message: "Looks like you’re not just a guest — you’re officially the Maid of Honor. Consider this your reminder that you have responsibilities." };

      case "Groomsman":

        return { title: `Well, ${first}...`, message: "Looks like you’re not just a guest — you’re officially one of the Groomsmen." };

      case "Bridesmaid":

        return { title: `Well, ${first}...`, message: "Looks like you’re not just a guest — you’re officially one of the Bridesmaids." };

      case "Sand Sponsor":

      case "Veil Sponsor":

      case "Cord Sponsor":

        return { title: `A Special Role, ${first}`, message: `We’re grateful to have you share in our ceremony as one of our ${guest.role}s.` };

      case "Flower Girl":

        return { title: `Guess What, ${first}?`, message: "You have one of the cutest jobs of the day — you’re officially one of our Flower Girls." };

      case "Coin Bearer":

      case "Bible Bearer":

        return { title: `Mission Accepted, ${first}?`, message: `You’ve got an important job on our big day — you’re officially our ${guest.role}.` };

      case "Ring Bearer":

        return { title: `Big Mission, ${first}!`, message: "You’ll be carrying something very important — you’re officially our Ring Bearer. No pressure." };

      default:

        return { title: `Well, ${first}...`, message: "You made the guest list. Now comes the part where you pretend you have a choice." };

    }

  }



  const DECLINE_MESSAGES = {

    guest: [

      { title: "Okay, Okay... Last Chance?", message: "You clicked decline. We’re giving you one free chance to blame it on your finger.", cancel: "I Changed My Mind", confirm: "Yes, I Can't Make It" },

      { title: "Oh... You Really Mean It?", message: "We checked. The button works perfectly. So apparently this decision is actually yours.", cancel: "Fine, Count Me In", confirm: "Sadly, Yes" },

      { title: "You Win. We Give Up.", message: "We tried guilt, persistence, and emotional damage. Nothing worked.", cancel: "Okay, I’ll Go", confirm: "Yes, I’m Sure" },

    ],

    sponsor: [

      { title: "Please Confirm", message: "May we confirm that you will not be able to join us on our special day?", cancel: "I’ll Be There", confirm: "Unable to Attend" },

      { title: "Just to Be Certain", message: "We completely understand. We simply want to make sure we record your response correctly.", cancel: "I’ll Be There", confirm: "Yes, That Is Correct" },

      { title: "Final Confirmation", message: "Would you like us to record your RSVP as unable to attend?", cancel: "I’ll Be There", confirm: "Yes, Please Confirm" },

    ],

  };



  function setText(element, value) {

    if (element) element.textContent = value;

  }



  function showStep(step) {

    modalSteps.forEach((element) => { element.hidden = element !== step; });

  }



  function setModalVisible(visible) {

    ui.modal.classList.toggle("is-visible", visible);

    ui.modal.setAttribute("aria-hidden", String(!visible));

    document.body.style.overflow = visible ? "hidden" : "";

  }



  function setSubmitLoader(visible) {

    ui.submitLoader?.classList.toggle("is-visible", visible);

    ui.submitLoader?.setAttribute("aria-hidden", String(!visible));

    try {

      if (visible) ui.submitAnimation?.play?.();

      else ui.submitAnimation?.pause?.();

    } catch (error) {

      console.warn("[INDEX RSVP] Submission animation unavailable:", error);

    }

  }



  function setSubmitting(loading) {

    if (ui.submitButton) {

      ui.submitButton.disabled = loading;

      ui.submitButton.textContent = loading ? "Sending..." : "Send RSVP";

    }

    [ui.contactInput, ui.messengerInput, ui.wishInput].forEach((field) => {

      if (field) field.disabled = loading;

    });

  }



  function showDetailsMessage(message = "") {

    setText(ui.detailsMessage, message);

  }



  function clearResponseSelection() {

    selectedResponse = null;

    responseOptions.forEach((option) => option.classList.remove("is-selected"));

    if (ui.continueButton) ui.continueButton.disabled = true;

  }



  function setResponse(value) {

    selectedResponse = value;

    responseOptions.forEach((option) => {

      option.classList.toggle("is-selected", option.dataset.response === value);

    });

    if (ui.continueButton) ui.continueButton.disabled = false;

  }



  function hideDecline() {

    if (ui.declinePanel) ui.declinePanel.hidden = true;

    declineStep = 0;

  }



  function resetState() {

    selectedGuest = null;

    clearResponseSelection();

    hideDecline();

    setSubmitLoader(false);

    setSubmitting(false);

    submissionPending = false;

    processingResponse = false;

    submissionMode = null;

    window.clearTimeout(submissionTimeout);

    submissionTimeout = null;

    [ui.contactInput, ui.messengerInput, ui.wishInput,

      ui.hiddenName, ui.hiddenContact, ui.hiddenMessenger, ui.hiddenMessage,

      ui.hiddenAttendance, ui.declineReason].forEach((field) => {

      if (field) field.value = "";

    });

    setText(ui.backLabel, "Wrong Turn?");

    setText(ui.responseTitle, "Well, Guest...");

    setText(ui.roleMessage, "You made the guest list. Now comes the part where you pretend you have a choice.");

    setText(ui.selectedName, "Guest Name");

    setText(ui.declineReasonError, "");

    showDetailsMessage();

    if (ui.messageTooltip) ui.messageTooltip.hidden = true;

    if (ui.skipTooltip) ui.skipTooltip.hidden = true;

    if (ui.skipButton) {

      ui.skipButton.disabled = false;

      ui.skipButton.textContent = "Skip Message & Send";

    }

    showStep(ui.guestStep);

  }



  function closeModal() {

    if (submissionPending) return;

    setModalVisible(false);

    resetState();

  }



  function searchGuests() {

    const query = normalizeForSearch(ui.searchInput.value);

    if (query.length < 2) {

      setText(ui.searchMessage, "Please enter at least 2 characters of your name.");

      if (ui.searchMessage) ui.searchMessage.style.color = "#e74c3c";

      return;

    }

    const matches = guests.filter((guest) => guest.searchName.includes(query)).slice(0, 10);

    if (!matches.length) {

      setText(ui.searchMessage, "We could not find that name. Please check the spelling and try again.");

      if (ui.searchMessage) ui.searchMessage.style.color = "#e74c3c";

      return;

    }

    setText(ui.searchMessage, "");

    shownResults = matches;

    const fragment = document.createDocumentFragment();

    matches.forEach((guest, index) => {

      const button = document.createElement("button");

      const name = document.createElement("strong");

      const role = document.createElement("span");

      button.type = "button";

      button.className = "intro-rsvp-guest-result";

      button.dataset.resultIndex = String(index);

      name.textContent = guest.displayName;

      role.textContent = guest.role;

      button.append(name, role);

      fragment.appendChild(button);

    });

    if (ui.results) ui.results.replaceChildren(fragment);

    showStep(ui.guestStep);

    setModalVisible(true);

  }



  function selectGuest(guest) {

    selectedGuest = guest;

    clearResponseSelection();

    hideDecline();

    setText(ui.backLabel, guest.role === "Principal Sponsor" ? "Back" : "Wrong Turn?");

    const { title, message } = getRoleResponseMessage(guest);

    setText(ui.responseTitle, title);

    setText(ui.roleMessage, message);

    setText(ui.selectedName, guest.displayName);

    showDetailsMessage();

    showStep(ui.responseStep);

  }



  function getDeclineMessages() {

    return DECLINE_MESSAGES[selectedGuest?.role === "Principal Sponsor" ? "sponsor" : "guest"];

  }



  function showDecline() {

    if (!ui.declinePanel) return;

    const steps = getDeclineMessages();

    const content = steps[declineStep];

    if (!content) return;

    setText(ui.declineTitle, content.title);

    setText(ui.declineMessage, content.message);

    setText(ui.declineCancel, content.cancel);

    setText(ui.declineConfirm, content.confirm);

    const finalStep = declineStep === steps.length - 1;

    if (ui.declineReasonWrap) ui.declineReasonWrap.hidden = !finalStep;

    setText(ui.declineReasonError, "");

    ui.declinePanel.hidden = false;

    if (ui.declineCard) {

      ui.declineCard.style.animation = "none";

      void ui.declineCard.offsetWidth;

      ui.declineCard.style.animation = "";

    }

    if (finalStep) window.setTimeout(() => ui.declineReason?.focus(), 150);

  }



  function startDecline() {

    declineStep = 0;

    if (ui.declineReason) ui.declineReason.value = "";

    showDecline();

  }



  function confirmDecline() {

    if (submissionPending) return;

    const steps = getDeclineMessages();

    if (declineStep < steps.length - 1) {

      declineStep += 1;

      showDecline();

      return;

    }

    const reason = ui.declineReason?.value.trim() || "";

    if (!reason) {

      setText(ui.declineReasonError, "Give us a little reason before you disappear on us. 😄");

      ui.declineReason?.focus();

      return;

    }

    submitDecline(reason);

  }



  function validateAccept() {

    showDetailsMessage();

    if (!selectedGuest) {

      showDetailsMessage("Please select your invited name first.");

      return false;

    }

    if (selectedResponse !== "accept") {

      showDetailsMessage("Please select whether you can attend.");

      return false;

    }

    const contact = ui.contactInput?.value.trim() || "";

    if (!contact) {

      showDetailsMessage("Please enter your contact number.");

      ui.contactInput?.focus();

      return false;

    }

    if (!/^[0-9+\s()\-]{7,30}$/.test(contact)) {

      showDetailsMessage("Please enter a valid contact number.");

      ui.contactInput?.focus();

      return false;

    }

    if (!ui.wishInput?.value.trim()) {

      if (ui.messageTooltip) ui.messageTooltip.hidden = false;

      return false;

    }

    if (ui.messageTooltip) ui.messageTooltip.hidden = true;

    return true;

  }



  function haveSubmissionFields() {

    return Boolean(ui.form && ui.frame && ui.hiddenName && ui.hiddenContact &&

      ui.hiddenMessenger && ui.hiddenMessage && ui.hiddenAttendance);

  }



  function fillForm(values) {

    ui.hiddenName.value = values.guestName;

    ui.hiddenContact.value = values.contactNumber;

    ui.hiddenMessenger.value = values.messengerName;

    ui.hiddenMessage.value = values.message;

    ui.hiddenAttendance.value = values.attendance;

  }



  function submitAccept() {

    if (submissionPending || !validateAccept()) return;

    if (!haveSubmissionFields()) {

      showDetailsMessage("Unable to prepare your RSVP. Please refresh the page and try again.");

      return;

    }

    fillForm({

      guestName: selectedGuest.name,

      contactNumber: ui.contactInput.value.trim(),

      messengerName: ui.messengerInput?.value.trim() || "",

      message: ui.wishInput.value.trim(),

      attendance: "YES",

    });

    showDetailsMessage();

    beginSubmission("full");

  }



  function submitDecline(reason) {

    if (submissionPending || !selectedGuest) return;

    if (!haveSubmissionFields()) {

      setText(ui.declineReasonError, "Unable to prepare your RSVP. Please try again.");

      return;

    }

    selectedResponse = "decline";

    // Keep all fields, including the reason and backend-required placeholder values.

    // Disabling all but guestName/attendance would drop the reason and break backend validation.

    fillForm({

      guestName: selectedGuest.name,

      contactNumber: "09999999999",

      messengerName: "N/A",

      message: reason,

      attendance: "NO",

    });

    hideDecline();

    setModalVisible(false);

    beginSubmission("decline-only");

  }



  function beginSubmission(mode) {

    submissionMode = mode;

    submissionPending = true;

    processingResponse = false;

    submissionStartedAt = Date.now();

    setSubmitting(mode === "full");

    setSubmitLoader(true);

    window.clearTimeout(submissionTimeout);

    submissionTimeout = window.setTimeout(() => {

      failSubmission("The RSVP is taking longer than expected. Please check your connection and try again.", mode);

    }, SUBMISSION_TIMEOUT_MS);

    try {

      ui.form.submit();

    } catch (error) {

      console.error("[INDEX RSVP] Submission failed:", error);

      failSubmission("Unable to send your RSVP. Please try again.", mode);

    }

  }



  function failSubmission(message, mode = submissionMode) {

    if (!submissionPending) return;

    submissionPending = false;

    processingResponse = false;

    submissionMode = null;

    window.clearTimeout(submissionTimeout);

    submissionTimeout = null;

    setSubmitLoader(false);

    setSubmitting(false);

    if (mode === "decline-only") {

      showStep(ui.responseStep);

      setText(ui.responseTitle, "One More Try?");

      setText(ui.roleMessage, message);

      setModalVisible(true);

    } else {

      showStep(ui.detailsStep);

      showDetailsMessage(message);

    }

  }



  function isTrustedGoogleResponse(event) {

    // An Apps Script HTMLService reply can originate in a nested iframe.

    // Verify that the sender belongs to our submission iframe first.

    const submittedFrame = ui.frame?.contentWindow;

    let sender = event.source;

    let frameMatches = false;

    for (let depth = 0; sender && depth < 4; depth += 1) {

      if (sender === submittedFrame) {

        frameMatches = true;

        break;

      }

      try {

        if (sender === sender.parent) break;

        sender = sender.parent;

      } catch {

        return false;

      }

    }

    if (!frameMatches) return false;



    // Preserve compatibility with Apps Script sandboxed (opaque) iframe origins.

    if (!event.origin || event.origin === "null") return true;

    try {

      const { protocol, hostname } = new URL(event.origin);

      return protocol === "https:" && (

        hostname === "script.google.com" ||

        hostname === "script.googleusercontent.com" ||

        hostname.endsWith(".googleusercontent.com") ||

        hostname.endsWith(".google.com")

      );

    } catch {

      return false;

    }

  }



  async function onSubmissionMessage(event) {

    const data = event.data;

    if (!data || typeof data !== "object" || data.type !== RESPONSE_TYPE) return;

    if (!submissionPending || processingResponse || !isTrustedGoogleResponse(event)) return;

    processingResponse = true;

    window.clearTimeout(submissionTimeout);

    submissionTimeout = null;

    const mode = submissionMode;

    await new Promise((resolve) => window.setTimeout(

      resolve, Math.max(0, MINIMUM_LOADER_TIME_MS - (Date.now() - submissionStartedAt))

    ));

    if (!submissionPending || submissionMode !== mode) return;

    if (data.success !== true) {

      failSubmission(data.message || "Unable to submit your RSVP. Please try again.", mode);

      return;

    }

    const guestName = selectedGuest?.name || "";

    const attendance = mode === "full" ? "YES" : "NO";

    submissionPending = false;

    processingResponse = false;

    submissionMode = null;

    setSubmitLoader(false);

    setSubmitting(false);

    ui.searchInput.value = "";

    setText(ui.searchMessage, "");

    closeModal();

    window.setTimeout(() => showSuccess(guestName, attendance), 250);

  }



  function controlRoses(play) {

    if (!ui.fallingRoses) return;

    window.clearTimeout(rosesStartTimeout);

    ui.fallingRoses.style.display = play ? "block" : "none";

    try { ui.fallingRoses.stop?.(); } catch (error) {

      console.warn("[INDEX RSVP] Could not stop falling roses:", error);

    }

    if (play) {

      rosesStartTimeout = window.setTimeout(() => {

        try { ui.fallingRoses?.play?.(); } catch (error) {

          console.warn("[INDEX RSVP] Could not play falling roses:", error);

        }

      }, 50);

    }

  }



  function showSuccess(guestName, attendance) {

    if (!ui.successOverlay) return;

    window.clearTimeout(successTimeout);

    window.clearTimeout(successScrollTimeout);

    const first = guestName ? getFirstName(guestName) : "Guest";

    const accepting = attendance === "YES";

    setText(ui.successMessage, accepting

      ? `Thank you, ${first}! We can't wait to celebrate with you.`

      : `Thank you, ${first}. We appreciate you letting us know. We'll miss you on our special day.`);

    controlRoses(true);

    ui.successOverlay.classList.add("is-visible");

    ui.successOverlay.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

   
successTimeout = window.setTimeout(() => {
  hideSuccess();

  // Only guests who joyfully accepted will automatically
  // continue to the Wedding Home page.
  if (accepting) {
    Promise.resolve()
      .then(() => window.openWeddingAfterRsvp())
      .catch((error) => {
        console.error("[INDEX RSVP] Unable to open Wedding Home:", error);
        alert("Unable to open the wedding pages. Please try again.");
      });
  }

  // Regretfully declined:
  // Stay on the invitation page without redirecting.

}, SUCCESS_CELEBRATION_TIME_MS);


  }



  function hideSuccess() {

    window.clearTimeout(successTimeout);

    successTimeout = null;

    ui.successOverlay?.classList.remove("is-visible");

    ui.successOverlay?.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    controlRoses(false);

  }



  function scrollToInvitationCard() {

    ui.invitationCover?.scrollIntoView({

      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",

      block: "center",

    });

  }



  // Guest selection uses one listener, even when search results are rebuilt.

  ui.results?.addEventListener("click", (event) => {

    const target = event.target.closest?.("[data-result-index]");

    if (!target || !ui.results.contains(target)) return;

    const guest = shownResults[Number(target.dataset.resultIndex)];

    if (guest) selectGuest(guest);

  });



  responseOptions.forEach((option) => option.addEventListener("click", () => {

    if (submissionPending) return;

    if (option.dataset.response === "decline") startDecline();

    else {

      hideDecline();

      setResponse("accept");

    }

  }));



  ui.declineConfirm?.addEventListener("click", confirmDecline);

  ui.declineCancel?.addEventListener("click", () => {

    hideDecline();

    setResponse("accept");

  });

  ui.declineReason?.addEventListener("input", () => setText(ui.declineReasonError, ""));



  ui.continueButton?.addEventListener("click", () => {

    if (!selectedGuest || selectedResponse !== "accept" || submissionPending) return;

    showDetailsMessage();

    showStep(ui.detailsStep);

    window.setTimeout(() => ui.contactInput?.focus(), 150);

  });



  document.querySelectorAll("[data-rsvp-back]").forEach((button) => {

    button.addEventListener("click", () => {

      if (submissionPending) return;

      showDetailsMessage();

      const target = button.dataset.rsvpBack;

      if (target === "guest") showStep(ui.guestStep);

      if (target === "response") showStep(ui.responseStep);

    });

  });



  ui.submitButton?.addEventListener("click", submitAccept);

  ui.skipButton?.addEventListener("click", () => {

    ui.skipButton.disabled = true;

    ui.skipButton.textContent = "Nice Try! 😂";

    if (ui.skipTooltip) ui.skipTooltip.hidden = false;

  });

  ui.searchButton?.addEventListener("click", searchGuests);

  ui.searchInput.addEventListener("keydown", (event) => {

    if (event.key !== "Enter") return;

    event.preventDefault();

    searchGuests();

  });

  ui.searchInput.addEventListener("input", () => setText(ui.searchMessage, ""));

  [ui.contactInput, ui.messengerInput].forEach((input) => {

    input?.addEventListener("input", () => showDetailsMessage());

  });

  const hideMessageTooltip = () => {

    if (ui.messageTooltip) ui.messageTooltip.hidden = true;

    showDetailsMessage();

  };

  ui.wishInput?.addEventListener("focus", hideMessageTooltip);

  ui.wishInput?.addEventListener("input", hideMessageTooltip);



  [...document.querySelectorAll("[data-rsvp-close]"), ui.modalClose]

    .filter(Boolean).forEach((button) => button.addEventListener("click", closeModal));



  document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    if (ui.successOverlay?.classList.contains("is-visible")) {

      // Keep the thank-you animation visible until automatic navigation.

    } else if (ui.declinePanel && !ui.declinePanel.hidden) {

      hideDecline();

    } else if (ui.modal?.classList.contains("is-visible")) {

      closeModal();

    }

  });



  window.addEventListener("message", onSubmissionMessage);

  console.info("[INDEX RSVP] Initialized.");

});
