class TitlePage extends Phaser.Scene {
	constructor() {
		super({
			key: 'TitlePage',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const newGameText = this.add.text(100, 100, 'NEW GAME', { color: '#ffffff', fontSize: '24px' });
		const highScoreText = this.add.text(100, 300, 'HIGH SCORES', { color: '#ffffff', fontSize: '24px' });

		// Change scene to new game
		newGameText.setInteractive();
		newGameText.on('pointerdown', () => {
			this.scene.start('NewGame');
		});

		// Change scene to high scores
		highScoreText.setInteractive();
		highScoreText.on('pointerdown', () => {
			this.scene.start('HighScores');
		});

		// Rectangle to cover right menu and preserve proportions of menu
		const rect = new Phaser.Geom.Rectangle(900, 0, 150, 390);
		const graphics = this.add.graphics();
		graphics.fillStyle(0xffffff, 1.0);
		graphics.fillRectShape(rect);
	}
}