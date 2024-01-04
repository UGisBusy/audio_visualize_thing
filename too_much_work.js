var song;
var fft;

function preload() {
  song = loadSound("LeaF - もぺもぺ (2019).flac");
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
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB);
  angleMode(DEGREES);
  // song.play();
}

var spectrum = Array.apply(0, Array(FFT_CNT));
var sf = 0;
var flag_light = true;
var flag_dark = false;
var a = [2630, 2887];
function draw() {
  if (song.isPlaying()) {
    spectrum = fft.analyze();
    if (a[0] <= sf && sf <= a[1]) {
      flag_light = false;
      flag_dark = true;
    } else {
      flag_light = true;
      flag_dark = false;
    }
    sf++;
  } else {
    console.log(sf);
  }

  if (flag_light && !flag_dark) {
    background(0, 0, 90);
    pointLight(0, 0, 50, -TOTAL_LENGTH, -LEN / 2, -TOTAL_LENGTH + LEN);
    pointLight(0, 0, 50, TOTAL_LENGTH, -LEN / 2, -TOTAL_LENGTH + LEN);
    pointLight(0, 0, 50, -TOTAL_LENGTH, -LEN / 2, TOTAL_LENGTH + LEN);
    pointLight(0, 0, 50, TOTAL_LENGTH, -LEN / 2, TOTAL_LENGTH + LEN);
    pointLight(0, 0, 80, 0, -TOTAL_LENGTH, 0);
    shininess(1);
  }
  if (!flag_light && flag_dark) {
    background(5);
    // pointLight(0, 0, 0, -TOTAL_LENGTH, 0, -TOTAL_LENGTH);
    // pointLight(0, 100, 50, TOTAL_LENGTH, 0, TOTAL_LENGTH);
    pointLight(0, 100, 50, TOTAL_LENGTH, 0, TOTAL_LENGTH + LEN);
    pointLight(0, 100, 80, 0, 0, 0);

    // pointLight(0, 100, 100, TOTAL_LENGTH, 0, TOTAL_LENGTH + LEN);
  }

  let d, y, h, s, v;

  strokeWeight(2);
  // rotateY(frameCount / 2);
  push();
  translate(-TOTAL_LENGTH, 0, -TOTAL_LENGTH);
  for (let x = -TOTAL_LENGTH; x <= TOTAL_LENGTH; x += LEN) {
    push();
    for (let z = -TOTAL_LENGTH; z <= TOTAL_LENGTH; z += LEN) {
      if (flag_light && !flag_dark) {
        d = sqrt(x * x + z * z);
        y = get_h_center(d) * HEIGHT_FACTOR;
        h = (map(d, 0, TOTAL_LENGTH, 120, 360) + sf / 2) % 360;
        // h = (map(y, 0, 510, 180, 360) + frameCount / 5) % 360;
        // h = map(y, 0, 510, 200, 360);
        s = y === 0 ? 20 : 100;
        v = y === 0 ? 20 : map(y, 90, 255 * HEIGHT_FACTOR, 50, 100);
        specularMaterial(h, s, v);
        translate(0, 0, LEN);
        stroke(h, s, v);
        translate(0, -y / 2, 0);
        box(LEN, y + 10, LEN);
        translate(0, y / 2, 0);
        point(0, y, 0);
      }
      if (!flag_light && flag_dark) {
        d = sqrt(x * x + z * z);
        y = get_h_center(d) * HEIGHT_FACTOR;
        h = 0;
        // h = (map(y, 0, 510, 180, 360) + frameCount / 5) % 360;
        // h = map(y, 0, 510, 200, 360);
        s = map(y, 90, 255 * HEIGHT_FACTOR, 0, 100);
        v = map(h, 90, 255 * HEIGHT_FACTOR, 0, 100);
        specularMaterial(h, s, v);
        translate(0, 0, LEN);
        noStroke();
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
