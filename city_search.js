/*

This is a simple application to show how one might use the same Observables to perform various functions syncronously or asynchronously, and with some filtered sub-listeners.

In this app, you can type in a city name into the search box, and I will search the city against the Open Weather Map API.
When the response comes back from the API, an ReactiveX Observable will trigger an output with the data from OWM.
There are 3 subscribers to this observable that perform 3 different tasks.

1. Log the result
2. Display the result in a DIV
3. If the city's temp is > 303K, put it in a "hot" list

 */


//I know, I know. This is insecure. Please don't steal this and abuse it.
const API_KEY = "049bf60658d7ef8e17926cb7af4eb07c";


let City_search = new AJAXObserverStream();

console.log("Created obs stream: ", City_search);

//call this function to search for a city
function getCityWeather(city) {
    return City_search.dispatch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
}


//=======================================================================================================================================================================================
//==== Setup a subscription to watch for incoming AJAX requests =========================================================================================================================
//=============== And log them to the console ===========================================================================================================================================
//=======================================================================================================================================================================================

const subscription2 = City_search.subscribe(
    val=> console.log("Stream Complete for ", val.name, ": ", val),
    err=>console.error("got an error:",err) //also, check for errors
);

//=======================================================================================================================================================================================
//==== Setup a different subscription to watch for incoming AJAX requests ===============================================================================================================
//=============== And add them to the DOM ===============================================================================================================================================
//=======================================================================================================================================================================================

const subscription1 = City_search.subscribe(
    val=> $("#root").append(`<div class="city"><h1>${val.name}</h1><p>${val.main.temp} K</p></div>`),
    err=>console.error("got an error:",err)   //might need to watch for errors here too
    );


//=======================================================================================================================================================================================
//==== Setup another subscription to watch for incoming AJAX requests ===================================================================================================================
//=============But filter them to ones with temp > 303K =================================================================================================================================
//=============== And add them to the DOM ===============================================================================================================================================
//=======================================================================================================================================================================================

const hotCities = City_search.filter(item => (parseInt(item.main.temp) >= 303) ); //filter takes in a function to be run on every item. If the function returns true, the stream updates

const hotSub = hotCities.subscribe(
    val=> $("#hot-cities").append(`<p style="color:red">${val.name} is HOOOTTTTT!!!!!</p>`)
);









//=======================================================================================================================================================================================
//=====Setup events to handle searching for a new city==============================================================================================================================================================
//=======================================================================================================================================================================================

$(document).ready(function() {
    //Event 1:
    //When a city is typed in by the user:

    $("form").on("submit",function(e) {
        e.preventDefault();
        //get the city name from the input
        let city  = $("#city-name").val().trim();
        $("#city-name").val("");

        //Send a new request for the weather of the city
        getCityWeather(city);
    });
    //Event 2:
    //Just a list of some default cities to search
    [
        "Minneapolis",
        "Chicago",
        "Houston",
        "London",
        "Hong Kong"

    ].forEach(city => getCityWeather(city));

});
