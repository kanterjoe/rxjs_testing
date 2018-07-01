//Make some global names for our events
const HOVER = "hover_event";
const TICK = "tick_event";

let OS = new ObserverStream();
const {map,throttleTime, filter,sample} = rxjs.operators;

const  {  interval } = rxjs;


console.log(interval);

//Create Timer observables (Observables that emit an object at a given interval)
let timer1 = interval(50 ).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:1,}))); //throws object {type:TICK, ticks: tickCount, timerid:1,} every 50 milliseconds
let timer2 = interval(100).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:2,}))); //throws object {type:TICK, ticks: tickCount, timerid:2,} every 100 milliseconds
let timer3 = interval(700).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:3,}))); //throws object {type:TICK, ticks: tickCount, timerid:3,} every 700 milliseconds
//merge the timer observables into the main Observer Stream
OS.merge(timer1);
OS.merge(timer2);
OS.merge(timer3);

const ONHover = OS.filter(item => (item.type===HOVER));     // create an event stream of only HOVER events
const ONSampledHover = ONHover.pipe(sample(timer2));        // create an event stream that only fires the last HOVER event since timer3 TICKed

const ONTick = OS.filter(item => (item.type===TICK));       // create an event stream of only TICK events






ONSampledHover.subscribe (hoverItem => {
    console.log("Sampled Hover:", hoverItem)
    const element = $(`#${hoverItem.hoveredItem}`);
    element.toggleClass("hovered")
});

$(document).ready( () => {



    OS.subscribe( item => $(`#total-events`).text(parseInt($(`#total-events`).text()) + 1));                    // Subscription to update the total events div every event

    ONTick.subscribe( item => $(`#timer${item.timerid} p`).text(item.ticks));                                   // Subscription to update the individual timers when they tick
    ONTick.subscribe( item => $(`#total-ticks`).text(parseInt($(`#total-ticks`).text()) + 1));                  // Subscription to update the total timer tick div on every tick
    ONHover.subscribe( item => $("#total-hovers").text(parseInt($("#total-hovers").text()) + 1));               // Subscription to update the total hovers div on every hover



    $(".hoverable").hover( function(){
        console.log("hovering on ", $(this).attr("id"))

        OS.dispatch({
            type: HOVER,
            hoveredItem: $(this).attr("id")
        })

    });

});