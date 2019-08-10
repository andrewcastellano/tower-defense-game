// Gamestate class definition
class GameState {
    constructor() {
        this.money = 50;
        this.lives = 50;
        this.score = 0;
        this.towers =  [];
        this.enemies = null;
        this.time = 0;
        this.enemyNum = 0;
        this.waveNum = 0;
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

// TODO: Replace two functions below with tower placement functions
// Buy a Signal Disruptor 
function buySignalDisruptor() {
    if (gamestate.money < signaldisruptorCost) return;

    // Subtract cost from money
    gamestate.setMoney(gamestate.money - signaldisruptorCost);
}

// Buy a Laser
function buyLaser() {
    if (gamestate.money < laserCost) return;

    // Subtract cost from money
    gamestate.setMoney(gamestate.money - laserCost);
}