[rxlogo]: http://reactivex.io/assets/Rx_Logo_S.png
[citysearch]: https://kanterjoe.github.io/rxjs_testing/city_search.html
[hoverhell]: https://kanterjoe.github.io/rxjs_testing/hover_hell.html
# ![][rxlogo] ReactiveX JS Testing 


I recently found the [ReactiveX](http://reactivex.io/) paradigm, and liked it's style. 

[ReactiveX GitHub](https://github.com/ReactiveX/rxjs)

[ReactiveX website](http://reactivex.io/) 


This repository contains some toy apps I have written to play around with it.

## ObserverStream Object

- AJAXObserverStream.js

This has some classes that allow for easier access and setup of Observer streams. They essentially wrap the Observer object and perform all the setup and teardown.


## City Search

- city_search.html
- city_search.js

The city search app is a simple example of using ReactiveX to mix DOM events and AJAX calls in a simple and functionally seperated manner

To use, open the HTML in the browser and enter a City name. Press enter and see the result pop up. Try finding a city where it is currently Hot out!
 
 [Open in Browser][citysearch]
 
 ## Hover Hell
 
 - hover_hell.html
 - hover_hell.js
 
 The Hover Hell app has divs to hover over and timers. 
 They all emit events into the same stream, and various subscribers are able to perform actions with them. 
  
 Because it is setup with RXJS, and all state data is stored in the DOM, there is no worry about crossing streams or anything. 
 
  [Open in Browser][hoverhell]

 