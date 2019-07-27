// Class for Toasters
var Toaster = new Phaser.Class({

    Extends: Enemy,
    initialize:
        // Constructor
        function Toaster(scene) {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'toaster');
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 100;
            this.alive = true;
            this.speed = 1 / 30000;
            this.value = 10;
        }
});    