const { Observable, Subject, ReplaySubject, from, of, range } = rxjs;
const { map, filter, switchMap ,scan} = rxjs.operators;


const APIKEY = "049bf60658d7ef8e17926cb7af4eb07c";
fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${APIKEY}`)
    .then(Response => {
        console.log(Response)
    })


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