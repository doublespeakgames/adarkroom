 node.addEventListener("touchmove", function(event){
    //only deal with one finger
    if(event.touches.length == 1){
    //get the information for finger #1
    var touch = event.touches[0],
    // find style object for the node the drag started from
    style = touch.target.style;
   // position the element under the touch point
   style.position = "absolute";
   style.left = touch.pageX + "px";
   style.top = touch.pageY + "px";
    }
}, false);   