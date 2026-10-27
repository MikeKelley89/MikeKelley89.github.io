/* Weather demo client. The provider key lives in the Cloudflare Worker secret. */
(function ($) {
  "use strict";

  // After deploying worker/, replace the placeholder hostname with your Worker URL.
  const weatherEndpoint = "https://openweather-proxy.REPLACE-WITH-YOUR-CLOUDFLARE-SUBDOMAIN.workers.dev/weather";
  const $form = $("#localWeather");
  const $zip = $("#zip");
  const $button = $("#findWeather");
  const $status = $("#weatherStatus");
  const $results = $("#weatherResults");
  const $error = $("#weatherError");
  const $alert = $("#weatherAlert");

  function clearWeather() {
    $results.prop("hidden", true);
    $alert.prop("hidden", true);
    $error.prop("hidden", true);
  }

  function setStatus(message, isError) {
    $status.text(message).toggleClass("error-text", Boolean(isError));
  }

  function isValidZip(value) {
    return /^\d{5}$/.test(value);
  }

  function showError(xhr, fallbackMessage) {
    const payload = xhr.responseJSON || {};
    const message = payload.error && payload.error.message
      ? payload.error.message
      : fallbackMessage;
    $("#errorCode").text(xhr.status ? xhr.status + ": " : "");
    $("#errorMsg").text(message);
    $error.prop("hidden", false);
    setStatus(message, true);
  }

  $zip.on("input", function () {
    const zip = this.value.trim();
    const valid = isValidZip(zip);
    $button.prop("disabled", !valid);
    $("#zipStatus").prop("hidden", valid || zip.length === 0);
    if (!valid) {
      clearWeather();
      setStatus("Enter a five-digit US ZIP code to look up local conditions.");
    } else {
      setStatus("Ready to check weather.");
    }
  });

  $form.on("submit", function (event) {
    event.preventDefault();
    const zip = $zip.val().trim();

    if (!isValidZip(zip)) {
      $("#zipStatus").prop("hidden", false);
      setStatus("Enter a valid five-digit US ZIP code.", true);
      return;
    }

    clearWeather();
    $button.prop("disabled", true);
    setStatus("Finding the location and retrieving current conditions…");

    $.ajax({
      url: weatherEndpoint,
      method: "GET",
      data: { zip: zip },
      dataType: "json",
      timeout: 12000
    }).done(function (payload) {
      const location = payload.location || {};
      const weather = payload.weather || {};
      const current = weather.current || {};
      const firstWeather = (current.weather && current.weather[0]) || {};
      const daily = (weather.daily && weather.daily[0]) || {};

      $("#conditions").text("Conditions for " + (location.name || "Selected location") + ", " + (location.country || "US"));
      $("#main_temp").text(Number.isFinite(current.temp) ? Math.round(current.temp) : "Unavailable");
      $("#wind_speed").text(Number.isFinite(current.wind_speed) ? current.wind_speed : "Unavailable");
      $("#wind_direction").text(Number.isFinite(current.wind_deg) ? current.wind_deg : "Unavailable");
      $("#weather_conditions").text(
        (daily.summary ? daily.summary + " " : "") +
        (firstWeather.description ? "Currently: " + firstWeather.description + "." : "Current conditions are unavailable.")
      );
      $results.prop("hidden", false);

      const alerts = Array.isArray(weather.alerts) ? weather.alerts : [];
      if (alerts.length) {
        const alert = alerts[0];
        $("#sender_name").text(alert.sender_name || "Weather service");
        $("#event").text(alert.event || "Weather alert");
        $("#start").text(alert.start ? new Date(alert.start * 1000).toLocaleString() : "Not provided");
        $("#end").text(alert.end ? new Date(alert.end * 1000).toLocaleString() : "Not provided");
        $("#description").text(alert.description || "No description provided.");
        $("#tags").text(Array.isArray(alert.tags) ? alert.tags.join(", ") : "Not provided");
        $alert.prop("hidden", false);
      }

      setStatus("Weather updated.");
    }).fail(function (xhr, textStatus) {
      const fallback = textStatus === "timeout"
        ? "The request timed out. Please try again."
        : "The weather service could not complete the lookup.";
      showError(xhr, fallback);
    }).always(function () {
      $button.prop("disabled", !isValidZip($zip.val().trim()));
    });
  });
})(jQuery);
