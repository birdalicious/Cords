const RedChannel = 0;
const GreenChannel = 1;
const BlueChannel = 2;

class ImageHandler {
	constructor(imageLocation = "example.png", scaling) {
		this.image = loadImage(imageLocation);
		this.scaling = scaling || 1;
	}

	setup() {
		this.image.loadPixels();
		let pixelRestore = this.image.pixels;

		this.width = this.image.width;
		this.height = this.image.height;

		//Split and scale colour channels
		this.RGB = {
			r : this.scaleSingleChannel(RedChannel),
			g : this.scaleSingleChannel(GreenChannel),
			b : this.scaleSingleChannel(BlueChannel)
		};

		//Get the luminosity
		this.image.filter("gray");
		this.image.loadPixels();
		this.lum = this.scaleSingleChannel(0);
		for(let i = 0; i < this.lum.length; i += 1) {
			this.lum[i] = 255 - this.lum[i];
		}

		//Restore pixels
		this.image.pixels = pixelRestore;
		this.image.updatePixels();
	}

	getPixelAt(x, y) {
		if(x < 0 || x > this.width || y < 0 || y > this.height) {
			return [0,0,0];
		}
		let red = this.RGB.r[this.width * y + x];
		let green = this.RGB.g[this.width * y + x];
		let blue = this.RGB.b[this.width * y + x];

		reutn [red, green, blue];
	}

	getLumAt(x, y) {
		if(x < 0 || x > this.width || y < 0 || y > this.height) {
			return [0,0,0];
		}
		return this.lum[this.width * y + x];
	}



	scaleSingleChannel(channel) {
		let scaledPixels = []

		pixels = this.getChannel(channel);

		let length = pixels.length*(this.scaling**2);
		for(let i = 0; i < length; i += 1) {
			let x = Math.floor(i % (this.width*this.scaling));
			let y = Math.floor(i / (this.width*this.scaling));

			scaledPixels.push(
					pixels[this.width*Math.floor(y/this.scaling)+ Math.floor(x/this.scaling)]
				);
		}

		return scaledPixels;
	}

	getChannel(channel) {
		let returnChannel = [];

		let length = this.image.pixels.length;
		for(let i = channel; i < length; i += 4) {
			returnChannel.push(this.image.pixels[i]);
		}

		return returnChannel
	}
}