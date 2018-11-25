class WeatherClient{

    static findCities(term, successCallback, errorCallback){
        $.ajax({
            url: 'https://openweathermap.org/data/2.5/find?q=' + term + '&type=like&sort=population&cnt=30&appid=b6907d289e10d714a6e88b30761fae22',
            dataType: 'json',
            type: 'get',
            success: successCallback,
            error: errorCallback
        });
    }

    static currentWeather(id, successCallback, errorCallback){
        $.ajax({
            url: 'https://openweathermap.org/data/2.5/weather?id='+id+'&appid=b6907d289e10d714a6e88b30761fae22',
            dataType: 'json',
            type: 'get',
            success: successCallback,
            error: errorCallback
        });
    }

    static fiveDaysWeather(id, successCallback, errorCallback){
        $.ajax({
            url: 'https://openweathermap.org/data/2.5/forecast?id='+id+'&appid=b6907d289e10d714a6e88b30761fae22',
            dataType: 'json',
            type: 'get',
            success: successCallback,
            error: errorCallback
        });
    }

}