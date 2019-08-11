// Class for Robots
var Robot = new Phaser.Class({
    Extends: Enemy,
    initialize:
        // Constructor
        function Robot(scene) {
            // store enemy image
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'robot_atlas');
            this.setScale(.25);
            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 250;
            this.alive = true;
            this.speed = 1 / 20000;
            this.value = 10;
            this.anims.play('robotMove', true);
            this.path = path[Math.floor(Math.random() * path.length)];
        }
});