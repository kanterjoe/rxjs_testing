const { Observable, Subject, ReplaySubject, from, of, range } = rxjs;
const { map, filter, switchMap ,scan, publish} = rxjs.operators;

const cities = [
    "Minneapolis",
    "Chicago",
    "Houston"
];

//
// function CityLookup () {
//     let _observer = new AJAXObeserverStream();
//
//     return {
//         observerCreator: function (observer) {
//             _observer = observer;
//         },
//         lookupCity: function (city) {
//             getCityWeather(city)
//                 .then(HTTP_response => HTTP_response.json() )
//                 .then( JSON_response => _observer.next(JSON_response))
//                 .catch( err=> _observer.error(err));
//         }
//     }
//
// }
// const CITYLOOKUP = new CityLookup();
const API_KEY = "049bf60658d7ef8e17926cb7af4eb07c";
const AJAXStream = new AJAXObserverStream();

function getCityWeather(city) {
    return AJAXStream.dispatch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
}

// const AJAXObserver = Observable.create(
//     CITYLOOKUP.observerCreator
// );

cities.forEach(city => getCityWeather(city));



const subscription2 = AJAXStream.subscribe(
    val=> console.log("Stream Complete for ", val.name, ": ", val),
    err=>console.error("gots an error:",err)
);
const subscription1 = AJAXStream.subscribe(
    val=> $("#root").append(`<div><h1>${val.name}</h1><p>${val.main.temp} K</p></div>`),
    err=>console.error("gots an error:",err)
    );


const hotCities = AJAXStream.pipe(filter( item => (parseInt(item.main.temp) >= 303)));

const hotSub = hotCities.subscribe(
    val=> $("#hot-cities").append(`<p style="color:red">${val.name} is HOOOTTTTT!!!!!</p>`)
);


$(document).ready(function() {
    $("#submitter").click(function() {

        CITYLOOKUP.lookupCity($("#city-name").val().trim());
    })
});