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
        path = this.add.path(easyPoints.x[0], easyPoints.y[0]);
        for (var i = 1; i < easyPoints.x.length; i++) {
            path.lineTo(easyPoints.x[i], easyPoints.y[i]);
        }

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
}