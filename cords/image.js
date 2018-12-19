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

		this.width = this.image.width;
		this.height = this.image.height;
		this.scaledWidth = this.width * this.scaling;
		this.scaledHeight = this.height * this.scaling;

		//Split and scale colour channels
		this.RGB = {
			r : this.scaleChannel(RedChannel),
			g : this.scaleChannel(GreenChannel),
			b : this.scaleChannel(BlueChannel)
		};

		//Get the luminosity

		this.lum = this.RGB.r;
		for(let i = 0; i < this.RGB.r.length; i += 1) {
			this.lum[i] = 255 - (this.RGB.r[i] *  299/1000 + this.RGB.g[i] * 587/1000 + this.RGB.b[i] * 114/1000);
		}
	}

	setPixelAt(value, x, y) {
		if(x < 0 || x > this.scaledWidth || y < 0 || y > this.scaledHeight) {
			return -1;
		}
		let i = this.scaledWidth * y + x;
		this.RGB.r[i] = value[0];
		this.RGB.g[i] = value[1];
		this.RGB.b[i] = value[2];

		return i;
	}

	getPixelAt(x, y) {
		if(x < 0 || x > this.scaledWidth || y < 0 || y > this.scaledHeight) {
			return [0,0,0];
		}
		let red = this.RGB.r[this.scaledWidth * y + x];
		let green = this.RGB.g[this.scaledWidth * y + x];
		let blue = this.RGB.b[this.scaledWidth * y + x];

		reutn [red, green, blue];
	}

	setLumAt(value, x, y) {
		if(x < 0 || x > this.scaledWidth || y < 0 || y > this.scaledHeight) {
			return -1;
		}
		let i = this.scaledWidth * y + x;
		this.lum[i] = value;

		return i;
	}

	getLumAt(x, y) {
		if(x < 0 || x > this.scaledWidth || y < 0 || y > this.scaledHeight) {
			return 0;
		}
		return this.lum[this.scaledWidth * y + x];
	}



	scaleChannel(channel) {
		let scaledPixels = []

		pixels = this.getChannel(channel);

		let length = pixels.length*(this.scaling**2);
		for(let i = 0; i < length; i += 1) {
			let x = Math.floor(i % this.scaledWidth);
			let y = Math.floor(i / this.scaledWidth);

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