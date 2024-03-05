window.addEventListener('load', () => {
    let long;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            fetchWeatherData(lat, long);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }

    document.getElementById('toggle-unit').addEventListener('click', toggleUnit);
    document.getElementById('search-btn').addEventListener('click', searchWeather);
});

function fetchWeatherData(lat, long) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=f976faeca8d74f1266566f3517e2151c&units=metric`;

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayWeatherData(data) {
    const name = data.name;
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    document.getElementById('location').textContent = name;
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('weather-description').textContent = description;
    document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
}

function toggleUnit() {
    const temperatureElement = document.getElementById('temperature');
    const currentTemp = temperatureElement.textContent;
    const tempValue = parseFloat(currentTemp);

    if (currentTemp.includes('°C')) {
        const tempF = (tempValue * 9 / 5) + 32;
        temperatureElement.textContent = `${tempF.toFixed(2)}°F`;
    } else if (currentTemp.includes('°F')) {
        const tempC = (tempValue - 32) * 5 / 9;
        temperatureElement.textContent = `${tempC.toFixed(2)}°C`;
    }
}

function searchWeather() {
    const searchInput = document.getElementById('search').value;
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=YOUR_API_KEY&units=metric`;

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            const lat = data.coord.lat;
            const long = data.coord.lon;
            fetchWeatherData(lat, long);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
