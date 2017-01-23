/**
 * Created by Berglind on 23.1.2017.
 */

//To save, use json object. There is an api to call when saving or loading data

class Point{
    constructor(x,y){
        this.xCoord = x;
        this.yCoord = y;
    }

}

class Rectangle{
    constructor(x1,y2,x2,y2){
        this.topLeft = new Point(x1,y1);
        this.topRight = new Point(x2,y1);
        this.bottomLeft = new Point(x1,y2);
        this.bottomRight = new Point(x2,y2);
    }
}

var objectArray = [];

$(document).ready(function(){
    var canvas = document.getElementById("MyCanvas1");
    var context = canvas.getContext("2d");

    //default settings
    var nextObject = "Pen";
    var nextColor = "Black";

    var beginPoint;
    var isDrawing = false;

    $("#MyCanvas1").mousedown(function(e){
        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;

        beginPoint = new Point(xCoord,yCoord);
        isDrawing = true;

    });

    $("#MyCanvas1").mousemove(function(e){
       var xCoord = e.pageX - this.offsetLeft;
       var yCoord = e.pageY - this.offsetTop;

        var currentEnd = new Point(xCoord,yCoord);

        context.clearRect(0,0,500,500);

        if( isDrawing === true){
            //Rectangle drawing
            context.fillStyle = nextColor;
            var tmpRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,currentEnd.xCoord,currentEnd.yCoord);
            context.strokeRect(beginPoint.xCoord,beginPoint.yCoord,currentEnd.xCoord - beginPoint.xCoord,currentEnd.yCoord - beginPoint.yCoord);
            objectArray.push(tmpRect);
        }

        //line drawing
        /*context.beginPath();
        context.moveTo(current.xCoord,current.yCoord);
        context.lineTo(current.xCoord+10, current.yCoord+10);
        context.stroke();*/

        //circle drawing
        /*context.beginPath();
        context.arc(current.xCoord,current.yCoord,10,0,2*Math.PI,false);
        context.strokeStyle = "black";
        context.stroke();*/

        //text drawing
        /*context.strokeText("Text",current.xCoord,current.yCoord,10);
        //text calculating how much space a text needs
        context.measureText("Text");*/
    });

    $("#MyCanvas1").mouseup(function(e){
        isDrawing = false;
        //if (nextObject == "Rectangle"){}
    });
});

