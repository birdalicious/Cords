class CordDrawing extends ImageHandler {
	constructor(args) {
		//Create object if one wasn't passed
		if(!args) {
			args = {};
		}

		//Defaults for the imagehandler class
		args.src = args.src || "example.png";
		args.sampling = args.sampling || 1;

		super(args.src, args.sampling);

		//Set default values or get them args object
		this.src = args.src;
		this.sampling = Math.floor(args.sampling);
		this.nbPegs  = Math.floor(args.pegs) || 500;
		this.lines = Math.floor(args.lines) || 2750;
		this.weight = args.weight || 0.16;

		this.diameter = args.diameter || -1;

		if(args.createCanvas === undefined) {
			this.createCanvas = true;
		} else {
			this.createCanvas = args.createCanvas;
		}
	}

	setup() {
		super.setup();

		this.counter = 0;

		if(this.diameter == -1) {
			this.diameter = this.width;
		}
		this.scale = this.diameter/this.width;

		if(this.createCanvas) {
			createCanvas(this.diameter, this.diameter);
		}

		//Create pegs
		this.pegs = [];
		let dTheta = 2*Math.PI/this.nbPegs;
		let id = 0;
		for(let theta = 0; theta < 2*Math.PI; theta += dTheta) {
			let x = this.scaledWidth/2 + (this.scaledWidth/2)*Math.cos(theta);
			let y = this.scaledWidth/2 + (this.scaledWidth/2)*Math.sin(theta);
			this.pegs.push({
				x: x,
				y: y,
				id: id
			});
			id += 1;
		}

		this.currentPeg = this.pegs[0];

		//Check that the image has been loaded properly
		if(this.image.pixels.length == 4) {
			this.initialised = false;
		} else {
			this.initialised = true;
		}
	}

	draw(g) {
		if(this.counter > this.lines) {
			return;
		}

		//Makes sure there is an area to draw to
		if(!g && !this.createCanvas) {
			return false;
		}

		let nextPeg = this.findNextPegByLum();

		this.reduceLumOfLine(
			this.currentPeg.x, this.currentPeg.y,
			nextPeg.x, nextPeg.y,
			255*this.weight
		);


		//Calculate the x and y coordinates to the right scale
		let x0 = this.currentPeg.x * (1/this.sampling) * this.scale;
		let y0 = this.currentPeg.y * (1/this.sampling) * this.scale;

		let x1 = nextPeg.x * (1/this.sampling) * this.scale;
		let y1 = nextPeg.y * (1/this.sampling)* this.scale;

		this.currentPeg = nextPeg;

		if(g) {
			g.strokeWeight(this.weight);
			g.line(x0,y0,x1,y1);
		} else {
			strokeWeight(this.weight);
			line(x0,y0,x1,y1);
		}

		this.counter += 1;
	}

	findNextPegByLum() {
		let lums = [];
		let ids = [];
		//Get a list of average luminosity of lines
		for(let i = 0; i < this.nbPegs; i += 1) {
			if(this.pegs.id != this.currentPeg.id) {
				let testpeg = this.pegs[i];
				lums.push(this.getAvgLumOfLine(
					this.currentPeg.x, this.currentPeg.y,
					testpeg.x, testpeg.y
				));
				ids.push(testpeg.id);
			}
		}

		//Find the peg that gives the highest average
		let largest = 0;
		let id = 0;
		for(let i = 0; i < lums.length; i += 1) {
			if(lums[i]> largest) {
				largest	= lums[i];
				id = ids[i];
			}
		}

		return this.pegs[id];
	}

	getAvgLumOfLine(x0,y0,x1,y1) {
		let points = CordDrawing.brasenhamPoints(x0,y0,x1,y1);

		let t = 0;
		for(let i = 0; i < points.length; i += 1) {
			t += super.getLumAt(points[i].x, points[i].y);
		}

		return t/points.length;
	}

	reduceLumOfLine(x0,y0,x1,y1,reducer) {
		let points = CordDrawing.brasenhamPoints(x0,y0,x1,y1);

		for(let i = 0; i < points.length; i += 1) {
			let x = points[i].x;
			let y = points[i].y;
			let lum = super.getLumAt(x,y);
			let newValue = lum - reducer > 0 ? lum - reducer : 0;
			super.setLumAt(newValue,x,y);
		}
	}

	static brasenhamPoints(x0, y0, x1, y1){
		x0 = Math.floor(x0);
		x1 = Math.floor(x1);
		y0 = Math.floor(y0);
		y1 = Math.floor(y1);

		let dx = Math.abs(x1-x0);
		let dy = Math.abs(y1-y0);
		let sx = (x0 < x1) ? 1 : -1;
		let sy = (y0 < y1) ? 1 : -1;
		let err = dx-dy;

		let points = [];

		let condition = true;
		while(condition){
			points.push({x: x0, y: y0});

			if ((x0==x1) && (y0==y1)){
				condition = false;
			}
			let e2 = 2*err;
			if (e2 >-dy){
				err -= dy; x0  += sx;
			}
			if (e2 < dx){
				err += dx; y0  += sy;
			}
		}

		return points;
	}
}