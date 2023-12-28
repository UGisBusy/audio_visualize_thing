var song;
var fft;
var BIN_COUNT = 256;

function preload() {
  // song = loadSound("Never gonna give you up.mp3");
  song = loadSound("yakuza-ost-baka-mitai-kiryu-full-version.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT(0.8, BIN_COUNT);
  colorMode(HSB);
  angleMode(RADIANS);
}

function draw() {
  background(30);
  var spectrum = fft.analyze();
  // var spectrum = fft.waveform();

  // translate(width / 2, height / 2);
  noStroke();
  // noFill();
  for (var i = 0; i < BIN_COUNT; i++) {
    var x = map(i, 0, BIN_COUNT, 0, width);
    var h = map(spectrum[i], 0, 255, 0, height);

    var c = map(i, 0, BIN_COUNT, 0, 360);
    fill(c, 100, 100);
    // stroke(c, 100, 100);

    rect(x, height - h, width / BIN_COUNT, height);

    // var theta = map(i, 0, BIN_COUNT, 0, PI);
    // beginShape();
    // var r = map(spectrum[i], 0, 255, 100, 200);
    // var x1 = 100 * cos(theta);
    // var y1 = 100 * sin(theta);
    // var x2 = r * cos(theta);
    // var y2 = r * sin(theta);
    // vertex(x1, y1);
    // vertex(x2, y2);
    // endShape();
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}
