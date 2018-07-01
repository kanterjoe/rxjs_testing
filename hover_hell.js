const HOVER = "hover";

let OS = new ObserverStream();


const ONHover = OS.filter(item => (item.type===HOVER));

ONHover.subscribe( item =>console.log(item)

);

$(document).ready( () => {
    $(".hoverable").hover( function(){
        console.log("hovering on ", $(this).attr("id"))

        OS.dispatch({
            type: HOVER,
            hoveredItem: $(this).attr("id")
        })

    });

});