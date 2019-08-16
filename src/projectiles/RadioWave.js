// radiowaves class definition
var radiowave = new Phaser.Class({
	Extends: Phaser.GameObjects.Image,
	initialize:
		function radiowave(scene, x, y) {
			Phaser.GameObjects.Image.call(this, scene, x, y, '_radiowave');
			this.scene = scene;
			this.deltaX = 0;
			this.deltaY = 0;
			this.speed = Phaser.Math.GetSpeed(400, 1); //how far, how long
			this.scene.add.existing(this);
			this.dmg = 5;
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