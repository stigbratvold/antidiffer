"use strict";

/**
 * Configuration
 */
const config = {
  // Number of shapes to generate
  shapes: 126,

  // The selector for the container in which to generate the shapes
  container: ".shapes",

  // An array of the length of each style set.
  // With styleSets: [3,3], the CSS classes used will be .style-1-1, .style-1-2, .style-1-3, .style-2-1, .style-2-2 and .style-2-3
  styleSets: [1, 1, 1, 1],

  // Interval of color set switches
  styleSetSwitchInterval: 6
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

  // What color set we are currently using
  styleSetIndex: 0,

  // What color in the current set we are currently using
  styleIndex: 0,

  // The DOM element of the element containing the shapes
  container: undefined,

  // An array of the actual particles elements and some metadata (positioning)
  shapes: []
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

  // Add listener for mouse position
  window.addEventListener("mousemove", throttle(updateMousePosition));

  // Add listener for scrolling/resizing
  const throttledUpdateWindowBounds = throttle(updateWindowBounds);
  window.addEventListener("resize", throttledUpdateWindowBounds);
  window.addEventListener("scroll", throttledUpdateWindowBounds);

  // And run it once during startup:
  updateWindowBounds();
}

/**
 * Update the mouse position
 */
function updateMousePosition(e) {
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;

  // For every shape

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

/**
 * Generate the shape elements
 */
function generateElements() {
  if (!state.container) {
    state.container = document.querySelector(config.container);
  }
  state.shapes = [];
  for (var i = 0; i < config.shapes; i++) {
    const elementContainer = document.createElement("div");
    const element = document.createElement("span");
    element.classList.add("element");
    elementContainer.appendChild(element);
    state.container.appendChild(elementContainer);
    state.shapes.push({ element: element });
    element.addEventListener("mouseenter", function(e) {
      element.parentElement.className = getNextStyleClass();
    });
  }
}

/**
 * Recalculate positions, offsets after scroll/resize
 */
function updateWindowBounds() {
  for (var i = 0; i < config.shapes; i++) {
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

// if (this.state.isTouch) {
//     window.addEventListener(
//       'deviceorientation',
//       this.updateOrientation,
//       true
//     );
//   }

//   updateOrientation = animationThrottle((e: DeviceOrientationEvent) => {
//     const t = Math.round((e as any).webkitCompassHeading);
//     this.setState({
//       rotation: t,
//       //   translateX: 0,
//       //   translateY: 0,
//     });
//   });

document.addEventListener("DOMContentLoaded", initializeShapes);
