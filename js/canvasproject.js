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

class Circle extends Shape{
    constructor(x,y,color, radius,lineWidth){
        super(x,y,color,lineWidth);
        this.radius = radius;
        this.type = "Circle";
    }

    draw(context){
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.arc(this.xCoord,this.yCoord,this.radius,0,2*Math.PI);
        context.strokeStyle = this.selectedColor;
        context.stroke();
    }

    inside(xpos, ypos){
        var distance = Math.sqrt((xpos-this.xCoord)*(xpos-this.xCoord) + (ypos-this.yCoord)*(ypos-this.yCoord));
        if (distance < this.radius){
            return true;
        }
        return false;
    }
}

class Point{
    constructor(x,y){
        this.xCoord = x;
        this.yCoord = y;
    }

}

class Rectangle extends Shape{
    constructor(x,y,width,height,color, lineWidth){
        super(x,y,color,lineWidth);
        this.width = width;
        this.height = height;
        this.type = "Rectangle";
    }

    draw(context){
        context.lineWidth=this.lineWidth;
        context.strokeStyle = this.selectedColor;
        context.strokeRect(this.xCoord,this.yCoord,this.width,this.height);
    }

    inside(xpos, ypos){
        var rightSide = this.xCoord + this.width;
        var bottomSide = this.yCoord + this.height;

        var xDistance = rightSide - this.xCoord;
        var yDistance = bottomSide - this.yCoord;


        var xPosDistance = rightSide - xpos;
        var yPosDistance = bottomSide - ypos;

        if((xPosDistance < xDistance) && (yPosDistance < yDistance) && (xPosDistance > 0) && (yPosDistance > 0)){
            return true;
        }
        return false;
    }
}

class Pen extends Shape{
    constructor(x,y,color,lineWidth){
        super(x,y,color,lineWidth);
        this.points = [];
        this.type = "Pen";
    }

    addToLine(p){
        this.points.push(p);
    }

    draw(context) {
        //draw for each two points in the points array for
        for(var i = 0; i < this.points.length - 1; i++){
            console.log("here");
            context.beginPath();
            context.lineWidth=this.lineWidth;
            context.strokeStyle = this.selectedColor;
            context.moveTo(this.points[i].xCoord,this.points[i].yCoord);
            context.lineTo(this.points[i+1].xCoord, this.points[i+1].yCoord);
            context.stroke();
        }
    }
}

class Line extends Shape{
    constructor(x,y,color, endX, endY,lineWidth){
        super(x,y,color,lineWidth);
        this.endPoint = new Point(endX,endY);
        this.type = "Line";
    }
    draw(context){
        context.beginPath();
        context.moveTo(this.xCoord,this.yCoord);
        context.lineWidth=this.lineWidth;
        context.strokeStyle = this.selectedColor;
        context.lineTo(this.endPoint.xCoord, this.endPoint.yCoord);
        context.stroke();
    }

    inside(xpos, ypos){

        var dxc = xpos - this.xCoord;
        var dyc = ypos - this.yCoord;

        var dxl = this.endPoint.xCoord - this.xCoord;
        var dyl = this.endPoint.yCoord - this.yCoord;

        var cross = dxc * dyl - dyc * dxl;

        if(cross !== 0){
            return false;
        }

        return true;

    }
}




class Text extends Shape{
    constructor(x,y,color,fontStyle,fontSize, sentence){
        super(x,y,color);
        this.fontStyle = fontStyle;
        this.fontSize = fontSize;
        this.sentence = sentence;
        this.textBox = new Rectangle(0,0,0,0,0,0);
        this.type = "Text";
    }

    draw(context){
        context.fillStyle = this.selectedColor;

        //create a virtual box around text to be able to drag and drop the item
        var textMeasurements = context.measureText(this.sentence);
        this.textBox.xCoord = this.xCoord;
        this.textBox.yCoord = this.yCoord - this.fontSize;
        this.textBox.width = textMeasurements.width;
        this.textBox.height = this.fontSize;
        this.textBox.selectedColor = "White";
        this.textBox.lineWidth = 1;

        var font = this.fontSize + "px" + " " + this.fontStyle;
        context.font = font;
        context.fillText(this.sentence,this.xCoord,this.yCoord);

    }

    inside(xpos, ypos){

        console.log(this.textBox);
        console.log(xpos);
        console.log(ypos);

        var rightSide = this.textBox.xCoord + this.textBox.width;
        var bottomSide = this.textBox.yCoord + this.textBox.height;

        var xDistance = rightSide - this.textBox.xCoord;
        var yDistance = bottomSide - this.textBox.yCoord;

        var xPosDistance = rightSide - xpos;
        var yPosDistance = bottomSide - ypos;


        if((xPosDistance < xDistance) && (yPosDistance < yDistance) && (xPosDistance > 0) && (yPosDistance > 0)){
            return true;
        }
        return false;
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
        lineWidth : "1",
        textSize : "10px",
        textFont : "sans-serif",
        isDragging : false,
        selectedObject : "",
        dragOffsetX : 0,
        dragOffsetY : 0
    };

    var context = settings.canvas.getContext("2d");

    var beginPoint;
    var currentPen;

    $("#colorpicker").spectrum({
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        move: function(tinycolor) { settings.nextColor = this.value;},
        hide: function(tinycolor) { settings.nextColor = this.value;}
    });

    $('#textSize').change(function(){
        settings.textSize = this.value;
    });

    $('#fontStyle').change(function(){
        settings.textFont = this.value;
    });

    $('#lineWidth').change(function(){
        settings.lineWidth = this.value;
    });


    $("#MyCanvas1").mousedown(function(e){
        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;

        beginPoint = new Point(xCoord,yCoord);
        settings.isDrawing = true;

        if(settings.nextObject === "Pen"){
            currentPen = new Pen(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor,settings.lineWidth);
        }
        else if(settings.nextObject === "Select"){
            var pos = new Point(xCoord, yCoord);
            selectMove(pos);
        }


    });

    $("#MyCanvas1").mousemove(function(e){
       var xCoord = e.pageX - this.offsetLeft;
       var yCoord = e.pageY - this.offsetTop;

       var currentEnd = new Point(xCoord,yCoord);

       context.clearRect(0,0,700,700);



       if( settings.isDrawing === true){
            if(settings.nextObject === "Rectangle"){
                var width = Math.abs(currentEnd.xCoord - beginPoint.xCoord);
                var height = Math.abs(currentEnd.yCoord - beginPoint.yCoord);
                var tmpRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,width,height, settings.nextColor,settings.lineWidth);
                tmpRect.draw(context);
            }
            else if(settings.nextObject === "Line"){
                var tmpLine = new Line(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, currentEnd.xCoord, currentEnd.yCoord,settings.lineWidth);
                tmpLine.draw(context);
            }
            else if(settings.nextObject === "Circle"){
                var deltaX = beginPoint.xCoord - currentEnd.xCoord;
                var deltaY = beginPoint.yCoord - currentEnd.yCoord;
                var radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                var tmpCircle = new Circle(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, radius,settings.lineWidth);
                tmpCircle.draw(context);
            }
            else if(settings.nextObject === "Pen"){
                currentPen.addToLine(currentEnd);
                currentPen.draw(context);
            }
            else if(settings.nextObject === "Select"){
                if(settings.isDragging){
                    settings.selectedObject.xCoord = currentEnd.xCoord - settings.dragOffsetX;
                    settings.selectedObject.yCoord = currentEnd.yCoord - settings.dragOffsetY;
                }
            }
        }
        drawCompleteCanvas();

    });

    $("#MyCanvas1").mouseup(function(e){
        settings.isDrawing = false;
        settings.isDragging = false;

        var xCoord = e.pageX - this.offsetLeft;
        var yCoord = e.pageY - this.offsetTop;
        var FinalEnd = new Point(xCoord,yCoord);

        if (settings.nextObject === "Rectangle"){
            var width = Math.abs(FinalEnd.xCoord - beginPoint.xCoord);
            var height = Math.abs(FinalEnd.yCoord - beginPoint.yCoord);
            var NewRect = new Rectangle(beginPoint.xCoord,beginPoint.yCoord,width,height, settings.nextColor,settings.lineWidth);
            objectArray.push(NewRect);
        }
        else if(settings.nextObject === "Line"){
            var newLine = new Line(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, FinalEnd.xCoord, FinalEnd.yCoord,settings.lineWidth);
            objectArray.push(newLine);
        }
        else if(settings.nextObject === "Circle"){
            //circle calculations
            var deltaX = beginPoint.xCoord - FinalEnd.xCoord;
            var deltaY = beginPoint.yCoord - FinalEnd.yCoord;
            var radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            var newCircle = new Circle(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor,radius,settings.lineWidth);
            objectArray.push(newCircle);
        }
        else if(settings.nextObject === "Pen"){
            objectArray.push(currentPen);
        }
        else if(settings.nextObject === "Text"){
            var scentence = document.getElementById("textarea").value;
            var newText = new Text(beginPoint.xCoord, beginPoint.yCoord, settings.nextColor, settings.textFont,settings.textSize, scentence);
            objectArray.push(newText);
        }
        drawCompleteCanvas();
    });

    function drawCompleteCanvas(){
        for(var i = 0; i < objectArray.length; i++){
            objectArray[i].draw(context);
        }
    }

    $('input:radio[title=options]').change(function() {
        settings.nextObject = this.value;
    });

    $("#savebutton").click(function(){
        var title = prompt("Please enter a title to save");
        var drawing = {
            title : title,
            content: objectArray
        };

        var url = "http://localhost:3000/api/drawings";

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: url,
            data: JSON.stringify(drawing),
            success: function (data) {
                alert("Your canvas has been saved");
            },
            error: function (xhr, err) {
                alert('Something went wrong, your draving could not be saved');
            }
        });
    });

    $('#loadbutton').click(function(){
        var title = prompt("Please enter the name of the canvas");
        var id = "";

        var url = "http://localhost:3000/api/drawings/";

        $.ajax({
            type : "GET",
            contentType: "application/json; charset=utf-8",
            url : url + title,
            success : function(data){
                var newArray = [];
                for(var i = 0; i < data.content.length; i++){
                    if(data.content[i].type === "Pen"){
                        var tmpPen = new Pen(data.content[i].xCoord, data.content[i].yCoord,data.content[i].selectedColor,data.content[i].lineWidth);
                        tmpPen.points = data.content[i].points;
                        newArray.push(tmpPen);
                    }
                    else if(data.content[i].type === "Rectangle"){
                        var tmpRect = new Rectangle(data.content[i].xCoord, data.content[i].yCoord, data.content[i].width, data.content[i].height, data.content[i].selectedColor, data.content[i].lineWidth);
                        newArray.push(tmpRect);
                    }
                    else if(data.content[i].type === "Circle"){
                        var tmpCircle = new Circle(data.content[i].xCoord,data.content[i].yCoord,data.content[i].selectedColor,data.content[i].radius, data.content[i].lineWidth);
                        newArray.push(tmpCircle);
                    }
                    else if(data.content[i].type === "Line"){
                        var tmpLine = new Line(data.content[i].xCoord, data.content[i].yCoord, data.content[i].selectedColor, data.content[i].endPoint.xCoord, data.content[i].endPoint.yCoord,data.content[i].lineWidth);
                        newArray.push(tmpLine);
                    }
                    else if(data.content[i].type === "Text"){
                        var tmpText = new Text(data.content[i].xCoord, data.content[i].yCoord, data.content[i].selectedColor, data.content[i].fontStyle, data.content[i].fontSize, data.content[i].sentence);
                        tmpText.textBox = data.content[i].textBox;
                        newArray.push(tmpText);
                    }

                }
                objectArray = newArray;
                context.clearRect(0,0,700,700);
                drawCompleteCanvas();
            }
       })
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

        for(var i = 0; i < objectArray.length; i++){
            if(objectArray[i].inside(pos.xCoord, pos.yCoord)){
              var mySelection = objectArray[i];
                settings.dragOffsetX = pos.xCoord - mySelection.xCoord;
                settings.dragOffsetY = pos.yCoord - mySelection.yCoord;
                settings.isDragging = true;
                settings.selectedObject = mySelection;
                return;
            }
        }
    }

});

