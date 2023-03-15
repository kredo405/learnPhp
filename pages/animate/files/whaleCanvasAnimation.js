// whale canvas animation
import {BezierEasing} from "../helpers/cubicBezier";
import {animateDuration, animateEasing, animateProgress} from "../helpers/animate";
import {runLoop, runSerial} from "../helpers/promise"

// global window sizing
let ww, wh, wd, hd;

// canvas variables
const whaleCanvasDom = document.getElementById('whale-canvas'),
  whaleCtx = whaleCanvasDom.getContext('2d');

// global whale sizing
let whaleBodyWidth, whaleBodyHeight,
  whaleBodyL, whaleBodyT;

// global whale fin sizing
let whaleFinWidth, whaleFinHeight,
  whaleFinL, whaleFinT,
  whaleFinAngle = 0;

// global whale tail sizing
let whaleTailWidth, whaleTailHeight,
  whaleTailL, whaleTailT,
  whaleTailAngle = 0;

// global cloud left sizing
let cloudLeftWidth, cloudLeftHeight,
  cloudLeftL, cloudLeftT;

// global cloud right sizing
let cloudRightWidth, cloudRightHeight,
  cloudRightL, cloudRightT;

// global balloon left sizing
let balloonLeftWidth, balloonLeftHeight,
  balloonLeftL, balloonLeftT;

// global balloon left sizing
let balloonRightWidth, balloonRightHeight,
  balloonRightL, balloonRightT;

const setWhaleSceneSizing = () => {
  // global window sizing
  ww = window.innerWidth;
  wh = window.innerHeight;
  wd = window.innerWidth / 1440;
  hd = window.innerHeight / 760;

  function setWhaleSizing() {
    // global whale sizing
    whaleBodyWidth = Math.round(880 * wd);
    whaleBodyHeight = Math.round(whaleBodyWidth * 295 / 783);
    whaleBodyL = Math.round((ww - whaleBodyWidth) / 2);
    whaleBodyT = Math.round((wh - whaleBodyHeight) / 2 + 17 * wd);

    // global whale fin sizing
    whaleFinWidth = Math.round(200 * wd);
    whaleFinHeight = Math.round(whaleFinWidth * 133 / 216);
    whaleFinL = Math.round(whaleBodyL + 310 * wd);
    whaleFinT = Math.round(whaleBodyT + 200 * wd);

    // global whale tail sizing
    whaleTailWidth = Math.round(119 * wd);
    whaleTailHeight = Math.round(whaleTailWidth * 79 / 119);
    whaleTailL = Math.round(whaleBodyL + whaleBodyWidth - 145 * wd);
    whaleTailT = Math.round(whaleBodyT + 35 * wd);
  }

  function setCloudsSizing() {
    // global cloud left sizing
    cloudLeftWidth = Math.round(612 * wd);
    cloudLeftHeight = Math.round(cloudLeftWidth * 344 / 612);
    cloudLeftL = Math.round(whaleBodyL - 180 * wd);
    cloudLeftT = Math.round(whaleBodyT + 100 * wd);

    // global cloud right sizing
    cloudRightWidth = Math.round(644 * wd);
    cloudRightHeight = Math.round(cloudRightWidth * 270 / 644);
    cloudRightL = Math.round(whaleBodyL + whaleBodyWidth - 540 * wd);
    cloudRightT = Math.round(whaleBodyT + 10 * wd);
  }

  function setBalloonsSizing() {
    // global balloon left sizing
    balloonLeftWidth = Math.round(149 * wd);
    balloonLeftHeight = Math.round(balloonLeftWidth * 162 / 149);
    balloonLeftL = Math.round(whaleBodyL + 140 * wd);
    balloonLeftT = Math.round(whaleBodyT - 145 * wd);

    // global balloon left sizing
    balloonRightWidth = Math.round(152 * wd);
    balloonRightHeight = Math.round(balloonRightWidth * 182 / 152);
    balloonRightL = Math.round(whaleBodyL + 208 * wd);
    balloonRightT = Math.round(whaleBodyT - 185 * wd);
  }

  // set sizing
  setWhaleSizing();
  setCloudsSizing();
  setBalloonsSizing();
};

// set whale scene sizing on document load
setWhaleSceneSizing();

// global clouds opacity
let cloudsOpacity = 0;

// global whale scene option
let whaleSceneX = 0,
  whaleSceneY = 0,
  whaleSceneAngle = 0;

// global moon sizing
const moonRadius = 75,
  moonDx = 18,
  moonEndX = 946,
  moonY = 263;
let moonRotateAngle = -450;

// global stars options
let starsOptions = [
  // b 6
  {
    t: 'b',
    x: 1150,
    y: 273,
    s: 4.15,
    h: 5.20,
  },
  // b 5
  {
    t: 'b',
    x: 1090,
    y: 525,
    s: 5.17,
    h: 6.23,
  },
  // b 3
  {
    t: 'b',
    x: 324,
    y: 329,
    s: 4.52,
    h: 5.57,
  },
  // b 2
  {
    t: 'b',
    x: 962,
    y: 543,
    s: 3.39,
    h: 4.44,
  },
  // b 0
  {
    t: 'b',
    x: 466,
    y: 253,
    s: 3.28,
    h: 4.33,
  },
  // s 16
  {
    t: 's',
    x: 1079,
    y: 240,
    s: 5.41,
    h: 6.23,
  },
  // s 15
  {
    t: 's',
    x: 1203,
    y: 275,
    s: 5.08,
    h: 5.54,
  },
  // s 19
  {
    t: 's',
    x: 350,
    y: 368,
    s: 3.27,
    h: 4.07,
  },
  // s 14
  {
    t: 's',
    x: 350,
    y: 368,
    s: 6.02,
    h: 6.23,
  },
  // s 13
  {
    t: 's',
    x: 496,
    y: 344,
    s: 5.23,
    h: 6.21,
  },
  // s 12
  {
    t: 's',
    x: 1043,
    y: 170,
    s: 4.56,
    h: 5.57,
  },
  // s 11
  {
    t: 's',
    x: 1071,
    y: 495,
    s: 4.28,
    h: 5.02,
  },
  // s 10
  {
    t: 's',
    x: 382,
    y: 272,
    s: 4.40,
    h: 5.41,
  },
  // s 9
  {
    t: 's',
    x: 462,
    y: 372,
    s: 4.22,
    h: 5.16,
  },
  // s 4
  {
    t: 's',
    x: 925,
    y: 526,
    s: 3.49,
    h: 4.31,
  },
  // s 3
  {
    t: 's',
    x: 1123,
    y: 249,
    s: 3.27,
    h: 4.21,
  },
  // s 2
  {
    t: 's',
    x: 494,
    y: 284,
    s: 3.40,
    h: 4.19,
  },
  // s 0
  {
    t: 's',
    x: 426,
    y: 232,
    s: 3.33,
    h: 4.14,
  },
];

// draw one star
function drawStar(type, x, y, scale) {
  // responsive position
  x *= wd;
  y *= hd;
  // disconnected path
  whaleCtx.beginPath();
  whaleCtx.moveTo(x, y);

  switch (type) {
    // small star
    case 's':
      const size = 10 * scale;
      whaleCtx.lineTo(x + size, y + size);
      whaleCtx.moveTo(x + size, y);
      whaleCtx.lineTo(x, y + size);

      break;
    // big star
    case 'b':
      const sizeX = 20 * scale,
        sizeY = 28 * scale,
        lx = x,
        ly = y,
        tx = lx + sizeX / 2,
        ty = ly - sizeY / 2,
        rx = lx + sizeX,
        ry = ly,
        bx = lx + sizeX / 2,
        by = ly + sizeY / 2,
        cx = lx + sizeX / 2,
        cy = ly;
      whaleCtx.bezierCurveTo(lx, ly, cx, cy, tx, ty);
      whaleCtx.bezierCurveTo(tx, ty, cx, cy, rx, ry);
      whaleCtx.bezierCurveTo(rx, ry, cx, cy, bx, by);
      whaleCtx.bezierCurveTo(bx, by, cx, cy, lx, ly);

      break;
  }

  // draw stroke
  whaleCtx.strokeStyle = "#fff";
  whaleCtx.stroke();
}

// rotate canvas by anchor point
function rotateWhaleCtx(angle, cx, cy) {
  whaleCtx.translate(cx, cy);
  whaleCtx.rotate(angle * Math.PI / 180);
  whaleCtx.translate(-cx, -cy);
}

// draw moon
function drawMoon(x, y, radius, dx, angle) {
  // responsive position
  x *= wd;
  y *= hd;
  // transform
  whaleCtx.save();
  rotateWhaleCtx(angle, x, y);
  // outer arc
  whaleCtx.beginPath();
  let startAngle = Math.PI / 8;
  whaleCtx.arc(x, y, radius, startAngle, 2 * Math.PI - startAngle);
  whaleCtx.strokeStyle = "#fff";
  whaleCtx.stroke();
  whaleCtx.closePath();
  // inner arc
  whaleCtx.beginPath();
  startAngle += Math.PI / 24;
  whaleCtx.arc(x + dx + 1, y, radius - dx, startAngle, 2 * Math.PI - startAngle);
  // draw stroke
  whaleCtx.stroke();
  whaleCtx.closePath();
  // restore context
  whaleCtx.restore();
}

// draw whale
const drawWhaleScene = () => {
  // set canvas size (fullwidth, fullheight)
  whaleCanvasDom.width = ww;
  whaleCanvasDom.height = wh;

  // clear context
  whaleCtx.clearRect(0, 0, ww, wh);

  if (whaleAnimate) {
    // draw stars by options
    starsOptions.forEach(starOption => {
      drawStar(starOption.t, starOption.x, starOption.y, starOption.sc || 0);
    });

    // draw moon
    const moonX = moonEndX - moonRadius * ((-moonRotateAngle - 32) * Math.PI / 180);
    drawMoon(moonX, moonY, moonRadius, moonDx, moonRotateAngle);
    // draw clouds
    whaleCtx.globalAlpha = cloudsOpacity;
    whaleCtx.drawImage(cloudLeftImgDom, cloudLeftL, cloudLeftT, cloudLeftWidth, cloudLeftHeight);
    whaleCtx.drawImage(cloudRightImgDom, cloudRightL, cloudRightT, cloudRightWidth, cloudRightHeight);
    // draw whale body image
    whaleCtx.globalAlpha = 1;
    whaleCtx.translate(whaleSceneX, whaleSceneY);
    rotateWhaleCtx(whaleSceneAngle, ww / 2, wh / 2);
    whaleCtx.drawImage(whaleBodyImgDom, whaleBodyL, whaleBodyT, whaleBodyWidth, whaleBodyHeight);
    // draw whale fin image
    whaleCtx.save();
    rotateWhaleCtx(whaleFinAngle, whaleFinL + 21 * wd, whaleFinT + 31 * wd);
    whaleCtx.drawImage(whaleFinImgDom, whaleFinL, whaleFinT, whaleFinWidth, whaleFinHeight);
    whaleCtx.restore();
    // draw whale tail image
    whaleCtx.save();
    rotateWhaleCtx(whaleTailAngle, whaleTailL + 10 * wd, whaleTailT + 12 * wd);
    whaleCtx.drawImage(whaleTailImgDom, whaleTailL, whaleTailT, whaleTailWidth, whaleTailHeight);
    whaleCtx.restore();
    // draw thread left
    // whaleCtx.scale(threadsScaleX, threadsScaleY);
    // whaleCtx.translate(threadsL, threadsT);
    // const threadLeft = new Path2D('M0,0 S 25,75,68,110 c43,35,84,92,84,98');
    // whaleCtx.lineWidth = 2;
    whaleCtx.strokeStyle = '#fff';
    // whaleCtx.stroke(threadLeft);
    whaleCtx.beginPath();
    // const threadLTX = threadRightL + 25 * wd,
    //   threadLTY = threadRightT + 75 * hd,
    //   threadMX = threadRightL + 68 * wd,
    //   threadMY = threadRightT + 110 * hd,
    //   threadBBX = threadMX + 84 * wd,
    //   threadBBY = threadMY + 98 * hd;
    const threadLeftBBX = whaleBodyL + 370 * wd,
      threadLeftBBY = whaleBodyT + 222 * wd,
      threadLeftMX = threadLeftBBX - 84 * wd,
      threadLeftMY = threadLeftBBY - 98 * wd,
      threadLeftBTX = threadLeftMX + 43 * wd,
      threadLeftBTY = threadLeftMY + 35 * wd,
      threadLeftBMX = threadLeftMX + 84 * wd,
      threadLeftBMY = threadLeftMY + 92 * wd,
      threadLeftT = threadLeftMY - 110 * wd,
      threadLeftL = threadLeftMX - 68 * wd,
      threadLeftLTY = threadLeftT + 75 * wd,
      threadLeftLTX = threadLeftL + 25 * wd;
    whaleCtx.moveTo(threadLeftL, threadLeftT);
    whaleCtx.bezierCurveTo(threadLeftL, threadLeftT, threadLeftLTX, threadLeftLTY, threadLeftMX, threadLeftMY);
    whaleCtx.bezierCurveTo(threadLeftBTX, threadLeftBTY, threadLeftBMX, threadLeftBMY, threadLeftBBX, threadLeftBBY);
    // whaleCtx.strokeStyle = 'red';
    whaleCtx.stroke();
    whaleCtx.closePath();
    // draw thread right
    const threadRightBBX = whaleBodyL + 312 * wd,
      threadRightBBY = whaleBodyT + 234 * wd,
      threadRightL = threadRightBBX - 30 * wd,
      threadRightT = threadRightBBY - 262 * wd,
      threadRightLTX = threadRightL + 16 * wd,
      threadRightLTY = threadRightT + 39 * wd,
      threadRightMX = threadRightL + 11 * wd,
      threadRightMY = threadRightT + 117 * wd,
      threadRightBTX = threadRightL + 6 * wd,
      threadRightBTY = threadRightT + 190 * wd,
      threadRightBMX = threadRightL + 25 * wd,
      threadRightBMY = threadRightT + 256 * wd;
    // const threadRight = new Path2D('M0,0 S16,39, 11,117, 25,256, 30,262');
    // whaleCtx.stroke(threadRight);
    whaleCtx.beginPath();
    whaleCtx.moveTo(threadRightL, threadRightT);
    // whaleCtx.bezierCurveTo(threadLTX, threadLTY, threadLTX, threadLTY, threadMX, threadMY);
    whaleCtx.bezierCurveTo(threadRightL, threadRightT, threadRightLTX, threadRightLTY, threadRightMX, threadRightMY);
    whaleCtx.bezierCurveTo(threadRightBTX, threadRightBTY, threadRightBMX, threadRightBMY, threadRightBBX, threadRightBBY);
    // whaleCtx.bezierCurveTo(0, 0, 16, 39, 11, 117);
    // whaleCtx.bezierCurveTo(6, 190, 25, 256, 30, 262);
    // whaleCtx.strokeStyle = 'red';
    whaleCtx.stroke();
    whaleCtx.closePath();
    // draw balloons
    whaleCtx.drawImage(balloonLeftImgDom, balloonLeftL, balloonLeftT, balloonLeftWidth, balloonLeftHeight);
    whaleCtx.drawImage(balloonRightImgDom, balloonRightL, balloonRightT, balloonRightWidth, balloonRightHeight);
  }
};

// Create an image object. This is not attached to the DOM and is not part of the page.
let whaleBodyImgDom = new Image(),
  whaleFinImgDom = new Image(),
  whaleTailImgDom = new Image(),
  cloudLeftImgDom = new Image(),
  cloudRightImgDom = new Image(),
  balloonLeftImgDom = new Image(),
  balloonRightImgDom = new Image(),
  loadWhaleCount = 0;

const increaseLoadWhaleImg = () => {
  loadWhaleCount++;

  if (loadWhaleCount === 7) {
    drawWhaleScene();
  }
};

// When the image has loaded, draw it to the canvas
whaleBodyImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
whaleFinImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
whaleTailImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
cloudLeftImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
cloudRightImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
balloonLeftImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// When the image has loaded, draw it to the canvas
balloonRightImgDom.onload = () => {
  increaseLoadWhaleImg();
};

// Now set the source of the image that we want to load
whaleBodyImgDom.src = '/img/whaleBody.png';
whaleFinImgDom.src = '/img/whaleFin.png';
whaleTailImgDom.src = '/img/whaleTail.png';
cloudLeftImgDom.src = '/img/cloudLeft.png';
cloudRightImgDom.src = '/img/cloudRight.png';
balloonLeftImgDom.src = '/img/balloonLeft.png';
balloonRightImgDom.src = '/img/balloonRight.png';

// animate stars show/hide
let startAnimations = [];

const animateStarsInfinite = () => {
  const starsAnimationTick = (progress) => {
    starsOptions = starsOptions.map(starOption => {
      const showAt = (starOption.s - 3.27) * 1000 || 0,
        hideAt = (starOption.h - 3.27) * 1000 || 0;
      // set star scale
      switch (starOption.t) {
        // big star
        case 'b':
          const starEasing = BezierEasing(.33, 0, .06, 1),
            scaleDuration = 400;
          if (progress < hideAt && progress >= showAt) {
            const starScaleProgress = (progress - showAt >= scaleDuration) ? 1 : (progress - showAt) / scaleDuration;
            starOption.sc = starEasing(starScaleProgress);
          } else if (progress > hideAt && progress - hideAt < scaleDuration) {
            const starScaleProgress = (progress - hideAt >= scaleDuration) ? 0 : (progress - hideAt) / scaleDuration;
            starOption.sc = 1 - starEasing(starScaleProgress);
          } else {
            starOption.sc = 0;
          }
          break;
        // small star
        case 's':
          starOption.sc = (progress < hideAt && progress >= showAt) ? 1 : 0;
          break;
        // big star
        default:
          starOption.sc = 0;
      }

      return starOption;
    });
  };

  const starsAnimations = [
    () => animateDuration(starsAnimationTick, 2960),
    () => animateDuration(starsAnimationTick, 2960),
    () => animateDuration(starsAnimationTick, 2960),
  ];

  runSerial(starsAnimations);
};

// start whale animation
const startStarsAnimationInfinite = () => {
  // animatePosterTearOff();
  const globalWhaleAnimationTick = (globalProgress) => {
    if (globalProgress === 0) {
      animateStarsInfinite();
    }
    // animateClouds(progress);
    // animateMoon(progress);
    // animateWhale(progress);
    // animateWhaleBody(progress);
    // draw scene
    // drawWhaleScene();
  };

  const animations = [
    () => animateDuration(globalWhaleAnimationTick, 6000)
  ];

  runSerial(animations).then(startStarsAnimationInfinite);
};

// animate clouds show/hide
const animateClouds = () => {
  // clouds position x
  const cloudLeftXTick = (from, to) => (progress) => {
    cloudLeftL = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };
  const cloudRightXTick = (from, to) => (progress) => {
    cloudRightL = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const cloudLeftXFrom = (1113 - 612 / 2) * wd,
    cloudLeftXTo = cloudLeftXFrom - 660 * wd,
    cloudLeftAnimations = [
      () => animateEasing(cloudLeftXTick(cloudLeftXFrom, cloudLeftXTo), 2467, BezierEasing(.11, 0, 0, 1)),
    ],
    cloudRightXFrom = (463 - 644 / 2) * wd,
    cloudRightXTo = cloudRightXFrom + 660 * wd,
    cloudRightAnimations = [
      () => animateEasing(cloudRightXTick(cloudRightXFrom, cloudRightXTo), 2467, BezierEasing(.11, 0, 0, 1)),
    ];

  runSerial(cloudLeftAnimations);
  runSerial(cloudRightAnimations);

  // clouds opacity
  const cloudsOpacityTick = (progress) => {
    cloudsOpacity = progress;
    // console.log(progress);
  };

  animateEasing(cloudsOpacityTick, 850, BezierEasing(0, 0, 1, 1));
};

// animate clouds show/hide
const animateCloudsInfinite = () => {
  const cloudLeftYTick = (from, to) => (progress) => {
    cloudLeftT = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };
  const cloudRightYTick = (from, to) => (progress) => {
    cloudRightT = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const cloudLeftYFrom = cloudLeftT,
    cloudLeftYTo = cloudLeftYFrom - 20 * wd,
    cloudLeftAnimations = [
      () => animateEasing(cloudLeftYTick(cloudLeftYFrom, cloudLeftYTo), 4883, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(cloudLeftYTick(cloudLeftYTo, cloudLeftYFrom), 4317, BezierEasing(.33, 0, .67, 1)),
    ],
    cloudRightYFrom = cloudRightT,
    cloudRightYTo = cloudRightYFrom + 20 * wd,
    cloudRightAnimations = [
      () => animateEasing(cloudRightYTick(cloudRightYFrom, cloudRightYTo), 4883, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(cloudRightYTick(cloudRightYTo, cloudRightYFrom), 4317, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(cloudLeftAnimations);
  runSerial(cloudRightAnimations);
};

// start animate clouds infinite
const startAnimateCloudsInfinite = () => {
  // animatePosterTearOff();
  const globalWhaleAnimationTick = (globalProgress) => {
    if (globalProgress === 0) {
      animateCloudsInfinite();
    }
    // animateClouds(progress);
    // animateMoon(progress);
    // animateWhale(progress);
    // animateWhaleBody(progress);
    // draw scene
    // drawWhaleScene();
  };

  const animations = [
    () => animateDuration(globalWhaleAnimationTick, 9200)
  ];

  runSerial(animations).then(startAnimateCloudsInfinite);
};

// start animate clouds infinite
const startAnimateClouds = () => {
  // animatePosterTearOff();
  const globalWhaleAnimationTick = (globalProgress) => {
    if (globalProgress === 0) {
      animateClouds();
    }
    // animateClouds(progress);
    // animateMoon(progress);
    // animateWhale(progress);
    // animateWhaleBody(progress);
    // draw scene
    // drawWhaleScene();
  };

  const animations = [
    () => animateDuration(globalWhaleAnimationTick, 2467)
  ];

  runSerial(animations).then(startAnimateCloudsInfinite);
};

// animate clouds show/hide
const animateMoon = () => {
  // moon rotate
  const moonRotateTick = (from, to) => (progress) => {
    moonRotateAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const moonAnimations = [
    () => animateEasing(moonRotateTick(-450, -20), 2033, BezierEasing(.55, 0, .12, 1)),
    () => animateEasing(moonRotateTick(-20, -37), 683, BezierEasing(.31, 0, .69, 1)),
    () => animateEasing(moonRotateTick(-37, -32), 717, BezierEasing(.17, 0, .69, 1)),
  ];

  runSerial(moonAnimations);
};

// animate clouds show/hide
const animateWhaleShow = () => {
  // whale x
  const whaleXAnimationTick = (progress) => {
    const from = 1180 * wd,
      to = 0;
    whaleSceneX = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  animateEasing(whaleXAnimationTick, 3900, BezierEasing(.11, .26, 0, 1));
};

// animate clouds show/hide
const animateWhaleInfinite = () => {
  // whale tail
  const whaleTailAnimationTick = (from, to) => (progress) => {
    whaleTailAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const whaleTailAnimations = [
    () => animateEasing(whaleTailAnimationTick(-20, 7), 3250, BezierEasing(.33, 0, .67, 1)),
    () => animateEasing(whaleTailAnimationTick(7, -20), 2750, BezierEasing(.33, 0, .67, 1)),
    // () => animateEasing(whaleTailAnimationTick(-20, 7), 3250, BezierEasing(.33, 0, .67, 1)),
    // () => animateEasing(whaleTailAnimationTick(7, -20), 2750, BezierEasing(.33, 0, .67, 1)),
  ];

  runSerial(whaleTailAnimations);
  // whale fin
  const whaleFinAnimationTick = (from, to) => (progress) => {
    whaleFinAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const whaleFinAnimations = [
    () => animateEasing(whaleFinAnimationTick(26, 3), 2367, BezierEasing(.33, 0, .33, 1)),
    () => animateEasing(whaleFinAnimationTick(3, 26), 3567, BezierEasing(.33, 0, .67, 1)),
    // () => animateEasing(whaleFinAnimationTick(26, 3), 2367, BezierEasing(.33, 0, .33, 1)),
    // () => animateEasing(whaleFinAnimationTick(3, 26), 3567, BezierEasing(.33, 0, .67, 1)),
  ];

  runSerial(whaleFinAnimations);
  // balloon left
  // y
  const balloonLeftYAnimationTick = (from, to) => (progress) => {
    balloonLeftT = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const balloonLeftYFrom = balloonLeftT,
    balloonLeftYTo = balloonLeftYFrom + 20 * wd,
    balloonLeftYAnimations = [
      () => animateEasing(balloonLeftYAnimationTick(balloonLeftYFrom, balloonLeftYTo), 2525, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(balloonLeftYAnimationTick(balloonLeftYTo, balloonLeftYFrom), 3475, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonLeftYAnimationTick(balloonLeftYFrom, balloonLeftYTo), 2525, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonLeftYAnimationTick(balloonLeftYTo, balloonLeftYFrom), 3475, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(balloonLeftYAnimations);
  // x
  const balloonLeftXAnimationTick = (from, to) => (progress) => {
    balloonLeftL = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const balloonLeftXFrom = balloonLeftL,
    balloonLeftXTo = balloonLeftXFrom + 8 * wd,
    balloonLeftXAnimations = [
      () => animateEasing(balloonLeftXAnimationTick(balloonLeftXFrom, balloonLeftXTo), 2525, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(balloonLeftXAnimationTick(balloonLeftXTo, balloonLeftXFrom), 3475, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonLeftXAnimationTick(balloonLeftXFrom, balloonLeftXTo), 2525, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonLeftXAnimationTick(balloonLeftXTo, balloonLeftXFrom), 3475, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(balloonLeftXAnimations);
  // balloon right
  // y
  const balloonRightYAnimationTick = (from, to) => (progress) => {
    balloonRightT = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const balloonRightYFrom = balloonRightT,
    balloonRightYTo = balloonRightYFrom + 20 * wd,
    balloonRightYAnimations = [
      () => animateEasing(balloonRightYAnimationTick(balloonRightYFrom, balloonRightYTo), 2525, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(balloonRightYAnimationTick(balloonRightYTo, balloonRightYFrom), 3475, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonRightYAnimationTick(balloonRightYFrom, balloonRightYTo), 2525, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonRightYAnimationTick(balloonRightYTo, balloonRightYFrom), 3475, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(balloonRightYAnimations);
  // x
  const balloonRightXAnimationTick = (from, to) => (progress) => {
    balloonRightL = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const balloonRightXFrom = balloonRightL,
    balloonRightXTo = balloonRightXFrom + 5 * wd,
    balloonRightXAnimations = [
      () => animateEasing(balloonRightXAnimationTick(balloonRightXFrom, balloonRightXTo), 2525, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(balloonRightXAnimationTick(balloonRightXTo, balloonRightXFrom), 3475, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonRightXAnimationTick(balloonRightXFrom, balloonRightXTo), 2525, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(balloonRightXAnimationTick(balloonRightXTo, balloonRightXFrom), 3475, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(balloonRightXAnimations);

  // whale y
  const whaleYAnimationTick = (from, to) => (progress) => {
    whaleSceneY = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const whaleYFrom = 80,
    whaleYTo = 0,
    whaleYAnimations = [
      () => animateEasing(whaleYAnimationTick(whaleYFrom, whaleYTo), 3079, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(whaleYAnimationTick(whaleYTo, whaleYFrom), 2854, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(whaleYAnimationTick(whaleYFrom, whaleYTo), 3079, BezierEasing(.33, 0, .67, 1)),
      // () => animateEasing(whaleYAnimationTick(whaleYTo, whaleYFrom), 2854, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(whaleYAnimations);
  // whale angle
  const whaleAngleAnimationTick = (from, to) => (progress) => {
    whaleSceneAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
  };

  const whaleAngleFrom = -3,
    whaleAngleTo = 5,
    whaleAngleAnimations = [
      () => animateEasing(whaleAngleAnimationTick(whaleAngleFrom, whaleAngleTo), 2525, BezierEasing(.33, 0, .67, 1)),
      () => animateEasing(whaleAngleAnimationTick(whaleAngleTo, whaleAngleFrom), 3475, BezierEasing(.33, 0, .67, 1)),
    ];

  runSerial(whaleAngleAnimations);
};

// start whale animation
const startWhaleAnimationInfinite = () => {
  // animatePosterTearOff();
  const globalWhaleAnimationTick = (globalProgress) => {
    if (globalProgress === 0) {
      animateWhaleInfinite();
    }
    // animateClouds(progress);
    // animateMoon(progress);
    // animateWhale(progress);
    // animateWhaleBody(progress);
    // draw scene
    drawWhaleScene();
  };

  const animations = [
    () => animateDuration(globalWhaleAnimationTick, 6000)
  ];

  runSerial(animations).then(startWhaleAnimationInfinite);
};

// global flag about whale animation on start equal true (draw only on animation)
let whaleAnimate = false;

// start whale animation
const startWhaleAnimation = () => {
  if (!whaleAnimate) {
    whaleAnimate = true;

    const globalWhaleAnimationTick = (globalProgress) => {
      if (globalProgress >= 0 && startAnimations.indexOf(0) === -1) {
        startAnimations.push(0);

        animateWhaleShow();
        startWhaleAnimationInfinite();
      }

      if (globalProgress >= 400 && startAnimations.indexOf(400) === -1) {
        startAnimations.push(400);

        startStarsAnimationInfinite();
        animateMoon();
      }

      if (globalProgress >= 233 && startAnimations.indexOf(233) === -1) {
        startAnimations.push(233);

        startAnimateClouds();
      }
      // animateClouds(progress);
      // animateMoon(progress);
      // animateWhale(progress);
      // animateWhaleBody(progress);
      // draw scene
      // drawWhaleScene();
    };

    animateDuration(globalWhaleAnimationTick, 3900);
  }
};

export {setWhaleSceneSizing, drawWhaleScene, startWhaleAnimation}
