var path;
var track;
var enemies;
var toasters;
var washingmachines;
var robots;
var graphics;
var projectiles;
var allEnemies = [];

var waterhoses;
var signaldisruptors;
var lasers;

var waterdrops;
var radiowaves;
var laserbeams;

var waterhoseIcon;
var signaldisruptorIcon;
var laserIcon;
var upgradeWaterhoseIcon;
var upgradeSignalDisruptorIcon;
var upgradeLaserIcon;

// Tower prices
const waterhoseCost = 25;
const signaldisruptorCost = 100;
const laserCost = 500;

// Upgrade prices
const waterhoseUpgradeCost = 50;
const signalDisruptorUpgradeCost = 75;
const laserUpgradeCost = 100;


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

// Vars used for upgrading towers
var isUpgradingWaterhose = false;
var isUpgradingSignalDisruptor = false;
var isUpgradingLaser = false;

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
var enemyList;

const addMoneyInterval = 1000; // Passively generate money every second
var nextTimeToAddMoney = 0;

class GameBase extends Phaser.Scene {
	constructor(config) {
		super(config);
	}

	preload() {
		// HUD assets
		this.load.image('robot', 'images/Robot.png');
		this.load.image('laser', 'images/towers/laser_color.png');
		this.load.image('signaldisruptor', 'images/towers/signaldisruptor_color.png');
		this.load.image('waterhose', 'images/towers/waterhose_color.png');
		this.load.image('play', 'images/play.png');
		this.load.image('cancel', 'images/cancel.png');
		this.load.image('save', 'images/save.png');
		this.load.image('greencircle', 'images/greencircle.png');
		this.load.image('redcircle', 'images/redcircle.png');
		this.load.image('upgrade', 'images/upgrade.png');


		// Enemy assets
		this.load.image('toaster', 'images/enemies/toaster/toaster.png');
		this.load.image('washingmachine', 'images/enemies/washingmachine/washingmachine.png');
		this.load.image('robot_', 'images/enemies/robot/robot.png');
		this.load.atlas('toaster_atlas', 'images/enemies/toaster/toaster_atlas.png', 'images/enemies/toaster/toaster_atlas.json');
		this.load.atlas('washingmachine_atlas', 'images/enemies/washingmachine/washingmachine_atlas.png', 'images/enemies/washingmachine/washingmachine_atlas.json');
		this.load.atlas('robot_atlas', 'images/enemies/robot/robot_atlas.png', 'images/enemies/robot/robot_atlas.json');

		// Tower assets
		this.load.image('_waterhose', 'images/towers/waterhose_color.png');
		this.load.image('_signaldisruptor', 'images/towers/signaldisruptor_color.png');
		this.load.image('_laser', 'images/towers/laser_color.png');

		// Projectile assets
		this.load.image('_waterdrop', 'images/projectiles/waterdrop.png');
		this.load.image('_radiowave', 'images/projectiles/radiowave.png');
		this.load.image('_laserbeam', 'images/projectiles/laserbeam.png');
	}

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
		//create group for towers
		waterhoses = this.add.group({ classType: Waterhose, runChildUpdate: true });
		lasers = this.add.group({ classType: Laser, runChildUpdate: true });
		signaldisruptors = this.add.group({ classType: SignalDisruptor, runChildUpdate: true });
		//create group for projectiles
		waterdrops = this.physics.add.group({ classType: waterdrop, runChildUpdate: true });
		laserbeams = this.physics.add.group({ classType: laserbeam, runChildUpdate: true });
		radiowaves = this.physics.add.group({ classType: radiowave, runChildUpdate: true });

		//waterdrop overlap
		this.physics.add.overlap(toasters, waterdrops, this.hurtEnemy.bind(this));
		this.physics.add.overlap(washingmachines, waterdrops, this.hurtEnemy.bind(this));
		this.physics.add.overlap(robots, waterdrops, this.hurtEnemy.bind(this));
		//laserbeam overlap
		this.physics.add.overlap(toasters, laserbeams, this.hurtEnemy.bind(this));
		this.physics.add.overlap(washingmachines, laserbeams, this.hurtEnemy.bind(this));
		this.physics.add.overlap(robots, laserbeams, this.hurtEnemy.bind(this));
		//waves overlap
		this.physics.add.overlap(toasters, radiowaves, this.hurtEnemy.bind(this));
		this.physics.add.overlap(washingmachines, radiowaves, this.hurtEnemy.bind(this));
		this.physics.add.overlap(robots, radiowaves, this.hurtEnemy.bind(this));
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
		if (this.gameOver() === true) {
			this.scene.pause();
			return;
		}
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

	gameOver() {
		// check if player ran out of lives
		if (gamestate.lives <= 0) {
			var endText = this.add.text(150, 150, 'Game Over! You lost all your lives!', { fontSize: '20px', fill: '#ffffff' });
			return true;
		}
		// check if player completed all waves
		else if (waveNum >= enemyList.length && waveSpawned && this.isBoardEmpty() === true) {
			var endText = this.add.text(170, 150, 'Congratulations! You won!', { fontSize: '20px', fill: '#ffffff' });
			return true;
		}
		else //game isn't over
			return false;
	}

	// Creates the HUD, including all icons and text
	createHeadsUpDisplay(graphics) {
		// Add gray hud panel to screen
		graphics.fillStyle(0x2c3e50, 1);
		graphics.fillRect(675, 0, 375, 390);

		// Add white border lines to hud
		graphics.fillStyle(0x34495e, 1);
		graphics.fillRect(675, 78, 375, 3);
		graphics.fillRect(675, 156, 375, 3);
		graphics.fillRect(675, 234, 375, 3);
		graphics.fillRect(675, 312, 375, 3);
		graphics.fillRect(672, 0, 3, 390);

		// Add tower icons and text
		waterhoseIcon = this.add.image(710, 117, 'waterhose');
		waterhoseIcon.setInteractive();
		// Start placing tower mode when clicking on the waterhoseIcon in the HUD
		waterhoseIcon.on('pointerdown', this.startPlacingWaterhose.bind(this));
		this.add.text(740, 100, 'Waterhose:$25', { color: '#ffffff', fontSize: '12px' });
		upgradeWaterhoseIcon = this.add.image(972, 132, 'upgrade').setScale(0.5);
		upgradeWaterhoseIcon.setInteractive();
		upgradeWaterhoseIcon.on('pointerdown', this.startUpgradeWaterhose.bind(this));
		this.add.text(940, 100, 'Upgrade:$50', { color: '#ffffff', fontSize: '12px' });

		signaldisruptorIcon = this.add.image(710, 195, 'signaldisruptor');
		signaldisruptorIcon.setInteractive();
		signaldisruptorIcon.on('pointerdown', this.startPlacingSignalDisruptor.bind(this));
		this.add.text(740, 178, 'Signal Disruptor:$100', { color: '#ffffff', fontSize: '12px' });
		upgradeSignalDisruptorIcon = this.add.image(972, 210, 'upgrade').setScale(0.5);
		upgradeSignalDisruptorIcon.setInteractive();
		upgradeSignalDisruptorIcon.on('pointerdown', this.startUpgradeSignalDisruptor.bind(this));
		this.add.text(940, 178, 'Upgrade:$75', { color: '#ffffff', fontSize: '12px' });

		laserIcon = this.add.image(710, 273, 'laser');
		laserIcon.setInteractive();
		laserIcon.on('pointerdown', this.startPlacingLaser.bind(this));
		this.add.text(740, 256, 'Laser:$500', { color: '#ffffff', fontSize: '12px' });
		upgradeLaserIcon = this.add.image(972, 288, 'upgrade').setScale(0.5);
		upgradeLaserIcon.setInteractive();
		upgradeLaserIcon.on('pointerdown', this.startUpgradeLaser.bind(this));
		this.add.text(940, 256, 'Upgrade:$100', { color: '#ffffff', fontSize: '12px' });

		// Add play, save, load buttons
		playButton = this.add.image(710, 345, 'play').setScale(0.06);
		playButton.setInteractive();
		playButton.on('pointerdown', this.startPlayMode);
		this.add.text(697, 365, 'Play', { color: '#ffffff', fontSize: '12px' });
		saveButton = this.add.image(780, 345, 'save').setScale(0.06);
		saveButton.setInteractive();
		saveButton.on('pointerdown', () => {
			this.scene.start('SaveGame');
			this.scene.destroy('Easy');
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

	// Helper function to get array of all active enemies
	getAllEnemies() {
		var enemies = [];

		//for each enemy type
		for (var i = 0; i < allEnemies.length; i++) {
			//get their children
			var enemy = allEnemies[i].getChildren();

			for (var j = 0; j < enemy.length; j++) {
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

	addWaterDrops(x, y, angle) {
		var wd = waterdrops.getFirstDead();
		if (!wd) {
			var wd = new waterdrop(this, 0, 0);
			waterdrops.add(wd);
		}
		wd.fire(x, y, angle);
	}
	addRadioWaves(x, y, angle, upgraded) {
		var wv = radiowaves.getFirstDead();
		if (!wv) {
			var wv = new radiowave(this, 0, 0);
			radiowaves.add(wv);
		}
		if (upgraded) {
			wv.dmg = 20;
		}
		wv.fire(x, y, angle);
	}
	addLaserBeams(x, y, angle) {
		var lb = laserbeams.getFirstDead();
		if (!lb) {
			var lb = new laserbeam(this, 0, 0);
			laserbeams.add(lb);
		}
		lb.fire(x, y, angle);
	}


	placeWaterhose(pointer) {
		var hose = waterhoses.getFirstDead();
		if (!hose) {
			var hose = new Waterhose(this, pointer.x, pointer.y);
			waterhoses.add(hose);
		}
		hose.setInteractive();
		hose.on('pointerdown', () => {
			if (isUpgradingWaterhose && !hose.upgrade) {
				hose.upgrade = true;
				hose.setScale(0.05);
				gamestate.money -= waterhoseUpgradeCost;
				isUpgradingWaterhose = !isUpgradingWaterhose;
			}
		});
		hose.setActive(true);
		hose.setVisible(true);
	}
	placeSignalDisruptor(pointer) {
		var signaldisruptor = signaldisruptors.getFirstDead();
		if (!signaldisruptor) {
			var signaldisruptor = new SignalDisruptor(this, pointer.x, pointer.y);
			signaldisruptors.add(signaldisruptor);
		}
		signaldisruptor.setInteractive();
		signaldisruptor.on('pointerdown', () => {
			if (isUpgradingSignalDisruptor && !signaldisruptor.upgrade) {
				signaldisruptor.upgrade = true;
				signaldisruptor.setScale(0.05);
				gamestate.money -= signalDisruptorUpgradeCost;
				isUpgradingSignalDisruptor = !isUpgradingSignalDisruptor;
			}
		});
		signaldisruptor.setActive(true);
		signaldisruptor.setVisible(true);
	}
	placeLaser(pointer) {
		var laser = lasers.getFirstDead();
		if (!laser) {
			var laser = new Laser(this, pointer.x, pointer.y);
			lasers.add(laser);
		}
		laser.setInteractive();
		laser.on('pointerdown', () => {
			if (isUpgradingLaser && !laser.upgrade) {
				laser.upgrade = true;
				laser.setScale(0.05);
				gamestate.money -= laserUpgradeCost;
				isUpgradingLaser = !isUpgradingLaser;
			}
		});
		laser.setActive(true);
		laser.setVisible(true);
		laser.setScale(0.04);
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
		if (waveNum < enemyList.length) {
			//check if board is empty after full wave, advance to next round first enemy if all enemies defeated
			if (time > startTime && waveSpawned) {
				var boardEmpty = this.isBoardEmpty();
				if (boardEmpty) {
					nextEnemy = time + 2000; // 2 second gap to new wave when cleared early
					waveSpawned = false;
				}
			}

			//if it's time for the next enemy to spawn
			if (time > nextEnemy) {
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
	cleanUpEnemies() {
		// Return early if game has not started
		if (!isInPlayMode) return;

		//check all enemy types
		for (var i = 0; i < allEnemies.length; i++) {
			//get children of that type
			var children = allEnemies[i].getChildren();

			//check children
			for (var j = 0; j < children.length; j++) {
				// check if enemy completed track or defeated
				if (children[j].follower.t >= 1 || children[j].health <= 0) {
					//remove enemy from group/game
					allEnemies[i].remove(children[j], true, true);
				}
			}
		}

	}

	// Handler for clicking the waterhose icon in the HUD
	startPlacingWaterhose() {
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
		newTowerPlaceholder = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'waterhose');
		newTowerPlaceholder.setInteractive();

		// Handle placing the tower into position if valid or cancel by clicking into the HUD
		newTowerPlaceholder.on('pointerdown', this.placeTowerWaterhose.bind(this));
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
	placeTowerWaterhose(pointer) {
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
	// Handler for clicking the waterhose icon in the HUD
	startPlacingSignalDisruptor() {
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
		newTowerPlaceholder = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'signaldisruptor');
		newTowerPlaceholder.setInteractive();

		// Handle placing the tower into position if valid or cancel by clicking into the HUD
		newTowerPlaceholder.on('pointerdown', this.placeTowerSignalDisruptor.bind(this));
	}


	// Handle placing tower when the mouse is clicked 
	placeTowerSignalDisruptor(pointer) {
		if (gamestate.money < signaldisruptorCost) return;
		else if (isPlacingTower) {
			if (pointer.x < 675) {
				// Pointer is in the game area
				if (!this.isPointerOverTrack(pointer)) {
					// Tower placed in valid area
					gamestate.money -= signaldisruptorCost;
					this.placeSignalDisruptor(pointer);
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
	// Handler for clicking the waterhose icon in the HUD
	startPlacingLaser() {
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
		newTowerPlaceholder = this.add.image(this.input.mousePointer.x, this.input.mousePointer.y, 'laser');
		newTowerPlaceholder.setInteractive();

		// Handle placing the tower into position if valid or cancel by clicking into the HUD
		newTowerPlaceholder.on('pointerdown', this.placeTowerLaser.bind(this));
	}


	// Handle placing tower when the mouse is clicked 
	placeTowerLaser(pointer) {
		if (gamestate.money < laserCost) return;
		else if (isPlacingTower) {
			if (pointer.x < 675) {
				// Pointer is in the game area
				if (!this.isPointerOverTrack(pointer)) {
					// Tower placed in valid area
					gamestate.money -= laserCost;
					this.placeLaser(pointer);
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

	startUpgradeWaterhose() {
		if (waterhoses.getChildren().length > 0 && gamestate.money > waterhoseUpgradeCost) { //if there are waterhoses and we have the funds
			isUpgradingWaterhose = !isUpgradingWaterhose;
		}
	}
	startUpgradeSignalDisruptor() {
		if (signaldisruptors.getChildren().length > 0 && gamestate.money > signalDisruptorUpgradeCost) { //if there are waterhoses and we have the funds
			isUpgradingSignalDisruptor = !isUpgradingSignalDisruptor;
		}
	}
	startUpgradeLaser() {
		if (lasers.getChildren().length > 0 && gamestate.money > laserUpgradeCost) { //if there are waterhoses and we have the funds
			isUpgradingLaser = !isUpgradingLaser;
		}
	}


	startPlayMode() {
		isInPlayMode = true;
	}
}