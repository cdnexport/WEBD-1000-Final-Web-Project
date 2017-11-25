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
		if(letDrop){
			letDrop = !letDrop;
			setDropperBackground(letDrop);
		}
		willErase = !willErase;
		setEraserBackground(willErase);
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
		if(willErase){
			willErase = !willErase;
			setEraserBackground(willErase)
		}
		letDrop = !letDrop;
		setDropperBackground(letDrop);
		
	});
	document.getElementById("paintCanvas").addEventListener("click",(e)=>{
		if(letDrop){
			getColor(e);
			letDrop = !letDrop;
			setCursor("./img/cursors/brushcursor.png");
		}
		setDropperBackground(letDrop);
	});

	//for the cursors
	document.getElementById("paintCanvas").addEventListener("mouseover", ()=>{
		if(letDrop){
			setCursor("./img/cursors/droppercursor.png");
		}
		else if(willErase){
			setCursor("./img/cursors/erasercursor.png");
		}
		else{
			setCursor("./img/cursors/brushcursor.png");
		}
	})
}

//Sets the cursor
function setCursor(cursor){
	document.getElementById("paintCanvas").style.cursor = "url("+cursor+"),auto";
}

//Occurs when the file chosen is changed
function handleFiles(files){
	document.getElementById("imgWebInvalid").style.display="none";
	let fileRegEx = new RegExp(/^.*\.(jpg|jpeg|ico|png)$/,'i')
	if (!fileRegEx.test(document.getElementById("imgWeb").value)){
		document.getElementById("imgWebInvalid").style.display="inline";
	}
	else{
		let img = new Image();
		img.src = window.URL.createObjectURL(files[0]);
		img.onload = () => {
			window.URL.revokeObjectURL(this.src);
		}
		drawImage(img);
	}
}

//Draws the image link to the canvas.
function drawImage(image){
	let canvas = document.getElementById("paintCanvas")
	let ctx = canvas.getContext("2d");
	let link = document.getElementById("imgWeb").value;

	image.onload = () =>{
		ctx.drawImage(image,0,0,canvas.width,canvas.height);
	}
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
	let color = 'rgb('+document.getElementById("redRange").value+','+
		document.getElementById("greenRange").value+','+document.getElementById("blueRange").value+')';
	
	document.getElementById("colorOptionsList").style.background = color;
	return color;
}

document.addEventListener("DOMContentLoaded",load);