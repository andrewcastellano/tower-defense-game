// TODO: refactor- find a home for these vars

// Easy Track point data
var easyPoints = {
    'x': [0, 125, 125, 595, 595, 125, 125, 84, 84, 634, 634, 84, 84, 0],
    'y': [185, 185, 95, 95, 295, 295, 245, 245, 335, 335, 55, 55, 145, 145]
};
var path;
var enemies;
var toasters;
var washingmachines;
var waterhoses;
var robots;
var graphics;
var projectiles;
var allEnemies = [];

// Tower prices
const waterhoseCost = 25;
const signaldisruptorCost = 100;
const laserCost = 500;

const addMoneyInterval = 1000; // Passively generate money every second
var nextTimeToAddMoney = 0;

var waterhoseIcon;
var signaldisruptorIcon;
var laserIcon;

// Text displayed on GUI - maybe move into own object or gamestate eventually
var moneyText = null;
var livesText = null;
var currentWave = null;
var cantAffordWaterhoseText = null;
var cantAffordSignalDisruptorText = null;
var cantAffordLaserText = null;

//Enemy Wave related variables
var enemyNum = 0;           //tracks index of enemy in current wave
var waveNum = 0;            //tracks index of wave that has been called to screen
var newWave = false;        //to help update wave numbers
var waveSpawned = false;    //to help track when to spawn next wave
var startTime = 1000;
var nextEnemy = startTime;  //initialize to time (in ms) that first wave will start in game
var TTF = 45000;            //slowest time enemies take to complete track
var enemyList =             //Wave order enemies will appear on screen
    // t = toaster, w = washingmachine, r = robot
    // gap = additional time for next enemy to spawn in
    [ 
        //wave 1
        [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000}, 
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: TTF}],
        //wave 2
        [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000}, 
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000},
         {name: 'w', gap: 1000}, {name: 'w', gap: 1000}, {name: 'w', gap: TTF}],
        //wave 3
        [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 'r', gap: 1000}, 
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 'r', gap: TTF}],
        //wave 4
        [{name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 }, 
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: TTF}],
        //wave 5
        [{name: 'r', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: 2000},
         {name: 't', gap: 1000}, {name: 'w', gap: 3000}, {name: 'r', gap: 2000},
         {name: 'w', gap: 2000}, {name: 'w', gap: 2000}, {name: 't', gap: TTF}],
        //wave 6
        [{name: 'w', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: 2000},
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 3000},
         {name: 'r', gap: 3000}, {name: 'r', gap: 3000}, {name: 'r', gap: TTF}],
        //wave 7
        [{name: 'w', gap: 2000}, {name: 't', gap: 2000}, {name: 'w', gap: 2000},
         {name: 'r', gap: 2000}, {name: 'w', gap: 2000}, {name: 'r', gap: 2000},
         {name: 'r', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: TTF}],
        //wave 8
        [{name: 'w', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: 2000},
         {name: 'w', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: 2000},
         {name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: TTF}],
        //wave 9
        [{name: 'w', gap: 2000}, {name: 'w', gap: 2000}, {name: 'w', gap: 2000},
         {name: 't', gap: 2000}, {name: 't', gap: 2000}, {name: 't', gap: 2000},
         {name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: TTF}],
        //wave 10
        [{name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 }, 
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 'r', gap: 1000}, {name: 'r', gap: 2000}, {name: 'r', gap: 3000},
         {name: 'r', gap: 1000}, {name: 'r', gap: 2000}, {name: 'r', gap: TTF}]
    ];

class Easy extends Phaser.Scene {

    constructor() {
        super({
            key: 'Easy',
            active: false
        });
    }

    // Preload the game scene
    preload() {
        // HUD assets
        this.load.image('robot', 'images/Robot.png');
        this.load.image('laser', 'images/laser.png');
        this.load.image('signaldisruptor', 'images/signaldisruptor.png');
        this.load.image('waterhose', 'images/waterhose.png');
        this.load.image('play', 'images/play.png');
        this.load.image('cancel', 'images/cancel.png');
        this.load.image('save', 'images/save.png');

        // Track assets
        this.load.image('easyTrack', 'images/tracks/easyTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels

        // Enemy assets
        this.load.image('toaster', 'images/enemies/toaster/toaster.png');
        this.load.image('washingmachine', 'images/enemies/washingmachine/washingmachine.png');
        this.load.image('robot_', 'images/enemies/robot/robot.png');

        // Tower assets
        this.load.image('_waterhose', 'images/towers/waterhose.png');

        // Projectile assets
        this.load.image('_waterdrop', 'images/projectiles/waterdrop.png');

    }

    // Create the game scene
    create() {
        // Add backdrop
        //this.add.image(400, 300, 'backdrop');

        var graphics = this.add.graphics();

        // Add gray hud panel to screen
        graphics.fillStyle(0x646464, 1);
        graphics.fillRect(675, 0, 225, 390);

        // Add white border lines to hud
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(675, 78, 225, 3);
        graphics.fillRect(675, 156, 225, 3);
        graphics.fillRect(675, 234, 225, 3);
        graphics.fillRect(675, 312, 225, 3);
        graphics.fillRect(672, 0, 3, 390);

        var newTower;
        var isMovingTower = false;
        // Add tower icons and text
        waterhoseIcon = this.add.image(710, 117, 'waterhose').setScale(0.04);
        waterhoseIcon.setInteractive();
        waterhoseIcon.on('pointerdown', () => {
            newTower = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'waterhose').setScale(0.04);
            newTower.setInteractive();
            isMovingTower = !isMovingTower;
            this.input.on('pointermove', pointer => {
                if (isMovingTower) {
                    newTower.x = pointer.x;
                    newTower.y = pointer.y;
                }
            });
            newTower.on('pointerdown', pointer => {
                if (gamestate.money < waterhoseCost) return;
                else if (isMovingTower) {
                    if (pointer.x < 675) {
                        // Tower placed in valid area
                        gamestate.money -= waterhoseCost;
                        gamestate.towers.push(newTower);
                        isMovingTower = false;
                        newTower = null;
                    } else if (true) {
                        // Case 1: Cancel tower purchase clicking in the menu area
                    } else {
                        // Case 2: Trying to place the tower in the track or invalid area
                    }
                }
            })
        });
        // waterhoseIcon.on('pointerdown', buyWaterhose);
        this.add.text(740, 100, 'Waterhose:$25', { color: '#ffffff', fontSize: '12px' });

        signaldisruptorIcon = this.add.image(710, 195, 'signaldisruptor').setScale(0.04);
        signaldisruptorIcon.setInteractive();
        signaldisruptorIcon.on('pointerdown', buySignalDisruptor);
        this.add.text(740, 178, 'Signal Disruptor:$100', { color: '#ffffff', fontSize: '12px' });

        laserIcon = this.add.image(710, 273, 'laser').setScale(0.04);
        laserIcon.setInteractive();
        laserIcon.on('pointerdown', buyLaser);
        this.add.text(740, 256, 'Laser:$500', { color: '#ffffff', fontSize: '12px' });

        // Add play, save, load buttons
        this.add.image(710, 345, 'play').setScale(0.06);
        this.add.text(697, 365, 'Play', { color: '#ffffff', fontSize: '12px' });
        this.add.image(780, 345, 'save').setScale(0.06);
        this.add.text(765, 365, 'Save', { color: '#ffffff', fontSize: '12px' });
        this.add.image(850, 345, 'cancel').setScale(0.06);
        this.add.text(830, 365, 'Cancel', { color: '#ffffff', fontSize: '12px' });

        // Add money and lives text info
        moneyText = this.add.text(700, 5, `Money: ${gamestate.money}`, { color: '#ffffff' });
        livesText = this.add.text(700, 45, `Lives: ${gamestate.lives}`, { color: '#ffffff' });
        currentWave = this.add.text(5, 5, `Wave #1`, { color: '#ffffff' });

        // Add not enough funds text under towers
        cantAffordWaterhoseText = this.add.text(740, 120, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordSignalDisruptorText = this.add.text(740, 198, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordLaserText = this.add.text(740, 276, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });

        // Position track (will the track need physics??)
        this.add.image(325, 195, 'easyTrack');

        // Load up Easy Track data points into path
        path = this.add.path(easyPoints.x[0], easyPoints.y[0]);
        for (var i = 1; i < easyPoints.x.length; i++) {
            path.lineTo(easyPoints.x[i], easyPoints.y[i]);
        }
        // Draw the path to visualize
        //graphics.lineStyle(3, 0xffffff, 1);
        //path.draw(graphics);

        // Create group for enemies
        toasters = this.physics.add.group({ classType: Toaster, runChildUpdate: true });
        washingmachines = this.physics.add.group({ classType: WashingMachine, runChildUpdate: true });
        robots = this.physics.add.group({ classType: Robot, runChildUpdate: true });

        // Create master enemy list
        allEnemies.push(toasters);
        allEnemies.push(washingmachines);
        allEnemies.push(robots);

        // Create group for towers
        waterhoses = this.add.group({ classType: waterhose, runChildUpdate: true });
        projectiles = this.physics.add.group({ classType: waterdrop, runChildUpdate: true });

        // Bullet overlap with enemy
        this.physics.add.overlap(toasters, projectiles, this.hurtEnemy.bind(this)); //run hurt enemy function when overlap
        this.physics.add.overlap(washingmachines, projectiles, this.hurtEnemy.bind(this)); //run hurt enemy function when overlap
        this.physics.add.overlap(robots, projectiles, this.hurtEnemy.bind(this)); //run hurt enemy function when overlap

        // this.nextEnemy = 1000; //initialize to time (in ms) that waves will start
        this.input.on('pointerdown', this.placeWaterhose.bind(this));
    }

    // Update game scene
    update(time, delta) {
        // add money at regular intervals second
        if (time > nextTimeToAddMoney) {
            gamestate.money += 1;
            nextTimeToAddMoney = time + 1000;
        }

        updateNotEnoughFundsText();

        // update player money and lives
        moneyText.setText('Money: ' + gamestate.money);
        livesText.setText('Lives: ' + gamestate.lives)

        // spawn waves of enemies
        this.spawnEnemies(time);
        this.cleanUpEnemies();
    }

    // Helper function to get array of all active enemies
    getAllEnemies(){
        var enemies = [];

        //for each enemy type
        for (var i = 0; i < allEnemies.length; i++)
        {
            //get their children
            var enemy = allEnemies[i].getChildren();

            for (var j = 0; j < enemy.length; j++)
            {
                //add child to array
                enemies.push(enemy[j]);
            }
        }
        return enemies;
    }

    //find if there is an enemy in our turret range
    getEnemy(x, y, distance) {
        var enemies = this.getAllEnemies();
        
        console.log(enemies);
        
        for (var i = 0; i < enemies.length; i++) { //loop through all enemies
            if (enemies[i].active && Phaser.Math.Distance.Between(x, y, enemies[i].x, enemies[i].y) <= distance) {
                return enemies[i]; //in range and active
            }
        }
        return false;
    }

    addWaterDrop(x, y, angle) {
        var wd = new waterdrop(this, 0, 0);
        projectiles.add(wd);
        wd.fire(x, y, angle);
    }

    placeWaterhose(pointer) {
        var hose = new waterhose(this, pointer.x, pointer.y);
        waterhoses.add(hose);
        hose.setActive(true);
        hose.setVisible(true);
        hose.setScale(0.04);
    }

    hurtEnemy(enemy, proj) {
        if (proj.active && enemy.active) {
            proj.setVisible(false);
            proj.setActive(false);
            enemy.takeDamage(proj.dmg); //call take damage function on enemy with the projectiles damage
        }
    }

    // Helper function to determine if board is empty of enemies
    isBoardEmpty() {
        var isEmpty = false;
        var numToasters = toasters.countActive(true);
        var numWashingMachines = washingmachines.countActive(true);
        var numRobots = robots.countActive(true);
        if (numToasters + numWashingMachines + numRobots === 0) {
            isEmpty = true;
        }
        return isEmpty;
    }

    // Used by Update function to bring enemies onto the track, using wave and enemyList info
    spawnEnemies(time) {

        //if there are still waves to spawn
        if (waveNum < enemyList.length)
        {
            //check if board is empty after full wave, advance to next round first enemy if all enemies defeated
            if (time > startTime && waveSpawned)
            {
                var boardEmpty = this.isBoardEmpty();
                if (boardEmpty)
                {
                    nextEnemy = time + 2000; // 2 second gap to new wave when cleared early
                    waveSpawned = false;
                }
            }

            //if it's time for the next enemy to spawn
            if (time > nextEnemy)
            {
                if (newWave) {
                    currentWave.setText('Wave #' + (waveNum + 1));
                    newWave = false;
                    waveSpawned = false;
                }
                // get next enemy     
                var enemy;
                switch (enemyList[waveNum][enemyNum].name) {
                    case 't':
                        enemy = toasters.get();
                        break;
                    case 'w':
                        enemy = washingmachines.get();
                        break;
                    case 'r':
                        enemy = robots.get();
                        break;
                }
                if (enemy) {
                    enemy.setActive(true);
                    enemy.setVisible(true);
    
                    // place the enemy at the beginning of the path
                    enemy.spawn();
                    // determine index of next enemy
                    if ((enemyNum + 1) == enemyList[waveNum].length) // go to next wave
                    {
                        nextEnemy = time + enemyList[waveNum][enemyNum].gap;
                        enemyNum = 0;
                        waveNum++;
                        newWave = true;
                        waveSpawned = true;
                    }
                    else {
                        nextEnemy = time + enemyList[waveNum][enemyNum].gap;
                        enemyNum++;
                    }
                }
            }
        }
    }

    // Used by 'update' to clean up and remove enemies that have been defeated by the player's towers
    cleanUpEnemies(){

        //check all enemy types
        for (var i = 0; i < allEnemies.length; i++)
        {
            //get children of that type
            var children = allEnemies[i].getChildren();

            //check children
            for (var j = 0; j < children.length; j++)
            {
                // check if enemy completed track or defeated
                if (children[j].follower.t >= 1 || children[j].health <= 0)
                {
                    //remove enemy from group/game
                    allEnemies[i].remove(children[j], true, true);
                }
            }
        }

    }
}