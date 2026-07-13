(function () {
  "use strict";

  const config = window.NIWASA_CONFIG || {};

  function value(form, name) {
    const field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  }

  function leadFromForm(form) {
    return {
      name: value(form, "name"),
      phone: value(form, "phone"),
      email: value(form, "email"),
      project_type: value(form, "project_type"),
      message: value(form, "message"),
      source: "NIWASA Website",
      submitted_at: new Date().toISOString()
    };
  }

  function whatsappUrl(lead) {
    const number = config.WHATSAPP_NUMBER || "919304687036";
    const message = [
      "New NIWASA consultation request",
      "",
      "Name: " + lead.name,
      "Phone: " + lead.phone,
      "Email: " + lead.email,
      "Project Type: " + lead.project_type,
      "Message: " + (lead.message || "Not provided")
    ].join("\n");

    return "https://wa.me/" + encodeURIComponent(number) + "?text=" + encodeURIComponent(message);
  }

  function saveToGoogleSheet(lead) {
    if (!config.GOOGLE_SCRIPT_URL) return Promise.resolve(false);

    return fetch(config.GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(lead)
    }).then(() => true);
  }

  function setSubmitting(button, isSubmitting, originalText) {
    if (!button) return;
    button.disabled = isSubmitting;
    button.innerHTML = isSubmitting ? '<span class="btn-loading"></span>' : originalText;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("consultationForm");
    if (!form) return;

    const firstInput = form.querySelector("input");
    if (firstInput) firstInput.setAttribute("autocomplete", "name");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.innerHTML : "";
      const lead = leadFromForm(form);

      setSubmitting(submitButton, true, originalText);

      saveToGoogleSheet(lead)
        .then(function () {
          if (window.Toast) {
            window.Toast.show("Thank you! Your details are saved. WhatsApp will open with your message.", "success");
          }
          window.open(whatsappUrl(lead), "_blank", "noopener");
          form.reset();
        })
        .catch(function () {
          if (window.Toast) {
            window.Toast.show("Could not save to Google Sheet. WhatsApp will still open with your message.", "error");
          }
          window.open(whatsappUrl(lead), "_blank", "noopener");
        })
        .finally(function () {
          setSubmitting(submitButton, false, originalText);
        });
    });
  });
}());
