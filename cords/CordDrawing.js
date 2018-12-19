class CordDrawing extends ImageHandler {
	constructor(args) {
		if(!args) {
			args = {};
		}

		args.imageLocation = args.imageLocation || "example.png";
		args.sampling = args.sampling || 4

		super(args.imageLocation, args.sampling);

		this.imageLocation = args.imageLocation;
		this.sampling = args.sampling;
		this.nbPegs  = args.pegs || 500;
		this.lines = args.lines || 4000;
		this.weight = args.weight || 0.16;

		if(args.createCanvas === undefined) {
			this.createCanvas = true;
		} else {
			this.createCanvas = args.createCanvas;
		}
	}

	setup() {
		super.setup()

		this.counter = 0;

		if(this.createCanvas) {
			createCanvas(this.width, this.width);
		}

		//create pegs
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

		strokeWeight(this.weight);
	}

	draw(g) {
		if(this.counter > this.lines) {
			return;
		}

		if(!g && !this.createCanvas) {
			return false
		}
		let lums = [];
		let ids = [];
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

		let largest = 0;
		let id = 0;
		for(let i = 0; i < lums.length; i += 1) {
			if(lums[i]> largest) {
				largest	= lums[i];
				id = ids[i];
			}
		}

		let nextPeg = this.pegs[id];

		this.reduceLumOfLine(
			this.currentPeg.x, this.currentPeg.y,
			nextPeg.x, nextPeg.y,
			255
			);

		let x0 = this.currentPeg.x * (1/this.sampling);
		let y0 = this.currentPeg.y * (1/this.sampling);

		let x1 = nextPeg.x * (1/this.sampling);
		let y1 = nextPeg.y * (1/this.sampling);

		this.currentPeg = nextPeg;

		if(g) {
			g.line(x0,y0,x1,y1);
		} else {
			line(x0,y0,x1,y1);
		}
		this.counter += 1;

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
			let newValue = super.getLumAt(x,y) - reducer > 0 ? super.getLumAt(x,y) - reducer : 0;
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

		while(true){
			points.push({x: x0, y: y0});

			if ((x0==x1) && (y0==y1)){
				break;
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