let cityInput=document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key='727e4a0e9968828520e75d32cd3c9d41',
currentWeatherCard= document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard = document.querySelector('.day-forecast'),
aqicard = document.querySelectorAll('.highlights .card')[0],
sunrisecard = document.querySelectorAll('.highlights .card')[1],
humidityVal = document.getElementById('humidityVal')
windSpeedVal = document.getElementById('windSpeedVal')
aqiList = ['Good','Fair', 'Moderate', 'Poor', 'Very Poor'],
alarmSound = document.getElementById('alarmSound');

function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`,
    AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`,
    days=[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months=[
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    fetch(AIR_POLLUTION_API_URL).then(res=> res.json()).then(data =>{
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqicard.innerHTML = `
        <div class="card-head">
            <p>Air Quality Index</p>
            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
            <i class="fa-regular fa-wind fa-3x"></i>
            <div class="item">
                <p>PM2.5</p>
                <h2>${pm2_5}</h2>
            </div>
            <div class="item">
                <p>PM10</p>
                <h2>${pm10}</h2>
            </div>
            <div class="item">
                <p>SO2</p>
                <h2>${so2}</h2>
            </div>
            <div class="item">
                <p>CO</p>
                <h2>${co}</h2>
            </div>
            <div class="item">
                <p>NO</p>
                <h2>${no}</h2>
            </div>
            <div class="item">
                <p>NO2</p>
                <h2>${no2}</h2>
            </div>
            <div class="item">
                <p>NH3</p>
                <h2>${nh3}</h2>
            </div>
            <div class="item">
                <p>O3</p>
                <h2>${o3}</h2>
            </div>
        </div>
        `;
    }).catch(() => {
        alert('Failed to fetch Air Quality Index');
    });


    fetch(WEATHER_API_URL).then(res=> res.json()).then(data=>{
        let date= new Date();
        currentWeatherCard.innerHTML = `<div class="current-weather">
            <div class="details">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="weather icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=" ">
            </div>
        </div>
        <br>
        <hr>
        <br>
        <div class="card-footer">
            <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
            <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
        </div>
        `;
        let {sunrise, sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity}=data.main,
        {speed} = data.wind,
        sRiseTime= moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
        sSetTime= moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
        sunrisecard.innerHTML = `
         <div class="card-head">
            <p>Sunrise & Sunset</p>
        </div>  
        <div class="sunrise-sunset">
        <div class="item">
            <div class="icon">
            <i class="fa-light fa-sunrise fa-4x"></i>
            </div>
            <div>
                <p>Sunrise</p>
                <h2>${sRiseTime}</h2>
            </div>
        </div>
        <div class="item">
            <div class="icon">
                <i class="fa-light fa-sunset fa-4x"></i>
            </div>
            <div>
                <p>Sunset</p>
                <h2>${sSetTime}</h2>
            </div>
        </div>
    </div>
        `;
        humidityVal.innerHTML = `${humidity}%`;
        windSpeedVal.innerHTML = `${speed}m/s`;
    }).catch(() => {
        alert('Failed to fetch current weather');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data =>{
        let uniqueForecastDays =[];
        let fiveDaysForecast= data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
       fiveDaysForecastCard.innerHTML='';
       for(i=1;i < fiveDaysForecast.length; i++){
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
        <div class="forecast-item">
            <div class="icon-wrapper">
                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt= " ">
                <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
        </div>
        `;
       }
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    });
}

function getCityCoordinates(){
    let cityName=cityInput.value.trim();
    cityInput.value='';
    if(!cityName) return;
    let GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
       let {name, lat, lon, country, state} = data[0];
       getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert('Failed to catch coordinates of ${cityName}');
    });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let{latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('Failed to fetch user cordinates');
        });
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation permision denied. Please reset location permission to grant access again');

        }
    });
}


function setWeatherAlarm() {
    navigator.geolocation.getCurrentPosition(position => {
        let{latitude, longitude} = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=${'727e4a0e9968828520e75d32cd3c9d41'}`)
        .then(response => response.json())
        .then(data => {
            const dailyForecast = data.daily;
            checkForStorm(dailyForecast);
        })
        .catch(error => console.error('Error fetching weather data:', error));
});
}


function checkForStorm(forecast) {
    const today = new Date();
    const stormThreshold = 2; // Example threshold for storm alerts

    for (let i = 0; i < forecast.length; i++) {
        const weatherConditions = forecast[i].weather[0].id; // Weather condition ID
        if (weatherConditions >= 200 && weatherConditions < 600) { // Thunderstorm to rain
            const alertDate = new Date(today);
            alertDate.setDate(today.getDate() + i);
            alertUser (alertDate);
            break;
        }
    }
}

function alertUser (alertDate) {
    alert(`Storm alert! A storm is expected on ${alertDate.toDateString()}.`);
    alarmSound.play();
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load',getUserCoordinates);
document.getElementById('setAlarmBtn').addEventListener('click', setWeatherAlarm);
