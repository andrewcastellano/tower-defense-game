// Waterdrop class definition
var laserbeam = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,
	initialize:
		function laserbeam(scene, x, y) {
			Phaser.GameObjects.Image.call(this, scene, x, y, '_laserbeam');
			this.scene = scene;
			this.deltaX = 0;
			this.deltaY = 0;
			this.speed = Phaser.Math.GetSpeed(400, 1); //how fast, how long
			this.scene.add.existing(this);
			this.dmg = 200;
			this.lifespan = 0;
		},
	fire: function (x, y, angle) {
		this.lifespan = 2000;
		this.setActive(true);
		this.setVisible(true);
		this.setPosition(x, y);

		this.deltaX = Math.cos(angle);
		this.deltaY = Math.sin(angle);

	},
	update: function (time, delta) {
		this.x += this.deltaX * (this.speed * delta);
		this.y += this.deltaY * (this.speed * delta);

		this.lifespan -= delta;
		if (this.lifespan <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}); 