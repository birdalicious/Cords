const scale = 1;
const width = 476;
const height = 476;
const radius = width/2;

const displayWidth = width*scale;
const displayHeight = height*scale;
const displayRadius = radius*scale;

const nbPegs = 100;

var pegs;

function setup() {
  background(255);
  createCanvas(displayWidth, displayHeight);
  ellipse(displayWidth/2,displayHeight/2,displayRadius*2);

  //init the peg locations
  pegs = [];
  let dTheta = 2*Math.PI/nbPegs;
  for(let theta = 0; theta < 2*Math.PI; theta += dTheta) {
    let x = width/2 + radius*Math.cos(theta);
    let y = height/2 + radius*Math.sin(theta);
    pegs.push({
      x: x,
      y: y
    });
  }

  //draw the pegs - remove in final version
  for(let i = 0; i < pegs.length; i += 1) {
    let peg = pegs[i]
    ellipse(peg.x*scale, peg.y*scale, 10)
  }
}