class SaveGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'SaveGame',
			active: false
		})
	}

	create() {
		const titleText = this.add.text(300, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const save1Text = this.add.text(100, 100, 'SAVE 1', { color: '#ffffff', fontSize: '24px' });
		const save2Text = this.add.text(100, 200, 'SAVE 2', { color: '#ffffff', fontSize: '24px' });
		const save3Text = this.add.text(100, 300, 'SAVE 3', { color: '#ffffff', fontSize: '24px' });

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
		});
	}
}