// SignalDisruptor class definition
var SignalDisruptor = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:

        function SignalDisruptor(scene, x, y) {
            Phaser.GameObjects.Image.call(this, scene, x, y, 'signaldisruptor');
            this.nextTic = 0;
            this.scene.add.existing(this);
        },

    place: function (i, j) {

    },
    fire: function () {
        var enemy = this.scene.getEnemy(this.x, this.y, 200);
        if (enemy) { //if there is an enemy in range
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y); //angle between tower and enemy
            this.scene.addRadioWaves(this.x, this.y, angle); // add bullet at the angle
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        }
    },
    update: function (time, delta) {
        if (time > this.nextTic) {
            //we can fire another
            this.fire();
            this.nextTic = time + 1000;
        }
    }
}); 