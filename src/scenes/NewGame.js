class NewGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'NewGame',
			active: true
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		if (localStorage.getItem('isEasyCleared')) {
			const easyClearedText = this.add.text(100, 80, 'CLEARED', { color: '#ff0000', fontSize: '24px' });
		}
		const easyText = this.add.text(100, 100, 'EASY', { color: '#ffffff', fontSize: '24px' });
		if (localStorage.getItem('isMediumCleared')) {
			const mediumClearedText = this.add.text(100, 180, 'CLEARED', { color: '#ff0000', fontSize: '24px' });
		}
		const mediumText = this.add.text(100, 200, 'MEDIUM', { color: '#ffffff', fontSize: '24px' });
		if (localStorage.getItem('isHardCleared')) {
			const hardClearedText = this.add.text(100, 280, 'CLEARED', { color: '#ff0000', fontSize: '24px' });
		}
		const hardText = this.add.text(100, 300, 'HARD', { color: '#ffffff', fontSize: '24px' });
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