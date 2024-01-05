var song;
var fft;
var amp;

function preload() {
  song = loadSound("LeaF - もぺもぺ (2019).flac");
  song.addCue(47, switchFlag);
  song.addCue(52.5, switchFlag);
}

function keyPressed() {
  if (keyCode === 32) {
    if (song.isPlaying()) {
      song.pause();
    } else {
      song.play();
    }
  }
}

var FFT_CNT = 1024;
var TOTAL_LENGTH = 500;
var FULL_SIDE_CNT = 31;
var FFT_RATIO;
var HALF_SIDE_CNT;
var HEIGHT_FACTOR = 2;
var LEN;

function setup() {
  FFT_RATIO = TOTAL_LENGTH / FFT_CNT;
  HALF_SIDE_CNT = floor(FULL_SIDE_CNT / 2);
  LEN = TOTAL_LENGTH / HALF_SIDE_CNT;

  fft = new p5.FFT(0.8, FFT_CNT);
  amp = new p5.Amplitude();
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  angleMode(DEGREES);
  // song.play();
}

function switchFlag() {
  flag_light = !flag_light;
}

var spectrum = Array.apply(0, Array(FFT_CNT)).map(() => 0);
var sf = 0;
var flag_light = true;
function draw() {
  if (song.isPlaying()) {
    spectrum = fft.analyze();
    sf++;
  } else {
    console.log(song.currentTime());
  }

  if (flag_light) {
    background(0, 0, 90);
    pointLight(0, 0, 50, -TOTAL_LENGTH * 2, 0, LEN);
    pointLight(0, 0, 50, TOTAL_LENGTH * 2, 0, LEN);
    pointLight(0, 0, 50, 0, 0, (TOTAL_LENGTH + LEN) * 2);
    pointLight(0, 0, 50, 0, 0, (-TOTAL_LENGTH + LEN) * 2);
    pointLight(0, 0, 40, 0, -TOTAL_LENGTH * 2, 0);
    shininess(1);
  }
  if (!flag_light) {
    background(0, 0, map(amp.getLevel(), 0, 1, 0, 10));
    pointLight(
      5,
      100,
      map(amp.getLevel(), 0, 1, 20, 80),
      TOTAL_LENGTH,
      0,
      TOTAL_LENGTH + LEN
    );
    pointLight(0, 100, 5, -TOTAL_LENGTH, 10, -TOTAL_LENGTH + LEN);
    pointLight(0, 100, 10, 0, -TOTAL_LENGTH * 2, LEN);
    shininess(0);
  }

  let d, y, h, s, v;

  strokeWeight(2);
  // rotateY(frameCount / 2);
  push();
  translate(-TOTAL_LENGTH, 0, -TOTAL_LENGTH);
  for (let x = -TOTAL_LENGTH; x <= TOTAL_LENGTH; x += LEN) {
    push();
    for (let z = -TOTAL_LENGTH; z <= TOTAL_LENGTH; z += LEN) {
      if (flag_light) {
        d = sqrt(x * x + z * z);
        y = get_h_center(d) * HEIGHT_FACTOR;
        h = (map(d, 0, TOTAL_LENGTH, 120, 360) + sf / 2) % 360;
        // h = (map(y, 0, 255 * HEIGHT_FACTOR, 180, 360) + frameCount / 5) % 360;
        // h = map(y, 0, 510, 200, 360);
        s = y === 0 ? 30 : map(y, 0, 255 * HEIGHT_FACTOR, 40, 100);
        v = y === 0 ? 20 : map(y, 0, 255 * HEIGHT_FACTOR, 50, 100);
        stroke(h, s, v);
        translate(0, 0, LEN);
        specularMaterial(h, s, v);
        translate(0, -y / 2, 0);
        box(LEN, y + 10, LEN);
        translate(0, y / 2, 0);
        // point(0, y, 0);
      }
      if (!flag_light) {
        d = sqrt(x * x + z * z);
        y = get_h_center(d) * HEIGHT_FACTOR;
        h = 0;
        // h = (map(y, 0, 510, 180, 360) + frameCount / 5) % 360;
        // h = map(y, 0, 510, 200, 360);
        s = map(y, 0, 255 * HEIGHT_FACTOR, 0, 100);
        v = y === 0 ? 0 : map(y, 0, 255 * HEIGHT_FACTOR, 10, 100);
        stroke(0, 100, map(y, 0, 255 * HEIGHT_FACTOR, 0, 80));
        specularMaterial(20, s, v);
        translate(0, 0, LEN);
        // noStroke();
        translate(0, -y / 2, 0);
        box(LEN, y + 10, LEN);
        translate(0, y / 2, 0);
      }
    }
    pop();
    translate(LEN, 0);
  }
  pop();
  orbitControl();
}

function get_h_center(d) {
  let idx = floor(d / FFT_RATIO);
  if (idx > FFT_CNT) {
    return 0;
  }
  if (idx === FFT_CNT) {
    return spectrum[FFT_CNT - 1];
  }
  return spectrum[idx];
}
