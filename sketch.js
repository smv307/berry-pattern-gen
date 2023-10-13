// P R E L O A D

// define image vars
let blueberryStemImg, strawberryBodyImg, strawberryStemImg, razzberryImg;

let fruitData; // var for json data

function preload() {
  fruitData = loadJSON("fruitdata.json"); // get data from json

  //import imagesa
  razzberryImg = loadImage("razzberry.png");
  blueberryStemImg = loadImage("blueberry-stem.png");
  strawberryBodyImg = loadImage("strawberry-body.png");
  strawberryStemImg = loadImage("strawberry-stem.png");
}

// D A T A

// get user input
let yearInput;

function handleYearInput() {
  document.getElementById("error-message").style.visibility = "hidden";
  yearInput = document.getElementById("yearInput").valueAsNumber;
  if (yearInput > 2020 || yearInput < 1971) {
    yearInput = null;
    document.getElementById("error-message").style.visibility = "visible";
  }
}

// F R U I T S

// parent class for fruit types
class Fruit {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  grow() {
    this.size++;
    this.draw(); // draw method defined in each child class
  }
}

// razzberry fruit
class Razzberry extends Fruit {
  constructor(x, y, size) {
    super(x, y, size);
  }
  draw() {
    image(razzberryImg, this.x, this.y, this.size, this.size);
  }
}

// strawberry fruit
class Strawberry extends Fruit {
  constructor(x, y, size) {
    super(x, y, size);
  }
  draw() {
    image(strawberryBodyImg, this.x, this.y, this.size, this.size);
    image(
      strawberryStemImg,
      this.x,
      this.y - this.size * 0.4,
      this.size,
      this.size - this.size * 0.4
    );
  }
}

// blueberryfruit
class Blueberry extends Fruit {
  constructor(x, y, size) {
    super(x, y, size);
  }
  draw() {
    // outer circle
    fill("#657d8c");
    circle(this.x, this.y, this.size);
    // inner stem
    image(
      blueberryStemImg,
      this.x + random(this.size * -0.5, this.size * 0.1),
      this.y + random(this.size * -0.5, this.size * 0.1),
      this.size / 2.7,
      this.size / 2.7
    );
  }
}

// P A C K I N G

const possibleFruits = [Razzberry, Strawberry, Strawberry, Blueberry];
const currentFruits = []; // all fruit on canvas
const minFruitSize = 20; // size at generation

// check for collision between two fruits
function checkForCollision(fruit) {
  for (let i = 0; i < currentFruits.length; i++) {
    let fruit2 = currentFruits[i]; // fruit checking with
    let distance = dist(fruit.x, fruit.y, fruit2.x, fruit2.y);
    if (distance !== 0 && distance <= fruit.size + fruit2.size) {
      if (fruit.size === minFruitSize) {
        currentFruits.pop(); // remove non growing fruits
      }
      return true;
    }
  }
  return false;
}

// create new fruit obj to put on canvas
function createFruit(className) {
  let fruitInstance = new className(
    random(0, width),
    random(0, height),
    minFruitSize
  );

  currentFruits.push(fruitInstance);
}

// C O N T R O L

// number specific fruits
const currentRaspberries = [];
const currentStrawberries = [];
const currentBlueberries = [];

// control frequency of a specific fruit obj
function controlFruitFrequency(className, object) {
  className.push(object);
}

// S E T U P

let finalize = false;

function setup() {
  frameRate(60)
  // check if finalize button clicked
  document.getElementById("finalizeButton").addEventListener("click", () => {
    finalize = true;
  });

  // check if finalize button clicked
  document.getElementById("resetButton").addEventListener("click", () => {
    location.reload();
  });

  // frameRate(13)
  createCanvas(1050, 675);
  noStroke();
}

const ratio = 2000; // data is divided by...

// I M P L E M E N T

function draw() {
  handleYearInput(); // check for and set user input

  if (!yearInput) {
    return; // Skip executing the rest of the code
  }

  // get fruit amount data

  let maxStrawberries =
    floor(fruitData.strawberries[String(yearInput)] / ratio);
  let maxBlueberries = floor(fruitData.blueberries[String(yearInput)] / ratio);
  let maxRaspberries = floor(fruitData.raspberries[String(yearInput)] / ratio);

  background(255); // clear canvas every frame

  // grow all current fruits
  for (let i of currentFruits) {
    if (checkForCollision(i)) {
      i.draw();
    } else {
      i.grow();
    }
  }

  //draw new fruit instance
  let generatedFruit = random(possibleFruits);
  createFruit(generatedFruit);

  // control amount of each fruit on canvas
  switch (generatedFruit) {
    case Razzberry:
      controlFruitFrequency(currentRaspberries, generatedFruit);
      break;
    case Strawberry:
      controlFruitFrequency(currentStrawberries, generatedFruit,);
      break;
    case Blueberry:
      controlFruitFrequency(currentBlueberries, generatedFruit);
      break;
  }

  // stop growth if
  if (
    (currentRaspberries.length >= maxRaspberries) &
    (currentStrawberries.length >= maxStrawberries) &
    (currentBlueberries.length >= maxBlueberries)
  ) {
    noLoop();
    console.log("done yay");
  }

  if (finalize == true) {
    noLoop();
  }
}
