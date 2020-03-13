import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'
import GameEvents from '~/consts/GameEvents'
import WebFontFile from '~/ui/WebFontFile'

export default class Preload extends Phaser.Scene
{
	preload()
	{
		const fonts = new WebFontFile(this.load, [
			'Nosifer',
			'Lemon'
		])

		this.load.addFile(fonts)

		this.load.image(TextureKeys.Virus, 'assets/game/coronavirus.png')
		this.load.image(TextureKeys.VirusParticles, 'assets/game/light_02.png')
	}

	create()
	{
		this.game.events.emit(GameEvents.PreloadFinished)
	}
}
