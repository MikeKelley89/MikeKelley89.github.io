/* Adapted from Mike Kelley's original OpenWeather demo in openWeatherApi. */
(function ($) {
  "use strict";

  const apiKey = "48ced08bac40a7979644285e22addce1";
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

  $zip.on("input", function () {
    const valid = isValidZip(this.value.trim());
    $button.prop("disabled", !valid);
    $("#zipStatus").prop("hidden", valid || this.value.length === 0);
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
      url: "https://api.openweathermap.org/geo/1.0/zip",
      data: { zip: zip + ",US", appid: apiKey },
      dataType: "json"
    }).done(function (location) {
      $("#conditions").text("Conditions for " + location.name + ", " + (location.country || "US"));
      $.ajax({
        url: "https://api.openweathermap.org/data/3.0/onecall",
        data: {
          lat: location.lat,
          lon: location.lon,
          exclude: "minutely,hourly",
          appid: apiKey,
          units: "imperial"
        },
        dataType: "json"
      }).done(function (weather) {
        const current = weather.current || {};
        const firstWeather = (current.weather && current.weather[0]) || {};
        const daily = (weather.daily && weather.daily[0]) || {};
        $("#main_temp").text(Number.isFinite(current.temp) ? Math.round(current.temp) : "Unavailable");
        $("#wind_speed").text(Number.isFinite(current.wind_speed) ? current.wind_speed : "Unavailable");
        $("#wind_direction").text(Number.isFinite(current.wind_deg) ? current.wind_deg : "Unavailable");
        $("#weather_conditions").text(
          (daily.summary ? daily.summary + " " : "") +
          (firstWeather.description ? "Currently: " + firstWeather.description + "." : "")
        );
        $results.prop("hidden", false);

        if (weather.alerts && weather.alerts.length) {
          const alert = weather.alerts[0];
          $("#sender_name").text(alert.sender_name || "Weather service");
          $("#event").text(alert.event || "Weather alert");
          $("#start").text(alert.start ? new Date(alert.start * 1000).toLocaleString() : "Not provided");
          $("#end").text(alert.end ? new Date(alert.end * 1000).toLocaleString() : "Not provided");
          $("#description").text(alert.description || "No description provided.");
          $("#tags").text(Array.isArray(alert.tags) ? alert.tags.join(", ") : "Not provided");
          $alert.prop("hidden", false);
        }
        setStatus("Weather updated.");
      }).fail(function (xhr) {
        showError(xhr, "The location was found, but the weather request failed.");
      }).always(function () {
        $button.prop("disabled", !isValidZip($zip.val().trim()));
      });
    }).fail(function (xhr) {
      showError(xhr, "Couldn't find weather for that ZIP code.");
      $button.prop("disabled", !isValidZip($zip.val().trim()));
    });
  });

  function showError(xhr, message) {
    $("#errorCode").text(xhr.status ? xhr.status + ": " : "");
    $("#errorMsg").text(xhr.statusText || "Request failed");
    $error.prop("hidden", false);
    setStatus(message, true);
  }
})(jQuery);
