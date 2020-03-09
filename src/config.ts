const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'phaser-container',
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		width: '100%',
		height: '100%'
	}
}

export default config
