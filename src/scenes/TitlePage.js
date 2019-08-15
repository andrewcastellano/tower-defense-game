class TitlePage extends Phaser.Scene {
	constructor() {
		super({
			key: 'TitlePage',
			active: true
		})
	}

	create() {
		const titleText = this.add.text(600, 185, 'ai uprising', { color: '#eb4d4b', fontSize: '48px', fontFamily: 'Arial' });
		const newGameText = this.add.text(100, 100, 'new game', { color: '#ffffff', fontSize: '24px', fontFamily: 'Arial' });
		const loadGameText = this.add.text(100, 200, 'load game', { color: '#ffffff', fontSize: '24px', fontFamily: 'Arial' });
		const highScoreText = this.add.text(100, 300, 'high scores', { color: '#ffffff', fontSize: '24px', fontFamily: 'Arial' });

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