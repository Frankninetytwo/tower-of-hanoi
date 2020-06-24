class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class TowerBlock {
  static maxBlockWidth = 90;

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  paint() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class StackManager {

  constructor(countTowerBlocks = 5) {
    this.coordinateOrigin = new Point(50, 120);
    // This better not be variably user picked, else it becomes
    // likely that it cannot fully be displayed in the UI.
    this.towerBlockHeight = 9;
    this.stackWidth = 100;

    if (countTowerBlocks < 0 || countTowerBlocks > 10) {
      alert("Invalid amount of TowerBlocks! Might be unable to display them all.");
    }
    this.countTowerBlocks = countTowerBlocks;

    this.stacks = this.generateStacks();
    this.paintAllStacks();
    this.countTowerBlockMoves = 0;

    this.moveOrder = [];

    this.moveCounter = 0;
  }

  // Generates stacks and TowerBlocks, which are all placed into the
  // first stack (index 0).
  generateStacks() {
    let stacks = [
      [],
      [],
      []
    ];

    let i;
    for (i = 0; i < this.countTowerBlocks; ++i) {
      let width = 8 + (this.countTowerBlocks - 1 - i) * 8;
      let newTowerBlock = new TowerBlock(
        this.coordinateOrigin.x - Math.floor(width / 2),
        this.coordinateOrigin.y - i * (this.towerBlockHeight + 1),
        width,
        this.towerBlockHeight
      );

      stacks[0].push(newTowerBlock);
    }

    return stacks;
  }

  paintStackAreaWhite() {
    const x = this.coordinateOrigin.x - TowerBlock.maxBlockWidth / 2;
    const y =
      this.coordinateOrigin.y -
      ((this.countTowerBlocks - 1) * (this.towerBlockHeight + 1));
    const width = this.stacks.length * this.stackWidth;
    const height = this.countTowerBlocks * (this.towerBlockHeight + 1);

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
  }

  paintAllStacks() {
    // erase previous drawings
    this.paintStackAreaWhite();

    let i;
    for (i = 0; i < this.stacks.length; ++i) {

      let j;
      for (j = 0; j < this.stacks[i].length; ++j) {
        this.stacks[i][j].paint();
      }
    }
  }

  // pops TowerBlock from source stack and moves it
  // to the destination stack
  moveTowerBlock(indexSourceStack, indexDestinationStack) {

    let movedTowerBlock = this.stacks[indexSourceStack].pop();

    movedTowerBlock.x += this.stackWidth * (indexDestinationStack - indexSourceStack);
    movedTowerBlock.y =
      this.coordinateOrigin.y -
      this.calculateTowerHeight(indexDestinationStack);

    this.stacks[indexDestinationStack].push(movedTowerBlock);

    ++this.countTowerBlockMoves;
  }

  // Each stack of the member array "stacks" represents a tower.
  calculateTowerHeight(stackIndex) {
    return this.stacks[stackIndex].length *
      (this.towerBlockHeight + 1);
  }

  setMoveOrder(n, indexSrcStack, indexDstStack, indexAuxStack) {

    if (n == 0) {
      return;
    }

    this.setMoveOrder(n - 1, indexSrcStack, indexAuxStack, indexDstStack);

    this.moveOrder.push({
      "source stack index": indexSrcStack,
      "destination stack index": indexDstStack
    });

    this.setMoveOrder(n - 1, indexAuxStack, indexDstStack, indexSrcStack);
  }

  solveTowerOfHanoi(speedOfBlockMovementInMs = 1000) {
    this.setMoveOrder(this.countTowerBlocks, 0, 2, 1);

    for (let i = 0; i < this.moveOrder.length; ++i) {

      setTimeout(() => {
        this.moveTowerBlock(
          this.moveOrder[i]["source stack index"],
          this.moveOrder[i]["destination stack index"]
        );

        this.paintAllStacks();
      }, speedOfBlockMovementInMs + i * speedOfBlockMovementInMs);
    }

    setTimeout(() => {
      console.log(`${this.moveOrder.length} moves were required.`)
    }, this.moveOrder.length * speedOfBlockMovementInMs);
  }
}


let countTowerBlocks = 5;
let speedOfBlockMovementInMs = 1000;
stackManager = new StackManager(countTowerBlocks);
stackManager.solveTowerOfHanoi(speedOfBlockMovementInMs);