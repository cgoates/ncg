function Score(noise,reducednoise)
{
	function RMS(signal){
		s2 = signal.map(function(num){
			return Math.pow(num,2);
		});
		
		var sum = 0;
		
		for(var i = 0; i<s2.length; i++)
			sum += s2[i];
			
		var ms = sum / signal.length;
		
		return Math.sqrt(ms);
	}
	
	function decibel(prms,pref)
	{
		if(pref==undefined)
			pref = 1;
		return Math.round(10*20*Math.log10(prms/pref))/10;
	}
	
	this.dB = decibel(RMS(noise),RMS(reducednoise));
	
	this.draw = function(ctx,winWidth,winHeight)
	{
		ctx.fillStyle = "rgba(230,230,230,.9)";
		ctx.rect(winWidth/2 - 70,winHeight/2 - 50,140,50);
		ctx.fill();
		ctx.font = "30px Comic Sans MS";
		
		// score-sensitive color
		if(this.dB <= 0)
			ctx.fillStyle = "#FF0000";
		else if(this.dB <= 3)
			ctx.fillStyle = "#FF8000";
		else if(this.dB <= 10)
			ctx.fillStyle = "#AADD00";
		else
			ctx.fillStyle = "#00BB00";
		
		ctx.textAlign = "center";
		ctx.fillText(latestScore.dB + " dB", winWidth/2, winHeight/2 - 12);
	}
}	