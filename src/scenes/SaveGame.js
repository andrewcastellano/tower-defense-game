class SaveGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'SaveGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'ai uprising', { color: '#ff0000', fontSize: '48px', fontFamily: 'Montserrat' });
		const save1Text = this.add.text(100, 100, 'save 1', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const save2Text = this.add.text(100, 200, 'save 2', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });
		const save3Text = this.add.text(100, 300, 'save 3', { color: '#ffffff', fontSize: '24px', fontFamily: 'Montserrat' });

		save1Text.setInteractive();
		save1Text.on('pointerdown', () => {
			// Save current gamestate to Save 1 slot
			var save1 = {
				date: new Date().toUTCString(),
				score: gamestate.score,
				lives: gamestate.lives,
				money: gamestate.money
			}
			localStorage.setItem('save1', JSON.stringify(save1));

			this.scene.start('TitlePage');
			this.scene.destroy('SaveGame');
		});
	}
}