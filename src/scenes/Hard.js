// Hard Track point data
var hardPoints1 = {                     //<-- splits here
    'x': [   0,  90,  90, 220, 220, 335, 335, 675], 
    'y': [ 275, 275,  52,  52, 227, 227, 105, 105]
};

var hardPoints2 = {                     //<-- splits here
    'x': [   0,  90,  90, 220, 220, 335, 482, 482, 675], 
    'y': [ 275, 275,  52,  52, 227, 227, 227, 307, 307]
};

class Hard extends GameBase {

    constructor() {
        super({
            key: 'Hard',
            active: false
        });
    }

    // Preload the game scene
    preload() {
        GameBase.prototype.preload.call(this);

        // Track assets
        this.load.image('hardTrack', 'images/tracks/hardTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels
    }

    // Create the game scene
    create() {
        // Position track (will the track need physics??)
        this.add.image(336, 180, 'hardTrack');

        // Load up Hard Track data points into path
        var hardPath1 = this.loadTrackPoints(hardPoints1);
        var hardPath2 = this.loadTrackPoints(hardPoints2);
        path.push(hardPath1);
        path.push(hardPath2);

        //scalar to adjust enemy speed on this level
        MAP_SPEED = 2;

        enemyList =             //Wave order enemies will appear on screen
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

        GameBase.prototype.create.call(this);
    }

    // Update game scene
    update(time, delta) {
        GameBase.prototype.update.call(this, time, delta);

        // check for game over conditions
        if (GameBase.prototype.gameOver.call(this) === true) {
            // Add gray panel to screen
            var msgBox = this.add.graphics();
            msgBox.fillStyle(0x2c3e50, 1);
            msgBox.fillRect(175, 150, 375, 100);
            msgBox.active = false;
            msgBox.visible = false;

            // check if player ran out of lives
            if (gamestate.lives <= 0) {
                isInPlayMode = false;
                msgBox.active = true;
                msgBox.visible = true;
                var endText = this.add.text(362, 185, 'game over! you ran out of lives!', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Montserrat' }).setOrigin(.5);
                var playAgainText = this.add.text(362, 215, 'play again?', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Montserrat' }).setOrigin(.5);
                playAgainText.setInteractive();
                playAgainText.on('pointerdown', () => {
                    location.reload();
                });
                return true;
            }
            // check if player completed all waves
            else if (waveNum >= enemyList.length && waveSpawned && this.isBoardEmpty() === true) {
                isInPlayMode = false;
                msgBox.active = true;
                msgBox.visible = true;
                var endText = this.add.text(362, 185, 'congratulations! you won!', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Montserrat' }).setOrigin(.5);
                var playAgainText = this.add.text(362, 215, 'play again?', { fontSize: '20px', fill: '#ffffff', fontFamily: 'Montserrat' }).setOrigin(.5);
                playAgainText.setInteractive();
                playAgainText.on('pointerdown', () => {
                    location.reload();
                });
                localStorage.setItem("isHardCleared", "true");
                return true;
            }
            return;
        }
    }

    // Returns whether pointer is hovering over part of the track. Used to determine which area of
    // effect indicator to use when attempting to place a tower.
    // Why check bounds for track instead of detecing pointer / image overlap?
    // => Track image is a rectangle even though the visible track area takes up edges of image
    isPointerOverTrack(pointer) {
        // Stores bounds of different rectangles on the map that the track image covers
        let boundariesList = [
            { leftBound:   0, rightBound: 105, topBound: 260, bottomBound: 290},
            { leftBound:  75, rightBound: 105, topBound:  37, bottomBound: 260},
            { leftBound: 105, rightBound: 235, topBound:  37, bottomBound:  67},
            { leftBound: 205, rightBound: 235, topBound:  67, bottomBound: 242},
            { leftBound: 235, rightBound: 497, topBound: 212, bottomBound: 242},
            { leftBound: 467, rightBound: 497, topBound: 242, bottomBound: 322},
            { leftBound: 497, rightBound: 675, topBound: 292, bottomBound: 322},
            { leftBound: 320, rightBound: 350, topBound:  90, bottomBound: 212},
            { leftBound: 320, rightBound: 675, topBound:  90, bottomBound: 120}            
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
}