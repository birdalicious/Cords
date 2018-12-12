# ImageHandler
Can only be used on a server or a browser configured to ignore CORS alerts for file:/// URLs.
## Properties
* `width` **number** width of image
* `height` **number** height of image
* `scaling` **number** scale factor applied to the image
* `RGB` **object** colour channels
	* `RGB.r` **array** all the pixels in the red cahnnel
	* `RBG.g` **array** all the pixels in the green channel
	* `RGB.b` **array** all the pixels in the blue channel
* `lum` **array** luminosity of the pixels with 255 being the darkest and 0 the brightest

## Constructor
Any new instance of the ImageHandler should be made in the `preload()` function of p5. 
### Parameters
* `imageLocation` **string** *Default:* `"example.png"` file location of the image.
* `scaling` **number** *Default:* `1` scale factor to apply to the image for sampling.

### Example
```javascript
var ih;
function preload() {
	ih = new ImageHander("example.png",2);
}
```

## setup
Once the image is loaded, setup will split the pixels into its RGB channels and a luminosity channels, then scale the image according to the scale factor given in the constructor.

`setup()` must be called in the p5 setup function.
### Example
```javascript
var ih;
function preload() {
	ih = new ImageHander("example.png",2);
}

function setup() {
	ih.setup();
}
```

## getPixelAt
It will return pixel data at (x, y) cooridinates as array `[red,green,blue]`
### Parameters
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Example
```javascript
pixel = ih.getPixelAt(50,100);
```
Returns **array** the pixel data at pixel (50, 100).

## getLumAt
Gets the luminosity of the pixel at (x, y) cooridinate. 255 is the darkest and 0 is the brightest.
### Parameters
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Example
```javascript
luminosity = ih.getLumAt(50,100);
```
Returns **number** the pixels luminosity at pixel (50, 100).

## getChannel
Takes the pixels in the p5 layout and returns a single channel.
### Parameters
* `channel` **number** the channel to scale. The id is modulo 4 so 5 is the same as 1.
	* 0 - red
	* 1 - green
	* 2 - blue
	* 3 - alpha

### Example
```javascript
const RedChannel = 0;

redPixels = ih.getChannel(RedChannel);
```
Returns **array** the red channel.

## scaleSingleChannel
Scales a single channel of the image as it is easier to split into channels then scale than scale all the channels at once.
### Parameters
* `channel` **number** the channel to scale. The id is modulo 4 so 5 is the same as 1.
	* 0 - red
	* 1 - green
	* 2 - blue
	* 3 - alpha

### Example
```javascript
const RedChannel = 0;

scaledRedPixels = ih.scaleSingleChannel(RedChannel);
```
Returns **array** a scaled up red channel.