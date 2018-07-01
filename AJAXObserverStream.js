/* !~Must have rxjs installed to work [https://rxjs-dev.firebaseapp.com/]~!
 *
 * The Observer Stream object creates a stream of observable items.
 *
 * It is essentially a wrapper around the RX Observable class that saves the observable internally so I don't have to remember the exact syntax.
 *
 * It is meant to be extended, but works standalone as well:
 *
 *
 * const OS = new ObserverStream()
 * OS.subscribe( val => console.log(val)) //set up a simple consumer that just logs all items
 *
 * OS.dispatch(observer=> {
 *  observer.next(1); //dispatch a 1
 *  observer.next(2); //dispatch a 2
 *  observer.next(3); //dispatch a 3
 * });
*/

const throwError = err => {
    throw err;
};

class ObserverStream  {
    //_observer = false;
    constructor() {
        const {publish, filter} = rxjs.operators;
        const { Observable } = rxjs;

        this._observer =false;

        //when creating creating an Observable, we need to pass a function that receives an observer.
        //For this class, we just save that observer so we can dispatch on it at an arbitrary time (or, throw an error if for some reason this is getting recreated)
        const _observerCreator = observer => (this._observer? throwError("Attempt to overwrite observer") : this._observer = observer);

        const _observable       = Observable.create(_observerCreator);      // create the  observable
        this._publishedStream  = _observable.pipe(publish());               // publish the stream so that it can be subscribed to multiple times

        this._publishedStream.connect();                                    // if you don't connect the stream, it can't receive events


        //Set up some public functions
        //this.filter  = filterFunc    => this.pipe(filter(filterFunc));
        this.split = this.pipe
    }


    destroy() {
        return this._observer.complete();
    }

    subscribe   (onNext, onError, onComplete) {
        return this._publishedStream.subscribe(onNext, onError, onComplete);
    };
    //to send a dispatch, call dispatch with a function that receives the observer.
    dispatch  (item) {
        if (typeof item === "object" && item.hasOwnProperty("type")) return this._observer.next(item);
        else if (typeof item==="function") return item(this._observer);
        else {
            throwError("Cannot dispatch item.");
        }
    };
    // call pipe with arbitrary arguments, it will just pass it along
    pipe () {
        return this._publishedStream.pipe.apply(this._publishedStream, arguments);
    };
    filter (filterFunc) {
        return this.pipe(rxjs.operators.filter(filterFunc));
    };
    //allow another observable to push events into this observable

    merge (OtherObservable) {
        OtherObservable.subscribe(
            item => {this._observer.next(item)},
            err => {this._observer.error(err)},
            comp => {this._observer.error(err)}
        )

    }



}
 /*
 * To use this, instantiate with no parameters.
 *      const City_search = new AJAXObserverStream();
 *
 * use the dispatch method to send a fetch:
 *      City_search.dispatch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`, params)
 *
 * To subscribe to events:
 *      City_search.subscribe(
 *          val=> console.log("Fetch Complete for ", val.name, ": ", val),
 *          err=>console.error("gots an error:",err)
 *      );
 *
 * @constructor
 * @method subscribe (onNext, onError, onComplete) => adds a subscription to the observer
 *
 */

class AJAXObserverStream extends ObserverStream {

    dispatch (url, parameters) {
        console.log("Dispatching with: ", url, parameters)
        super.dispatch( (observer) => {

            return fetch(url, parameters)
                .then( HTTP_response => HTTP_response.json() )
                .then( JSON_response => observer.next(JSON_response))
            //.catch( err=> observer.error(err));

        })

    }
}












/*
let AJAXObserverStream = function () {
    const {publish, filter} = rxjs.operators;
    const { Observable } = rxjs;

    let _observer;

    const _observerCreator = function ( observer ) {
        if (!_observer) _observer = observer;
        else console.error("Attempting to overwrite observer")
    };
    const _destroy = function () {
        _observer.complete();
    };
    const _subscribe = function (onNext, onError, onComplete) {
        return _publishedStream.subscribe(onNext, onError, onComplete);
    };
    const _dispatch = function (url, parameters) { //sends an HTTP fetch request and attaches it to the observable
        return fetch(url, parameters)
            .then( HTTP_response => HTTP_response.json() )
            .then( JSON_response => _observer.next(JSON_response))
            .catch( err=> _observer.error(err));
    };
    const _pipe = function() { //replicates the _pipe function so we can fork the observable
        return _publishedStream.pipe.apply(_publishedStream, arguments);
    };
    const _observable = Observable.create(_observerCreator);
    const _publishedStream = _observable.pipe(publish());

    _publishedStream.connect();

    return {
        observerCreator: _observerCreator,
        destroy: _destroy,


        subscribe   : _subscribe,
        dispatch    : _dispatch,
        pipe        : _pipe,
        split       : _pipe,
    }

};
*/