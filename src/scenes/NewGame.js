class NewGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'NewGame',
			active: true
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'ai uprising', { color: '#ffffff', fontSize: '48px', fontFamily: 'Montserrat' });
		if (localStorage.getItem('isEasyCleared')) {
			const easyClearedText = this.add.text(100, 80, 'cleared', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		}
		const easyText = this.add.text(100, 100, 'easy', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		if (localStorage.getItem('isMediumCleared')) {
			const mediumClearedText = this.add.text(100, 180, 'cleared', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		}
		const mediumText = this.add.text(100, 200, 'medium', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		if (localStorage.getItem('isHardCleared')) {
			const hardClearedText = this.add.text(100, 280, 'cleared', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		}
		const hardText = this.add.text(100, 300, 'hard', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		// const cancelText = this.add.text(700, 200, 'CANCEL', { color: '#ffffff', fontSize: '24px'});


		// Change scene to Easy
		easyText.setInteractive();
		easyText.on('pointerdown', () => {
			this.scene.stop();
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
		// cancelText.setInteractive();
		// cancelText.on('pointerdown', () => {
		// 	this.scene.start('TitlePage');
		// });

		// Rectangle to cover right menu and preserve proportions of menu
		const rect = new Phaser.Geom.Rectangle(900, 0, 150, 390);
		const graphics = this.add.graphics();
		graphics.fillStyle(0x202020, 1.0);
		graphics.fillRectShape(rect);
	}
}