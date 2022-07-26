//get reference to Canvas
var canvas = document.getElementById("canvas");

//get reference to Canvas context
var context = canvas.getContext("2d");

//get reference to loading screen
var loadingScreen = document.getElementById("loading");

//initialize loading variables
var loaded = false;
var loadCounter = 0;

//initialize images for layers
var background = new Image();
var floaties = new Image();
var shadow = new Image();
var clouds = new Image();
var mask = new Image();
var human = new Image();
var orbs = new Image();

//create a list of layer objects
var layerList = [
  {
    image: background,
    src: "/src/parallaxfolder/Parallax-1.png",
    z_index: -2.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: floaties,
    src: "/src/parallaxfolder/Parallax-2.png",
    z_index: -2,
    position: { x: 0, y: 0 },
    blend: "overlay",
    opacity: 1,
  },
  {
    image: shadow,
    src: "/src/parallaxfolder/Parallax-3.png",
    z_index: -1.25,
    position: { x: 0, y: 0 },
    blend: "multiply",
    opacity: 1,
  },
  {
    image: clouds,
    src: "/src/parallaxfolder/Parallax-4.png",
    z_index: -0.75,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: mask,
    src: "/src/parallaxfolder/Parallax-5.png",
    z_index: 0,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: human,
    src: "/src/parallaxfolder/Parallax-6.png",
    z_index: 1.25,
    position: { x: 0, y: 0 },
    blend: null,
    opacity: 1,
  },
  {
    image: orbs,
    src: "/src/parallaxfolder/Parallax-7.png",
    z_index: 2,
    position: { x: 0, y: 0 },
    blend: "add",
    opacity: 0.9,
  },
];

layerList.forEach(function (layer, index) {
  layer.image.onload = function () {
    loadCounter += 1;
    if (loadCounter >= layerList.length) {
      hideLoading();
      requestAnimationFrame(drawCanvas);
    }
  };
  layer.image.src = layer.src;
});

function hideLoading() {
  loadingScreen.classList.add("hidden");
}

function drawCanvas() {
  //clear whatever is in canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //calculate how much canvas should rotate
  var rotate_x = pointer.y * -0.15 + motion.y * -1.2;
  var rotate_y = pointer.x * 0.15 + motion.x * 1.2;

  var transformString =
    "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
  canvas.style.transform = transformString;
  //loop through each layer and draw it to the canvas
  layerList.forEach(function (layer, index) {
    layer.position = getOffset(layer);

    if (layer.blend) {
      context.globalCompositeOperation = layer.blend;
    } else {
      context.globalCompositeOperation = "normal";
    }

    context.globalAlpha = layer.opacity;

    context.drawImage(layer.image, layer.position.x, layer.position.y);
  });

  requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
  var touch_multiplier = 0.1;
  var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
  var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

  var motion_multiplier = 2;
  var motionOffset_x = motion.x * layer.z_index * motion_multiplier;
  var motionOffset_y = motion.y * layer.z_index * motion_multiplier;

  var offset = {
    x: touch_offset_x + motionOffset_x,
    y: touch_offset_y + motionOffset_y,
  };

  return offset;
}

//TOUCH AND MOUSE CONTROLS
var moving = false;

//initialize touch and mouse position
pointerInitial = {
  x: 0,
  y: 0,
};

var pointer = {
  x: 0,
  y: 0,
};

canvas.addEventListener("touchstart", pointerStart);
canvas.addEventListener("mousedown", pointerStart);

function pointerStart(event) {
  moving = true;
  if (event.type === "touchstart") {
    pointerInitial.x = event.touches[0].clientX;
    pointerInitial.y = event.touches[0].clientY;
  } else if (event.type === "mousedown") {
    pointerInitial.x = event.clientX;
    pointerInitial.y = event.clientY;
  }
}

window.addEventListener("touchmove", pointerMove);
window.addEventListener("mousemove", pointerMove);
function pointerMove(event) {
  event.preventDefault();
  if (moving === true) {
    var current_x = 0;
    var current_y = 0;
    if (event.type === "touchmove") {
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
    } else if (event.type === "mousemove") {
      current_x = event.clientX;
      current_y = event.clientY;
    }
    pointer.x = current_x - pointerInitial.x;
    pointer.y = current_y - pointerInitial.y;
  }
}

canvas.addEventListener("touchmove", function (event) {
  event.preventDefault();
});

canvas.addEventListener("mousemove", function (event) {
  event.preventDefault();
});

window.addEventListener("touchend", function (event) {
  endGesture();
});

window.addEventListener("mouseup", function (event) {
  endGesture();
});

function endGesture() {
  moving = false;

  pointer.x = 0;
  pointer.y = 0;
}

//MOTION CONTROLS
//initialize variables for motion based parallax;

var motionInitial = {
  x: null,
  y: null,
};

var motion = {
  x: 0,
  y: 0,
};

//listen to gyroscope events
window.addEventListener("deviceorientation", function (event) {
  //if this is first time through
  if (!motionInitial.x && !motionInitial.y) {
    motionInitial.x = event.beta;
    motionInitial.y = event.gamma;
  }

  //Orientations to handle: portrait, left landscape, right landscape, upside down
  else if (window.orientation === 0) {
    motion.x = event.gamma - motionInitial.y;
    motion.y = event.beta - motionInitial.x;
  } else if (window.orientation === 90) {
    motion.x = event.beta - motionInitial.x;
    motion.y = event.gamma - motionInitial.y;
  } else if (window.orientation === -90) {
    motion.x = -event.beta + motionInitial.x;
    motion.y = -event.gamma + motionInitial.y;
  } else {
    motion.x = -event.gamma + motionInitial.y;
    motion.y = -event.beta + motionInitial.x;
  }
});

window.addEventListener("orientationchange", function (event) {
  motionInitial.x = 0;
  motionInitial.y = 0;
});

window.addEventListener("touchend", function () {
  enableMotion();
});

function enableMotion() {
  if (window.DeviceOrientationEvent) {
    DeviceOrientationEvent.requestPermission();
  }
}
