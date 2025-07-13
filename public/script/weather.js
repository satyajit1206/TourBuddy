const apiKey = weatherApiKey;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const locationElement = document.getElementById("locationWeather");
const temperatureElement = document.getElementById("temperatureWeather");
const descriptionElement = document.getElementById("descriptionWeather");
const windSpeedElement = document.getElementById("windSpeedWeather");
const humidityElement = document.getElementById("humidityWeather");
const pressureElement = document.getElementById("pressureWeather");

const getWeather = async (city) => {
  const response = await fetch(
    `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  // console.log(data);

  locationElement.textContent = "City: " + data.name;
  temperatureElement.innerHTML += `${Math.round(data.main.temp)}°C`;
  descriptionElement.innerHTML += data.weather[0].description;
  windSpeedElement.innerHTML += `${data.wind.speed} m/s`;
  humidityElement.innerHTML += `${data.main.humidity}%`;
  pressureElement.innerHTML += `${data.main.pressure} hPa`;

  document.getElementById("weather").style.display = "block";
  document.getElementById("loading").style.display = "none";
};

getWeather(locationWeather);
