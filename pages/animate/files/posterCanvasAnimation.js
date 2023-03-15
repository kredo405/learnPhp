// poster canvas animation
import {BezierEasing} from "../helpers/cubicBezier";
import {animateDuration, animateEasing, animateProgress} from "../helpers/animate";
import {runSerial} from "../helpers/promise";
import {startWhaleAnimation} from "./whaleCanvasAnimation";

// global window sizing
let ww = window.innerWidth,
  wh = window.innerHeight,
  wd = window.innerWidth / 1440;

// canvas variables
const posterCanvasDom = document.getElementById('poster-canvas'),
  posterCtx = posterCanvasDom.getContext('2d'),
  posterBgCanvasDom = document.getElementById('poster-bg-canvas'),
  posterBgCtx = posterBgCanvasDom.getContext('2d');

// global poster sizing
let posterWidth, posterHeight,
  posterL, posterT, posterR, posterB;

const setPosterSize = () => {
  // global window sizing
  ww = window.innerWidth;
  wh = window.innerHeight;
  wd = window.innerWidth / 1440;

  // console.log(ww, wh, wd);
  const isMobile = window.innerWidth < 770;

  // global poster sizing
  posterWidth = (isMobile) ? ww : Math.round(340 * wd);
  posterHeight = Math.round(posterWidth * 494/340);
  posterL = Math.round((ww - posterWidth) / 2);
  posterT = Math.round((wh - posterHeight) / 2 + 17 * wd);
  posterR = posterL + posterWidth;
  posterB = posterT + posterHeight;
};

// set poster sizing on load document
setPosterSize();

// console.log(posterL, posterT, posterR, posterB);

// poster parameters
let cornerAlpha = 0,
  cornerWidth = 150,
  posterScaleY = 1,
  posterSkewX = 0,
  posterTranslateX = 0,
  posterRotateAngle = 0;

// draw poster bg (purple rectangle)
const drawPosterBg = () => {
  // set canvas size (fullwidth, fullheight)
  posterBgCanvasDom.width = ww;
  posterBgCanvasDom.height = wh;

  // clear context
  posterBgCtx.clearRect(0, 0, ww, wh);

  // draw poster background
  posterBgCtx.fillStyle = '#c78fff';
  posterBgCtx.fillRect(posterL + 1, posterT + 1, posterWidth - 2, posterHeight - 2);
};

// rotate poster around anchor point
const rotatePoster = (angle, cx, cy) => {
  posterCtx.translate(cx, cy);
  posterCtx.rotate(angle * Math.PI / 180);
  posterCtx.translate(-cx, -cy);
};

// draw poster (illusionist avatar)
const drawPoster = () => {
  // set canvas size (fullwidth, fullheight)
  posterCanvasDom.width = ww;
  posterCanvasDom.height = wh;

  // clear context
  posterCtx.clearRect(0, 0, ww, wh);

  // draw poster corner trianges (purple + gray)
  function drawPosterCorner(alpha, deltaWidth) {
    const radian = alpha * Math.PI / 180,
      deltaHeight = deltaWidth * Math.tan(radian);

    // draw corner triangle gray
    // begin back path
    posterCtx.beginPath();

    // inner triangle points
    if (deltaWidth <= posterWidth) {
      // L
      posterCtx.moveTo(posterR - deltaWidth, posterB);
      // R
      posterCtx.lineTo(posterR, posterB - deltaHeight);
      // T
      posterCtx.lineTo(posterR - deltaHeight * Math.sin(2 * radian),
        posterB - deltaHeight * (Math.cos(2 * radian) + 1));
    }
    // outer trapezoid points
    else {
      const outerDeltaWidth = deltaWidth - posterWidth,
        outerDeltaHeight = outerDeltaWidth * Math.tan(radian);
      // LB
      posterCtx.moveTo(posterL, posterB - outerDeltaWidth * Math.tan(radian));
      // RB
      posterCtx.lineTo(posterR, posterB - deltaHeight);
      // RT
      posterCtx.lineTo(posterR - deltaHeight * Math.sin(2 * radian),
        posterB - deltaHeight * (1 + Math.cos(2 * radian)));
      // LT
      posterCtx.lineTo(posterL - outerDeltaHeight * Math.sin(2 * radian),
        posterB - outerDeltaHeight * (1 + Math.cos(2 * radian)));
    }

    // close back path
    posterCtx.closePath();
    posterCtx.fillStyle = '#ccc';
    posterCtx.fill();
    // save context transform
    posterCtx.save();

    // mask poster corner
    rotatePoster(-alpha, posterR - deltaWidth, posterB);
    // restore context transform
    posterCtx.clearRect(posterL - posterWidth/4, posterB, posterWidth + posterWidth/2, deltaHeight);
    // posterCtx.fillStyle = '#fff';
    posterCtx.restore();
  }

  // transform poster scene
  posterCtx.transform(1, posterSkewX, 0, posterScaleY, posterTranslateX, 0);
  rotatePoster(posterRotateAngle, ww/2, 0);
  // draw poster image
  posterCtx.drawImage(posterImgDom, posterL, posterT, posterWidth, posterHeight);
  // draw corner triangles
  drawPosterCorner(cornerAlpha, cornerWidth);
};

// Create an image object. This is not attached to the DOM and is not part of the page.
let posterImgDom = new Image();

// When the image has loaded, draw it to the canvas
posterImgDom.onload = () => {
  drawPoster();
};

// Now set the source of the image that we want to load
posterImgDom.src = '/img/pic1.jpg';

// animation ticks
// corner union (width + alpha)
const cornerAnimationTick = (fromAlpha, toAlpha, fromWidth, toWidth) => (progress) => {
  // alpha
  cornerAlpha = fromAlpha + progress * Math.sign(toAlpha - fromAlpha) * Math.abs(toAlpha - fromAlpha);
  // width
  if (fromWidth && toWidth) {
    cornerWidth = fromWidth + progress * Math.sign(toWidth - fromWidth) * Math.abs(toWidth - fromWidth);
  }
};

// poster scale by y
const posterScaleYAnimationTick = (from, to) => (progress) => {
  posterScaleY = from + progress * Math.sign(to - from) * Math.abs(to - from);
};

// poster skew by x
const posterSkewXAnimationTick = (from, to) => (progress) => {
  posterSkewX = from + progress * Math.sign(to - from) * Math.abs(to - from);
};

// poster translate x
const posterTranslateXAnimationTick = (from, to) => (progress) => {
  posterTranslateX = from + progress * Math.sign(to - from) * Math.abs(to - from);
};

// poster rotate angle
const posterRotateAnimationTick = (from, to) => (progress) => {
  posterRotateAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
};

// animation for corner init fluid
function animateCornerFluid() {
  // animate corner alpha and width
  const cornerFluidEasing = BezierEasing(0.33, 0, 0.67, 1),
    cornerWidthTo = cornerWidth - 10,
    cornerWidthFrom = cornerWidth,
    cornerAlphaAnimations = [
      () => animateEasing(cornerAnimationTick(0, 7), 500, cornerFluidEasing),
      () => animateEasing(cornerAnimationTick(7, 0), 500, cornerFluidEasing),
      () => animateEasing(cornerAnimationTick(0, 6), 667, cornerFluidEasing),
      () => animateEasing(cornerAnimationTick(6, 2), 367, cornerFluidEasing),
      () => animateEasing(cornerAnimationTick(2, 17, cornerWidthFrom, cornerWidthTo), 617, cornerFluidEasing),
      () => animateEasing(cornerAnimationTick(17, 0, cornerWidthTo, cornerWidthFrom), 417, cornerFluidEasing),
    ];

  runSerial(cornerAlphaAnimations);
}

// animation poster tear off
function animatePosterTearOff() {
  // corner alpha and width
  const cornerEasing = BezierEasing(0.41, 0, 0.05, 1),
    cornerWidthFrom = cornerWidth,
    cornerWidthTo = cornerWidthFrom + 250;

  animateEasing(cornerAnimationTick(0, 15, cornerWidth, cornerWidthTo), 500, cornerEasing);

  // poster skew by x
  const posterSkewXEasing = BezierEasing(0.33, 0, 0, 1);

  animateEasing(posterSkewXAnimationTick(0, 15 / wh), 633, posterSkewXEasing);

  // poster scale by y
  const posterScaleYEasing = BezierEasing(0.33, 0, 0, 1);

  animateEasing(posterScaleYAnimationTick(1, .9), 633, posterScaleYEasing);

  // poster rotate
  const posterRotateEasing = BezierEasing(0.2, 0, 0, 1);

  animateEasing(posterRotateAnimationTick(0, 35), 1200, posterRotateEasing);

  // poster translate by x
  const posterTranslateXEasing = BezierEasing(0.2, 0, 0, 1);

  animateEasing(posterTranslateXAnimationTick(0, -976), 1800, posterTranslateXEasing);
}

let startPosterAnimations = [];

// global flag that poster already animated
let posterAnimate = false;

// start poster animation
const startPosterAnimation = () => {
  if (!posterAnimate) {
    posterAnimate = true;

    // animatePosterTearOff();
    const globalFluidAnimationTick = (globalProgress) => {
      if (globalProgress >= 0 && startPosterAnimations.indexOf('fluid') === -1) {
        startPosterAnimations.push('fluid');
        // animatePosterTearOff();
        animateCornerFluid();
      }
      // .then(animatePosterTearOff);
      // draw scene
      drawPoster();
    };

    const globalTearOffAnimationTick = (globalProgress) => {
      if (globalProgress >= 0 && startPosterAnimations.indexOf('tear-off') === -1) {
        startPosterAnimations.push('tear-off');
        // animatePosterTearOff();
        animatePosterTearOff();
      }
      // .then(animatePosterTearOff);
      // draw scene
      drawPoster();
    };

    const posterAnimations = [
      () => animateDuration(globalFluidAnimationTick, 3068),
      () => animateDuration(globalTearOffAnimationTick, 1800),
    ];

    runSerial(posterAnimations).then(startWhaleAnimation);
  }
};

export {setPosterSize, drawPosterBg, drawPoster, startPosterAnimation}
