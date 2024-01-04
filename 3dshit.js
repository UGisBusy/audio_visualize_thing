var song;
var fft;

function preload() {
  song = loadSound("Never gonna give you up.mp3");
  // song = loadSound("yakuza-ost-baka-mitai-kiryu-full-version.mp3");
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

var FFT_CNT = 256;
var TOTAL_LENGTH = 500;
var FULL_SIDE_CNT = 5;
var FFT_RATIO;
var HALF_SIDE_CNT;
var LEN;

function setup() {
  FFT_RATIO = TOTAL_LENGTH / FFT_CNT;
  HALF_SIDE_CNT = floor(FULL_SIDE_CNT / 2);
  LEN = TOTAL_LENGTH / HALF_SIDE_CNT;

  createCanvas(windowWidth, windowHeight, WEBGL);
  fft = new p5.FFT(0.8, FFT_CNT);
  colorMode(HSB);
  angleMode(RADIANS);
}

function draw() {
  background(20);

  let spectrum = fft.analyze();

  fill(20);
  strokeWeight(3);
  push();
  translate(-LEN * HALF_SIDE_CNT, 0, -LEN * HALF_SIDE_CNT);
  for (let i = -HALF_SIDE_CNT; i <= HALF_SIDE_CNT; i++) {
    push();
    for (let ii = -HALF_SIDE_CNT; ii <= HALF_SIDE_CNT; ii++) {
      let h = get_h(i, ii, spectrum) * 2;
      translate(0, 0, LEN);
      stroke(map(h, 0, 510, 0, 360), 100, 100);
      translate(0, -h / 2, 0);
      box(LEN, h, LEN);
      translate(0, h / 2, 0);
    }
    pop();
    translate(LEN, 0);
  }
  pop();
  orbitControl();
}

function get_h(i, ii, spectrum) {
  let x = i * LEN;
  let y = ii * LEN;
  let d = sqrt(x * x + y * y);
  let idx = floor(d / FFT_RATIO);
  // console.log(d, idx);
  console.log(idx);
  if (idx >= FFT_CNT) {
    return 0;
  }
  return spectrum[idx];
}
