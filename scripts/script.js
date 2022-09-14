/** @format */
let apiKey = "91e4be9d3f0ce62462b88df7804804ae";
let apiAstronomy = "b99861f9264143c2bd4a20afe37f2ab0";
function zero_first_format(value) {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}

function date(dayPlus) {
  let current_datetime = new Date();
  current_datetime.setDate(current_datetime.getDate() + dayPlus);
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
function time() {
  let current_datetime = new Date();
  let hours = zero_first_format(current_datetime.getHours());
  let minutes = zero_first_format(current_datetime.getMinutes());

  return hours + '<span id="blink">:</span>' + minutes;
}
document.querySelector(".currentDate").innerHTML = date(0);
document.querySelector(".dayPlus1").innerHTML = date(1);
document.querySelector(".dayPlus2").innerHTML = date(2);
document.querySelector(".dayPlus3").innerHTML = date(3);
document.querySelector(".dayPlus4").innerHTML = date(4);
document.querySelector(".dayPlus5").innerHTML = date(5);
setInterval(function () {
  document.querySelector(".time").innerHTML = time();
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
  document.querySelector("#iconCurrentWeather").innerHTML = content;
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

function updateCurrentData(response) {
  document.querySelector(".cityName").innerHTML =
    response.data.name.toUpperCase();
  let urlState = `https://restcountries.com/v3.1/alpha/${response.data.sys.country}`;
  axios.get(urlState).then(updateStateName);
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#currentTemperature").innerHTML = `${temperature}°C`;
  let windSpeed = response.data.wind.speed;
  document.querySelector("#currentWindSpeed").innerHTML = windSpeed;
  let humidity = response.data.main.humidity;
  document.querySelector("#currentHumidity").innerHTML = humidity;
  let conditions = response.data.weather[0].icon;
  updateIcon(conditions);
  let weatherDescription = response.data.weather[0].description;
  document.querySelector("#weatherDescription").innerHTML = weatherDescription;
  let urlAstronomy = `https://api.ipgeolocation.io/astronomy?apiKey=${apiAstronomy}&lat=-${response.data.coord.lat}&long=${response.data.coord.lon}`;
  axios.get(urlAstronomy).then(updateAstronomy);
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

let fahrenheit = document.querySelector("#fahrenheit");
let celsius = document.querySelector("#celsius");

function toFahrenheit() {
  let temperature = document.querySelectorAll(".temperature");
  temperature.forEach(function (element) {
    element.innerHTML =
      Math.floor(element.innerHTML.split("°")[0] * 1.8 + 32) + "°F";
  });
  fahrenheit.disabled = true;
  celsius.disabled = false;
}
function toCelsius() {
  let temperature = document.querySelectorAll(".temperature");
  temperature.forEach(function (element) {
    element.innerHTML =
      Math.ceil((element.innerHTML.split("°")[0] - 32) / 1.8) + "°C";
  });
  fahrenheit.disabled = false;
  celsius.disabled = true;
}
fahrenheit.addEventListener("click", toFahrenheit);
celsius.addEventListener("click", toCelsius);
