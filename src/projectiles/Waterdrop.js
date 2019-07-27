// Waterdrop class definition
var waterdrop = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
        function waterdrop(scene, x, y) {
            Phaser.GameObjects.Image.call(this, scene, x, y, '_waterdrop');
            this.scene = scene;
            this.deltaX = 0;
            this.deltaY = 0;
            this.speed = Phaser.Math.GetSpeed(400, 1); //how far, how long
            this.scene.add.existing(this);
            this.dmg = 20;
        },
    fire: function (x, y, angle) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

        this.deltaX = Math.cos(angle);
        this.deltaY = Math.sin(angle);
    },
    update: function (time, delta) {
        this.x += this.deltaX * (this.speed * delta);
        this.y += this.deltaY * (this.speed * delta);
    }
});