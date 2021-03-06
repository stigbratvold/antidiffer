"use strict";

/**
 * Configuration
 */
const config = {
  // The selector for the container in which to generate the shapes
  container: ".shapes",

  // An array of the length of each style set.
  // With styleSets: [3,3], the CSS classes used will be .style-1-1, .style-1-2, .style-1-3, .style-2-1, .style-2-2 and .style-2-3
  styleSets: [1, 1, 1, 1, 1, 1, 1, 1],

  // Interval of color set switches
  styleSetSwitchInterval: 6,

  // The stages for animating the icons
  stage1: ".zero",
  stage2: ".zeroone",
  stage3: ".onezero"
};

/**
 * Application state
 */
const state = {
  // Simple touch device check
  isTouch: "ontouchstart" in document.documentElement,

  // Current mouse cursor position
  mouseX: undefined,
  mouseY: undefined,

  // Remember the previous scroll position to keep rotations fresh when scrolling
  lastScrollY: 0,

  // What color set we are currently using
  styleSetIndex: 0,

  // What color in the current set we are currently using
  styleIndex: 0,

  // The DOM element of the element containing the shapes
  container: undefined,

  // An array of the actual particles elements and some metadata (positioning)
  shapes: [],

  // The positions of the stage nodes
  stage1: undefined, // The node itself
  stage1top: undefined,
  stage1bottom: undefined,
  stage2: undefined, // The node itself
  stage2top: undefined,
  stage2bottom: undefined,
  stage3: undefined, // The node itself
  stage3top: undefined,
  stage3bottom: undefined
};

/**
 * Throttle, based on requestAnimationFrame
 */
function throttle(fn) {
  var requestId, lastArgs;

  function later(context) {
    return function() {
      requestId = null;
      fn.apply(context, lastArgs);
    };
  }

  function throttledFunction() {
    lastArgs = arguments;
    if (!requestId) {
      requestId = requestAnimationFrame(later(this));
    }
  }

  throttledFunction.cancel = function() {
    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }
  };

  return throttledFunction;
}

/**
 * Initialize shapes
 */
function initializeShapes() {
  // Generate the DOM markup for each shape
  generateElements();

  // Switch color set every 10 seconds
  setInterval(selectNextStyleSet, config.styleSetSwitchInterval * 1000);

  // For testing touch functionality on desktop:
  // state.isTouch = true;

  // Add listener for device orientation
  if (state.isTouch) {
    state.container.className = "shapes is-mobile";
    window.addEventListener(
      "deviceorientation",
      throttle(updateDeviceOrientation),
      true
    );
  } else {
    // Add listener for mouse position
    window.addEventListener("mousemove", throttle(updateMousePosition));
  }

  window.addEventListener("scroll", throttle(updateScroll));
  window.addEventListener("resize", throttle(updateWindowBounds));
  // And run it once during startup:
  updateWindowBounds();
}

/**
 * Update device orientation
 */
function updateDeviceOrientation(e) {
  const deg = e.webkitCompassHeading ? e.webkitCompassHeading : e.alpha;
  // const t = Math.round(e.webkitCompassHeading);
  state.deviceRotation = deg;

  if (!state.shapes) {
    return;
  }

  for (var i = 0; i < state.shapes.length; i++) {
    const shape = state.shapes[i];
    shape.element.style.transform = "rotate(" + deg + "deg)";
  }
}

/**
 * Update the mouse position
 */
function updateMousePosition(e) {
  // Skip mouse position events on touch devices
  if (state.isTouch) {
    return;
  }
  state.mouseX = e.clientX;
  state.mouseY = e.clientY + window.scrollY;
  updateRotations();
}

function updateScroll() {
  state.mouseY += window.scrollY - state.lastScrollY;
  state.lastScrollY = window.scrollY;
  // updateWindowBounds();
  updateRotations();
  updateStage();
}

function updateStage() {
  var midpoint = state.lastScrollY + window.innerHeight / 2;

  document.body.classList.remove("stage0");
  document.body.classList.remove("stage1");
  document.body.classList.remove("stage2");
  document.body.classList.remove("stage3");

  if (midpoint > state.stage1top && midpoint < state.stage1bottom) {
    document.body.classList.add("stage1");
  }

  if (midpoint > state.stage2top && midpoint < state.stage2bottom) {
    document.body.classList.add("stage2");
  }

  if (midpoint > state.stage3top && midpoint < state.stage3bottom) {
    document.body.classList.add("stage3");
  }

  // let stage = 0;
  // if (midpoint > state.stage1top) {
  //   stage = 1;
  // }
  // if (midpoint > state.stage2top) {
  //   stage = 2;
  // }
  // if (midpoint > state.stage3top) {
  //   stage = 3;
  // }
  // document.body.classList.add('stage' + stage.toString());
  // document.body.className = "stage" + stage.toString();
}

function updateRotations() {
  if (!state.shapes) {
    return;
  }

  for (var i = 0; i < state.shapes.length; i++) {
    const shape = state.shapes[i];
    var u = Math.atan2(
      state.mouseX - (shape.left - shape.width / 2),
      state.mouseY - (shape.top - shape.height / 2)
    );
    var l = Math.round(u * (180 / Math.PI) * -1);
    shape.element.style.transform = "rotate(" + l + "deg)";
  }
}

function touchShape(e) {
  const pe = e.currentTarget.parentElement;
  const classes = pe.className.split(" ");
  const newClasses = [];
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].indexOf("style-") !== 0) {
      newClasses.push(classes[i]);
    }
  }
  pe.className = newClasses.join(" ") + " " + getNextStyleClass();
}

/**
 * Extract the shape elements from the DOM
 */
function generateElements() {
  if (!state.stage1) {
    state.stage1 = document.querySelector(config.stage1);
  }
  if (!state.stage2) {
    state.stage2 = document.querySelector(config.stage2);
  }
  if (!state.stage3) {
    state.stage3 = document.querySelector(config.stage3);
  }
  if (!state.container) {
    state.container = document.querySelector(config.container);
  }
  state.shapes = [];
  const elements = document.querySelectorAll(
    config.container + " .shape > .element"
  );
  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    state.shapes.push({ element: element });
    element.addEventListener("mouseenter", touchShape);
    element.addEventListener("touchstart", touchShape);
  }
}

function getAbsoluteOffsets(el) {
  const res = {
    left: el.offsetLeft,
    top: el.offsetTop
  };
  var parent = el.offsetParent;
  while (parent) {
    res.left += parent.offsetLeft;
    res.top += parent.offsetTop;
    parent = parent.offsetParent;
  }
  return res;
}

/**
 * Recalculate positions, offsets after scroll/resize
 */
function updateWindowBounds() {
  const s1 = state.stage1.getBoundingClientRect();
  const ao1 = getAbsoluteOffsets(state.stage1);
  state.stage1top = ao1.top;
  state.stage1bottom = ao1.top + s1.height;

  const s2 = state.stage2.getBoundingClientRect();
  const ao2 = getAbsoluteOffsets(state.stage2);
  state.stage2top = ao2.top;
  state.stage2bottom = ao2.top + s2.height;

  const s3 = state.stage3.getBoundingClientRect();
  const ao3 = getAbsoluteOffsets(state.stage3);
  state.stage3top = ao3.top;
  state.stage3bottom = ao3.top + s3.height;

  for (var i = 0; i < state.shapes.length; i++) {
    var el = state.shapes[i].element;
    state.shapes[i].height = el.parentElement.offsetHeight;
    state.shapes[i].width = el.parentElement.offsetWidth;
    state.shapes[i].left = el.offsetLeft + el.parentElement.offsetWidth / 2;
    state.shapes[i].top = el.offsetTop + el.parentElement.offsetHeight / 2;

    var parent = el.offsetParent;
    while (parent) {
      state.shapes[i].left += parent.offsetLeft;
      state.shapes[i].top += parent.offsetTop;
      parent = parent.offsetParent;
    }
  }
}

/**
 * Select the next color set
 */
function selectNextStyleSet() {
  const newValue = (state.styleSetIndex + 1) % config.styleSets.length;
  // console.log("Changing color set from", state.colorIndex, "to", newValue);
  state.styleSetIndex = newValue;
  state.styleIndex = 0;
}

/**
 * Retrieve the next color from the current color set
 */
function getNextStyleClass() {
  // Instead of sequentially going through styleIndex, one could also use
  // Math.random() to select a random style from the current set.
  var className =
    "style-" +
    (state.styleSetIndex + 1).toString() +
    "-" +
    (state.styleIndex + 1).toString();

  state.styleIndex =
    (state.styleIndex + 1) % config.styleSets[state.styleSetIndex];

  // console.log('Retrieving the next color from the set', color);
  return className;
}

document.addEventListener("DOMContentLoaded", initializeShapes);
