class TitlePage extends Phaser.Scene {
	constructor() {
		super({
			key: 'TitlePage',
			active: true
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const newGameText = this.add.text(100, 100, 'NEW GAME', { color: '#ffffff', fontSize: '24px' });
		const loadGameText = this.add.text(100, 200, 'LOAD GAME', { color: '#ffffff', fontSize: '24px' });
		const highScoreText = this.add.text(100, 300, 'HIGH SCORES', { color: '#ffffff', fontSize: '24px' });

		// Change scene to new game
		newGameText.setInteractive();
		newGameText.on('pointerdown', () => {
			this.scene.start('NewGame');
		});

		// Change scene to load game
		loadGameText.setInteractive();
		loadGameText.on('pointerdown', () => {
			this.scene.start('LoadGame')
		});


		// Change scene to high scores
	}
}