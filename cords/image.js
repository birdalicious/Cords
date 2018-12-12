class ImageHandler {
	constructor(imageLocation = "example.png", sampling) {
		this.image = loadImage(imageLocation);
		this.sampling = sampling || 1;
	}

	setup() {
		this.image.loadPixels();
		this.pixels = this.image.pixels;

		this.width = this.image.width;
		this.height = this.image.height;

		//Split into colour channels
		this.channels = {
			red : this.getChannel(this.pixels, 0),
			green : this.getChannel(this.pixels, 1),
			blue : this.getChannel(this.pixels, 2)
		};
		//Get the lumosity
		this.image.filter("gray");
		this.image.loadPixels();
		this.pixels = this.image.pixels;
	}

	scale(pixels) {
		let scaledPixels = []

		let length = pixels.length*(this.sampling**2);
		for(let i = 0; i < length; i += 1) {
			let x = Math.floor(i % (this.width*this.sampling));
			let y = Math.floor(i / (this.width*this.sampling));

			scaledPixels.push(
					pixels[this.width*Math.floor(y/this.sampling)+ Math.floor(x/this.sampling)]
				);
		}

		return scaledPixels;
	}

	getChannel(pixels, channel) {
		let returnChannel = [];

		let length = pixels.length;
		for(let i = channel; i < length; i += 4) {
			returnChannel.push(pixels[i]);
		}

		return returnChannel
	}
}