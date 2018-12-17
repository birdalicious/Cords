# ImageHandler
Can only be used on a server or a browser configured to ignore CORS alerts for file:/// URLs.
## Properties
* `width` **number** width of image.
* `height` **number** height of image.
* `scaling` **number** scale factor applied to the image.
* `scaledWidth` **number** width of the image after scaling.
* `scaledHeight` **number** height of the imager after scaling.
* `RGB` **object** colour channels
	* `RGB.r` **array** all the pixels in the red cahnnel.
	* `RBG.g` **array** all the pixels in the green channel.
	* `RGB.b` **array** all the pixels in the blue channel.
* `lum` **array** luminosity of the pixels with 255 being the darkest and 0 the brightest.

## constructor
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

## setPixelAt
Set the colour values at (x, y) cooridinates.
### Parameters
* value **array** the colours value the pixel will be set to.
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Returns
**number** Index of the pixel in the pixel array if the change was successfull, otherwise returns `-1`.

### Example
```javascript
index = ih.setPixelAt([255,255,255], 50 ,100);
```
Set the pixel at (50, 100) to black.  
Returns **number** the index of the pixel at (50, 100) in the pixel array.

## getPixelAt
It will return colour values at (x, y) cooridinates.
### Parameters
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Returns
**array** the colour values of the pixel in format `[red, green, blue]`.

### Example
```javascript
pixel = ih.getPixelAt(50,100);
```
Returns **array** the pixel data at pixel (50, 100).

## setLumAt
Set the luminosity at (x, y) cooridinates.
Returns `-1` if the cooridinate doesn't exist and the index of the pixel if it was changed successfully.
### Parameters
* value **number** the luminosity the pixel will be set to.
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Returns
**number** Index of the pixel in the pixel array if the change was successfull, otherwise returns `-1`.

### Example
```javascript
index = ih.setLumAt(255, 50 ,100);
```
Set the pixel at (50, 100) to the darkest luminosity.  
Returns **number** the index of the pixel at (50, 100) in the pixel array.

## getLumAt
Gets the luminosity of the pixel at (x, y) cooridinate. 255 is the darkest and 0 is the brightest.
### Parameters
* x **number** x cooridinate of the pixel.
* y **number** y cooridinate of the pixel.

### Returns
**number** the luminosity of the pixel at (x, y) with 255 being the darkest and 0 the brightest.

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

### Returns
**array** the colour channel selected.

### Example
```javascript
const RedChannel = 0;

redPixels = ih.getChannel(RedChannel);
```
Returns **array** the red channel.

## scaleChannel
Scales a single channel of the image as it is easier to split into channels then scale than scale all the channels at once.
### Parameters
* `channel` **number** the channel to scale. The id is modulo 4 so 5 is the same as 1.
	* 0 - red
	* 1 - green
	* 2 - blue
	* 3 - alpha

### Returns
**array** the colour channel selected scaled up using the scaling factor set when the ImageHandler was created.

### Example
```javascript
const RedChannel = 0;

scaledRedPixels = ih.scaleSingleChannel(RedChannel);
```
Returns **array** a scaled up red channel.



# CordDrawing

## constructor
Any new instance of the CordDrawing should be made in the `preload()` function of p5.
### Parameters
* `args` **object**
	* `args.imageLocation` **string** *Default* `"example.png"` file location of the image.
	* `args.sampling` **number** *Default:* `4` amount the image is scaled up for processing and then scaled down for display.
	* `args.pegs` **number** *Default:* `500` number of pegs placed on the circumference of the circle for the cords to be drawn from.
	* `args.lines` **number** *Default:* `4000` limit of lines drawn.
	* `args.weight` **number** *Default:* `0.16` line weight of the cords.
	* `args.createCanvas` **boolean** *Default:* `True` will create a canvas to draw to. If it is false a graphics area or canvas has to be given in the draw function.

### Example
```javascipt
var cd;
function preload() {
	cd = new CordDrawing();
}
```
## setup
Creates the canvas if needed and genral setup needed before the drawing can begin.
### Example
```javascript
function setup() {
	cd.setup();
}
```

## *static* brasenhamPoints
Calculates which pixels form a line between two points.
### Parameters
* `x0` **number** x-coordinate of the first point,
* `y0` **number** y-coordinate of the first point.
* `x1` **number** x-coordinate of the second point.
* `y1` **number** y-coordinate of the second point.

### Returns
**array** the coordinates of the pixels between the two specified points. The cooridinates are stored as objects `{x: x0, y: y0}`
### Example
```javascript
var points = CordDrawing.brasenhamPoints(0,0,50,100);
```
Returns **array** the points between the points (0,0) and (50,100).