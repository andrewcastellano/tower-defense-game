class NewGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'NewGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'ai uprising', { color: '#eb4d4b', fontSize: '48px', fontFamily: 'Montserrat' });
		const easyText = this.add.text(100, 100, 'easy', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const mediumText = this.add.text(100, 200, 'medium', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const hardText = this.add.text(100, 300, 'hard', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const cancelText = this.add.text(700, 200, 'cancel', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });


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