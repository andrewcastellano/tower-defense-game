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
            default: 'arcade',
            /* I don't think we need/want gravity
            arcade: {
                gravity: { y: 200 }
            }*/
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        backgroundColor: 'rgba(0,0,255,0.5)',
    };

    var objects = {};
    var game = new Phaser.Game(config);
    var gamestate = {
        money: 50,
        lives: 100,
        score: 0,
        towers: {},
        level: {},
        player: {},
        moneyText: "",
        livesText: ""
    };
    var path;
    var enemies;
    var graphics;
    
    // Easy Track point data
    var easyPoints = {
        'x': [   0, 125, 125, 595, 595, 125, 125,  84,  84, 634, 634, 84,  84,   0 ],
        'y': [ 185, 185,  95,  95, 295, 295, 245, 245, 335, 335,  55, 55, 145, 145 ]
    };
    
    // Waterhose class definition
    var waterhose = new Phaser.Class({ 
        Extends: Phaser.GameObjects.Image,
        initialize: function Waterhose(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'waterhose');
            this.range = 0;
            this.damage = 0;
            this.pos = [0, 0];
            this.cost = 25;
        },
        place: function() {
            //definition for the place function
        },
        getEnemyInRange: function () {
            //definition for finding enemy in range
        },
        fire: function() {
            //definition for the fire function
        },
        update: function() {
            //definition for the update function
        }
    });

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
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels

        // Enemy assets
        this.load.image('toaster', 'images/enemies/toaster/toaster.png');

        // Tower assets

    }

    // Class for enemies (being used only for toaster enemy currently)
    var Enemy = new Phaser.Class({
    
        Extends: Phaser.GameObjects.Image,

        initialize: 

        // Constructor
        function Enemy(scene)
        {
            // store enemy image
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'toaster');

            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

            // enemy specific attributes
            this.name = "";
            this.health = 100;
            this.alive = true;
            this.speed = 1/30000;
            this.value = 10;
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
                gamestate.lives--;
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

        // Add tower images
        this.add.image(710, 117, 'waterhose').setScale(0.04);
        this.add.text(740, 100, 'Waterhose:$25', { color: '#ffffff', fontSize: '12px' });
        this.add.image(710, 195, 'signaldisruptor').setScale(0.04);
        this.add.text(740, 178, 'Signal Disruptor:$100', { color: '#ffffff', fontSize: '12px' });
        this.add.text(740, 198, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });
        this.add.image(710, 273, 'laser').setScale(0.04);
        this.add.text(740, 256, 'Laser:$500', { color: '#ffffff', fontSize: '12px' });
        this.add.text(740, 276, 'Not enough funds', { color: '#ff0000', fontSize: '12px' });

        // Add play, save, load buttons
        this.add.image(710, 345, 'play').setScale(0.06);
        this.add.text(697, 365, 'Play', { color: '#ffffff', fontSize: '12px' });
        this.add.image(780, 345, 'save').setScale(0.06);
        this.add.text(765, 365, 'Save', { color: '#ffffff', fontSize: '12px' });
        this.add.image(850, 345, 'cancel').setScale(0.06);
        this.add.text(830, 365, 'Cancel', { color: '#ffffff', fontSize: '12px' });

      
        waterhoses = this.physics.add.group({ classType: waterhose, runChildUpdate: true });
        // Add money and lives text info
        gamestate.moneyText = this.add.text(700, 5, `Money: ${gamestate.money}`, { color: '#ffffff' });
        gamestate.livesText = this.add.text(700, 45, `Lives: ${gamestate.lives}`, { color: '#ffffff' });

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
        enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
	    this.nextEnemy = 0;
    }

    var enemyCount = 0;
    var waveCount = 10;

    // Update game scene
    function update (time, delta)
    {
        //this.add.text(700, 5, `Money: ${gamestate.money}`, { color: '#ffffff' });
        //this.add.text(700, 45, `Lives: ${gamestate.lives}`, { color: '#ffffff' });
        // update player money and lives
        gamestate.moneyText.setText('Money: ' + gamestate.money);
        gamestate.livesText.setText('Lives: ' + gamestate.lives)

        // if its time for the next enemy and still enemies to spawn
        if (time > this.nextEnemy && enemyCount < waveCount)
        {   
            // get another enemy     
            var enemy = enemies.get();
            if (enemy)
            {
                enemy.setActive(true);
                enemy.setVisible(true);
                
                // place the enemy at the beginning of the path
                enemy.spawn();

                // tally enemy (to be used for waves)
                enemyCount++;
                
                var gap = 2000; //increase for larger gaps, decrease for smaller gaps
                this.nextEnemy = time + gap;
            }       
        }       
    }

    </script>
</body>
</html>