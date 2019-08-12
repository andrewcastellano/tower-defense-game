// Class for Toasters
var Toaster = new Phaser.Class({

    Extends: Enemy,
    initialize:
        // Constructor
        function Toaster(scene) {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'toaster_atlas');
            this.setScale(.50);

            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

            // enemy specific attributes
            this.health = 100;
            this.alive = true;
            this.speed = 1 / 30000 * MAP_SPEED;
            this.value = 2;
            this.movingRight = true;
            this.anims.play('toasterMoveRight', true);
            this.path = path[Math.floor(Math.random() * path.length)];
        },
        // Update function for path tracking and animations
        update: function (time, delta) {
            var oldX = this.x;
            // get new progress through track path
            this.follower.t += this.speed * delta;
            // use progression to find new position coordinate
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            //check if enemy completed track path
            if (this.follower.t >= 1) {
                //deactivate enemy
                this.setActive(false);
                this.setVisible(false);
                //take a life away from player
                gamestate.setLives(gamestate.lives - 1);
            }

            // check direction of toaster, animate accordingly
            if (oldX < this.x && this.movingRight === false) //moving right now
            {
                //use moving right animation
                this.anims.play('toasterMoveRight', true);
                this.movingRight = true;
            }
            else if (oldX > this.x && this.movingRight === true) //moving left now
            {
                //use moving left animation
                this.anims.play('toasterMoveLeft', true);
                this.movingRight = false;
            }

        }
});    