class LoadGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'LoadGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'ai uprising', { color: '#ff0000', fontSize: '48px', fontFamily: 'Montserrat' });
		const save1 = JSON.parse(localStorage.getItem('save1'));
		const save1Text = save1
			? this.add.text(100, 100,
				`date: ${save1.date}\nscore: ${save1.score}\nlives: ${save1.lives}\nmoney: ${save1.money}`,
				{ color: '#ffffff', fontSize: '12px', fontFamily: 'Montserrat' })
			: this.add.text(100, 100, 'save 1', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		// const save1Text = this.add.text(100, 100, 'SAVE 1', { color: '#ffffff', fontSize: '24px' });
		const save2Text = this.add.text(100, 200, 'save 2', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const save3Text = this.add.text(100, 300, 'save 3', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const cancelText = this.add.text(700, 200, 'cancel', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });

		// var save1 = JSON.parse(localStorage.getItem('save1')) || 'save1 not found';
		// console.log(save1);
		// Change scene to TitlePage
		cancelText.setInteractive();
		cancelText.on('pointerdown', () => {
			this.scene.start('TitlePage');
		});

		save1Text.setInteractive();
		save1Text.on('pointerdown', () => {
			this.scene.start('Easy');
			this.scene.destroy('LoadGame');
			gamestate.score = save1.score;
			gamestate.lives = save1.lives;
			gamestate.money = save1.money;
		})
	}
}