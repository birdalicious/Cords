# Licencing
This code is based on the [*chords*](https://www.openprocessing.org/sketch/389857) sketch by OpenProcessing user [*brzzt*](https://www.openprocessing.org/user/69383). Under the [OpenProcessing Terms of Service](https://www.openprocessing.org/home/tos) any person that submits content to OpenProcessing for inclusion on that person's account grants anyone a [Creative Commons licence](https://creativecommons.org/). As such I am publishing my adaptation of the work under a [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) Creative Commons licence.

# ImageHandler
Makes the p5 pixel array easier to use, by letting you refer to pixels by (x,y) cooridinates.

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
* `src` **string** *Default:* `"example.png"` file location of the image.
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
Takes an image and redraws it using cords of a circle. Each line follows from where the last line left so it acts as a single thread creating the image.

## Properties
* `src` **string** file location of the image.
* `sampling` **number** amount the image is scaled up for processing and then scaled down for display.
* `nbPegs` **number** number of pegs for which the cords can connect to and from.
* `lines` **number** the limit of lines drawn.
* `weight` **number** the stroke weight of the lines.
* `diameter` **number** the diameter of the circle that is displayed. *Value is set in setup function if it isn't set in the args.*
* `scale` **number** the value of the display diameter divided by the image width. *Value is set in the setup function.*
* `counter` **number** the number of line that have been drawn.
* `createCanvas` **boolean** whether or not the canvas has been created by the class or it is drawing to a graphics area.
* `initialised` **boolean** If the image has been properly loaded at the end of `setup()` this will be true otherwise it will be false.

## constructor
Any new instance of the CordDrawing should be made in the `preload()` function of p5.
### Parameters
* `args` **object**
	* `args.src` **string** *Default* `"example.png"` file location of the image.
	* `args.diameter` **number** *Default: the width of the image* sets the size of the circle that will be draw and the size of the canvas if `args.createCanvas` is `true`.
	* `args.sampling` **number** *Default:* `1` amount the image is scaled up for processing and then scaled down for display.
	* `args.pegs` **number** *Default:* `500` number of pegs placed on the circumference of the circle for the cords to be drawn from.
	* `args.lines` **number** *Default:* `2750` limit of lines drawn.
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

## draw
Draws a line between the current peg and then next next which is the best candiate to create the image.

Will only draw to the canvas the class has created, or the grpahics area specified. I will not draw to a canvas created by other means. 
### Parameters
* `g` **object** *optional* the graphics area you want the image drawn to, if it not specified it will draw to the canvas the class created. 

### Returns
**undefined** or **boolean** Only returns when something goes wrong or is no longer drawing as the number of lines drawn match the line limit. Returns `false` when no graphics area is given and the class hasn't created a canvas. Returns `undefined` when it is done drawing.

### Example
```javascript
function draw() {
	cd.draw();
}
``` 
Draws a line each animaion frame.

## findNextPegByLum
Calculates the best peg to go to from the current peg by the luminosity of the pixels between them.
### Returns
**object** peg with largest sum of the luminosities of the pixels between the current peg and the other pegs.

## getAvgLumOfLine
Calculates the average of the luminosity of the pixles between two points.
### Parameters
* `x0` **number** x-coordinate of the first point.
* `y0` **number** y-coordinate of the first point.
* `x1` **number** x-coordinate of the second point.
* `y1` **number** y-coordinate of the second point.

### Returns
**number** average luminosity of the pixels between tow points.

## reduceLumOfLine
Reduces the luminosity of the the pixels on a line by a set amount.
### Parameters
* `x0` **number** x-coordinate of the first point.
* `y0` **number** y-coordinate of the first point.
* `x1` **number** x-coordinate of the second point.
* `y1` **number** y-coordinate of the second point.
* `reducer` **number** amount to be subtracted form the luminosity of each pixel.

## *static* brasenhamPoints
Calculates which pixels form a line between two points.
### Parameters
* `x0` **number** x-coordinate of the first point.
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