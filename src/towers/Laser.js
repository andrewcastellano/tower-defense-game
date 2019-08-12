// Laser class definition
var Laser = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,
	initialize:
		function Laser(scene, x, y) {
			Phaser.GameObjects.Image.call(this, scene, x, y, 'laser');
			this.nextTic = 0;
			this.upgrade = false;
			this.range = 200;
			this.scene.add.existing(this);
		},
	fire: function () {
		if (this.upgrade) {
			this.range = 350;
		}
		var enemy = this.scene.getEnemy(this.x, this.y, this.range);
		if (enemy) { //if there is an enemy in range
			var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y); //angle between tower and enemy
			this.scene.addLaserBeams(this.x, this.y, angle); // add bullet at the angle
			this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
		}
	},
	update: function (time, delta) {
		if (time > this.nextTic) {
			//we can fire another
			this.fire();
			this.nextTic = time + 3000;
		}
	}
}); 