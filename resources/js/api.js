
const covidApi = {
    getSummary: async () => {
        return await fetchRequest(covidApiEndPoints.summary())
    },
    getWorldAllTimeCases: async () => {
        return await fetchRequest(covidApiEndPoints.worldAllTimeCases())
    },
    getCountryAllTimeCases: async (country, status) => {
        return await fetchRequest(covidApiEndPoints.countryAllTimeCases(country, status))
    },
    getWorldDaysCases: async () => {
        return await fetchRequest(covidApiEndPoints.worldDaysCases())
    },
    getCountryDaysCases: async (country, status) => {
        return await fetchRequest(covidApiEndPoints.countryDaysCases(country, status))
    }
}
 
const covid_api_base = 'https://api.covid19api.com/'

const covidApiEndPoints = {
    summary: () => {
        return getApiPath('summary')
    },
    worldAllTimeCases: () => {
        return getApiPath('world')
    },
    countryAllTimeCases: (country, status) => {
        let end_point = `dayone/country/${country}/status/${status}`
        return getApiPath(end_point)
    },
    countryDaysCases: (country, status) => {
        let date = getDaysRange(30)
        let end_point = `country/${country}/status/${status}?from=${date.start_date}&to=${date.end_date}`
        return getApiPath(end_point)
    },
    worldDaysCases: () => {
        let date = getDaysRange(30)
        let end_point = `world?from=${date.start_date}&to=${date.end_date}`
        return getApiPath(end_point)
    }
}

getDaysRange = (days) => {
    let d = new Date()
    let from_d = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000))
    let to_date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    let from_date = `${from_d.getFullYear()}-${from_d.getMonth() + 1}-${from_d.getDate()}`
    return {
        start_date: from_date,
        end_date: to_date
    }
}

getApiPath = (end_point) => {
    return covid_api_base + end_point
}

/*Chart two code start*/

const countries = document.querySelector('datalist');
const search = document.querySelector('#srch');
const date = document.querySelector('#date');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

let dataChart = [];

const API_URL = "https://api.covid19api.com/summary";

async function covid(country){
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log(country)

    if(res.status === 4 || res.status === 200){
        date.textContent = new Date(data.Date).toDateString();

        if(country === '' || country === 'World'){
            const {TotalConfirmed,TotalRecovered,TotalDeaths,NewConfirmed,NewRecovered,NewDeaths} = data.Global;
            total(TotalConfirmed,TotalRecovered,TotalDeaths);
            newUpdate(NewConfirmed,NewRecovered,NewDeaths);
            dataChart = [TotalConfirmed,TotalRecovered,TotalDeaths];
            };

        data.Countries.forEach(item =>{
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);

            if(country === item.Country){
                total(item.TotalConfirmed,item.TotalRecovered,item.TotalDeaths);
                newUpdate(item.NewConfirmed,item.NewRecovered,item.NewDeaths);
            
            }
        });

        drawChart(dataChart);

    }else{
        chart.innerHTML = `<h2>Loading.....</h2>`;
    }
}

const speed = 100;

function counting(target, element){
    const inc = target / speed;
    const count = +element.textContent;
    if(count < target){
        element.textContent = Math.ceil(count + inc);
        setTimeout(()=>{
            counting(target, element)
        },1)

    }else{
        element.textContent = target;
    }
};

function total(Confirmed,Recovered,Deaths){
    counting(Confirmed, confirmed.children[1]);
    counting(Recovered, recovered.children[1]);
    counting(Deaths, deaths.children[1]);

    
};

function newUpdate(Confirmed,Recovered,Deaths){
   counting(Confirmed, confirmed.children[2]);
   counting(Recovered, recovered.children[2]);
   counting(Deaths, deaths.children[2]);
   
};

function drawChart(data){
    chart.innerHTML = '';
    const ctx = document.createElement('canvas');
    chart.appendChild(ctx);
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Total Confirmed', 'Total Recovered ', 'Total Deaths'],
            datasets: [{
                data: data,
                backgroundColor: ['red','green','black']
            }]
        },
        options: {}
    });
};

covid(search.value);

const btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', (e)=>{
    e.preventDefault();
    covid(search.value);
    search.value = '';
})

