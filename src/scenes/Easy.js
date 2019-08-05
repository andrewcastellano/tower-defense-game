// TODO: refactor- find a home for these vars

// Easy Track point data
var easyPoints = {
    'x': [0, 125, 125, 595, 595, 125, 125, 84, 84, 634, 634, 84, 84, 0],
    'y': [185, 185, 95, 95, 295, 295, 245, 245, 335, 335, 55, 55, 145, 145]
};
var path;
var track;
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

// Vars used for drag and drop placement of towers
var newTowerPlaceholder;
var rangeIndicator;
var cantPlaceTowerIndicator;
var isPlacingTower = false;

// Vars used for play, save, and cancel
var playButton;
var isInPlayMode = false;
var saveButton;
var cancelButton;

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
        this.load.image('greencircle', 'images/greencircle.png');
        this.load.image('redcircle', 'images/redcircle.png');

        // Track assets
        this.load.image('easyTrack', 'images/tracks/easyTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels

        // Enemy assets
        this.load.image('toaster', 'images/enemies/toaster/toaster.png');
        this.load.image('washingmachine', 'images/enemies/washingmachine/washingmachine.png');
        this.load.image('robot_', 'images/enemies/robot/robot.png');
        this.load.atlas('toaster_atlas', 'images/enemies/toaster/toaster_atlas.png', 'images/enemies/toaster/toaster_atlas.json');
        this.load.atlas('washingmachine_atlas', 'images/enemies/washingmachine/washingmachine_atlas.png', 'images/enemies/washingmachine/washingmachine_atlas.json');
        this.load.atlas('robot_atlas', 'images/enemies/robot/robot_atlas.png', 'images/enemies/robot/robot_atlas.json');

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

        this.createHeadsUpDisplay(graphics);

        // Cancel placing tower if ESC key is pressed while tower is following mouse
        this.input.keyboard.on('keydown_ESC', this.cancelPlacingTower);

        // Handle setting green or red area of effect indicator when moving the pointer
        // while placing a tower
        this.input.on('pointermove', this.applyIndicator.bind(this));

        // Position track (will the track need physics??)
        this.add.image(325, 195, 'easyTrack');

        // Load up Easy Track data points into path
        path = this.add.path(easyPoints.x[0], easyPoints.y[0]);
        for (var i = 1; i < easyPoints.x.length; i++) {
            path.lineTo(easyPoints.x[i], easyPoints.y[i]);
        }     

        // Create enemy animations
        this.createEnemyAnimations();

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
    }

    // Update game scene
    update(time, delta) {
        // add money at regular intervals second
        if (isInPlayMode && time > nextTimeToAddMoney) {
            gamestate.money += 1;
            nextTimeToAddMoney = time + 1000;
        }

        updateNotEnoughFundsText();

        // update player money and lives
        moneyText.setText('Money: ' + gamestate.money);
        livesText.setText('Lives: ' + gamestate.lives)

        // spawn waves of enemies and clean up 
        this.spawnEnemies(time);
        this.cleanUpEnemies();

        // check for game over conditions
        if (this.gameOver() === true)
        {
            this.scene.pause();
            return;
        }
    }

    gameOver(){
        // check if player ran out of lives
        if (gamestate.lives <= 0)
        {
            var endText = this.add.text(150, 150, 'Game Over! You lost all your lives!', { fontSize: '20px', fill: '#ffffff' });
            return true;
        }
        // check if player completed all waves
        else if (waveNum >= enemyList.length && waveSpawned && this.isBoardEmpty() === true) 
        {
            var endText = this.add.text(170, 150, 'Congratulations! You won!', { fontSize: '20px', fill: '#ffffff' });
            return true;
        }
        else //game isn't over
            return false;
    }

    // Creates the HUD, including all icons and text
    createHeadsUpDisplay(graphics) {
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

        // Add tower icons and text
        waterhoseIcon = this.add.image(710, 117, 'waterhose').setScale(0.04);
        waterhoseIcon.setInteractive();
        // Start placing tower mode when clicking on the waterhoseIcon in the HUD
        waterhoseIcon.on('pointerdown', this.startPlacingTower.bind(this));
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
        playButton = this.add.image(710, 345, 'play').setScale(0.06);
        playButton.setInteractive();
        playButton.on('pointerdown', this.startPlayMode);
        this.add.text(697, 365, 'Play', { color: '#ffffff', fontSize: '12px' });
        saveButton = this.add.image(780, 345, 'save').setScale(0.06);
        saveButton.setInteractive();
        saveButton.on('pointerdown', () => {
            this.scene.start('SaveGame');
        });
        this.add.text(765, 365, 'Save', { color: '#ffffff', fontSize: '12px' });
        cancelButton = this.add.image(850, 345, 'cancel').setScale(0.06);
        cancelButton.setInteractive();
        cancelButton.on('pointerdown', () => {
            this.scene.start('NewGame');
        });
        this.add.text(830, 365, 'Cancel', { color: '#ffffff', fontSize: '12px' });

        // Add money and lives text info
        moneyText = this.add.text(700, 5, `Money: ${gamestate.money}`, { color: '#ffffff' });
        livesText = this.add.text(700, 45, `Lives: ${gamestate.lives}`, { color: '#ffffff' });
        currentWave = this.add.text(5, 5, `Wave #1`, { color: '#ffffff' });

        // Add not enough funds text under towers
        cantAffordWaterhoseText = this.add.text(740, 120, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordSignalDisruptorText = this.add.text(740, 198, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordLaserText = this.add.text(740, 276, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
    }

    // Creates all enemy movement animations to be used in their update functions
    createEnemyAnimations() {
        this.anims.create({
            key: 'toasterMoveRight',
            frames: this.anims.generateFrameNames('toaster_atlas', {
                prefix: 'toaster_right_',
                start: 0,
                end: 4
            }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'toasterMoveLeft',
            frames: this.anims.generateFrameNames('toaster_atlas', {
                prefix: 'toaster_left_',
                start: 0,
                end: 4
            }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'washingMachineMoveRight',
            frames: this.anims.generateFrameNames('washingmachine_atlas', {
                prefix: 'washingmachine_right_',
                start: 0,
                end: 8
            }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'washingMachineMoveLeft',
            frames: this.anims.generateFrameNames('washingmachine_atlas', {
                prefix: 'washingmachine_left_',
                start: 0,
                end: 8
            }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'robotMove',
            frames: this.anims.generateFrameNames('robot_atlas', {
                prefix: 'robot_',
                start: 0,
                end: 11
            }),
            frameRate: 5,
            yoyo: false,
            repeat: -1
        });
    }

    // Handler for clicking play button, starts play mode
    startPlayMode() {
        isInPlayMode = true;
    }

    // Helper function to get array of all active enemies
    getAllEnemies() {
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
        // Return early if game has not started
        if (!isInPlayMode) return;

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
        // Return early if game has not started
        if (!isInPlayMode) return;

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

    // Returns whether pointer is hovering over part of the track. Used to determine which area of
    // effect indicator to use when attempting to place a tower.
    // Why check bounds for track instead of detecing pointer / image overlap?
    // => Track image is a rectangle even though the visible track area takes up edges of image
    isPointerOverTrack(pointer) {
        // Stores bounds of different rectangles on the map that the track image covers
        let boundariesList = [
            { leftBound: 0, rightBound: 70, topBound: 126, bottomBound: 198},
            { leftBound: 70, rightBound: 139, topBound: 41, bottomBound: 200},
            { leftBound: 138, rightBound: 580, topBound: 40, bottomBound: 110},
            { leftBound: 576, rightBound: 651, topBound: 41, bottomBound: 351},
            { leftBound: 138, rightBound: 584, topBound: 281, bottomBound: 350},
            { leftBound: 69, rightBound: 140, topBound: 231, bottomBound: 350},
        ]

        // Loop through boundaries to detect collisions with pointer
        for (let i = 0; i < boundariesList.length; i++) {
            const boundary = boundariesList[i];
            if (pointer.x >= boundary.leftBound && pointer.x <= boundary.rightBound
                && pointer.y >= boundary.topBound && pointer.y <= boundary.bottomBound) {
                return true;
            }
        }
        return false;
    }

    // Handler for clicking the waterhose icon in the HUD
    startPlacingTower() {
        // Return early if game has not started
        if (!isInPlayMode) return;
        
        isPlacingTower = !isPlacingTower;

        // Indicators track the area of effect for the towers
        // The rangeIndicator is green and set when the tower is over a valid position
        // The cantPlaceTowerIndicator is red and set when hovering over invalid positions
        rangeIndicator = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'greencircle').setVisible(false);
        rangeIndicator.alpha = 0.2;
        rangeIndicator.createBitmapMask();
        cantPlaceTowerIndicator = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'redcircle').setVisible(false);
        cantPlaceTowerIndicator.alpha = 0.2;
        cantPlaceTowerIndicator.createBitmapMask();

        // Tower icon image that follows the pointer
        newTowerPlaceholder = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'waterhose').setScale(0.04);
        newTowerPlaceholder.setInteractive();

        // Handle placing the tower into position if valid or cancel by clicking into the HUD
        newTowerPlaceholder.on('pointerdown', this.placeTower.bind(this));
    }

    // Applies the correct indicator to the pointer if placing the tower
    applyIndicator(pointer) {
        if (isPlacingTower) {
            // Have tower icon and indicators follow pointer
            newTowerPlaceholder.x = pointer.x;
            newTowerPlaceholder.y = pointer.y;
            rangeIndicator.x = pointer.x;
            rangeIndicator.y = pointer.y;
            cantPlaceTowerIndicator.x = pointer.x;
            cantPlaceTowerIndicator.y = pointer.y;
            if (pointer.x < 675) {
                // Pointer is in game area
                if (this.isPointerOverTrack(pointer)) {
                    // Set red indicator when over track
                    rangeIndicator.setVisible(false);
                    cantPlaceTowerIndicator.setVisible(true);
                } else {
                    // Set green indicator in valid board positions
                    rangeIndicator.setVisible(true);
                    cantPlaceTowerIndicator.setVisible(false);
                }
            } else if (pointer.x >= 675 && rangeIndicator.visible) {
                // Turn off indicatos in HUD
                rangeIndicator.setVisible(false);
                cantPlaceTowerIndicator.setVisible(false);
            }
        }
    }

    // Handle placing tower when the mouse is clicked 
    placeTower(pointer) {
        if (gamestate.money < waterhoseCost) return;
        else if (isPlacingTower) {
            if (pointer.x < 675) {
                // Pointer is in the game area
                if (!this.isPointerOverTrack(pointer)) {
                    // Tower placed in valid area
                    gamestate.money -= waterhoseCost;
                    this.placeWaterhose(pointer);
                    isPlacingTower = false;
                    newTowerPlaceholder.destroy();
                    rangeIndicator.setVisible(false);
                    cantPlaceTowerIndicator.setVisible(false);
                }
            } else if (pointer.x >= 675) {
                // Cancel tower purchase by clicking in the HUD area
                isPlacingTower = false;
                newTowerPlaceholder.destroy();
            }
        }
    }
    
    // Cancels drag and drop tower placement when the ESC key is pressed
    cancelPlacingTower(event) {
        if (isPlacingTower) {
            isPlacingTower = false;
            newTowerPlaceholder.destroy();
            rangeIndicator.destroy();
            cantPlaceTowerIndicator.destroy();
        }
    }
}