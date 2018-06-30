

let AJAXObserverStream =   function () {
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
    const _dispatch = function (url, parameters) {
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


        subscribe: _subscribe,
        dispatch : _dispatch,
        pipe     : _pipe,
    }

};

/*
const AJAXObserver = Observable.create(
    CITYLOOKUP.observerCreator
);

const AJAXStream = AJAXObserver.pipe(publish())
 */