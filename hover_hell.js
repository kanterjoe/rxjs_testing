//Make some global names for our events
const HOVER = "hover_event";
const TICK = "tick_event";

//get some stuff from rxjs so we can use it
const {map,throttleTime, filter,sample} = rxjs.operators;
const { interval } = rxjs;


/**
//========================================================================================================================================================================================
//=============== Set up the Observables =================================================================================================================================================
//========================================================================================================================================================================================
                                                                                                                                                                                                        */

//Create the main event stram
let OS = new ObserverStream();


//Create Timer observables (Observables that emit an object at a given interval)
let timer1 = interval(50 ).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:1,})));     //throws object {type:TICK, ticks: tickCount, timerid:1,} every 50 milliseconds
let timer2 = interval(100).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:2,})));     //throws object {type:TICK, ticks: tickCount, timerid:2,} every 100 milliseconds
let timer3 = interval(700).pipe(map(tickCount => ({type:TICK, ticks: tickCount, timerid:3,})));     //throws object {type:TICK, ticks: tickCount, timerid:3,} every 700 milliseconds

//merge the timer observables into the main Observer Stream
OS.merge(timer1);
OS.merge(timer2);
OS.merge(timer3);


//split the streams
const ONTick            = OS.filter(item => ( item.type===TICK ));          // Split the main event stream into only TICK  events
const ONHover           = OS.filter(item => ( item.type===HOVER));          // Split the main event stream into only HOVER events

const ONSampledHover    = ONHover.pipe(sample(timer2));                     // create an event stream that only fires the last HOVER event since timer2 TICKed







/**
//========================================================================================================================================================================================
//=============== Set up the subscriptions ===============================================================================================================================================
//========================================================================================================================================================================================
                                                                                                                                                                                                        */
$(document).ready( () => {



    OS.subscribe( item => $(`#total-events`).text(parseInt($(`#total-events`).text()) + 1));                    // Subscription to update the total events div every event

    ONTick.subscribe( item => $(`#timer${item.timerid} p`).text(item.ticks));                                   // Subscription to update the individual timers when they tick
    ONTick.subscribe( item => $(`#total-ticks`).text(parseInt($(`#total-ticks`).text()) + 1));                  // Subscription to update the total timer tick div on every tick

    ONHover.subscribe( item => $("#total-hovers").text(parseInt($("#total-hovers").text()) + 1));               // Subscription to update the total hovers div on every hover

    ONSampledHover.subscribe (hoverItem => $(`#${hoverItem.hoveredItem}`).toggleClass("hovered"));              // Subscription to toggle the total hovered class on a div when it is hovered, but throttled by a timer

    //whenever a hoverable div is hovered...
    $(".hoverable").hover( function(){
        console.log("hovering on ", $(this).attr("id"))
        //...dispatch a hover event in the ObservableStream
        OS.dispatch({
            type: HOVER,
            hoveredItem: $(this).attr("id")
        })

    });

});