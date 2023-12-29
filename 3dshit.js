var song;
var fft;

function preload() {
  song = loadSound("Never gonna give you up.mp3");
  // song = loadSound("yakuza-ost-baka-mitai-kiryu-full-version.mp3");
}

var BIN_COUNT = 256;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  fft = new p5.FFT(0.8, BIN_COUNT);
  colorMode(HSB);
  angleMode(RADIANS);
}

var SIDE = 9;
var GAP = 50;

function draw() {
  background(20);

  fill(20);
  strokeWeight(3);
  var h_matrix = getHMatrix(fft.analyze());
  push();
  for (let i = 0; i < SIDE; i++) {
    push();
    for (let ii = 0; ii < SIDE; ii++) {
      translate(0, 0, GAP);
      push();
      translate(0, -h_matrix[i][ii] / 2, 0);
      stroke(map(h_matrix[i][ii], 0, 255, 0, 360), 100, 100);
      box(GAP, h_matrix[i][ii], GAP);
      pop();
    }
    pop();
    translate(GAP, 0);
  }
  pop();

  // var spectrum = fft.analyze();
  // for (let i = 0; i < 20; i++) {
  //   let a = map(i, 0, 20, 0, TWO_PI);
  //   for (let ii = 0; ii < 5; ii++) {
  //     let r = map(ii, 0, 5, 5, 200);
  //     let x = r * cos(a);
  //     let y = r * sin(a);
  //     let h = map(spectrum[ii], 0, 255, 0, 200);
  //     line(x, y, 0, x, y, h);
  //   }
  // }

  orbitControl();
}

function getHMatrix(spectrum) {
  let h_martix = [];
  // spectrum = spectrum.reverse() + spectrum;

  let j, jj;
  for (let i = 0; i < SIDE; i++) {
    h_martix[i] = [];
    for (let ii = 0; ii < SIDE; ii++) {
      j = abs(i - int(SIDE / 2) - 1);
      jj = abs(ii - int(SIDE / 2) - 1);
      let d = int(sqrt(j * j + jj * jj));
      h_martix[i][ii] =
        spectrum[map(d, 0, int((sqrt(2) * SIDE) / 2), 0, BIN_COUNT)];
    }
  }
  // console.log(h_martix);
  return h_martix;
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
