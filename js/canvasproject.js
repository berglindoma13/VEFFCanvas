/**
 * Created by Berglind on 23.1.2017.
 */

//To save, use json object. There is an api to call when saving or loading data
class Shape{
    constructor(x,y,color){
        this.xCoord = x;
        this.yCoord = y;
        this.selectedColor = color;
    }
}


class Point{
    constructor(x,y){
        this.xCoord = x;
        this.yCoord = y;
    }

}

class Rectangle extends Shape{
    constructor(x1,y1,x2,y2,color){
        super(x1,y1,color);
        this.topRight = new Point(x2,y1);
        this.bottomLeft = new Point(x1,y2);
        this.bottomRight = new Point(x2,y2);
    }

    draw(context){
        context.strokeRect(this.bottomLeft.xCoord,this.yCoord,this.topRight.xCoord - this.xCoord,this.bottomRight.yCoord - this.yCoord);

    }
}

class Pen extends Shape{
    constructor(x,y,color){
        super(x,y,color);
    }

    //line drawing
    //draw for each two points in the points array for
    /*context.beginPath();
     context.moveTo(current.xCoord,current.yCoord);
     context.lineTo(current.xCoord+10, current.yCoord+10);
     context.stroke();*/
}

class Line extends Shape{
    constructor(x,y,color){
        super(x,y,color);
    }
    //line drawing
    /*context.beginPath();
     context.moveTo(current.xCoord,current.yCoord);
     context.lineTo(current.xCoord+10, current.yCoord+10);
     context.stroke();*/
}

class Circle extends Shape{
    constructor(x,y,color){
        super(x,y,color);
    }

    //circle drawing
    /*context.beginPath();
     context.arc(current.xCoord,current.yCoord,10,0,2*Math.PI,false);
     context.strokeStyle = "black";
     context.stroke();*/
}

class Text{
    //Attributes: Font, FontSize
    //text drawing
    /*context.strokeText("Text",current.xCoord,current.yCoord,10);
     //text calculating how much space a text needs
     context.measureText("Text");*/
}


var objectArray = [];

$(document).ready(function(){

    var settings = {
        canvas : document.getElementById("MyCanvas1"),
        nextObject : "Pen",
        nextColor : "Black",
        isDrawing : false

    };

    var context = settings.canvas.getContext("2d");

    var beginPoint;


    $("#MyCanvas1").mousedown(function(e){
        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;

        beginPoint = new Point(xCoord,yCoord);
        settings.isDrawing = true;

    });

    $("#MyCanvas1").mousemove(function(e){
       var xCoord = e.pageX - this.offsetLeft;
       var yCoord = e.pageY - this.offsetTop;

        var currentEnd = new Point(xCoord,yCoord);

        context.clearRect(0,0,500,500);

        if( isDrawing === true){
            //Rectangle drawing
            context.fillStyle = settings.nextColor;
            var tmpRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,currentEnd.xCoord,currentEnd.yCoord);
            objectArray.push(tmpRect);
            tmpRect.draw(context);  
        }

    });

    $("#MyCanvas1").mouseup(function(e){
        settings.isDrawing = false;

        var Image = settings.canvas.toDataURL();
        document.getElementById('canvasImg').src = Image;

        //if (nextObject == "Rectangle"){}
    });

    function drawCompleteCanvas(){
        context.clearRect(0,0,500,500);
        for(var i = 0; i < objectArray.length; i++){
            console.log(objectArray[i]);
        }
    }
});

