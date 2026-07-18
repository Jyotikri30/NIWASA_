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

  function saveToGoogleSheet(lead) {
    if (!config.GOOGLE_SCRIPT_URL) {
      return Promise.reject(new Error("Google Sheet URL is missing."));
    }

    return new Promise(function (resolve, reject) {
      const callbackName = "niwasaLeadCallback_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      const timeout = window.setTimeout(function () {
        cleanup();
        reject(new Error("Google Sheet request timed out."));
      }, 15000);

      function cleanup() {
        window.clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = function (response) {
        cleanup();
        if (response && response.ok) {
          resolve(response);
        } else {
          reject(new Error((response && response.error) || "Google Sheet save failed."));
        }
      };

      script.onerror = function () {
        cleanup();
        reject(new Error("Could not reach Google Sheet endpoint."));
      };

      const separator = config.GOOGLE_SCRIPT_URL.indexOf("?") === -1 ? "?" : "&";
      script.src = config.GOOGLE_SCRIPT_URL + separator +
        "callback=" + encodeURIComponent(callbackName) +
        "&payload=" + encodeURIComponent(JSON.stringify(lead));

      document.body.appendChild(script);
    });
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
            window.Toast.show("Thank you! Your consultation request has been received. Our design expert will contact you shortly.", "success");
          }
          form.reset();
        })
        .catch(function () {
          if (window.Toast) {
            window.Toast.show("Could not save your request. Please check the Google Sheet setup and try again.", "error");
          }
        })
        .finally(function () {
          setSubmitting(submitButton, false, originalText);
        });
    });
  });
}());
