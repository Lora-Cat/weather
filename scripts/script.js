/** @format */
let apiKey = "91e4be9d3f0ce62462b88df7804804ae";
let apiAstronomy = "b99861f9264143c2bd4a20afe37f2ab0";
//displayForecast();
let startCity = "New York";
let urlStartCity = `https://api.openweathermap.org/data/2.5/weather?q=${startCity}&appid=${apiKey}&units=metric`;
axios.get(urlStartCity).then(updateCurrentData);

let timezone = 0;
function zero_first_format(value) {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}

function date(timestamp) {
  let current_datetime = new Date(timestamp);
  let day = zero_first_format(current_datetime.getDate());
  let month = current_datetime.getMonth();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayName = days[current_datetime.getDay()];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return dayName + "<br />" + monthNames[month] + " " + day;
}
function time(timezone) {
  let current_datetime = new Date();
  current_datetime.setHours(current_datetime.getHours() + timezone / 60);
  let hours = zero_first_format(current_datetime.getHours());
  let minutes = zero_first_format(current_datetime.getMinutes());

  return hours + '<span id="blink">:</span>' + minutes;
}
function updateYearAgoData(response) {
  let tempYearAgo = document.querySelector("#tempYearAgo");
  tempYearAgo.innerHTML = response.data.current.temp + "°C";
  let realFeelYearAgo = document.querySelector("#realFeelYearAgo");
  realFeelYearAgo.innerHTML = response.data.current.feels_like + "°C";
}
function displayForecast(response) {
  let forecastDay = response.data;
  document.querySelector(".currentDate").innerHTML = date(
    forecastDay.current.dt * 1000
  );
  let forecastElement = document.querySelector("#forecast");
  let forecastData = `
      <div class="row">
        <div class="col-12 col-md-2 currentWeather weather">
          <div>
            <div id="iconCurrentWeather">${updateIcon(
              forecastDay.current.weather[0].icon
            )}</div>
            <span class="temperature current" id="currentTemperature"
              >${Math.round(forecastDay.current.temp)}°C</span
            >
          </div>
          <span id="weatherDescription">${
            forecastDay.current.weather[0].description
          }</span><br />
          Wind: <span id="currentWindSpeed">${
            forecastDay.current.wind_speed
          }</span> km/h<br />
          Humidity: <span id="currentHumidity">${
            forecastDay.current.humidity
          }</span>%<br />
          <div class="btn-group mx-auto mt-1">
            <button class="btn btn-success" disabled id="celsius" onClick="toCelsius(); document.querySelector('#fahrenheit').disabled = false; document.querySelector('#celsius').disabled = true;">°C</button>
            <button class="btn btn-success" id="fahrenheit" onClick="toFahrenheit(); document.querySelector('#fahrenheit').disabled = true; document.querySelector('#celsius').disabled = false;">°F</button>
          </div>
        </div>`;
  for (i = 1; i <= 5; i++) {
    forecastData += `        
        <div class="col-12 col-md-2 nextDate weather">
          <div class="dayPlus${i}">${date(
      response.data.daily[i].dt * 1000
    )}</div>${updateIcon(
      response.data.daily[i].weather[0].icon
    )}max <span class="temperature">${Math.round(
      response.data.daily[i].temp.max
    )}°C</span><br />
          min <span class="temperature">${Math.round(
            response.data.daily[i].temp.min
          )}°C</span><br />
          <div class="realFeel">
            RealFeel<br />
            <span class="temperature">${Math.round(
              response.data.daily[i].feels_like.day
            )}°C</span> / <span class="temperature">${Math.round(
      response.data.daily[i].feels_like.night
    )}°C</span>
          </div>
        </div>
        `;
  }
  forecastElement.innerHTML = forecastData + `</div>`;
  let deg = Math.round(360 - forecastDay.daily[0].moon_phase * 360);
  document.querySelector(
    ".divider"
  ).style.transform = `rotate3d(0, 1, 0, ${deg}deg)`;

  let hemispheres = document.querySelectorAll(".hemisphere");

  if (deg < 180) {
    hemispheres[0].classList.remove("dark");
    hemispheres[0].classList.add("light");

    hemispheres[1].classList.add("dark");
    hemispheres[1].classList.remove("light");
    console.log(deg);
  } else {
    hemispheres[0].classList.add("dark");
    hemispheres[0].classList.remove("light");

    hemispheres[1].classList.remove("dark");
    hemispheres[1].classList.add("light");
  }
}

setInterval(function () {
  document.querySelector(".time").innerHTML = time(timezone);
}, 1000);

function searchUpdate(e) {
  e.preventDefault();
  let cityName = document.querySelector("#search-location").value;
  document.querySelector("#search-location").value = "";
  if (cityName !== "") {
    cityName = cityName.trim().toUpperCase();
    let urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    axios.get(urlCity).then(updateCurrentData);
  }
}
function favouriteLocationUpdate(e) {
  e.preventDefault();
  let cityName = this.innerHTML;
  if (cityName !== "") {
    cityName = cityName.trim().toUpperCase();
    let urlCity = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    axios.get(urlCity).then(updateCurrentData);
  }
}

function updateLocation() {
  navigator.geolocation.getCurrentPosition(currentLocation);
}
function updateStateName(response) {
  document.querySelector(".stateName").innerHTML =
    response.data[0].name.official;
}
function updateIcon(conditions) {
  let content = "";
  switch (conditions) {
    case "01d":
    case "01n":
      content =
        '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
      break;
    case "02d":
    case "02n":
      content =
        '<div class="icon sun-cloudy"><div class="cloud"></div><div class="sun"><div class="rays"></div></div></div>';
      break;
    case "03d":
    case "03n":
      content = '<div class="icon cloudy"><div class="cloud"></div></div>';
      break;
    case "04d":
    case "04n":
      content =
        '<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>';
      break;
    case "09d":
    case "09n":
      content =
        '<div class="icon cloudy rainy"><div class="cloud"></div><div class="cloud"></div><div class="rain"></div></div>';
      break;
    case "10d":
    case "10n":
      content =
        '<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>';
      break;
    case "11d":
    case "11n":
      content =
        '<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>';
      break;
    case "13d":
    case "13n":
      content =
        '<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>';
      break;
    case "50d":
    case "50n":
      content = '<div class="icon cloudy"><div class="cloud"></div></div>';
      break;
    default:
      content =
        '<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>';
  }
  return content;
}
function updateAstronomy(response) {
  let sunrise = response.data.sunrise;
  document.querySelector("#sunrise").innerHTML = sunrise;
  let sunset = response.data.sunset;
  document.querySelector("#sunset").innerHTML = sunset;
  let moonrise = response.data.moonrise;
  document.querySelector("#moonrise").innerHTML = moonrise;
  let moonset = response.data.moonset;
  document.querySelector("#moonset").innerHTML = moonset;
}
function updateTime(response) {
  let current_timezone = response.data.timezone_offset * 60;
  let current_datetime = new Date();
  timezone = current_timezone + current_datetime.getTimezoneOffset();
}
function updateCurrentData(response) {
  document.querySelector(".cityName").innerHTML =
    response.data.name.toUpperCase();
  let urlDailyForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&units=metric&appid=${apiKey}`;
  axios.get(urlDailyForecast).then(displayForecast);
  let urlState = `https://restcountries.com/v3.1/alpha/${response.data.sys.country}`;
  axios.get(urlState).then(updateStateName);
  let urlAstronomy = `https://api.ipgeolocation.io/astronomy?apiKey=${apiAstronomy}&lat=${response.data.coord.lat}&long=${response.data.coord.lon}`;
  axios.get(urlAstronomy).then(updateAstronomy);
  let urlTime = `https://api.ipgeolocation.io/timezone?apiKey=${apiAstronomy}&lat=${response.data.coord.lat}&long=${response.data.coord.lon}`;
  axios.get(urlTime).then(updateTime);
}
function currentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(urlWeather).then(updateCurrentData);
}
let currentLocationButton = document.querySelector("#currentLocation");
currentLocationButton.addEventListener("click", updateLocation);

let search = document.querySelector("#search");
search.addEventListener("submit", searchUpdate);

document
  .querySelectorAll(".location a")
  .forEach((favLocation) =>
    favLocation.addEventListener("click", favouriteLocationUpdate)
  );

document
  .querySelectorAll(".top-locations li a")
  .forEach((favLocation) =>
    favLocation.addEventListener("click", favouriteLocationUpdate)
  );

//let fahrenheit = document.querySelector("#fahrenheit");
//let celsius = document.querySelector("#celsius");

function toFahrenheit() {
  let temperature = document.querySelectorAll(".temperature");
  temperature.forEach(function (element) {
    element.innerHTML =
      Math.floor(element.innerHTML.split("°")[0] * 1.8 + 32) + "°F";
  });
  //  fahrenheit.disabled = true;
  //  celsius.disabled = false;
}
function toCelsius() {
  let temperature = document.querySelectorAll(".temperature");
  temperature.forEach(function (element) {
    element.innerHTML =
      Math.ceil((element.innerHTML.split("°")[0] - 32) / 1.8) + "°C";
  });
  //  fahrenheit.disabled = false;
  //  celsius.disabled = true;
}
