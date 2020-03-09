import Phaser from 'phaser'

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
	}

	create()
	{
		this.game.events.emit(GameEvents.PreloadFinished)
	}
}
