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
            arcade: {
                gravity: { y: 200 }
            }
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
        player: {}
    };
    var easyTrack;

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
        this.load.image('track', 'images/tracks/easyTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels

        // Enemy assets
        this.load.image('toaster', 'images/enemies/toaster/toaster.png');

        // Tower assets

    }

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

        // Add track (easy level for now) and give it static physics
        var levelTrack = this.physics.add.staticGroup();

        // Position track
        levelTrack.create(325, 195, 'track');

////////// testing...////////////////////////////
        var pathGraphics = this.add.graphics();

        // Easy Track point data
        var points = {
            'x': [   0, 125, 125, 595, 595, 125, 125,  84,  84, 634, 634, 84,  84,   0 ],
            'y': [ 185, 185,  95,  95, 295, 295, 245, 245, 335, 335,  55, 55, 145, 145 ]
        };

        // Load up Easy Track data points into path
        path = this.add.path(points.x[0], points.y[0]);
        for (var i = 1; i < points.x.length; i++)
        {
            path.lineTo(points.x[i], points.y[i]);
        }        

        // Draw the path for now
        pathGraphics.lineStyle(3, 0xffffff, 1);
        path.draw(pathGraphics);

        // Add toaster
        var enemies = this.physics.add.staticGroup();
        enemies.create(0, 185, 'toaster');

    }
    </script>
</body>
</html>