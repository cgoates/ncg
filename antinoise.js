function antiNoise(theCtx,theStartX,theStartY,theWidth,theHeight,isGuide){
	
	/********************************************************************
	 * Declare the member variables										*
	 ********************************************************************/
	 
	this.context = theCtx;
	this.leftSide = theStartX;
	this.topSide = theStartY;
	this.width = theWidth;
	this.height = theHeight;
	this.noise = [];
	this.antinoise = [];
	this.reducednoise = [];
	this.showguide = isGuide;
	this.finished = false;
	
	if(this.showguide===undefined)
	{
		this.showguide = true;
	}
	
	
	
	/*******************************************************************
	 * Generate the noise function as a combination of two sine waves  *
	 *******************************************************************/
	this.init = function(){
		// Generate the values at which to evaluate the function
		var x0 = [];
		for(var i = 0;i<=this.width;i++)
		{
			x0.push(i*2/this.width);  
			// x runs from zero to 2 to create two periods in the width given
		}
		
		// Amplitudes of the two sine waves
		// Amplitudes can be negative
		// The lower frequency wave always has higher amplitude. The loop ensures this
		do {
			amp1 = Math.random()*140 - 70;
			amp2 = Math.random()*60 - 30;
		} while(Math.pow(amp1,2) < Math.pow(amp2,2));

		// Normalize the amplitudes so they fill a good portion of the space
		var norm = 0.35*(this.height)/Math.sqrt(Math.pow(amp1,2)+Math.pow(amp2,2));
		
		amp1 = amp1*norm;
		amp2 = amp2*norm;

		// Randomize the frequencies of the waves a little
		// The first varies between one and two
		var freq1 = Math.ceil(Math.random()*2);
		// The second varies between 3 and 5
		var freq2 = Math.ceil(Math.random()*3)+2;

		// Generate the actual noise signal
		this.noise = x0.map(function(num){
			return amp1*Math.sin(2*Math.PI*freq1*num) + amp2*Math.sin(2*Math.PI*freq2*num);
		});
	}
	
	/*******************************************************************
	 * Add an antinoise point function								   *
	 *******************************************************************/
	 
	this.addAnti = function(x,y){
		// if x isn't bigger than the biggest x already done, do nothing
		if(x<this.antinoise.length)
		{
			return false;
		}else if(x==this.antinoise.length)
		{ // if it's the next x, just add it on.
			this.antinoise.push(y);
			return true;
		}else{
			//we need to create a line
			
			// last known points
			if(this.antinoise.length == 0){
				x1 = 0; y1 = 0; // if there are none, start at mid-left
				this.antinoise.push(y1);
			}else{
				x1 = this.antinoise.length-1;
				y1 = this.antinoise[this.antinoise.length-1];
			}
			
			//define the line
			var slope = (y-y1)/(x-x1);
			var interc = y - slope*x;
			
			for(var i = x1+1; i <= x && i <= this.width; i++)
			{
				this.antinoise.push(slope*i+interc);
			}
			return "line";
		}
	}
	
	
	/*******************************************************************
	 * Draw the antiNoise lines	function							   *
	 *******************************************************************/
	
	this.draw = function(){
		
		var midheight = this.topSide+this.height/2;
		
		// draw the noise signal
		this.context.moveTo(this.leftSide,midheight);
		this.context.beginPath();
		this.context.strokeStyle = "#000000";
		for(var i = 0;i<this.noise.length;i++)
		{
			this.context.lineTo(this.leftSide+i,this.noise[i]+midheight);
		}
		this.context.stroke();

		// draw the guide if it is turned on
		if(this.showguide){
			this.context.beginPath();
			this.context.moveTo(this.leftSide,midheight);
			for(var i = 0;i<this.noise.length; i=i+10)
			{
				this.context.moveTo(this.leftSide+i,midheight-this.noise[i]);
				for(var j=0; j<5; j++)
				{
					this.context.lineTo(this.leftSide+i+j,midheight-this.noise[i+j]);
				}
			}
			this.context.strokeStyle = "#00AA55";
			this.context.stroke();
		}
		
		// draw the antinoise until it is finished
		if(!this.finished)
		{
			this.context.beginPath();
			this.context.moveTo(this.leftSide,midheight);
			this.context.beginPath();
			this.context.strokeStyle = "#FF0000";
			for(var i = 0;i<this.antinoise.length;i++)
			{
				this.context.lineTo(this.leftSide+i,this.antinoise[i]+midheight);
			}
			this.context.stroke();
		}

		// draw the midline
		this.context.beginPath();
		this.context.moveTo(this.leftSide+this.width,midheight);
		this.context.lineTo(this.leftSide,midheight);
		this.context.strokeStyle = "#AAAAAA";
		this.context.stroke();
	}
	
	
	this.init();
}