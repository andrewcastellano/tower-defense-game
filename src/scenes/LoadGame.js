class LoadGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'LoadGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const save1 = JSON.parse(localStorage.getItem('save1'));
		const save1Text = save1
			? this.add.text(100, 100, 
				`Date: ${save1.date}\nScore: ${save1.score}\nLives: ${save1.lives}\nMoney: ${save1.money}`, 
				{ color: '#ffffff', fontSize: '12px' })
			: this.add.text(100, 100, 'SAVE 1', { color: '#ffffff', fontSize: '24px' });
		// const save1Text = this.add.text(100, 100, 'SAVE 1', { color: '#ffffff', fontSize: '24px' });
		const save2Text = this.add.text(100, 200, 'SAVE 2', { color: '#ffffff', fontSize: '24px' });
		const save3Text = this.add.text(100, 300, 'SAVE 3', { color: '#ffffff', fontSize: '24px' });
		const cancelText = this.add.text(700, 200, 'CANCEL', { color: '#ffffff', fontSize: '24px'});

		// var save1 = JSON.parse(localStorage.getItem('save1')) || 'save1 not found';
		// console.log(save1);
		// Change scene to TitlePage
		cancelText.setInteractive();
		cancelText.on('pointerdown', () => {
			this.scene.start('TitlePage');
		});
	}
}