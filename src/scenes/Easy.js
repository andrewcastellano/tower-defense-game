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

//Enemy Wave related variables
var enemyNum = 0;           //tracks index of enemy in current wave
var waveNum = 0;            //tracks index of wave that has been called to screen
var newWave = false;        //to help update wave numbers
var nextEnemy = 1000;       //initialize to time (in ms) that first wave will start in game
var enemyList =             //Wave order enemies will appear on screen
// t = toaster, w = washingmachine, r = robot
// gap = additional time for next enemy to spawn in
[ 
    //wave 1
    [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000}, 
     {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 31000},],
    //wave 2
    [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000}, 
     {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 1000},
     {name: 'w', gap: 1000}, {name: 'w', gap: 1000}, {name: 'w', gap: 41000},],
    //wave 3
    [{name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 'r', gap: 1000}, 
     {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 'r', gap: 30000},],
    //wave 4
    [{name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 }, 
     {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
     {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
     {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
     {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 31000},],
    //wave 5
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}],
    //wave 6
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}],
    //wave 7
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}],
    //wave 8
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}],
    //wave 9
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}],
    //wave 10
    [{name: 't', gap: 2000}, {name: 'w', gap: 4000}, {name: 'r', gap: 37000}]
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

        // Add tower icons and text
        waterhoseIcon = this.add.image(710, 117, 'waterhose').setScale(0.04);
        waterhoseIcon.setInteractive();
        waterhoseIcon.on('pointerdown', buyWaterhose);
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
        
        // Draw the path to visualize
        //graphics.lineStyle(3, 0xffffff, 1);
        //path.draw(graphics);

        // Create group for enemies
        toasters = this.physics.add.group({ classType: Toaster, runChildUpdate: true });
        washingmachines = this.physics.add.group({ classType: WashingMachine, runChildUpdate: true });
        robots = this.physics.add.group({ classType: Robot, runChildUpdate: true });
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

        // spawn waves of enemies
        spawnEnemies(time);
    }
}

// Helper function to count active enemies on screen, returns true if no active enemies
function isBoardEmpty()
{
    var isEmpty = false;
    var numToasters = toasters.countActive(true);
    var numWashingMachines = washingmachines.countActive(true);
    var numRobots = robots.countActive(true);
    if (numToasters + numWashingMachines + numRobots === 0)
    {
        isEmpty = true;
    }
    return isEmpty;
}

// Used by Update function to bring enemies onto the track, using wave and enemyList info
function spawnEnemies(time)
{
    // if its time for the next enemy and still enemies to spawn
    if (time > nextEnemy && waveNum < enemyList.length)
    {   
        //check if first enemy of new wave, update display
        if (newWave)
        {
            currentWave.setText('Wave #' + (waveNum + 1));
            newWave = false;
        }
        // get next enemy     
        var enemy;
        switch (enemyList[waveNum][enemyNum].name)
        {
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
        if (enemy)
        {
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
            }
            else
            {
                nextEnemy = time + enemyList[waveNum][enemyNum].gap;
                enemyNum++;
            }
        }       
    }
}