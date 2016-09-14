var length = 10;
var counter = 500;

var attractors = [];
var particles = [];

var val;

var noise;
var filter, filterFreq, filterWidth;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for(var i = 0; i < length; i++) {
    attractors.push(new Attractor(random(150, width - 150), random(100, height - 100)));
  }

  for (var i = 0; i < length; i++) {
      particles[i] = new Array();
      for(var j = 0; j < counter; j++) {
        particles[i].push(new Particles());
      }
  }

  //Sound
  filter = new p5.BandPass();
  noise = new p5.Noise();
  noise.disconnect();
  filter.process(noise);
  noise.start();
  noise.amp(5);
}

function draw() {
  background(0);

  for(var i = 0; i < attractors.length; i++) {
      attractors[i].val();
      attractors[i].walk();
  }

  for( var i = 0; i < particles.length; i++) {
    for(var j = 0; j < particles[i].length; j++) {
      for(var m = 0; m < attractors.length; m++) {
        if(i === m) {
          particles[i][j].arrive(attractors[m]);
        }
        particles[i][j].update();
        //particles[i][j].display();

        if(particles[i][j].isDead(attractors[m])) {
          particles[i][j].pos.x = random(-200, width + 200), random(-200, height + 200);
          particles[i][j].pos.y = random(-200, width + 200), random(-200, height + 200);
        }
      }
          if(j > 0 && j < particles[i].length) {
      stroke(255, 20, 0);
      strokeWeight(0.03);
      line(particles[i][j].pos.x, particles[i][j].pos.y, particles[i][j-1].pos.x, particles[i][j-1].pos.y);
    }
    }
  }

  //Sound
  filterFreq = 500;
  filterWidth = 67.5;
  filter.set(filterFreq, filterWidth);
}

//ATTRACTOR
function Attractor(x, y) {
  this.x = x;
  this.y = y;
  this.pos = createVector(this.x, this.y);

  this.val = function () {
    var min = 1;
    var max = 20;
    val = Math.round(Math.random() * (max - min)) + min;
    console.log(val);
  }

  this.walk = function() {
    var walk = 8;
    if(val === 13)
        this.pos.x += walk;

    else if(val === 10)
        this.pos.x -= walk;

    else if(val === 19)
        this.pos.y += walk;

    else if(val === 7)
        this.pos.y -= walk;

    else if(this.pos.x < 0 || this.pos.x > width)
        this.pos.x = random(width);

    else if(this.pos.y < 0 || this.pos.y > height)
        this.pos.y = random(height);
  }

  this.display = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}


//PARTICLES
function Particles() {
  this.pos = createVector(random(-200, width + 200), random(-200, height + 200));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 0.1;

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.arrive = function(attractors) {
    var desired = p5.Vector.sub(attractors.pos, this.pos);
        var d = desired.mag();

    if(d < 500) {
      var m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    var steering = p5.Vector.sub(desired, this.vel);

    this.applyForce(steering);
  }

  this.isDead = function(attractors) {
    var distance = p5.Vector.sub(attractors.pos, this.pos);
    var d = distance.mag();

    if(d < 5) {
      return true;
    } else {
      return false;
    }
  }

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  this.display = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}
