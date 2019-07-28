// Class for Washing Machines
var WashingMachine = new Phaser.Class({
    Extends: Enemy,
    initialize:
        // Constructor
        function WashingMachine(scene) {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'washingmachine');
            this.setScale(.75);
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 300;
            this.alive = true;
            this.speed = 1 / 40000;
            this.value = 20;
        }
});  