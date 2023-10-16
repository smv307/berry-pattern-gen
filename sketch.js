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

//--------------------------------------------------------

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

//--------------------------------------------------------

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

// blueberry fruit
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

//--------------------------------------------------------

// P A C K I N G

const possibleFruits = [Razzberry, Strawberry, Strawberry, Blueberry];
const currentFruits = []; // all fruit on canvas
const minFruitSize = 20; // size at generation
let fruitInstance;

// amount of each fruit on canvas
let currentRaspberriesCount = 0;
let currentStrawberriesCount = 0;
let currentBlueberriesCount = 0;

// put fruit obj on canvas
function fruitToCanvas(className) {
  fruitInstance = new className(
    random(0, width),
    random(0, height),
    minFruitSize
  );
}

// check for collision between two fruits
function checkForCollision(fruit) {
  for (let i = 0; i < currentFruits.length; i++) {
    let fruit2 = currentFruits[i]; // fruit checking with
    let distance = dist(fruit.x, fruit.y, fruit2.x, fruit2.y);
    if (distance !== 0 && distance <= fruit.size + fruit2.size) {
      if (fruit !== fruit2) {
        if (fruit.size === minFruitSize) {
          currentFruits.splice(currentFruits.indexOf(fruit), 1); // Remove current fruit from array

          // Minus one from respective count
          switch (fruit.constructor) {
            case Razzberry:
              currentRaspberriesCount--;
              break;
            case Strawberry:
              currentStrawberriesCount--;
              break;
            case Blueberry:
              currentBlueberriesCount--;
              break;
          }
        }
      }
      return true;
    }
  }
  return false;
}


//--------------------------------------------------------

// S E T U P

let finalize = false;

function setup() {
  frameRate(60);
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

//--------------------------------------------------------

// I M P L E M E N T

function draw() {
  handleYearInput(); // check for and set user input

  if (!yearInput) {
    return; // Skip executing the rest of the code
  }

  // get fruit amount data

  let ratio = 4000 - Math.exp(yearInput - 2021); // data is divided by...

  let maxStrawberries = floor(
    fruitData.strawberries[String(yearInput)] / ratio
  );
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

  // choose a random fruit
  let randomFruit = random(possibleFruits);

  // add a new object of the chosen fruit to canvas
  switch (randomFruit) {
    case Razzberry:
      if (currentRaspberriesCount < maxRaspberries) {
        currentRaspberriesCount++;
        fruitToCanvas(randomFruit);
      }
      break;
    case Strawberry:
      if (currentStrawberriesCount < maxStrawberries) {
        currentStrawberriesCount++;
        fruitToCanvas(randomFruit);
      }
      break;
    case Blueberry:
      if (currentBlueberriesCount < maxBlueberries) {
        currentBlueberriesCount++;
        fruitToCanvas(randomFruit);
      }
      break;
  }

  currentFruits.push(fruitInstance); // add newly generated fruit to array of fruits on canvas

  // stop growth if
  if (
    (currentRaspberriesCount == maxRaspberries) &
    (currentStrawberriesCount == maxStrawberries) &
    (currentBlueberriesCount == maxBlueberries) || finalize == true || frameCount > 1000
  ) {
    noLoop();
  }
  console.log(`current: ${currentBlueberriesCount} max: ${maxBlueberries}`) // for testing
}
