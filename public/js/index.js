// on document ready
$(function () {

    // element references in variable to search only once
    const $city = $('#city');
    const $country = $('#country');
    const $humidity = $('#humidity');
    const $day_name = $('#day_name');
    const $hour = $('#hour');
    const $temperature = $('#temperature');
    const $weather = $('#weather');
    const $weather_icon = $('#weather_icon');
    const $searchbtn = $('#searchbtn');
    const $searchbar = $('#searchbar');
    const $weather_warning = $('#weather_warning');
    const $weather_data = $('#weather_data');
    const $recent_cities = $('#recent_cities');
    const $searched_cities = $('#searched_cities');

    showWarning('Pesquise uma cidade!');

    /**
     * event triggered when search button is clicked, then search city by name in weather api
     */
    $searchbtn.click(function (e) {
        e.preventDefault();
        const city = $searchbar.val();
        searchCity(city);
    });

    /**
     * insert city into database, recreate recent and searched cities list
     * @param {object} cityData 
     */
    function addCity(cityData) {
        const newCity = {
            name: cityData.name,
            timesSearched: 1,
            temperature: Math.round(cityData.main.temp - 273.15).toString(),
            weather: cityData.weather[0].main,
        };
        $.ajax({
            url: 'http://localhost:3000/api/city',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(newCity),
            success: function (data) {
                resetRecentCitiesList();
                resetSearchedCitiesList();
            },
            failure: function (err) {
                showWarning(err.msg);
            }
        });
    }

    /**
     * call weather api by city, fill weather information in html and add city to database
     * @param {string} city city name
     */
    function searchCity(city) {
        $.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fdbac302be160aaa43c47482d49f4cdf`, function (data) {
            if (data.cod.toString() === "200") {
                fillCityInfo(data);
                addCity(data);
            }
            else {
                showWarning('Cidade não encontrada.');
            }

        }).fail(function () {
            showWarning('Cidade não encontrada.');
        });
    }

    /**
     * fill all weather information in html page
     * @param {object} data 
     */
    function fillCityInfo(data) {
        const zeroCelInKel = 273.15; // 0 celsius = 273.15 kelvin
        let dt = new Date(data.dt * 1000); // in milliseconds
        const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const currentDayName = dayNames[dt.getDay()];
        const currentHour = dt.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
        $city.text(data.name);
        $country.text(data.sys.country);
        $temperature.text(Math.round(data.main.temp - zeroCelInKel).toString() + ' °C');
        $humidity.text(data.main.humidity);
        $day_name.text(currentDayName);
        $hour.text(currentHour);
        $weather.text(data.weather[0].main);
        $weather_icon.attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);

        $weather_warning.css("display", "none");
        $weather_data.css("display", "block");
    }

    /**
     * clear elements and create again the searched cities list with cities received by api call
     */
    function resetSearchedCitiesList() {
        $.get('http://localhost:3000/api/city/searched', function (searchedCities) {
            $searched_cities.empty();
            for (let city of searchedCities) {
                const newSearchedCityElement = `<li class="d_block pl-2 pr-2"><span class="badge badge-pill badge-light p-2">${city.name}</span></li>`;
                $searched_cities.append(newSearchedCityElement);
            }
        }).fail(function (err) {
            showWarning(err.msg);
        });
    }

    /**
     * clear elements and create again the recent cities list with cities received by api call
     */
    function resetRecentCitiesList() {
        $.get('http://localhost:3000/api/city/recent', function (recentCities) {
            $recent_cities.empty();
            for (let city of recentCities) {
                let currentDate = new Date();
                let citySearchedDate = new Date(city.updatedAt);
                let dateDiff = (currentDate - citySearchedDate) / 1000;
                let dateType = '';
                if (dateDiff > 60) {
                    dateType = 'minuto(s)';
                    dateDiff /= 60;
                } else {
                    dateType = 'segundo(s)';
                }
                const newRecentCityElement = `<li class="last_city list-group-item p-2">${city.name}, 
                        ${city.temperature} °C, ${city.weather} à ${Math.round(dateDiff)} ${dateType}</li>`;
                $recent_cities.append(newRecentCityElement);
            }
        }).fail(function (err) {
            showWarning(err.msg);
        });
    }

    /**
     * Hide weather informations and show a warning message
     * @param {string} text 
     */
    function showWarning(text) {
        $weather_warning.text(text);
        $weather_data.css("display", "none");
        $weather_warning.css("display", "block");
    }
});