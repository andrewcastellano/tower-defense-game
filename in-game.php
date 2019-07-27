<!DOCTYPE html>
<html>
<head>
    <!-- Phaser.io -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js"></script>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet">
    <!-- Bootstrap -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
    <script>

    var config = {
        type: Phaser.AUTO,
        width: 900,
        height: 390,
        physics: {
            default: 'arcade' // Maybe we don't even need this ?
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        backgroundColor: 'rgba(0,0,255,0.5)',
    };

    var game = new Phaser.Game(config);
    var path;
    var enemies;
    var toasters;
    var washingmachines;
    var robots;
    var graphics;
    
    // Easy Track point data
    var easyPoints = {
        'x': [   0, 125, 125, 595, 595, 125, 125,  84,  84, 634, 634, 84,  84,   0 ],
        'y': [ 185, 185,  95,  95, 295, 295, 245, 245, 335, 335,  55, 55, 145, 145 ]
    };

    var mediumPoints = {
        'x': [   0,  96,  96, 225, 225, 356, 356, 486, 486, 616, 616, 486, 486, 356, 356, 225, 225,  96,  96,  0],
        'y': [ 255, 255, 345, 345, 255, 255, 345, 345, 255, 255,  45,  45, 135, 135,  45,  45, 135, 135,  45, 45]
    };

    // Tower prices
    const waterhoseCost = 25;
    const signaldisruptorCost = 100;
    const laserCost = 500;

    // Gamestate class definition
    class GameState {
        constructor() {
            this.money = 50;
            this.lives = 100;
            this.score = 0;
            this.towers =  null;
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


    // Preload the game scene
    function preload ()
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
        this.load.image('mediumTrack', 'images/tracks/mediumTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels

        // Enemy assets
        this.load.image('toaster', 'images/enemies/toaster/toaster.png');
        this.load.image('washingmachine', 'images/enemies/washingmachine/washingmachine.png');
        this.load.image('robot_', 'images/enemies/robot/robot.png');

        // Tower assets
        this.load.image('waterdrop', 'images/waterdrop.png');
        // this.load.image('wave', 'images/wave.png'); // for signal disruptor 
        // this.load.image('beam', 'images/laser.png'); // for laser

    }

<<<<<<< HEAD
=======
    var Enemy = new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,

        initialize: 
        function Enemy(scene)
        {
            Phaser.GameObjects.Sprite.call(this, scene);
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // general/default enemy attributes
            this.health = 1;
            this.alive = true;
            this.speed = 1/100000;
            this.value = 1;
        },

        // Spawns enemy in at the start of the track path
        spawn: function ()
        {
            // put enemy to start of track path
            this.follower.t = 0;
            
            // get starting coordinates
            path.getPoint(this.follower.t, this.follower.vec);
            
            // move to starting coordinate
            this.setPosition(this.follower.vec.x, this.follower.vec.y);            
        },
        // To be used to receive damage from towers
        takeDamage: function (damange)
        {
            // damage received as a positive value
            this.health -= damage;
            // access if still alive
            if (this.health <= 0){
                this.alive = false;
            }
        },
        // Update function for gameplay
        update: function (time, delta)
        {
            // get new progress through track path
            this.follower.t += this.speed * delta;
            // use progression to find new position coordinate
            path.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            //check if enemy completed track path
            if (this.follower.t >=1)
            {
                //deactivate enemy
                this.setActive(false);
                this.setVisible(false);
                
                //take a life away from player
                gamestate.setLives(gamestate.lives-1);
            }
            // check for death
            if (this.alive === false)
            {
                //deactivate enemy
                this.setActive(false);
                this.setVisible(false);
                //give player the value of the destroyed enemy
                gamestate.money += this.value;
            }
        }
    });

    // Class for Toasters
    var Toaster = new Phaser.Class({
    
        Extends: Enemy,
        initialize: 
        // Constructor
        function Toaster(scene)
        {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'toaster');
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 100;
            this.alive = true;
            this.speed = 1/30000;
            this.value = 10;
        }
    });    

    // Class for Washing Machines
    var WashingMachine = new Phaser.Class({

        Extends: Enemy,
        initialize: 
        // Constructor
        function WashingMachine(scene)
        {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'washingmachine');
            this.setScale(.75);
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 300;
            this.alive = true;
            this.speed = 1/40000;
            this.value = 20;
        }
    });    

    // Class for Robots
    var Robot = new Phaser.Class({

        Extends: Enemy,
        initialize: 
        // Constructor
        function Robot(scene)
        {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'robot_');
            this.setScale(.75);
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 200;
            this.alive = true;
            this.speed = 1/20000;
            this.value = 30;
        }
    });

>>>>>>> 7c9ebeb9577a5375e501bde3380198dbb2b7d036
    // Buy a Waterhose
    function buyWaterhose() {
        if (gamestate.money < waterhoseCost) return;

        // Enable drag and drop
        // Wait for tower placed event
        // Subtract cost from money
        gamestate.setMoney(gamestate.money - waterhoseCost);
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

    function loadTrackPoints(track)
    {
        //set starting position
        path = new Phaser.Curves.Path(track.x[0], track.y[0]);

        //add track data points to path


        for (var i = 1; i < track.x.length; i++)
        {
            path.lineTo(track.x[i], track.y[i]);
        } 
    }


    // Create the game scene
    function create ()
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
      
        // Add money and lives text info
        moneyText = this.add.text(700, 5, `Money: ${gamestate.money}`, { color: '#ffffff' });
        livesText = this.add.text(700, 45, `Lives: ${gamestate.lives}`, { color: '#ffffff' });
        currentWave = this.add.text(5, 5, `Wave #1`, { color: '#ffffff' });

        // Add not enough funds text under towers
        cantAffordWaterhoseText = this.add.text(740, 120, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordSignalDisruptorText = this.add.text(740, 198, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        cantAffordLaserText = this.add.text(740, 276, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });

        // Position track (will the track need physics??)
        //this.add.image(325, 195, 'easyTrack');
        this.add.image(316, 195, 'mediumTrack');
        
        // Load up Easy Track data points into path
        loadTrackPoints(mediumPoints);    
        
<<<<<<< HEAD
	    this.nextEnemy = 1000; //initialize to time (in ms) that waves will start
=======
        // Draw the path to visualize
        //graphics.lineStyle(3, 0xffffff, 1);
        //path.draw(graphics);

        // Create groups for enemies
        toasters = this.physics.add.group({ classType: Toaster, runChildUpdate: true });
        washingmachines = this.physics.add.group({ classType: WashingMachine, runChildUpdate: true });
        robots = this.physics.add.group({ classType: Robot, runChildUpdate: true });
>>>>>>> 7c9ebeb9577a5375e501bde3380198dbb2b7d036
    }

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

    // Enemy wave related variables
    var enemyNum = 0;
    var waveNum = 0;
    const enemyGap = 1000;
    const waveGap = 15000;
    var newWave = false;
    var nextEnemy = 1000; //initialize to time (in ms) that first wave will start

    // Enemy wave information
    // t = toaster, w = washingmachine, r = robot
    // gap = additional time for next enemy to spawn in
    var enemyList = 
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
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 'r', gap: 21000},],
        //wave 4
        [{name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 }, 
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 500 }, {name: 't', gap: 500 }, {name: 't', gap: 500 },
         {name: 't', gap: 1000}, {name: 't', gap: 1000}, {name: 't', gap: 31000},],
    ];

    // Update game scene
    function update (time, delta)
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

    </script>
</body>
</html>