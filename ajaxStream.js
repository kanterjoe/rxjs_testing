const { Observable, Subject, ReplaySubject, from, of, range } = rxjs;
const { map, filter, switchMap ,scan, publish} = rxjs.operators;

const cities = [
    "Minneapolis",
    "Chicago",
    "Houston"
];

const API_KEY = "049bf60658d7ef8e17926cb7af4eb07c";
let AJAXStream = new AJAXObserverStream();

console.log("Created obs stream: ", AJAXStream)

function getCityWeather(city) {
    return AJAXStream.dispatch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
}

cities.forEach(city => getCityWeather(city));



const subscription2 = AJAXStream.subscribe(
    val=> console.log("Stream Complete for ", val.name, ": ", val),
    err=>console.error("gots an error:",err)
);
const subscription1 = AJAXStream.subscribe(
    val=> $("#root").append(`<div><h1>${val.name}</h1><p>${val.main.temp} K</p></div>`),
    err=>console.error("gots an error:",err)
    );


const hotCities = AJAXStream.filter( item => (parseInt(item.main.temp) >= 303) );

const hotSub = hotCities.subscribe(
    val=> $("#hot-cities").append(`<p style="color:red">${val.name} is HOOOTTTTT!!!!!</p>`)
);


$(document).ready(function() {
    $("#submitter").click(function() {

        getCityWeather($("#city-name").val().trim());

    })
});
