const { Observable, Subject, ReplaySubject, from, of, range } = rxjs;
const { map, filter, switchMap ,scan, fromPromise} = rxjs.operators;

const cities = [
    "Minneapolis",
    "Chicago"
];


const API_KEY = "049bf60658d7ef8e17926cb7af4eb07c";

function getCityWeather(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        //.then(res => res.json())
}

const AJAXStream = Observable.create(
    observer => {
        cities.forEach(city=>{
            console.log("Sending req for ", city);
            getCityWeather(city).then(
                HTTPres => {
                    if (HTTPres.ok) {
                        HTTPres.json()
                            .then(JSONres =>{
                                    console.log("Receiving req for ", city);

                                    observer.next(res)

                                });
                    }
                    else {
                        observer.error(HTTPres)
                    }

                });
        })
    }
);

const subscription = AJAXStream.subscribe(val=>console.log("Yay: ", val));

// getCityWeather("Minneapolis");
// range(1, 200)
//   .pipe(filter(x => x % 2 === 1), map(x => x + x))
//   .subscribe(x => console.log(x));


// var source = range(1,30)
//     .pipe(
//     scan(
//         (acc, x) => {
//             return acc + x;
//         })
//     );

// var subscription = source.subscribe(
//     function (x) { console.log('Next: ' + x); },
//     function (err) { console.log('Error: ' + err); },
//     function () { console.log('Completed'); });