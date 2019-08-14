// Class for Robots
var Robot = new Phaser.Class({
    Extends: Enemy,
    initialize:
        // Constructor
        function Robot(scene) {
            // store enemy image
            Phaser.Physics.Arcade.Sprite.call(this, scene, 0, 0, 'robot_atlas');
            scene.physics.world.enable(this);
            this.setScale(.25);
            this.setSize(100, 120);

            // to follow track path
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            // enemy specific attributes
            this.health = 250;
            this.alive = true;
            this.speed = 1 / 22500 * MAP_SPEED;
            this.value = 10;
            this.anims.play('robotMove', true);
            this.path = path[Math.floor(Math.random() * path.length)];
        }
});