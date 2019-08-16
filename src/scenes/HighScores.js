class HighScores extends GameBase {

    constructor() {
        super({
            key: 'HighScores',
            active: false
        });
    }

    create() {
		const titleText = this.add.text(300, 20, 'HIGH SCORES', { color: '#ff0000', fontSize: '48px' });

		// Rectangle to cover right menu and preserve proportions of menu
		const rect = new Phaser.Geom.Rectangle(900, 0, 150, 390);
		const graphics = this.add.graphics();
		graphics.fillStyle(0xffffff, 1.0);
		graphics.fillRectShape(rect);
    }

    update() {

    }

}