/**
 * Created by Berglind on 23.1.2017.
 */

//To save, use json object. There is an api to call when saving or loading data
class Shape{
    constructor(x,y,color, lineWidth){
        this.xCoord = x;
        this.yCoord = y;
        this.selectedColor = color;
        this.lineWidth = lineWidth;
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
        context.strokeStyle = this.selectedColor;
        context.strokeRect(this.bottomLeft.xCoord,this.yCoord,this.topRight.xCoord - this.xCoord,this.bottomRight.yCoord - this.yCoord);
    }
}

class Pen extends Shape{
    constructor(x,y,color){
        super(x,y,color);
        this.points = [];
    }

    addToLine(p){
        this.points.push(p);
    }

    draw(context) {
        //draw for each two points in the points array for
        for(var i = 0; i < this.points.length - 1; i++){
            context.beginPath();
            context.strokeStyle = this.selectedColor;
            context.moveTo(this.points[i].xCoord,this.points[i].yCoord);
            context.lineTo(this.points[i+1].xCoord, this.points[i+1].yCoord);
            context.stroke();
        }
    }
}

class Line extends Shape{
    constructor(x,y,color, endX, endY){
        super(x,y,color);
        this.endPoint = new Point(endX,endY);
    }
    draw(context){
        context.beginPath();
         context.moveTo(this.xCoord,this.yCoord);
         context.strokeStyle = this.selectedColor;
         context.lineTo(this.endPoint.xCoord, this.endPoint.yCoord);
         context.stroke();
    }
}


class Circle extends Shape{
    constructor(x,y,color, radius){
        super(x,y,color);
        this.radius = radius;
    }

    draw(context){
        context.beginPath();
        context.arc(this.xCoord,this.yCoord,this.radius,0,2*Math.PI);
        context.strokeStyle = this.selectedColor;
        context.stroke();
    }
}

class Text extends Shape{
    constructor(x,y,color,font, sentence){
        super(x,y,color);
        this.font = font;
        this.sentence = sentence;
    }

    draw(context){
        context.fillStyle = this.selectedColor;
        context.font = this.font;
        context.fillText(this.sentence,this.xCoord,this.yCoord);
    }
}


var objectArray = [];
var undoneObject = [];


$(document).ready(function(){

    var settings = {
        canvas : document.getElementById("MyCanvas1"),
        nextObject : "Pen",
        nextColor : "Black",
        isDrawing : false,
        lineWidth : "1px",
        textSize : "10px",
        textFont : "sans-serif"
    };

    var context = settings.canvas.getContext("2d");

    var beginPoint;
    var currentPen;


    $("#MyCanvas1").mousedown(function(e){
        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;

        beginPoint = new Point(xCoord,yCoord);
        settings.isDrawing = true;

        if(settings.nextObject == "Pen"){
            currentPen = new Pen(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor);
        }
        else if(settings.nextObject === "Select"){
            var pos = new Point(xCoord, yCoord);
            for(var i = 0; i < objectArray.length; i++){
                if(objectArray[i].xCoord == pos.xCoord){
                    console.log(objectArray[i]);
                }
            }
            //selectMove(pos);
        }


    });

    $("#MyCanvas1").mousemove(function(e){
       var xCoord = e.pageX - this.offsetLeft;
       var yCoord = e.pageY - this.offsetTop;

       var currentEnd = new Point(xCoord,yCoord);

       context.clearRect(0,0,700,700);

       var deltaX = 1;//beginPoint.xCoord;// - currentEnd.xCoord;
       var deltaY = 1;//beginPoint.yCoord;// - currentEnd.yCoord;

       if( settings.isDrawing === true){
            if(settings.nextObject == "Rectangle"){
                var tmpRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,currentEnd.xCoord,currentEnd.yCoord, settings.nextColor);
                tmpRect.draw(context);
            }
            else if(settings.nextObject == "Line"){
                var tmpLine = new Line(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, currentEnd.xCoord, currentEnd.yCoord);
                tmpLine.draw(context);
            }
            else if(settings.nextObject == "Circle"){
                var radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                var tmpCircle = new Circle(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, radius);
                tmpCircle.draw(context);
            }
            else if(settings.nextObject == "Pen"){
                currentPen.addToLine(currentEnd);
                currentPen.draw(context);
            }
        }
        drawCompleteCanvas();

    });

    $("#MyCanvas1").mouseup(function(e){
        settings.isDrawing = false;

        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;
        var FinalEnd = new Point(xCoord,yCoord);

        //circle calculations
        var deltaX = beginPoint.xCoord - FinalEnd.xCoord;
        var deltaY = beginPoint.yCoord - FinalEnd.yCoord;

        //var Image = settings.canvas.toDataURL();
        //document.getElementById('canvasImg').src = Image;

        if (settings.nextObject === "Rectangle"){
            var NewRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,FinalEnd.xCoord,FinalEnd.yCoord, settings.nextColor);
            objectArray.push(NewRect);
        }
        else if(settings.nextObject === "Line"){
            var newLine = new Line(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, FinalEnd.xCoord, FinalEnd.yCoord);
            objectArray.push(newLine);
        }
        else if(settings.nextObject === "Circle"){
            var radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var newCircle = new Circle(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor,radius);
            objectArray.push(newCircle);
        }
        else if(settings.nextObject === "Pen"){
            objectArray.push(currentPen);
        }
        else if(settings.nextObject === "Text"){
            var scentence = document.getElementById("textarea").value;
            var font = settings.textSize + " " + settings.textFont;
            var newText = new Text(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, font, scentence);
            objectArray.push(newText);
        }
    });

    function drawCompleteCanvas(){
        for(var i = 0; i < objectArray.length; i++){
            objectArray[i].draw(context);
        }
    }

    $('input:radio[title=options]').change(function() {
        settings.nextObject = this.value;
    });

   $("#colorpicker").spectrum({
	    preferredFormat: "hex",
	    showInput: true,
	    showPalette: true,
		move: function(tinycolor) { settings.nextColor = this.value;},
	    hide: function(tinycolor) { settings.nextColor = this.value;},
	});

    $('#textSize').change(function(){
        settings.textSize = this.value;
    });

    $('#fontStyle').change(function(){
        settings.textFont = this.value;
    });

    document.getElementById("undobutton").onclick = function(){undo()};
    document.getElementById("redobutton").onclick = function(){redo()};


    function undo(){
        if(objectArray.length > 0){
            undoneObject.push(objectArray.pop());
            context.clearRect(0,0,700,700);
            drawCompleteCanvas();
        }
    }

    function redo(){
        if(undoneObject.length > 0){
            objectArray.push(undoneObject.pop());
            context.clearRect(0,0,700,700);
            drawCompleteCanvas();
        }

    }
  
    function selectMove(pos){
        $("#MyCanvas1").mousemove(function(e){
            //console.log(pos);

        });
    }

});

