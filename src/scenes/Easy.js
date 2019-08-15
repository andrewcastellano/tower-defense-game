// Easy Track point data
var easyPoints = {
    'x': [0, 125, 125, 595, 595, 125, 125, 84, 84, 634, 634, 84, 84, 0],
    'y': [185, 185, 95, 95, 295, 295, 245, 245, 335, 335, 55, 55, 145, 145]
};

class Easy extends GameBase {

    constructor() {
        super({
            key: 'Easy',
            active: false
        });
    }

    // Preload the game scene
    preload() {
        GameBase.prototype.preload.call(this);

        // Track assets
        this.load.image('easyTrack', 'images/tracks/easyTrack.png');
        //this.load.image('backdrop', 'images/backdrop.png');   find a good backdrop for levels
    }

    // Create the game scene
    create() {
        // Position track (will the track need physics??)
        this.add.image(325, 195, 'easyTrack');

        // Load up Easy Track data points into path
        var easyPath = this.loadTrackPoints(easyPoints);
        path.push(easyPath);

        //scalar to adjust enemy speed on this level
        MAP_SPEED = 1;

        enemyList =             //Wave order enemies will appear on screen
            // t = toaster, w = washingmachine, r = robot
            // gap = additional time for next enemy to spawn in
            [
                //wave 1
                [{ name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: 1000 },
                { name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: TTF }],
                //wave 2
                [{ name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: 1000 },
                { name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: 1000 },
                { name: 'w', gap: 1000 }, { name: 'w', gap: 1000 }, { name: 'w', gap: TTF }],
                //wave 3
                [{ name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 'r', gap: 1000 },
                { name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 'r', gap: TTF }],
                //wave 4
                [{ name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: TTF }],
                //wave 5
                [{ name: 'r', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 't', gap: 1000 }, { name: 'w', gap: 3000 }, { name: 'r', gap: 2000 },
                { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 't', gap: TTF }],
                //wave 6
                [{ name: 'w', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 't', gap: 1000 }, { name: 't', gap: 1000 }, { name: 't', gap: 3000 },
                { name: 'r', gap: 3000 }, { name: 'r', gap: 3000 }, { name: 'r', gap: TTF }],
                //wave 7
                [{ name: 'w', gap: 2000 }, { name: 't', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 'r', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'r', gap: 2000 },
                { name: 'r', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: TTF }],
                //wave 8
                [{ name: 'w', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 't', gap: 2000 }, { name: 'w', gap: 4000 }, { name: 'r', gap: TTF }],
                //wave 9
                [{ name: 'w', gap: 2000 }, { name: 'w', gap: 2000 }, { name: 'w', gap: 2000 },
                { name: 't', gap: 2000 }, { name: 't', gap: 2000 }, { name: 't', gap: 2000 },
                { name: 't', gap: 2000 }, { name: 'w', gap: 4000 }, { name: 'r', gap: TTF }],
                //wave 10
                [{ name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 't', gap: 500 }, { name: 't', gap: 500 }, { name: 't', gap: 500 },
                { name: 'r', gap: 1000 }, { name: 'r', gap: 2000 }, { name: 'r', gap: 3000 },
                { name: 'r', gap: 1000 }, { name: 'r', gap: 2000 }, { name: 'r', gap: TTF }]
            ];

        GameBase.prototype.create.call(this);
    }


    // Update game scene
    update(time, delta) {
        GameBase.prototype.update.call(this, time, delta);

        // check for game over conditions
        if (GameBase.prototype.gameOver.call(this) === true) {
            // Save Easy stage cleared data
            localStorage.setItem("isEasyCleared", "true");
            this.scene.pause();
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
            { leftBound: 0, rightBound: 70, topBound: 126, bottomBound: 198 },
            { leftBound: 70, rightBound: 139, topBound: 41, bottomBound: 200 },
            { leftBound: 138, rightBound: 580, topBound: 40, bottomBound: 110 },
            { leftBound: 576, rightBound: 651, topBound: 41, bottomBound: 351 },
            { leftBound: 138, rightBound: 584, topBound: 281, bottomBound: 350 },
            { leftBound: 69, rightBound: 140, topBound: 231, bottomBound: 350 },
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