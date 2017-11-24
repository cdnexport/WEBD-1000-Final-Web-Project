//var mousedown = false;
function load(){
	createCanvas();

	//For the color sliders.
	var intervalId;
	var colorSliders = document.getElementsByClassName("colorSlider");
	for (var i = 0; i < colorSliders.length; i++) {
		colorSliders[i].addEventListener("mousedown",() => {
			intervalId = setInterval(() => {
				fillListBackground();
			}, 100);
		});
	}
	for (var i = 0; i < colorSliders.length; i++) {
		colorSliders[i].addEventListener("mouseup",() =>{
			clearInterval(intervalId);
		});
	}

	//For the canvas element.
	var mousedown=false;
	document.getElementById("paintCanvas").addEventListener("mousedown",()=>{
		console.log("TOO MANY");
		mousedown=true;
	});
	document.getElementById("paintCanvas").addEventListener("mousemove",(e)=>{
		let c = fillListBackground();
		mouseMoveHandler(e,mousedown,c,willErase);
	});
	document.getElementById("paintCanvas").addEventListener("mouseup",()=>{
		mousedown=false;
	});

	//for the eraser
	var willErase = false;
	document.getElementById("imageEraser").addEventListener("click",(e)=>{
		willErase = !willErase;
		setEraserBackground(e,willErase);
	});
}

//Creates the canvas and places it onto the page.
function createCanvas(){
	let canvas = document.createElement("canvas");
	canvas.id = "paintCanvas";
	canvas.width=606;
	canvas.height=507;
	let art = document.getElementById("articleCanvas");
	art.appendChild(canvas);
}

//Occurs when the eraser checkbox is pressed
function setEraserBackground(e,willErase){
	let li = document.getElementById("liEraser");
	if(willErase){
		li.style.backgroundColor = "grey";
	}
	else{
		li.style.backgroundColor = "coral";
	}
}

//Draws on the canvas element
function mouseMoveHandler(e,mousedown,color,willErase){
	let canvas = document.getElementById("paintCanvas");
	let ctx = canvas.getContext("2d");

	if(!mousedown){
		ctx.beginPath();
		ctx.moveTo(mouseX,mouseY);
	}
	if(mousedown){
		var mouseX = e.offsetX;
		var mouseY = e.offsetY;
		ctx.lineTo(mouseX,mouseY);
		let width = document.getElementById("selectSize").value;
		ctx.lineWidth = width;
		if(willErase){
			ctx.clearRect(mouseX,mouseY,width,width);
		}
		else{
			ctx.strokeStyle = color;
			ctx.stroke();
		}
	}
}
//Set the background color of the colorOptions list to the active slider color.
function fillListBackground(){

	let color = 'rgb('+document.getElementById("redRange").value+','+
		document.getElementById("greenRange").value+','+document.getElementById("blueRange").value+')';
	
	document.getElementById("colorOptionsList").style.background = color;
	return color;
}

document.addEventListener("DOMContentLoaded",load);