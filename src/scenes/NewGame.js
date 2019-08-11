class NewGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'NewGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const easyText = this.add.text(100, 100, 'EASY', { color: '#ffffff', fontSize: '24px' });
		const mediumText = this.add.text(100, 200, 'MEDIUM', { color: '#ffffff', fontSize: '24px' });
		const hardText = this.add.text(100, 300, 'HARD', { color: '#ffffff', fontSize: '24px' });
		const cancelText = this.add.text(700, 200, 'CANCEL', { color: '#ffffff', fontSize: '24px'});


		// Change scene to Easy
		easyText.setInteractive();
		easyText.on('pointerdown', () => {
			this.scene.start('Easy');
		});
		
		// Change scene to Medium
		mediumText.setInteractive();
		mediumText.on('pointerdown', () => {
			this.scene.start('Medium');
		});

		// Change scene to Medium
		hardText.setInteractive();
		hardText.on('pointerdown', () => {
			this.scene.start('Hard');
		});

		// Change scene to TitlePage
		cancelText.setInteractive();
		cancelText.on('pointerdown', () => {
			this.scene.start('TitlePage');
		});
	}
}