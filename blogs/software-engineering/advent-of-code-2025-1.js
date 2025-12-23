import fs from "fs";

const START = 50;
const SIZE = 100;
const INPUT_PATH = "advent-of-code-2025-1-input.txt";
const INPUT = fs.readFileSync(INPUT_PATH, { encoding: "utf8" });
const INPUT_PARSED = INPUT.split("\n");

let current = START;
let password = 0;

function direction(input) {
  let result = "";
  if (input.charAt(0) === "L") {
    result = "LEFT";
  } else {
    result = "RIGHT";
  }
  return result;
}

function rotatedLeft(current, clicks) {
  return (current - clicks + SIZE) % SIZE;
}

function rotatedRight(current, clicks) {
  return (current + clicks) % SIZE;
}

for (let i = 0; i < INPUT_PARSED.length; i++) {
  const item = INPUT_PARSED[i];
  const prefixRemoved = item.substring(1);
  const clicks = parseInt(prefixRemoved);

  if (direction(item) === "LEFT") {
    current = rotatedLeft(current, clicks);
  } else {
    current = rotatedRight(current, clicks);
  }

  if (current === 0) {
    password++;
  }
}

console.log(password);

// testRotatedLeft(50, 68);
// testRotatedRight(52, 48);
// testDirection("L14");

function testRotatedLeft(current, clicks) {
  console.log(rotatedLeft(current, clicks));
}

function testRotatedRight(current, clicks) {
  console.log(rotatedRight(current, clicks));
}

function testDirection(input) {
  console.log(direction(input));
}
