     
// GLOBAL VARABLES---------------------------------------------------------------------------------------------------------------------------------------------------------

var snake;
var bit;
var speed = 0.5;

// dimension variables
var cx;
var cy;
var diameter = 400;
var circleSize = 20;

// update variables
var d = 1;

// global tracking id
var globalHTD;

// count
var count;

// KINECT VARABLES---------------------------------------------------------------------------------------------------------------------------------------------------------

// Declare Kinectron
var kinectron = null;

// Create P5 Canvas
var myCanvas = null;

// head tracking
var globalHTD;

// P5 FUNCTIONS-------------------------------------------------------------------------------------------------------------------------------------------------------------

function setup() {
  
  myCanvas = createCanvas(500, 500);

  // dimensions
  cx = width / 2;
  cy = height / 2;

  // shapes
  noStroke();
  rectMode(CENTER);

  // snake  
  snake = new Snake();

  // bit
  bit = new Bits();
  bit.update();
  
} // end setup

function draw() {
  
  // background
  background(0);

  // payground
  playGround();

  // snake
  snake.update();
  snake.eat();
  snake.death();
  snake.show();

  // bit
  bit.show();

} // end draw


// SNAKE CONSTRUCTOR-----------------------------------------------------------------------------------------------------------------------------------------------------
function Snake() {
  // VARIABLES

  // position
  this.x = cx;
  this.y = cy;

  // kinect positions
  this.kinectX;
  this.kinectY;

  // slope
  this.rise;
  this.run;

  // angle
  this.angle;

  // direction
  this.nx;
  this.ny;

  // unit lengths
  this.unitx;
  this.unity;

  // tail
  this.tail = [];

  // total
  this.total = 0;

  // head
  this.head = null;

  // head tracking
  this.headTrackingId = null;

  //color
  this.r = random(255);
  this.g = random(255);
  this.b = random(255);

  // METHODS

  this.update = function() {

      // find slope

      this.rise = mouseY - this.y;
      this.run = mouseX - this.x;

      // find angle
      this.angle = atan(this.rise / this.run);

      // find direction
      if (this.run < 0) {
        this.nx = -1;
      } else {
        this.nx = 1;
      } // end run

      if (this.rise < 0) {
        this.ny = -1;
      } else {
        this.ny = 1;
      } // end rise

      // find unit lengths
      this.unitx = cos(this.angle);
      this.unity = sqrt(1 - this.unitx * this.unitx);

      // protet against jittering
      if (dist(this.x, this.y, mouseX, mouseY) < 1) {
        this.unitx = 0;
        this.unity = 0;
      } // end jittering

      // update x
      this.x = this.x + this.unitx * this.nx * speed;

      // update y
      this.y = this.y + this.unity * this.ny * speed;

      // array shift
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      } // end for 

      // array update
      this.tail[this.total] = createVector(this.x, this.y);

    } // end update

  this.eat = function() {

      // compare distance 
      if (dist(this.x, this.y, bit.x, bit.y) < 20) {

        // increase total
        this.total += 1;

        // update bit
        bit.update();

      } // end if 

    } // end eat

  this.death = function() {

      // snake
      if (dist(cx, cy, snake.x, snake.y) > 200 && snake.headTrackingId === globalHTD) {

        // tail
        this.tail = [];
        this.total = 0;

        // head 
        this.y = cy;
        this.x = cx;

        // count
        this.count++;

        if (count === 3) {

          // snake
          snake.headTrackingId = null;

          // color
          this.r = random(255);
          this.g = random(255);
          this.b = random(255);

          // count
          this.count = 0;

        } // end if

      } // end if 

      if (dist(cx, cy, snake.x, snake.y) > 200 && snake.headTrackingId != globalHTD) {

        // tail
        this.tail = [];
        this.total = 0;

        // head 
        this.y = cy;
        this.x = cx;

        // snake
        snake.headTrackingId = null;

        // color  
        this.r = random(255);
        this.g = random(255);
        this.b = random(255);

        // count
        count = 0;

      } // end if 

    } // end death

  this.show = function() {

      // color
      fill(this.r, this.g, this.b);

      // head
      ellipse(this.x + this.unitx + this.nx * speed, this.y + this.unity * this.ny * speed, circleSize, circleSize);

      // tail
      for (var i = 0; i < this.tail.length - 1; i++) {
        ellipse(this.tail[i].x, this.tail[i].y, circleSize, circleSize);
      } // end for 

    } // end show

} // end snake

// FOOD CONSTRUCTOR------------------------------------------------------------------------------------------------------------------------------------------------------
function Bits() {

  // VARIABLES

  // position
  this.x = random(width);
  this.y = random(height);

  // color
  this.r;
  this.g;
  this.b;

  // rotation
  this.rotation;

  // METHODS

  this.update = function() {

      // position
      this.x = random(cx - 125, cx + 125);
      this.y = random(cy - 125, cy + 125);

      // color
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);

      // rotation
      this.rotation = random(0, PI);

    } // end update

  this.show = function() {

      // color
      fill(this.r, this.g, this.b);

      // position + rotation 
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      rect(0, 0, circleSize, circleSize);
      pop();

    } // end show

} // end Bits

// BACKGROUND FUNCTION----------------------------------------------------------------------------------------------------------------------------------------------------
function playGround() {

  // snake area
  fill(255);
  ellipse(cx, cy, diameter, diameter);

} // end background