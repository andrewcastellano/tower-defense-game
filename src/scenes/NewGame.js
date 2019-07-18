class NewGame extends Phaser.Scene {
	constructor() {
		super({
			key: 'NewGame',
			active: true
		})
	}

	create() {
		const titleText = this.add.text(350, 185, 'AI UPRISING', { color: '#ff0000', fontSize: '48px' });
		const easyText = this.add.text(100, 100, 'EASY', { color: '#ffffff', fontSize: '24px' });
		const mediumText = this.add.text(100, 200, 'MEDIUM', { color: '#ffffff', fontSize: '24px' });
		const hardText = this.add.text(100, 300, 'HARD', { color: '#ffffff', fontSize: '24px' });

		// Change scene to Easy game when text is clicked - maybe change to button in future
		easyText.setInteractive();
		easyText.on('pointerdown', () => {
			this.scene.start('Easy');
		});
	}
}