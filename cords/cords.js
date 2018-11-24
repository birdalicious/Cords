const scale = 0.5;
const width = 476*2;
const height = 476*2;
const radius = width/2;
const excludeClosestPegs = 0; //fraction of pegs closest to the current peg that will not be tested

const lines = 1500;
var count = 0;

const weight = 0.16;

const displayWidth = width*scale;
const displayHeight = height*scale;
const displayRadius = radius*scale;

const nbPegs = 1000;

var pegs;
var currentPeg;

var image;

function brasenhamPoints(x0, y0, x1, y1){
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

function Image(array) {
  this.array = array;

  this.getPixelAt = function(x,y) {
    if(x < 0 || x > width || y < 0 || y > height) {
      return 0;
    }
    return this.array[width * y + x];
  }

  this.setPixelAt = function(x,y,value) {
    let i = this.getIndexFromCoord(x,y);
    if(i != -1) {
      this.array[i] = value;
    }
  }

  this.getIndexFromCoord = function(x,y) {
    if(x < 0 || x > width || y < 0 || y > height) {
      return -1;
    }
    return width * y + x
  }

  this.getCoordAtIndex = function(i) {
    let y = Math.floor(i/width);
    let x = i % width;
    return {x: x, y: y};
  }

  this.getIndexOfDarkestPixel = function() {
    var darkest = 0;
    var index = 0;

    let length = this.array.length;
    for(let i = 0; i < length; i += 1){
      let element = this.array[i]
      if(element > darkest) {
        index = i;
        darkest = element;
      }
    }

    return index;
  }
}

function setup() {
  background(255);
  createCanvas(displayWidth, displayHeight);
  ellipse(displayWidth/2,displayHeight/2,displayRadius*2);

  count = 0;

  image = new Image(imageArray);

  //init the peg locations
  pegs = [];
  let dTheta = 2*Math.PI/nbPegs;
  let id = 0;
  for(let theta = 0; theta < 2*Math.PI; theta += dTheta) {
    let x = width/2 + radius*Math.cos(theta);
    let y = height/2 + radius*Math.sin(theta);
    pegs.push({
      x: x,
      y: y,
      id: id
    });
    id += 1;
  }

  currentPeg = pegs[0];

  // ellipse(currentPeg.x, currentPeg.y, 20)

  //draw the pegs - remove in final version
  for(let i = 0; i < pegs.length; i += 1) {
    let peg = pegs[i]
    ellipse(peg.x*scale, peg.y*scale, 10)
  }

  strokeWeight(weight);

  tdraw();
}


function tdraw() {
  //test cords to find the darkest line
  //make sure the pegs next to each other don't connect
  let lums = [];
  let indices = [];
  for(let i = Math.floor(nbPegs * (excludeClosestPegs)); i < Math.floor(nbPegs *(1-excludeClosestPegs)); i += 1) {
    let pegIndex = (currentPeg.id+i)%(nbPegs);
    let testPeg = pegs[pegIndex];

    let points = brasenhamPoints(currentPeg.x,currentPeg.y,testPeg.x,testPeg.y);
    let lum = 0; //total luminosity of point on line
    for(let j = 0; j < points.length; j += 1) {
      let x = points[j].x;
      let y = points[j].y;
      lum += image.getPixelAt(x,y) || 0;
    }
    let average = lum/points.length;

    lums.push(average);
    indices.push(pegIndex);
  }

  //find the test cord with highest luminosity
  let largest = 0;
  let index = 0;
  for(let i = 0; i < lums.length; i += 1) {
    if(lums[i] > largest) {
      largest = lums[i];
      index = indices[i];
    }
  }
  // console.log(largest)

  let nextPeg = pegs[index];

  //set the points on cord to zero
  points = brasenhamPoints(currentPeg.x,currentPeg.y,nextPeg.x,nextPeg.y);
  let sum = 0;
  for(let i = 0; i < points.length; i += 1) {
    let x = points[i].x;
    let y = points[i].y;
    let index = image.getIndexFromCoord(x,y)

    image.array[i] = 0;
    let reducer = 255*weight
    let newValue = image.setPixelAt(x,y) - reducer > 0 ? image.setPixelAt(x,y) - reducer : 0;
    image.setPixelAt(x,y,);
    // console.log(image.getPixelAt(x,y) + ":" + image.array[index])

    sum += image.getPixelAt(x,y)
    // image.setPixelAt(x,y,0);
    // console.log(image.getPixelAt(x,y))
    // stroke('rgba(0,0,0,' + weight + ')');
    // point(x,y)
  }
  // console.log(sum)

  line(currentPeg.x*scale,currentPeg.y*scale,nextPeg.x*scale,nextPeg.y*scale);
  currentPeg = nextPeg;

}

function draw() {
  if(count < lines) {
    tdraw();
  }
  count += 1
}