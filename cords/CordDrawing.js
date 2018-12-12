class CordDrawing extends ImageHandler {
	constructor(args) {
		if(!args) {
			args = {};
		}
		
		super("example.png",1);

		this.imageLocation = args.imageLocation || "example.png";
		this.sampling = args.sampling || 4;
		this.nbPegs  = args.pegs || 500;
		this.lines = args.lines || 4000;
		this.weight = args.weight || 0.16;
	}
}