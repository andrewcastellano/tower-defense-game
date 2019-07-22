// TODO: refactor- find a home for these vars

// Easy Track point data
var easyPoints = {
    'x': [   0, 125, 125, 595, 595, 125, 125,  84,  84, 634, 634, 84,  84,   0 ],
    'y': [ 185, 185,  95,  95, 295, 295, 245, 245, 335, 335,  55, 55, 145, 145 ]
};
var path;
var enemies;
var toasters;
var washingmachines;
var robots;
var graphics;

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

var enemyNum = 0;
var waveNum = 0;
const enemyGap = 1000;
const waveGap = 15000;
var enemyList = 
[ 
    ['toaster', 'toaster', 'toaster', 'toaster', 'toaster'],                     //wave 1
    ['toaster', 'toaster', 'toaster', 'toaster', 'toaster', 'wm', 'wm', 'wm'],   //wave 2
    ['toaster', 'robot', 'toaster', 'robot', 'toaster', 'robot']                 //wave 3
];
let waterhoses;	

class Easy extends Phaser.Scene {

	constructor() {
		super({
			key: 'Easy',
			active: false
		});
	}

    // Preload the game scene
    preload ()
    {   
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

    }

    // Create the game scene
	create ()
    {
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

        waterhoses = this.physics.add.group({ classType: waterhose, runChildUpdate: true });
      
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
        for (var i = 1; i < easyPoints.x.length; i++)
        {
            path.lineTo(easyPoints.x[i], easyPoints.y[i]);
        }     
// TODO: Remove
        console.log(path.getBounds())
        // Draw the path to visualize
        //graphics.lineStyle(3, 0xffffff, 1);
        //path.draw(graphics);

        // Create group for enemies
        toasters = this.physics.add.group({ classType: Toaster, runChildUpdate: true });
        washingmachines = this.physics.add.group({ classType: WashingMachine, runChildUpdate: true });
        robots = this.physics.add.group({ classType: Robot, runChildUpdate: true });

	    this.nextEnemy = 1000; //initialize to time (in ms) that waves will start
    }

    // Update game scene
    update (time, delta)
    {   
        // add money at regular intervals second
        if (time > nextTimeToAddMoney) {
            gamestate.money += 1;
            nextTimeToAddMoney = time + 1000;
        }

        updateNotEnoughFundsText();

        // update player money and lives
        moneyText.setText('Money: ' + gamestate.money);
        livesText.setText('Lives: ' + gamestate.lives)

        // if its time for the next enemy and still enemies to spawn
        if (time > this.nextEnemy && waveNum < enemyList.length)
        {   
            // get next enemy     
            var enemy;
            switch (enemyList[waveNum][enemyNum])
            {
                case 'toaster':
                    enemy = toasters.get();
                    break;
                case 'wm':
                    enemy = washingmachines.get();
                    break;
                case 'robot':
                    enemy = robots.get();
                    break;
            }
            if (enemy)
            {
                enemy.setActive(true);
                enemy.setVisible(true);
                
                // place the enemy at the beginning of the path
                enemy.spawn();

                // determine index of next enemy
                enemyNum++;
                if (enemyNum == enemyList[waveNum].length) // go to next wave
                {
                    enemyNum = 0;
                    waveNum++;
                    this.nextEnemy = time + waveGap;
                    currentWave.setText('Wave #' + (waveNum + 1));
                }
                else
                {
                    this.nextEnemy = time + enemyGap;
                }
            }       
        }
    }
}