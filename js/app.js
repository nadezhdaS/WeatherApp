if(localStorage.getItem('id')==null){
    localStorage.setItem('id','625144');
    localStorage.setItem('name', 'Minsk');
    localStorage.setItem('lat', '53.9');
    localStorage.setItem('lon', '27.57');
    $(document).ready(currentWeather);

}
else{
    $(document).ready(currentWeather);
}

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let prevDate;

function findCities() {
    const term = $("#cityTerm").val();
    if (term.length >= 3) {
        WeatherClient.findCities(term, renderCities, clientError);
    }
}

function renderCities(data) {
    document.getElementById('weather_headline').innerHTML='Select city:';
    const dataDiv = $('#weather_data');
    dataDiv.hide();
    dataDiv.empty();
    $('#citiesListTemplate').tmpl(data.list).appendTo('#weather_data');
    dataDiv.fadeIn("slow");
}

function clientError(req, status, err) {
    $('.bd-example-modal-sm').modal('toggle')
}

function selectCity(id, name, country, lat, lon) {

    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("country", country);
    localStorage.setItem("lat", lat);
    localStorage.setItem("lon", lon);

    //{"id":625144,"name":"Minsk","coord":{"lat":53.9023,"lon":27.5619}

    $('#cities').empty();
    $('#cityTerm').val(name + ", " + country);
    $('#cityName').empty();
    $('#cityName').append(name + ", " + country);

    currentWeather();
    $("#cityTerm").val("");
}

function currentWeather() {
    const id = localStorage.getItem("id");
    WeatherClient.currentWeather(id, renderCurrentWeather, clientError);
}


function renderCurrentWeather(data) {
    document.getElementById('weather_headline').innerHTML='Current weather in '+data.name;
    const dataDiv = $('#weather_data');
    dataDiv.hide();
    dataDiv.empty();
    $('#currentWeatherTemplate').tmpl(data).appendTo('#weather_data');
    dataDiv.fadeIn("slow");
}


function fiveDaysWeatherForecast() {
    const id = localStorage.getItem("id");
    WeatherClient.fiveDaysWeather(id, renderFiveDaysWeatherForecast, clientError);
}

function renderFiveDaysWeatherForecast(data) {
    document.getElementById('weather_headline').innerHTML='Weather forecast in '+data.city.name;
    const dataDiv = $('#weather_data');
    dataDiv.hide();
    dataDiv.empty();
    $('#fiveDaysWeatherTemplate').tmpl(data.list).appendTo('#weather_data');
    dataDiv.fadeIn("slow");
}

function temperatureMap() {
    const id = localStorage.getItem("id");
    WeatherClient.currentWeather(id, renderTemperatureMap, clientError);
}

function renderTemperatureMap(data) {
    renderWeatherMap(data, 'temp_new', data.main.temp);
}

function windSpeedMap() {
    const id = localStorage.getItem("id");
    WeatherClient.currentWeather(id, renderWindSpeedMap, clientError);
}

function renderWindSpeedMap(data) {
    renderWeatherMap(data, 'wind_new', data.wind.speed);
}

function renderWeatherMap(data, type, inform) {
    $('#weather_headline').html('Temperature Map for ' + localStorage.getItem('name'));

    const dataDiv = $('#weather_data');
    dataDiv.empty();

    dataDiv.html("<div id=\"map\" class=\"map-content\" style=\"height: 600px\"></div>");
    const centerLat = parseFloat(localStorage.getItem("lat"));
    const centerLon = parseFloat(localStorage.getItem("lon"));
    const cityPosition = {lat: centerLat, lng: centerLon};

    const map = new google.maps.Map(document.getElementById('map'), {
        center: cityPosition,
        zoom: 5
    });

    const marker = new google.maps.Marker({
        position: cityPosition,
        map: map,
        animation: google.maps.Animation.DROP,
        title: localStorage.getItem("name")
    });

    var units;
    if(inform==data.wind.speed){
        units=' m/sec';
    }
    else{
        units='&#176;C';
    }
    var contentString = '<div id="content">' +
        '<p class="map_info_description_headline">' + localStorage.getItem("name") + '</p><p class="map_info_description">' + inform + units +'</p>' +
        '</div>';
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    var myMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "https://tile.openweathermap.org/map/" + type + "/" +
                zoom + "/" + coord.x + "/" + coord.y + ".png?appid=7af475211df7050da265b73bee077d6f";
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 9,
        minZoom: 0,
        name: 'mymaptype'
    });

    map.overlayMapTypes.insertAt(0, myMapType);

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });

    infowindow.open(map, marker);

}

function normalizeTime(number){
    if(number.toString().length==1){
        return "0"+number;
    }
    else{
        return number;
    }

}


function msToTime(duration, offset) {
    const date = new Date(duration * 1000);
    date.setMinutes(date.getMinutes() + (offset ? date.getTimezoneOffset() : 0));
        return normalizeTime(date.getHours()) + ":" + normalizeTime(date.getMinutes());


}

function msToDate(duration) {
    const date = new Date(duration * 1000);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.getUTCDate() + ' ' + monthNames[date.getUTCMonth()];
}

function isNextDay(duration) {
    const date = new Date(duration * 1000);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    if (!prevDate) {
        prevDate = date;
        return true;
    } else {
        if (prevDate.getUTCDate() !== date.getUTCDate()) {
            prevDate = date;
            return true;
        } else {
            return false;
        }
    }

}