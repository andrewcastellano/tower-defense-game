// Medium Track point data
var mediumPoints = {
    'x': [   0,  95,  95, 225, 225, 355, 355, 485, 485, 615, 615, 485, 485, 355, 355, 225, 225,  95,  95,  0],
    'y': [ 255, 255, 345, 345, 255, 255, 345, 345, 255, 255,  45,  45, 135, 135,  45,  45, 135, 135,  45, 45]
};

class Medium extends GameBase {

    constructor() {
        super({
            key: 'Medium',
            active: false
        });
    }

    // Preload the game scene
    preload() {
        GameBase.prototype.preload.call(this);

        // Track assets
        this.load.image('mediumTrack', 'images/tracks/mediumTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels
    }

    // Create the game scene
    create() {
        // Position track (will the track need physics??)
        this.add.image(315, 195, 'mediumTrack');

        // Load up Medium Track data points into path
        var mediumPath = this.loadTrackPoints(mediumPoints);
        path.push(mediumPath);

        //scalar to adjust enemy speed on this level
        MAP_SPEED = 1.5;

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
                localStorage.setItem("isMediumCleared", "true");
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
            { leftBound:   0, rightBound: 110, topBound: 240, bottomBound: 270},
            { leftBound:  80, rightBound: 110, topBound: 270, bottomBound: 360},
            { leftBound: 110, rightBound: 240, topBound: 330, bottomBound: 360},
            { leftBound: 210, rightBound: 240, topBound: 240, bottomBound: 330},
            { leftBound: 240, rightBound: 370, topBound: 240, bottomBound: 270},
            { leftBound: 340, rightBound: 370, topBound: 210, bottomBound: 360},
            { leftBound: 370, rightBound: 500, topBound: 330, bottomBound: 360},
            { leftBound: 470, rightBound: 500, topBound: 240, bottomBound: 330},
            { leftBound: 500, rightBound: 630, topBound: 240, bottomBound: 270},
            { leftBound: 600, rightBound: 630, topBound:  30, bottomBound: 240},
            { leftBound: 470, rightBound: 600, topBound:  30, bottomBound:  60},
            { leftBound: 470, rightBound: 500, topBound:  60, bottomBound: 150},
            { leftBound: 340, rightBound: 470, topBound: 120, bottomBound: 150},
            { leftBound: 340, rightBound: 370, topBound:  30, bottomBound: 120},
            { leftBound: 210, rightBound: 340, topBound:  30, bottomBound:  60},
            { leftBound: 210, rightBound: 240, topBound:  60, bottomBound: 150},
            { leftBound:  80, rightBound: 240, topBound: 120, bottomBound: 150},
            { leftBound:  80, rightBound: 110, topBound:  30, bottomBound: 120},
            { leftBound:   0, rightBound:  80, topBound:  30, bottomBound:  60},
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