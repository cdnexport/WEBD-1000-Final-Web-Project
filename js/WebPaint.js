//var mousedown = false;
function load(){
	createCanvas();
	fillListBackground();
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
		if(!letDrop){
			mousedown=true;
		}
	});
	document.getElementById("paintCanvas").addEventListener("mousemove",(e)=>{
		let c = fillListBackground();
		mouseMoveHandler(e,mousedown,c,willErase);
	});
	document.getElementById("paintCanvas").addEventListener("mouseup",()=>{
		mousedown=false;
	});

	//for the eraser.
	var willErase = false;
	document.getElementById("imageEraser").addEventListener("click",()=>{
		if(!letDrop){
			willErase = !willErase;
			setEraserBackground(willErase);
		}
	});

	//For the reset button.
	document.getElementById("btnReset").addEventListener("click",()=>{
		willErase = false;
		letDrop = false;
		setEraserBackground(willErase);
		setDropperBackground(letDrop);

		resetCanvas();
	});

	//For the dropper.
	var letDrop = false;
	document.getElementById("imgDropper").addEventListener("click",(e)=>{
		if(!willErase){
			letDrop = !letDrop;
			setDropperBackground(letDrop);
		}
	});
	document.getElementById("paintCanvas").addEventListener("click",(e)=>{
		if(letDrop){
			getColor(e);
			letDrop = !letDrop;
		}
		setDropperBackground(letDrop);
	});

	//For the image from the web
	document.getElementById("btnImgWeb").addEventListener("click",(e)=>{
		console.log("CLICK");
		if(imageLinkHasErrors()){
			e.preventDefault();
			console.log("PREVENT");
		}
		else{
			drawImage();
			document.getElementById("imgWeb").value = "";
		}
	});
}

//Draws the image link to the canvas.
function drawImage(){
	let canvas = document.getElementById("paintCanvas")
	let ctx = canvas.getContext("2d");
	let link = document.getElementById("imgWeb").value;

	let image = new Image();
	image.src = link;
	image.crossorigin = "anonymous";
	image.onload = () =>{
		ctx.drawImage(image,0,0,canvas.width,canvas.height);
	}
	console.log("VALUE" +link);
	//https://www.smashingmagazine.com/wp-content/uploads/2015/06/10-dithering-opt.jpg
}

//Checks the web image text box for errors.
function imageLinkHasErrors(){
	document.getElementById("imgWebError").style.display = "none";
	document.getElementById("imgWebInvalid").style.display = "none";

	let link = document.getElementById("imgWeb").value;
	let hasError = false;
	let linkRegEx = new RegExp(/^https:\/\/.*\.(jpg|png|jpeg)$/,'i');

	console.log(link);
	if(!link){
		if(!hasError){
			console.log("no value");
			document.getElementById("imgWebError").style.display = "inline";
			hasError = true;
		}
	}
	if(!linkRegEx.test(link)){
		if(!hasError){
			document.getElementById("imgWebInvalid").style.display = "inline";
			hasError = true;
		}
	}
	return hasError;
}

//Sets the background color for the dropper image.
function setDropperBackground(letDrop){
	if(letDrop){
		document.getElementById("imgDropper").style.backgroundColor = "grey";
	}
	else{
		document.getElementById("imgDropper").style.backgroundColor = "coral";
	}
}

//Gets the color the mouse has clicked on.
function getColor(e){
	let canvas = document.getElementById("paintCanvas")
	let ctx = canvas.getContext("2d");
	let mouseX = e.offsetX;
	let mouseY = e.offsetY;

	let colorData = ctx.getImageData(mouseX,mouseY,1,1).data;
	if(colorData[3]==0){
		document.getElementById("redRange").value = 255;
		document.getElementById("greenRange").value = 255;
		document.getElementById("blueRange").value = 255;
	}
	else{
		document.getElementById("redRange").value = colorData[0];
		document.getElementById("greenRange").value = colorData[1];
		document.getElementById("blueRange").value = colorData[2];
	}

	fillListBackground();
}

//Resets the canvas to empty
function resetCanvas(){
	let canvas = document.getElementById("paintCanvas")
	let ctx = canvas.getContext("2d");
	if(ctx){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
}
//Creates the canvas and places it onto the page.
function createCanvas(){
	let canvas = document.createElement("canvas");
	canvas.id = "paintCanvas";
	canvas.width=605;
	canvas.height=551;
	let art = document.getElementById("articleCanvas");
	art.appendChild(canvas);
}

//Occurs when the eraser checkbox is pressed
function setEraserBackground(willErase){
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