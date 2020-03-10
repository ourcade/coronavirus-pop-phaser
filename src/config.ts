import { BackgroundColor } from '~/consts/Colors'
import ElementKeys from '~/consts/ElementKeys'

const DPR = window.devicePixelRatio

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: ElementKeys.ContainerId,
	dom: {
		createContainer: true
	},
	backgroundColor: BackgroundColor,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		autoCenter: Phaser.Scale.Center.CENTER_BOTH,
		width: '100%',
		height: '100%',
		// width: 375 * DPR,
		// height: 667 * DPR
		// zoom: 1 / DPR
	}
}

export default config
