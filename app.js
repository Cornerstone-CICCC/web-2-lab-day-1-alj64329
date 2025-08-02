async function getData(url){
    try{
    const response = await fetch(url)
    const data = await response.json()
    return data
    }catch(err){
        console.log(err)
    }
}

function writeData(cityData, weatherData){
    const content = document.querySelector(".weather-container")
    const regionNamesInEnglish = new Intl.DisplayNames(["en"], { type: "region" });

    content.innerHTML = `
        <div class = "top-container">
        <div class="text-container">
        <div class ="city-name">${cityData.cityName}</div>
        <div class = "temp">${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}</div>
        </div>
        </div>

        <div class="table-container">
        <table class ="data-table">
        <tr>
        <th>Country</th>
        <td>${regionNamesInEnglish.of(cityData.country)}</td>
        </tr>
        <tr>
        <th>Timezone</th>
        <td>${cityData.timezone}</td>
        </tr>
        <tr>
        <th>Population</th>
        <td>${cityData.population}</td>
        </tr>
        <tr>
        <th>Tomorrow's Forecast</th>
        <td>
        <div>Low: ${weatherData.daily.temperature_2m_min} ${weatherData.daily_units.temperature_2m_min}</div>
        <div>Max: ${weatherData.daily.temperature_2m_max} ${weatherData.daily_units.temperature_2m_max}</div>
        </td>
        </tr>
        </table>
        </div>
    `
    console.log(weatherData.current.is_day)

    if(weatherData.current.is_day===1){
        content.querySelector(".top-container").style.backgroundImage = "url('/images/night.jpg')"
        document.querySelector(".container").style.backgroundColor ="black"
        document.querySelector(".container").style.color ="white"
    }


}



document.querySelector(".btn-search").addEventListener('click', async function(){
    const city = document.querySelector(".city-name-input").value

    const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`

    const data = await getData(cityURL)
    
    const cityData ={
        cityName: data.results[0].name,
        country:data.results[0].country_code,
        timezone:data.results[0].timezone,
        latitude : data.results[0].latitude,
        longitude : data.results[0].longitude,
        population : data.results[0].population
    }


    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    
    const weatherData = await getData(weatherURL)

    console.log(weatherData.daily.temperature_2m_min)
    writeData(cityData, weatherData)

    document.querySelector(".city-name-input").value =""
})