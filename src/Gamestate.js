// Gamestate class definition
class GameState {
    constructor() {
        this.money = 50;
        this.lives = 100;
        this.score = 0;
        this.towers =  [];
        this.enemies = null;
    }

    setMoney(amount) {
        this.money = amount;
    }

    setLives(lives) {
        this.lives = lives;
    }
}
var gamestate = new GameState();

// TODO: Find a home for these functions and vars

// Updates text indicating if player can afford certain towers
function updateNotEnoughFundsText() {
    if (gamestate.money < waterhoseCost) {
        // Player can't afford any towers
        cantAffordWaterhoseText.alpha = 1.0;
        cantAffordSignalDisruptorText.alpha = 1.0;
        cantAffordLaserText.alpha = 1.0;

        return;
    } else if (gamestate.money < signaldisruptorCost) {
        // Player can afford at least a Waterhose
        cantAffordWaterhoseText.alpha = 0.0;
        cantAffordSignalDisruptorText.alpha = 1.0;
        cantAffordLaserText.alpha = 1.0;

        return;
    } else if (gamestate.money < laserCost) {
        // Player can affor at least a Signal Disruptor
        cantAffordWaterhoseText.alpha = 0.0;
        cantAffordSignalDisruptorText.alpha = 0.0;
        cantAffordLaserText.alpha = 1.0;

        return;
    } else {
        cantAffordWaterhoseText.alpha = 0.0;
        cantAffordSignalDisruptorText.alpha = 0.0;
        cantAffordLaserText.alpha = 0.0;
    }
}

// Buy a Waterhose
function buyWaterhose() {
    if (gamestate.money < waterhoseCost) return;
    // Enable drag and drop
    this.input.setDraggable(this);
    // Wait for tower placed event
    // this.input.on('dragend', (pointer, gameObject) => {
    //     console.log(gameObject)
    //     this.input.setDraggable(gameObject, false);
    // });
    // Subtract cost from money
    gamestate.setMoney(gamestate.money - waterhoseCost);
}

function startDrag(pointer, targets) {
    this.input.off('pointerdown', this.startDrag, this);
    this.dragObj = targets[0];
    this.input.on('pointermove', this.doDrag, this);
}

function doDrag(pointer) {
    this.dragObj.x = pointer.x;
    this.dragObj.y = pointer.y;
}

// Buy a Signal Disruptor
function buySignalDisruptor() {
    if (gamestate.money < signaldisruptorCost) return;

    // Enable drag and drop
    // Wait for tower placed event
    // Subtract cost from money
    gamestate.setMoney(gamestate.money - signaldisruptorCost);
}

// Buy a Laser
function buyLaser() {
    if (gamestate.money < laserCost) return;

    // Enable drag and drop
    // Wait for tower placed event
    // Subtract cost from money
    gamestate.setMoney(gamestate.money - laserCost);
}