// Waterhose class definition
var Waterhose = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,
	initialize:

		function Waterhose(scene, x, y) {
			Phaser.GameObjects.Image.call(this, scene, x, y, 'waterhose');
			this.nextTic = 0;
			this.upgrade = false;
			this.scene.add.existing(this);
		},
	fire: function () {
		var enemy = this.scene.getEnemy(this.x, this.y, 100);
		if (enemy) { //if there is an enemy in range
			var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y); //angle between tower and enemy
			this.scene.addWaterDrops(this.x, this.y, angle); // add bullet at the angle
			this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
		}
	},
	update: function (time, delta) {
		if (time > this.nextTic) {
			//we can fire another
			this.fire();
			if (this.upgrade) {
				this.nextTic = time + 700;
			} else {
				this.nextTic = time + 1200;
			}
		}
	}
});