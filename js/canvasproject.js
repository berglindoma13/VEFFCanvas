/**
 * Created by Berglind on 23.1.2017.
 */

$(document).ready(function(){
    var canvas = document.getElementById("MyCanvas1");
    var context = canvas.getContext("2d");

    $("#MyCanvas1").mousedown(function(e){
        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;

        //Rectangle drawing
        context.fillStyle = "black";
        context.strokeRect(xCoord,yCoord,10,10);

        //line drawing
        context.beginPath();
        context.moveTo(xCoord,yCoord);
        context.lineTo(xCoord+10, yCoord+10);
        context.stroke();



    });
});

