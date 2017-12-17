//Adds all of the event listeners
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
		if(!letDrop && !drawLine){
			mousedown=true;
		}
	});
	document.getElementById("paintCanvas").addEventListener("mousemove",(e)=>{
		let c = getPaintColor();
		mouseMoveHandler(e,mousedown,c,willErase);
	});
	document.addEventListener("mouseup",()=>{
		mousedown=false;
	});

	//For the reset button.
	document.getElementById("btnReset").addEventListener("click",()=>{
		willErase = false;
		letDrop = false;
		drawLine = false;
		setIconBackground(imgEraser, willErase);
		setIconBackground(imgDropper, letDrop);
		setIconBackground(imgLine, drawLine);

		resetCanvas();
	});

	//for the eraser.
	var willErase = false;
	var imgEraser = document.getElementById("imageEraser")
	imgEraser.addEventListener("click",()=>{
		if(letDrop || drawLine){
			letDrop = false;
			setIconBackground(imgDropper, letDrop);
			drawLine = false;
			setIconBackground(imgLine, drawLine);
		}
		willErase = !willErase;
		setIconBackground(imgEraser, willErase);
	});

	//For the dropper.
	var letDrop = false;
	var imgDropper = document.getElementById("imgDropper")
	imgDropper.addEventListener("click",(e)=>{
		if(willErase || drawLine){
			willErase = false;
			setIconBackground(imgEraser,willErase)
			drawLine = false;
			setIconBackground(imgLine, drawLine);
		}
		letDrop = !letDrop;
		setIconBackground(imgDropper, letDrop);
		
	});

	//Handling clicks on the canvas.
	let clicks = 0;
	document.getElementById("paintCanvas").addEventListener("click",(e)=>{
		if(letDrop){
			getColor(e);
			letDrop = !letDrop;
			setCursor("./img/cursors/brushcursor.png");
			setIconBackground(imgDropper, letDrop);
		}
		if(drawLine){
			if(clicks  %2 == 0){
				prevDot = [e.offsetX, e.offsetY];
			}
			else{
				nextDot = [e.offsetX, e.offsetY];
				makeLine(prevDot,nextDot);
			}
			clicks += 1;
		}
		else{
			clicks = 0;
		}
	});

	//For the line maker.
	var drawLine = false;
	var imgLine = document.getElementById("imgLine");
	var prevDot;
	var nextDot;
	imgLine.addEventListener("click", (e) =>{
		if(willErase || letDrop){
			willErase = false;
			setIconBackground(imgEraser,willErase);
			letDrop = false;
			setIconBackground(imgDropper, letDrop);
		}
		clicks = 0;
		prevDot = null;
		drawLine = !drawLine;
		setIconBackground(imgLine, drawLine);
		
	});

	//for the cursors
	document.getElementById("paintCanvas").addEventListener("mouseover", ()=>{
		if(letDrop){
			setCursor("./img/cursors/droppercursor.png");
		}
		else if(willErase){
			setCursor("./img/cursors/erasercursor.png");
		}
		else if(drawLine){
			setCursor("./img/cursors/linecursor.png");
		}
		else{
			setCursor("./img/cursors/brushcursor.png");
		}
	});
}

/*Draws a straight line on the canvas from prevDot[x,y] to nextDot[x,y]
*
* param prevDot The location of the first click.
* param nextDot The location of the second click.
*/
function makeLine(prevDot,nextDot){
	let canvas = document.getElementById("paintCanvas")
	let ctx = canvas.getContext("2d");

	ctx.moveTo(prevDot[0], prevDot[1]);
	ctx.lineTo(nextDot[0], nextDot[1]);
	ctx.lineWidth = document.getElementById("selectSize").value;
	ctx.strokeStyle = getPaintColor();
	ctx.stroke();
}

/* Sets the cursor to the selected option.
* 
* param cursor The image url that needs to be set as the cursor.
*/
function setCursor(cursor){
	document.getElementById("paintCanvas").style.cursor = "url("+cursor+"),auto";
}

/* Occurs when the file chosen is changed. Constructs an image objec that the canvas can draw.
*
* param files The image that the user wants drawn on the canvas.
*/
function handleFiles(files){
	document.getElementById("imgFileInvalid").style.display="none";
	let fileRegEx = new RegExp(/^.*\.(jpg|jpeg|ico|png|gif)$/,'i')
	if (!fileRegEx.test(document.getElementById("imgFile").value)){
		document.getElementById("imgFileInvalid").style.display="inline";
	}
	else{
		let img = new Image();
		img.src = window.URL.createObjectURL(files[0]);
		img.onload = () => {
			window.URL.revokeObjectURL(this.src);
		}

		let canvas = document.getElementById("paintCanvas")
		let ctx = canvas.getContext("2d");

		img.onload = () =>{
			ctx.drawImage(img,0,0,canvas.width,canvas.height);
		}
	}
}

/* Sets the background of the icons to indicate if they are the active option.
*
* param element The icon that needs it's background updated.
* param flag Boolean of whether the icon should appear enabled or disabled.
*/
function setIconBackground(element, flag){
	let aside = document.getElementsByClassName("paintControls")[0];
	let imgIcons = aside.getElementsByTagName("img");

	for (var i = 0; i < imgIcons.length; i++) {
		if(element.id == imgIcons[i].id && flag){
			element.style.backgroundColor = "grey";
		}
		else{
			imgIcons[i].style.backgroundColor = "coral";
		}
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
	document.getElementById("imgFileInvalid").style.display="none";
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

/* Draws on the canvas element
*
* param mousedown Whether a mousee button is held down.
* param color The RGB value that the line's color should be.
* param willErase Whether it should be erasing.
*/
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
			ctx.strokeStyle = "rgb(255,255,255)";
		}
		else{
			ctx.strokeStyle = color;
		}
		ctx.stroke();
	}
}
//Set the background color of the colorOptions list to the active slider color.
function fillListBackground(){
	document.getElementById("colorOptionsList").style.background = getPaintColor();
}

//Gets the active color for painting
function getPaintColor(){
	let color = 'rgb('+document.getElementById("redRange").value+','+
		document.getElementById("greenRange").value+','+document.getElementById("blueRange").value+')';
	return color;
}
document.addEventListener("DOMContentLoaded",load);
