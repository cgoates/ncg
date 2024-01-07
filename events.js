var drag = false;

var rect = canvas.getBoundingClientRect();

var latestScore = new Score([1,1,1],[1,1,1]);

var highScore = new Score([1,1,1],[1,1,1]);

window.addEventListener("resize",function(){
	rect = canvas.getBoundingClientRect();
});

window.addEventListener("orientationchange",function(){
	rect = canvas.getBoundingClientRect();
});

window.addEventListener("scroll",function(){
	rect = canvas.getBoundingClientRect();
});

function trueLoc(mouseX,mouseY)
{
	rect = canvas.getBoundingClientRect();
	trueX = (mouseX - rect.left) * canvas.width / rect.width - anti.leftSide;
	trueY = (mouseY - rect.top) * canvas.height / rect.height - anti.topSide;
	return {x:trueX,  y:trueY}
}

function mMove(mouseX,mouseY){
	
	if(mouseX >= 0 && mouseX <= anti.width+10
		&& mouseY >= 0 && mouseY < anti.height)
	{
		anti.addAnti(mouseX,mouseY - anti.height/2);
	}else
		drag = false;
	
	if(anti.antinoise.length==anti.noise.length&&!over) // end of game
	{
		for(i=0;i<anti.noise.length;i++)
			anti.reducednoise[i] = anti.noise[i]+anti.antinoise[i];
		
		latestScore = new Score(anti.noise,anti.reducednoise);
		console.log(latestScore.dB + " dB");
		
		if(latestScore.dB > highScore.dB)
		{
			highScore = latestScore;
			document.getElementById("highscore").innerHTML = highScore.dB + " dB";
		}
		
		
		anti.noise = anti.reducednoise;
		over = true;
		anti.finished = true;
		anti.showguide = false;
	}
	
	draw();
}

canvas.addEventListener("mousemove",function(e){
	
	if(drag)
	{
		loc = trueLoc(e.clientX,e.clientY);
		mMove(loc.x,loc.y);
	}

},false);

canvas.addEventListener("touchmove",function(e){

	e.preventDefault();
	
	//mouseX = (e.touches[0].pageX - rect.left) * canvas.width / rect.width - anti.leftSide;
	//mouseY = (e.touches[0].pageY - rect.top) * canvas.height / rect.height - anti.topSide;
	
	loc = trueLoc(e.touches[0].clientX,e.touches[0].clientY);

	mMove(loc.x,loc.y);
},false);

canvas.addEventListener("mousedown",function(e){
	
	e.preventDefault();
	drag = true;
	
	//mouseX = (e.pageX - rect.left) * canvas.width / rect.width - anti.leftSide;
	//mouseY = (e.pageY - rect.top) * canvas.height / rect.height - anti.topSide;

	loc = trueLoc(e.clientX,e.clientY);
	mMove(loc.x,loc.y);

},false);


canvas.addEventListener("mouseup",function(){drag = false;},false);


function newAntiGame()
{
	check = document.getElementById('showguide').checked;
	anti = new antiNoise(ctx,50,0,600,250,check);
	rect = canvas.getBoundingClientRect();
	over=false;
	draw();
}

function guideCheckbox()
{
	if(!over)
	{
		anti.showguide = !anti.showguide;
	}
	
	draw();
}