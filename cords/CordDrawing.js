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

		if(this.createCanvas) {
			createCanvas(this.width, this.width);
		}

		//create pegs
		this.pegs = [];
		let dTheta = 2*Math.PI/this.nbPegs;
		let id = 0;
		for(let theta = 0; theta < 2*Math.PI; theta += dTheta) {
			let x = this.width/2 + (this.width/2)*Math.cos(theta);
			let y = this.width/2 + (this.width/2)*Math.sin(theta);
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
		if(!g && !this.createCanvas) {
			return false
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