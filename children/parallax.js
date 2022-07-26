//get reference to Canvas
var canvas = document.getElementById("canvas");

//get reference to Canvas context
var context = canvas.getContext("2d");

//initialize loading variables
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
      requestAnimationFrame(drawCanvas);
    }
  };
  layer.image.src = layer.src;
});

function drawCanvas() {
  //clear whatever is in canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  //loop through each layer and draw it to the canvas
  layerList.forEach(function (layer, index) {
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

//TOUCH AND MOUSE CONTROLS
